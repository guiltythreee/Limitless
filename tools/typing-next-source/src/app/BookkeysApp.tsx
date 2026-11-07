"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { BookkeysChapter, BookkeysLibraryMetadata, BookkeysShelf } from "../domain/persistence/bookkeys-v1-contracts";
import { openBookkeysDatabase, type BookkeysDatabase } from "../domain/persistence/bookkeys-v1-database";
import { readEpub } from "../domain/epub/epub-importer";
import type { EpubBlock, EpubChapter } from "../domain/epub/epub-domain";
import { readPdf } from "../domain/pdf/pdf-importer";
import { pagesFromText, textFingerprint } from "../domain/text/bookkeys-text-importer";
import {
  completeBookkeysPage, createPageDraft, emptyBookkeysGame, typingAccuracy, updateBookkeysKeyStats, type BookkeysKeyStats,
  readPageDraft,
} from "../domain/reading/bookkeys-reading-session";
import { createBookkeysRewardAdapter } from "../domain/rewards/bookkeys-reward-adapter";
import { bookkeysPageEvidenceFromText, installBookkeysRewardBridge } from "../domain/rewards/bookkeys-reward-bridge";
import { bookkeysRewardPolicy } from "../domain/rewards/bookkeys-reward-policy";
import { readGlobalRewardSummary } from "../domain/rewards/shared-rewards.mjs";
import { typingDraftKey } from "../domain/persistence/bookkeys-v1-contracts";
import { readBookkeysPosition, writeBookkeysPosition } from "../domain/reading/bookkeys-position";
import { readBookkeysChapterSettings, writeBookkeysChapterSettings } from "../domain/reading/bookkeys-chapter-storage";
import { requiredSections, tidyChapters, withRequirements } from "../domain/reading/bookkeys-chapters";
import { createBookkeysBackupV1, parseBookkeysBackup, restoreBookkeysBackup } from "../domain/reading/bookkeys-backup";
import { createShelf, deleteShelf, readShelves, renameShelf } from "../domain/reading/bookkeys-shelves";
import { bookkeysArchiveSummary } from "../domain/reading/bookkeys-achievements";
import { filterAndSortBookkeysLibrary, type BookkeysLibrarySort } from "../domain/reading/bookkeys-library-view";


const READER_BACKGROUND_PRESETS = [
  { id: "pic-morning", label: "Morning picture", image: "/tools/typing-next-preview/backgrounds/morning.webp", mobileImage: "/tools/typing-next-preview/backgrounds/morning-mobile.webp", background: "linear-gradient(#6b5140,#c18a58)" },
  { id: "pic-evening", label: "Evening picture", image: "/tools/typing-next-preview/backgrounds/evening.webp", mobileImage: "/tools/typing-next-preview/backgrounds/evening-mobile.webp", background: "linear-gradient(#30213c,#a65e50)" },
  { id: "pic-night", label: "Night picture", image: "/tools/typing-next-preview/backgrounds/night.webp", mobileImage: "/tools/typing-next-preview/backgrounds/night-mobile.webp", background: "linear-gradient(#10172b,#34446a)" },
  { id: "morning", label: "Morning glow", background: "radial-gradient(circle at 78% 15%, rgba(255,226,165,.45), transparent 34%), linear-gradient(155deg,#2c2634,#70513d 58%,#c18a58)" },
  { id: "evening", label: "Evening glow", background: "radial-gradient(circle at 75% 20%, rgba(245,156,105,.35), transparent 36%), linear-gradient(160deg,#17142c,#4d294c 62%,#a65e50)" },
  { id: "night", label: "Night sky", background: "radial-gradient(circle at 82% 17%,#e9efff 0 5px,transparent 6px), radial-gradient(circle at 82% 17%,rgba(190,210,255,.24),transparent 90px), linear-gradient(#04081a,#0e1a3d 60%,#1d2c57)" },
  { id: "snow", label: "Snow", background: "radial-gradient(circle at 18% 28%,rgba(255,255,255,.75) 0 2px,transparent 3px), radial-gradient(circle at 72% 62%,rgba(255,255,255,.55) 0 3px,transparent 4px), linear-gradient(#0a1422,#162a40 60%,#2a4160)" },
  { id: "aurora", label: "Aurora", background: "radial-gradient(ellipse at 52% 25%,rgba(45,255,154,.42),transparent 38%), radial-gradient(ellipse at 78% 48%,rgba(123,107,255,.35),transparent 42%), linear-gradient(#020712,#06142b 60%,#0b2236)" },
  { id: "rain", label: "Rain", background: "repeating-linear-gradient(105deg,transparent 0 18px,rgba(190,210,230,.13) 19px 20px), linear-gradient(#080e15,#101a24 60%,#1b2836)" },
  { id: "digital", label: "Digital rain", background: "repeating-linear-gradient(90deg,transparent 0 18px,rgba(43,255,122,.13) 19px 20px), linear-gradient(#000a05,#03140a 60%,#0f4a27)" },
  { id: "underwater", label: "Underwater", background: "radial-gradient(ellipse at 35% 15%,rgba(95,227,255,.32),transparent 45%), radial-gradient(ellipse at 75% 80%,rgba(12,106,138,.45),transparent 50%), linear-gradient(#021a30,#06304d)" },
  { id: "shafts", label: "Light shafts", background: "linear-gradient(115deg,#17120d 20%,rgba(227,181,101,.15) 36%,#3c2b18 48%,rgba(227,181,101,.22) 58%,#17120d 75%)" },
  { id: "candle", label: "Candlelight", background: "radial-gradient(circle at 50% 88%,rgba(255,179,71,.78),transparent 34%), linear-gradient(#0b0705,#17100b 65%,#3a2814)" },
  { id: "hearth", label: "Hearth", background: "radial-gradient(ellipse at 50% 100%,rgba(255,138,61,.6),transparent 42%), linear-gradient(#080303,#1a0a07 65%,#4a1e10)" },
  { id: "crt", label: "CRT", background: "repeating-linear-gradient(0deg,rgba(57,255,122,.08) 0 2px,transparent 2px 4px), linear-gradient(#03100a,#072016)" },
  { id: "warp", label: "Warp speed", background: "radial-gradient(circle at 50% 50%,#8fb4ff 0,#0a1030 25%,#02030a 70%)" },
  { id: "nebula", label: "Nebula", background: "radial-gradient(circle at 30% 40%,#7c3aed,transparent 55%), radial-gradient(circle at 70% 60%,#db2777,transparent 55%), #05030f" },
  { id: "fireflies", label: "Fireflies", background: "radial-gradient(circle at 30% 60%,#e8f27a 0 3px,transparent 4px), radial-gradient(circle at 65% 40%,#e8f27a 0 3px,transparent 4px), linear-gradient(#05100d,#0f2a1d)" },
  { id: "synthwave", label: "Synthwave", background: "linear-gradient(#0b0221,#6a0f7a 55%,#ff3e9a 56%,#1a0533 57%)" },
  { id: "sakura", label: "Sakura", background: "linear-gradient(#2a1236,#a14a82 70%,#f4a3bd)" },
  { id: "autumn", label: "Autumn leaves", background: "radial-gradient(circle at 25% 25%,rgba(255,178,70,.3),transparent 32%), linear-gradient(#2b1405,#6e3211 60%,#a8541a)" },
  { id: "lava", label: "Lava lamp", background: "radial-gradient(circle at 35% 70%,#ff5a8a,transparent 45%), radial-gradient(circle at 65% 35%,#ff9a3c,transparent 45%), #1a0630" },
  { id: "storm", label: "Thunderstorm", background: "radial-gradient(ellipse at 70% 20%,rgba(150,170,205,.25),transparent 35%), linear-gradient(#05070d,#2b364d)" },
  { id: "bokeh", label: "Bokeh", background: "radial-gradient(circle at 25% 35%,#4cc9f0 0 10px,transparent 11px), radial-gradient(circle at 70% 60%,#f472b6 0 14px,transparent 15px), linear-gradient(#0a0f1f,#1b1030)" },
  { id: "mesh", label: "Gradient mesh", background: "radial-gradient(ellipse at 18% 20%,#312e81,transparent 45%), radial-gradient(ellipse at 80% 35%,#be185d,transparent 50%), radial-gradient(ellipse at 48% 90%,#0f766e,transparent 55%), #090b1a" },
  { id: "constellation", label: "Constellation", background: "radial-gradient(circle at 20% 30%,#9db4ff 0 2px,transparent 3px), radial-gradient(circle at 60% 60%,#9db4ff 0 2px,transparent 3px), radial-gradient(circle at 80% 25%,#9db4ff 0 2px,transparent 3px), linear-gradient(#050816,#0c1233)" },
  { id: "mist", label: "Misty pines", background: "radial-gradient(ellipse at 50% 45%,rgba(180,205,210,.22),transparent 48%), linear-gradient(#0b1217,#243941 65%,#3a4f58)" },
] as const;
type ReaderBackgroundId = "none" | "gothic" | "garden" | (typeof READER_BACKGROUND_PRESETS)[number]["id"];

function isReaderBackgroundId(value: unknown): value is ReaderBackgroundId {
  return value === "none" || value === "gothic" || value === "garden" ||
    READER_BACKGROUND_PRESETS.some((preset) => preset.id === value);
}

type BookFormat = "pdf" | "epub" | "text";
interface ReaderBook {
  readonly isSample?: boolean;
  readonly libraryId: string;
  readonly bookKey: string;
  readonly format: BookFormat;
  readonly title: string;
  readonly author: string;
  readonly fingerprint: string;
  readonly sections: EpubBlock[][];
  readonly chapters: BookkeysChapter[];
}
interface LibraryEntry extends BookkeysLibraryMetadata {}
const SAMPLE_PASSAGE = "Reading is a deliberate kind of attention. A page gives the mind a small place to pause, follow an idea, and connect it with something already understood. The aim of practice is not speed alone: it is to build a steady rhythm, notice mistakes, and return to the sentence with greater precision. A short session repeated thoughtfully can become a lasting habit.";
interface BookkeysSettings {
  readonly bg: string;
  readonly size: number;
  readonly lineH: number;
  readonly celebrate: boolean;
  readonly readerBackground?: ReaderBackgroundId;
  readonly [extension: string]: unknown;
}

function safeArtworkDataUrl(value: string | undefined): string | undefined {
  return value && /^data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/=]+$/i.test(value) ? value : undefined;
}


async function resizeArtworkFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > 25 * 1024 * 1024) throw new Error("The image is larger than 25 MB.");
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("The image could not be read."));
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("The image could not be read."));
    reader.readAsDataURL(file);
  });
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onerror = () => reject(new Error("The image could not be opened."));
    element.onload = () => resolve(element);
    element.src = source;
  });
  const scale = Math.min(1, 1600 / image.width, 900 / image.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image processing is unavailable in this browser.");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.78);
}

function readLegacySize(fallback: number): number {
  try {
    const raw = window.localStorage.getItem("bookkeys:size");
    if (raw === null) return fallback;
    let value: unknown;
    try { value = JSON.parse(raw); } catch { value = raw; }
    const size = typeof value === "number" ? value : Number(value);
    return Number.isFinite(size) && size > 0 ? size : fallback;
  } catch {
    return fallback;
  }
}

function readSettings(): BookkeysSettings {
  const defaults: BookkeysSettings = { bg: "dark", size: 17, lineH: 1.8, celebrate: true };
  const legacySize = readLegacySize(defaults.size);
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem("bookkeys:settings") ?? "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return { ...defaults, size: legacySize };
    }
    const record = value as Record<string, unknown>;
    return {
      ...defaults,
      ...record,
      bg: typeof record.bg === "string" ? record.bg : defaults.bg,
      size: typeof record.size === "number" && Number.isFinite(record.size) ? record.size : legacySize,
      lineH: typeof record.lineH === "number" && Number.isFinite(record.lineH) ? record.lineH : defaults.lineH,
      celebrate: typeof record.celebrate === "boolean" ? record.celebrate : defaults.celebrate,
    };
  } catch { return { ...defaults, size: legacySize }; }
}

function readGame(): ReturnType<typeof emptyBookkeysGame> {
  try {
    const raw = window.localStorage.getItem("bookkeys:game");
    if (!raw) return emptyBookkeysGame();
    const value: unknown = JSON.parse(raw);
    return value && typeof value === "object" ? value as ReturnType<typeof emptyBookkeysGame> : emptyBookkeysGame();
  } catch {
    return emptyBookkeysGame();
  }
}

function readGlobalExp(): number {
  return readGlobalRewardSummary(window.localStorage).totalExp;
}

function loadChapterSettings(
  bookKey: string,
  libraryId: string,
  defaults: readonly EpubChapter[],
  total: number,
): BookkeysChapter[] {
  return readBookkeysChapterSettings(window.localStorage, bookKey, libraryId, defaults, total);
}

async function parseBook(
  libraryId: string,
  format: BookFormat,
  bytes: ArrayBuffer,
  fallbackTitle: string,
): Promise<ReaderBook> {
  if (format === "text") {
    const source = new TextDecoder("utf-8").decode(bytes);
    const sections = pagesFromText(source);
    if (!sections.length) throw new Error("This text file is empty.");
    const fingerprint = textFingerprint(source);
    return {
      libraryId,
      bookKey: "f:" + fingerprint,
      format,
      title: fallbackTitle || "Pasted text",
      author: "Plain text",
      fingerprint,
      sections,
      chapters: tidyChapters(withRequirements([{ p: 0, title: "Beginning" }]), sections.length),
    };
  }
  if (format === "epub") {
    const result = await readEpub(bytes, new DOMParser());
    return {
      libraryId,
      bookKey: "f:" + result.hash,
      format,
      title: result.title || fallbackTitle,
      author: result.author,
      fingerprint: result.hash,
      sections: result.sections,
      chapters: tidyChapters(withRequirements(result.chapters), result.sections.length),
    };
  }
  const result = await readPdf(bytes);
  return {
    libraryId,
    bookKey: result.fingerprint,
    format,
    title: result.title === "Untitled PDF" ? fallbackTitle : result.title,
    author: "",
    fingerprint: result.fingerprint,
    sections: result.pages,
    chapters: tidyChapters(withRequirements(result.chapters), result.pages.length),
  };
}

export default function BookkeysApp() {
  const [database, setDatabase] = useState<BookkeysDatabase | null>(null);
  const [library, setLibrary] = useState<LibraryEntry[]>([]);
  const [shelves, setShelves] = useState<BookkeysShelf[]>([{ id: "default", name: "Library" }]);
  const [selectedShelf, setSelectedShelf] = useState("default");
  const [libraryQuery, setLibraryQuery] = useState("");
  const [librarySort, setLibrarySort] = useState<BookkeysLibrarySort>("recent");
  const [book, setBook] = useState<ReaderBook | null>(null);
  const [view, setView] = useState<"home" | "book">("home");
  const navState = useRef({ i: 0, max: 0 });
  const bookCache = useRef<Record<string, ReaderBook>>({});
  const [pageIndex, setPageIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState("Import a PDF, EPUB or text file, or paste text to begin.");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [settings, setSettings] = useState<BookkeysSettings>({ bg: "dark", size: 17, lineH: 1.8, celebrate: true });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"appearance" | "data">("appearance");
  const [themeReady, setThemeReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [chaptersOpen, setChaptersOpen] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [globalExp, setGlobalExp] = useState(0);
  const [artwork, setArtwork] = useState<{ gothic?: string; garden?: string }>({});
  const [artworkBusy, setArtworkBusy] = useState<"gothic" | "garden" | null>(null);
  const [artworkStatus, setArtworkStatus] = useState("");
  const [gameProgress, setGameProgress] = useState<ReturnType<typeof emptyBookkeysGame>>(() => emptyBookkeysGame());
  const [completedPageIndexes, setCompletedPageIndexes] = useState<number[]>([]);
  const archive = useMemo(() => bookkeysArchiveSummary(gameProgress as Readonly<Record<string, unknown>>), [gameProgress]);
  const fileInput = useRef<HTMLInputElement>(null);
  const backupInput = useRef<HTMLInputElement>(null);
  const startedAt = useRef(Date.now());
  const completedThisPage = useRef(false);
  const keyStatsRef = useRef<BookkeysKeyStats>({ ok: 0, all: 0, lastTyped: "" });
  const [keyStats, setKeyStats] = useState({ ok: 0, all: 0 });

  // Keep reward verification tied to the actual parsed page content. The
  // bridge stores only a stable signature and character count, never book text.
  useEffect(() => {
    const adapter = createBookkeysRewardAdapter(window.localStorage, bookkeysRewardPolicy);
    return installBookkeysRewardBridge(window, adapter, {
      getPageEvidence: (check) => {
        const currentBook = bookCache.current[check.key];
        const section = currentBook?.sections[check.page];
        if (!section) return null;
        const raw = section.map((block) => block.text).join("\n");
        return bookkeysPageEvidenceFromText(raw);
      },
    });
  }, []);

  useEffect(() => {
    const refreshGlobalExp = () => setGlobalExp(readGlobalExp());
    refreshGlobalExp();
    window.addEventListener("limitless:rewards-updated", refreshGlobalExp);
    window.addEventListener("storage", refreshGlobalExp);
    return () => {
      window.removeEventListener("limitless:rewards-updated", refreshGlobalExp);
      window.removeEventListener("storage", refreshGlobalExp);
    };
  }, []);

  useEffect(() => {
    const refreshProgress = () => setGameProgress(readGame());
    const onStorage = (event: StorageEvent) => {
      if (event.key === "bookkeys:game") refreshProgress();
    };
    refreshProgress();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const savedSettings = readSettings();
    const savedTheme = window.localStorage.getItem("limitless.typing.v1.theme");
    const initialTheme = savedSettings.bg === "light" || savedTheme === "light" ? "light" : "dark";
    setSettings({
      ...savedSettings,
      bg: initialTheme,
      readerBackground: isReaderBackgroundId(savedSettings.readerBackground) ? savedSettings.readerBackground : "none",
    });
    setTheme(initialTheme);
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.setProperty("--tsize", settings.size + "px");
    document.documentElement.style.setProperty("--lineH", String(settings.lineH));
    try { window.localStorage.setItem("limitless.typing.v1.theme", theme); } catch { /* theme is a preference */ }
  }, [theme, themeReady, settings.size, settings.lineH]);

  useEffect(() => {
    let active = true;
    let opened: BookkeysDatabase | null = null;
    void (async () => {
      try {
        opened = await openBookkeysDatabase(window.indexedDB);
        const entries = await opened.listMetadata();
        const [gothic, garden] = await Promise.all([
          opened.getArtwork("art:gothic"),
          opened.getArtwork("art:garden"),
        ]);
        if (!active) { opened.close(); return; }
        setArtwork({
          ...(safeArtworkDataUrl(gothic) ? { gothic } : {}),
          ...(safeArtworkDataUrl(garden) ? { garden } : {}),
        });
        setDatabase(opened);
        setLibrary(entries.sort((a, b) => (b.opened ?? b.added) - (a.opened ?? a.added)));
        const loadedShelves = readShelves(window.localStorage.getItem("bookkeys:shelves"));
        const known = new Set(loadedShelves.map((shelf) => shelf.id));
        for (const entry of entries) {
          if (entry.shelf && !known.has(entry.shelf)) loadedShelves.push({ id: entry.shelf, name: entry.shelf });
        }
        setShelves(loadedShelves);
        
      } catch {
        if (active) setStatus("Browser storage is unavailable. You can still import a book for this session.");
      }
    })();
    return () => {
      active = false;
      opened?.close();
    };
  }, []);

  const shelfLibrary = useMemo(() => library.filter((entry) => entry.shelf === selectedShelf), [library, selectedShelf]);
  const visibleLibrary = useMemo(() => filterAndSortBookkeysLibrary(shelfLibrary, libraryQuery, librarySort), [shelfLibrary, libraryQuery, librarySort]);
  const continueEntry = shelfLibrary[0];
  const target = useMemo(
    () => book?.sections[pageIndex]?.map((block) => block.text).join("\n") ?? "",
    [book, pageIndex],
  );
  const textAccuracy = typingAccuracy(target, typed);
  const liveAccuracy = {
    ...textAccuracy,
    total: keyStats.all,
    percent: keyStats.all > 0 ? Math.floor((keyStats.ok * 100 + keyStats.all / 2) / keyStats.all) : 100,
  };
  const elapsedMs = Math.max(1000, Date.now() - startedAt.current);
  const liveWpm = typed.length
    ? Math.round((liveAccuracy.correct / 5) / (elapsedMs / 60_000))
    : 0;
  const requiredPageIndexes = useMemo(() => book ? requiredSections(book.chapters, book.sections.length) : [], [book]);
  const requiredCompletedCount = requiredPageIndexes.filter((page) => completedPageIndexes.includes(page)).length;
  const currentChapter = useMemo(() => {
    if (!book) return null;
    let selected: EpubChapter | null = null;
    for (const chapter of book.chapters) {
      if (chapter.p > pageIndex) break;
      selected = chapter;
    }
    return selected;
  }, [book, pageIndex]);

  useEffect(() => {
    if (!book) return;
    completedThisPage.current = false;
    startedAt.current = Date.now();
    keyStatsRef.current = { ok: 0, all: 0, lastTyped: "" };
    setKeyStats({ ok: 0, all: 0 });
    if (book.isSample) {
      setTyped("");
      setCompletedPageIndexes([]);
      setStatus("Sample passage ready. Typing here never earns XP or saves book progress.");
      return;
    }
    try {
      const key = typingDraftKey(book.bookKey, pageIndex);
      const draft = readPageDraft(window.localStorage.getItem(key), pageIndex, target);
      if (book.format === "pdf" && !target) {
        const emptyIndexes = book.sections.flatMap((section, index) => section.some((block) => block.text) ? [] : [index]);
        const result = completeBookkeysPage(
          readGame(), book.bookKey, pageIndex, "", "", 0, book.chapters, book.sections.length, emptyIndexes,
        );
        window.localStorage.setItem("bookkeys:game", JSON.stringify(result.game));
        setGameProgress(result.game);
        const savedBook = result.game.book?.[book.bookKey];
        setCompletedPageIndexes([...new Set([...(savedBook?.p ?? []), ...(savedBook?.e ?? [])])]);
        
        setStatus("No selectable text found on this PDF page. It is recorded as empty and will not block completion.");
      }
      if (draft) {
        keyStatsRef.current = { ok: draft.ok, all: draft.all, lastTyped: draft.typed };
        setKeyStats({ ok: draft.ok, all: draft.all });
        setTyped(draft.typed);
        startedAt.current = Date.now() - draft.spent;
        if (draft.typed.length >= target.length && target.length > 0) completedThisPage.current = true;
      } else setTyped("");
    } catch {
      setTyped("");
    }
  }, [book, pageIndex, target]);

  async function loadEntry(entry: LibraryEntry) {
    if (!database) return;
    setBusy(true);
    setStatus("Opening book…");
    try {
      const file = await database.getFile(entry.id);
      if (!file) throw new Error("The original file is missing from this browser's library.");
      const format: BookFormat = entry.fmt === "epub" ? "epub" : entry.fmt === "text" ? "text" : "pdf";
      const parsed = await parseBook(entry.id, format, await file.arrayBuffer(), entry.name);
      const openedBook = { ...parsed, chapters: loadChapterSettings(parsed.bookKey, entry.id, parsed.chapters, parsed.sections.length) };
      const savedPage = readBookkeysPosition(window.localStorage, parsed.bookKey, entry.id, parsed.sections.length);
      bookCache.current[openedBook.bookKey] = openedBook;
      setBook(openedBook);
      navTo("book", parsed.bookKey, savedPage);
      const savedBook = readGame().book?.[parsed.bookKey];
      setCompletedPageIndexes([...new Set([...(savedBook?.p ?? []), ...(savedBook?.e ?? [])])]);
      setPageIndex(savedPage);
      await database.putBook({ ...entry, opened: Date.now() }, file);
      setLibrary((await database.listMetadata()).sort((a, b) => (b.opened ?? b.added) - (a.opened ?? a.added)));
      setStatus("Book opened. Your typing drafts are saved in this browser.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not open this book.");
    } finally {
      setBusy(false);
    }
  }

  async function importFile(file: File) {
    const extension = file.name.toLowerCase().split(".").pop();
    if (extension !== "pdf" && extension !== "epub" && extension !== "txt") {
      setStatus("Choose a PDF, EPUB or plain-text file.");
      return;
    }
    const format: BookFormat = extension === "epub" ? "epub" : extension === "txt" ? "text" : "pdf";
    setBusy(true);
    setStatus("Reading book locally…");
    try {
      const bytes = await file.arrayBuffer();
      const temporaryId = window.crypto.randomUUID();
      const parsed = await parseBook(temporaryId, format, bytes, file.name.replace(/\.(pdf|epub|txt)$/i, ""));
      const existing = library.find((entry) => entry.fp === parsed.fingerprint &&
        (entry.fmt === "epub" ? "epub" : entry.fmt === "text" ? "text" : "pdf") === format);
      const libraryId = existing?.id ?? temporaryId;
      const savedBook = { ...parsed, libraryId };
      if (database) {
        const metadata: LibraryEntry = {
          id: libraryId,
          shelf: existing?.shelf ?? selectedShelf,
          name: parsed.title,
          size: file.size,
          pages: parsed.sections.length,
          added: existing?.added ?? Date.now(),
          fp: parsed.fingerprint,
          cover: existing?.cover ?? "",
          ...(format !== "pdf" ? { fmt: format } : {}),
          ...(parsed.author ? { author: parsed.author } : {}),
        };
        await database.putBook(metadata, file);
        setLibrary((await database.listMetadata()).sort((a, b) => (b.opened ?? b.added) - (a.opened ?? a.added)));
      }
      const openedBook = { ...savedBook, chapters: loadChapterSettings(savedBook.bookKey, libraryId, savedBook.chapters, savedBook.sections.length) };
      const savedPage = readBookkeysPosition(window.localStorage, savedBook.bookKey, libraryId, savedBook.sections.length);
      bookCache.current[openedBook.bookKey] = openedBook;
      setBook(openedBook);
      navTo("book", savedBook.bookKey, savedPage);
      const savedProgress = readGame().book?.[savedBook.bookKey];
      setCompletedPageIndexes([...new Set([...(savedProgress?.p ?? []), ...(savedProgress?.e ?? [])])]);
      setPageIndex(savedPage);
      setStatus(database
        ? "Imported and saved to this browser's library."
        : "Imported for this session. Browser library storage is unavailable.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The file could not be read.");
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function onTyping(value: string, inputType = "insertText") {
    setTyped(value);
    if (!book) return;
    const nextKeys = updateBookkeysKeyStats(keyStatsRef.current, target, value, inputType);
    keyStatsRef.current = nextKeys;
    setKeyStats({ ok: nextKeys.ok, all: nextKeys.all });
    if (book.isSample) {
      if (!completedThisPage.current && target.length > 0 && value.length >= target.length) {
        completedThisPage.current = true;
        setStatus("Sample page complete · no XP awarded and no book progress saved.");
      }
      return;
    }
    try {
      const draft = createPageDraft(pageIndex, target, value, startedAt.current, Date.now(), keyStatsRef.current);
      window.localStorage.setItem(typingDraftKey(book.bookKey, pageIndex), JSON.stringify(draft));
    } catch {
      setStatus("Typing is active, but this browser could not save the draft.");
    }

    if (completedThisPage.current || !target || value.length < target.length) return;
    completedThisPage.current = true;
    const previousGame = readGame();
    const result = completeBookkeysPage(
      previousGame, book.bookKey, pageIndex, target, value, Date.now() - startedAt.current,
      book.chapters, book.sections.length,
      book.sections.flatMap((section, index) => section.some((block) => block.text) ? [] : [index]),
      Date.now(), keyStatsRef.current,
    );
    try {
      const oldGameRaw = window.localStorage.getItem("bookkeys:game");
      const newGameRaw = JSON.stringify(result.game);
      window.localStorage.setItem("bookkeys:game", newGameRaw);
      // Storage events do not fire in the same document for localStorage writes.
      // Dispatch the exact before/after snapshot only after the save succeeds.
      window.dispatchEvent(new StorageEvent("storage", {
        key: "bookkeys:game",
        oldValue: oldGameRaw,
        newValue: newGameRaw,
        storageArea: window.localStorage,
      }));
      setGameProgress(result.game);
      const savedBook = result.game.book?.[book.bookKey];
      setCompletedPageIndexes([...new Set([...(savedBook?.p ?? []), ...(savedBook?.e ?? [])])]);
    } catch {
      setStatus("Page completed, but the game progress could not be saved.");
      return;
    }
    setStatus(result.alreadyCompleted
      ? "Page already completed. No XP awarded again."
      : result.xpAwarded > 0
        ? `Page complete · +${result.xpAwarded} XP · ${result.accuracy.percent}% accuracy`
        : "Page complete · no XP because the typing was too fast.");
  }


  async function saveArtwork(id: "gothic" | "garden", file: File) {
    if (!database) { setArtworkStatus("Browser storage is unavailable."); return; }
    setArtworkBusy(id);
    setArtworkStatus("Processing image…");
    try {
      const dataUrl = await resizeArtworkFile(file);
      await database.putArtwork("art:" + id, dataUrl);
      setArtwork((current) => ({ ...current, [id]: dataUrl }));
      setArtworkStatus(id === "gothic" ? "Gothic artwork saved locally." : "Garden artwork saved locally.");
    } catch (error) {
      setArtworkStatus(error instanceof Error ? error.message : "The image could not be saved.");
    } finally {
      setArtworkBusy(null);
    }
  }

  async function removeArtwork(id: "gothic" | "garden") {
    if (!database) return;
    setArtworkBusy(id);
    setArtworkStatus("Removing image…");
    try {
      await database.deleteArtwork("art:" + id);
      setArtwork((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      if (settings.readerBackground === id) persistSettings({ ...settings, readerBackground: "none" });
      setArtworkStatus("Artwork removed from this browser.");
    } catch {
      setArtworkStatus("The artwork could not be removed.");
    } finally {
      setArtworkBusy(null);
    }
  }

  function persistShelves(next: BookkeysShelf[]) {
    setShelves(next);
    try { window.localStorage.setItem("bookkeys:shelves", JSON.stringify(next)); } catch {
      setStatus("Shelf changes could not be saved in this browser.");
    }
  }

  function addShelf() {
    const name = window.prompt("Name this shelf");
    if (!name?.trim()) return;
    const next = createShelf(shelves, name, "shelf-" + window.crypto.randomUUID());
    if (next.length === shelves.length) {
      setStatus("A shelf with that name already exists.");
      return;
    }
    persistShelves(next);
    setSelectedShelf(next[next.length - 1].id);
  }

  function editShelfName() {
    const current = shelves.find((shelf) => shelf.id === selectedShelf);
    if (!current) return;
    const name = window.prompt("Rename shelf", current.name);
    if (!name?.trim()) return;
    const next = renameShelf(shelves, selectedShelf, name);
    if (next.every((shelf, index) => shelf.name === shelves[index]?.name)) {
      setStatus("That shelf name is already in use.");
      return;
    }
    persistShelves(next);
  }

  function startPastedText() {
    const source = pasteText.trim();
    if (!source) {
      setStatus("Paste some text before creating a book.");
      return;
    }
    setPasteOpen(false);
    setPasteText("");
    void importFile(new File([source], "Pasted text.txt", { type: "text/plain" }));
  }

  function startSample() {
    const sample: ReaderBook = {
      isSample: true,
      libraryId: "sample",
      bookKey: "sample",
      format: "epub",
      title: "Sample Passage",
      author: "Limitless",
      fingerprint: "sample",
      sections: [[{ t: "p", text: SAMPLE_PASSAGE }]],
      chapters: [],
    };
    bookCache.current[sample.bookKey] = sample;
    setBook(sample);
    setCompletedPageIndexes([]);
    setPageIndex(0);
    setTyped("");
    navTo("book", sample.bookKey, 0);
    setStatus("Sample passage ready. Typing here never earns XP or saves book progress.");
  }

  async function removeCurrentBook() {
    if (!book || book.isSample || !database) return;
    if (!window.confirm("Remove " + book.title + " from this browser's library? The original file will be deleted here, but saved typing progress and backups will remain.")) return;
    setBusy(true);
    try {
      await database.deleteBook(book.libraryId);
      setLibrary((await database.listMetadata()).sort((a, b) => (b.opened ?? b.added) - (a.opened ?? a.added)));
      delete bookCache.current[book.bookKey];
      setBook(null);
      setView("home");
      setTyped("");
      setStatus("Book removed from this browser's library. Saved typing progress was retained.");
    } catch {
      setStatus("Could not remove this book from the browser library.");
    } finally {
      setBusy(false);
    }
  }

  async function removeShelf() {
    if (!database || selectedShelf === "default") return;
    const current = shelves.find((shelf) => shelf.id === selectedShelf);
    if (!window.confirm("Delete " + (current?.name ?? "this shelf") + " and move its books to Library?")) return;
    setBusy(true);
    try {
      for (const entry of library.filter((item) => item.shelf === selectedShelf)) {
        const file = await database.getFile(entry.id);
        if (file) await database.putBook({ ...entry, shelf: "default" }, file);
      }
      setLibrary(await database.listMetadata());
      persistShelves(deleteShelf(shelves, selectedShelf));
      setSelectedShelf("default");
      setStatus("Shelf deleted. Its books were moved to Library.");
    } catch {
      setStatus("Could not move every book out of that shelf.");
    } finally {
      setBusy(false);
    }
  }

  function saveChapters(next: BookkeysChapter[]) {
    if (!book) return;
    const cleaned = tidyChapters(next, book.sections.length);
    const updatedBook = { ...book, chapters: cleaned };
    bookCache.current[book.bookKey] = updatedBook;
    setBook(updatedBook);
    try {
      writeBookkeysChapterSettings(window.localStorage, book.bookKey, book.libraryId, cleaned);
    } catch {
      setStatus("Chapter choices could not be saved in this browser.");
    }
  }

  function addChapter() {
    if (!book) return;
    const title = window.prompt("Name this chapter", "Chapter " + (book.chapters.length + 1));
    if (!title?.trim()) return;
    const next = tidyChapters([...book.chapters, { p: pageIndex, title: title.trim(), req: true }], book.sections.length);
    if (next.length === book.chapters.length) {
      setStatus("A chapter already begins on this section.");
      return;
    }
    saveChapters(next);
    setStatus("Chapter added at section " + (pageIndex + 1) + ".");
  }

  function removeChapter(index: number) {
    if (!book) return;
    saveChapters(book.chapters.filter((_, chapterIndex) => chapterIndex !== index));
    setStatus("Chapter removed. Reading progress was retained.");
  }

  function renameChapter(index: number) {
    if (!book) return;
    const chapter = book.chapters[index];
    if (!chapter) return;
    const title = window.prompt("Rename chapter", chapter.title);
    if (title === null) return;
    const cleaned = title.trim().slice(0, 80);
    if (!cleaned) {
      setStatus("Chapter names cannot be empty.");
      return;
    }
    saveChapters(book.chapters.map((item, itemIndex) =>
      itemIndex === index ? { ...item, title: cleaned } : item,
    ));
    setStatus("Chapter renamed.");
  }

  function setAllChapterRequirements(required: boolean) {
    if (!book) return;
    saveChapters(book.chapters.map((chapter) => ({ ...chapter, req: required })));
  }

  function resetChapterRequirements() {
    if (!book) return;
    saveChapters(withRequirements(book.chapters.map(({ p, title }) => ({ p, title }))));
  }

  function toggleChapterRequirement(index: number) {
    if (!book) return;
    saveChapters(book.chapters.map((chapter, itemIndex) =>
      itemIndex === index ? { ...chapter, req: !chapter.req } : chapter,
    ));
  }

  function persistSettings(next: BookkeysSettings) {
    setSettings(next);
    try {
      window.localStorage.setItem("bookkeys:settings", JSON.stringify(next));
      window.localStorage.setItem("bookkeys:size", JSON.stringify(next.size));
    } catch {
      setStatus("Settings could not be saved in this browser.");
    }
  }

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    persistSettings({ ...settings, bg: nextTheme });
  }

  function exportBackup() {
    try {
      const backup = createBookkeysBackupV1(window.localStorage);
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "bookkeys-backup-" + new Date().toISOString().slice(0, 10) + ".json";
      anchor.click();
      URL.revokeObjectURL(url);
      setStatus("Backup exported. Original PDF/EPUB files remain in this browser and are not included.");
    } catch {
      setStatus("Could not export the Bookkeys backup.");
    }
  }

  async function importBackup(file: File) {
    try {
      const backup = parseBookkeysBackup(await file.text());
      const result = restoreBookkeysBackup(window.localStorage, backup, "merge");
      const game = readGame();
      setGameProgress(game);
      
      setShelves(readShelves(window.localStorage.getItem("bookkeys:shelves")));
      const restoredSettings = readSettings();
      setSettings(restoredSettings);
      setTheme(restoredSettings.bg === "light" ? "light" : "dark");
      if (book) {
        const progress = game.book?.[book.bookKey];
        setCompletedPageIndexes([...new Set([...(progress?.p ?? []), ...(progress?.e ?? [])])]);
      }
      setStatus("Backup merged · " + result.written + " entries brought in · " +
        result.unchanged + " left as they already are here.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not import this backup.");
    } finally {
      if (backupInput.current) backupInput.current.value = "";
    }
  }

  function navTo(nextView: "home" | "book", bookKey?: string, page = 0) {
    if (nextView === "home" && book && !book.isSample) {
      try { writeBookkeysPosition(window.localStorage, book.bookKey, book.libraryId, pageIndex); }
      catch { setStatus("Reading position could not be saved in this browser."); }
    }
    const nextIndex = navState.current.i + 1;
    navState.current = { i: nextIndex, max: nextIndex };
    window.history.pushState(
      { i: nextIndex, v: nextView, bookKey, page },
      "",
      nextView === "home" ? "#home" : "#book-" + (page + 1),
    );
    setView(nextView);
  }

  function navBack() {
    if (navState.current.i > 0) window.history.back();
  }

  function navForward() {
    if (navState.current.i < navState.current.max) window.history.forward();
  }

  function changePage(next: number) {
    if (!book || next < 0 || next >= book.sections.length || next === pageIndex) return;
    const nextIndex = navState.current.i + 1;
    navState.current = { i: nextIndex, max: nextIndex };
    window.history.pushState(
      { i: nextIndex, v: "book", bookKey: book.bookKey, page: next },
      "",
      "#book-" + (next + 1),
    );
    try { writeBookkeysPosition(window.localStorage, book.bookKey, book.libraryId, next); }
    catch { setStatus("Reading position could not be saved in this browser."); }
    setPageIndex(next);
  }

  useEffect(() => {
    window.history.replaceState({ i: 0, v: "home" }, "", "#home");
  }, []);

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const state = event.state as { i?: unknown; v?: unknown; bookKey?: unknown; page?: unknown } | null;
      if (!state || !Number.isInteger(state.i)) {
        navState.current.i = 0;
        setView("home");
        return;
      }
      navState.current.i = state.i as number;
      if (state.v === "book" && typeof state.bookKey === "string") {
        const restored = bookCache.current[state.bookKey];
        if (!restored) { setView("home"); return; }
        setBook(restored);
        setView("book");
        if (Number.isInteger(state.page)) {
          const next = state.page as number;
          if (next >= 0 && next < restored.sections.length) {
            setPageIndex(next);
            try { writeBookkeysPosition(window.localStorage, restored.bookKey, restored.libraryId, next); }
            catch { /* history navigation must still work when storage is unavailable */ }
          }
        }
      } else setView("home");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); navBack(); }
      else if (event.key === "ArrowRight") { event.preventDefault(); navForward(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);


  return (
    <main className="bk-shell">
      <header className="bk-header">
        <div>
          <p className="bk-eyebrow">LIMITLESS / BOOKKEYS PREVIEW</p>
          <h1>Bookkeys</h1>
        </div>
        <div className="bk-header-actions">
          <button className="bk-quiet bk-archive-button" onClick={() => setArchiveOpen(true)} aria-haspopup="dialog">Archive · Lv {archive.level}</button>
          <button id="openSettings" className="bk-quiet bk-settings-button" onClick={() => setSettingsOpen(true)} aria-label="Settings" title="Settings" aria-haspopup="dialog" aria-expanded={settingsOpen}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/><path d="m19.4 15 .1.1a1.8 1.8 0 0 1-2.5 2.5l-.1-.1a1.8 1.8 0 0 0-3 .9v.2a1.8 1.8 0 0 1-3.6 0v-.2a1.8 1.8 0 0 0-3-.9l-.1.1a1.8 1.8 0 0 1-2.5-2.5l.1-.1a1.8 1.8 0 0 0-.9-3h-.2a1.8 1.8 0 0 1 0-3.6h.2a1.8 1.8 0 0 0 .9-3l-.1-.1a1.8 1.8 0 0 1 2.5-2.5l.1.1a1.8 1.8 0 0 0 3-.9v-.2a1.8 1.8 0 0 1 3.6 0v.2a1.8 1.8 0 0 0 3 .9l.1-.1a1.8 1.8 0 0 1 2.5 2.5l-.1.1a1.8 1.8 0 0 0 .9 3h.2a1.8 1.8 0 0 1 0 3.6h-.2a1.8 1.8 0 0 0-.9 3Z"/></svg>
          </button>
          <button className="bk-quiet bk-theme-toggle" onClick={toggleTheme} aria-label="Toggle light and dark theme">
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <div className="bk-xp"><span>Limitless EXP</span><strong>{globalExp.toLocaleString()}</strong></div>
        </div>
      </header>

      {view === "home" || !book ? (
        <section className="bk-library">
          <div className="bk-intro">
            <div>
              <h2>Your library</h2>
              <p>Books are parsed locally. Original files and typing drafts stay in this browser.</p>
            </div>
            <div className="bk-library-actions">
              <select className="bk-shelf-select" value={selectedShelf} onChange={(event) => setSelectedShelf(event.currentTarget.value)} aria-label="Choose shelf">
                {shelves.map((shelf) => <option key={shelf.id} value={shelf.id}>{shelf.name}</option>)}
              </select>
              <button className="bk-quiet" onClick={addShelf}>New shelf</button>
              <button className="bk-quiet" onClick={editShelfName}>Rename</button>
              <button className="bk-quiet" onClick={() => void removeShelf()} disabled={busy || selectedShelf === "default"}>Delete</button>
              {continueEntry && <button className="bk-primary" onClick={() => void loadEntry(continueEntry)}>Continue reading</button>}
              <button className="bk-quiet" onClick={() => setPasteOpen((open) => !open)}>Paste text</button>
              <button className="bk-quiet" onClick={startSample}>Try sample text</button>
              <button className="bk-quiet" onClick={exportBackup}>Export backup</button>
              <button className="bk-quiet" onClick={() => backupInput.current?.click()}>Import backup</button>
              <button className="bk-primary" onClick={() => fileInput.current?.click()} disabled={busy}>
                {busy ? "Working…" : "Import PDF / EPUB / TXT"}
              </button>
            </div>
            <input
              ref={fileInput}
              className="bk-hidden"
              type="file"
              accept=".pdf,.epub,.txt,application/pdf,application/epub+zip,text/plain"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) void importFile(file);
              }}
            />
          </div>
          {pasteOpen && (
            <section className="bk-paste-panel" aria-label="Paste book text">
              <label htmlFor="bk-paste-text">Paste a passage or a longer text</label>
              <textarea
                id="bk-paste-text"
                value={pasteText}
                onChange={(event) => setPasteText(event.currentTarget.value)}
                placeholder="Paste text here. Blank lines separate paragraphs."
                rows={7}
              />
              <div>
                <button className="bk-primary" onClick={startPastedText} disabled={busy || !pasteText.trim()}>Create text book</button>
                <button className="bk-quiet" onClick={() => setPasteOpen(false)}>Cancel</button>
              </div>
            </section>
          )}
          <section className="bk-progress-overview" aria-label="Bookkeys progress">
            <div className="bk-progress-heading">
              <strong>Reading progress</strong>
              <span>Saved in this browser</span>
            </div>
            <div className="bk-progress-stats">
              <div className="bk-progress-stat"><strong>{Number(gameProgress.pages ?? 0).toLocaleString()}</strong><span>Pages typed</span></div>
              <div className="bk-progress-stat"><strong>{Number(gameProgress.chapters ?? 0).toLocaleString()}</strong><span>Chapters completed</span></div>
              <div className="bk-progress-stat"><strong>{Number(gameProgress.books ?? 0).toLocaleString()}</strong><span>Books completed</span></div>
              <div className="bk-progress-stat"><strong>{Number(gameProgress.words ?? 0).toLocaleString()}</strong><span>Words typed</span></div>
              <div className="bk-progress-stat"><strong>{Number(gameProgress.chars ?? 0).toLocaleString()}</strong><span>Characters typed</span></div>
            </div>
          </section>
          <div className="bk-library-tools">
            <label className="bk-library-search">
              <span>Search this shelf</span>
              <input
                type="search"
                value={libraryQuery}
                onChange={(event) => setLibraryQuery(event.currentTarget.value)}
                placeholder="Search by book title or author…"
                aria-label="Search books"
              />
            </label>
            <label className="bk-library-sort">
              <span>Sort by</span>
              <select aria-label="Sort books" value={librarySort} onChange={(event) => setLibrarySort(event.currentTarget.value as BookkeysLibrarySort)}>
                <option value="recent">Recently opened</option>
                <option value="title-asc">Title A–Z</option>
                <option value="title-desc">Title Z–A</option>
              </select>
            </label>
          </div>
          {visibleLibrary.length ? (
            <div className="bk-book-grid">
              {visibleLibrary.map((entry) => (
                <button className="bk-book" key={entry.id} onClick={() => void loadEntry(entry)} disabled={busy}>
                  <span className="bk-book-format">{entry.fmt === "epub" ? "EPUB" : entry.fmt === "text" ? "TXT" : "PDF"}</span>
                  <strong>{entry.name}</strong>
                  <span>{entry.pages} {entry.fmt ? "sections" : "pages"}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="bk-empty">
              <strong>{libraryQuery.trim() ? "No matching books" : "No books yet"}</strong>
              <span>{libraryQuery.trim() ? "Try another title or author, or clear the search." : "Import a PDF, EPUB or text file, or paste text to create your local library."}</span>
            </div>
          )}
        </section>
      ) : (
        <section className="bk-reader">
          <div className="bk-reader-top">
            <button className="bk-quiet" onClick={() => { navTo("home"); setTyped(""); }}>← Library</button>
            {!book.isSample && <button className="bk-quiet" onClick={() => void removeCurrentBook()} disabled={busy}>Remove book</button>}
            <div className="bk-book-title">
              <strong>{book.title}</strong>
              <span>{book.author || (book.format === "pdf" ? "PDF" : book.format === "epub" ? "EPUB" : "Plain text")}</span>
            </div>
            <div className="bk-counter">{book.format === "pdf" ? "Page" : "Section"} {pageIndex + 1} / {book.sections.length}</div>
          </div>
          <div className="bk-chapter-tools">
            <div>
              <strong>Chapters</strong>
              <span>{requiredSections(book.chapters, book.sections.length).length} required sections</span>
            </div>
            <div className="bk-chapter-actions">
              <button className="bk-quiet" onClick={() => setAllChapterRequirements(true)}>All required</button>
              <button className="bk-quiet" onClick={() => setAllChapterRequirements(false)}>All optional</button>
              <button className="bk-quiet" onClick={resetChapterRequirements}>Use defaults</button>
              <button className="bk-quiet" onClick={() => setChaptersOpen((open) => !open)}>{chaptersOpen ? "Hide" : "Edit"}</button>
              {chaptersOpen && <button className="bk-quiet" onClick={addChapter}>Add chapter</button>}
            </div>
          </div>
          {chaptersOpen && (
            <div className="bk-chapter-list">
              {book.chapters.map((chapter, index) => (
                <div className="bk-chapter-row" key={chapter.p + ":" + index}>
                  <span>{chapter.title}</span>
                  <div className="bk-chapter-row-actions">
                    <button
                      className={chapter.req ? "bk-required" : "bk-optional"}
                      aria-pressed={chapter.req}
                      onClick={() => toggleChapterRequirement(index)}
                    >{chapter.req ? "Required" : "Optional"}</button>
                    <button className="bk-quiet" onClick={() => renameChapter(index)} aria-label={"Rename " + chapter.title}>Rename</button>
                    <button className="bk-quiet" onClick={() => removeChapter(index)} aria-label={"Remove " + chapter.title}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="bk-reader-meta">
            <span>{currentChapter?.title ?? "Beginning"}</span>
            <span>{Math.round(((pageIndex + 1) / book.sections.length) * 100)}% through book · {requiredCompletedCount}/{requiredPageIndexes.length} required complete</span>
          </div>
          <div className="bk-progress-track"><span style={{ width: (requiredPageIndexes.length ? requiredCompletedCount / requiredPageIndexes.length * 100 : 0) + "%" }} /></div>
          {target ? (
            <>
              <article
                className="bk-source-text"
                data-reader-background={settings.readerBackground ?? "none"}
                style={(() => {
                  const selected = settings.readerBackground === "gothic" ? artwork.gothic
                    : settings.readerBackground === "garden" ? artwork.garden : undefined;
                  const safe = safeArtworkDataUrl(selected);
                  const preset = READER_BACKGROUND_PRESETS.find((item) => item.id === settings.readerBackground);
                  if (preset?.image) return undefined;
                  if (safe) return {
                    backgroundImage: `linear-gradient(var(--bk-reader-art-overlay), var(--bk-reader-art-overlay)), url("${safe}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  };
                  return preset ? {
                    backgroundImage: `linear-gradient(rgba(4, 5, 12, .42), rgba(4, 5, 12, .42)), ${preset.background}`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  } : undefined;
                })()}
              >{target}</article>
              <label className="bk-type-label" htmlFor="bk-typing">Type the section below</label>
              <textarea
                id="bk-typing"
                className="bk-typing"
                value={typed}
                onChange={(event) => {
                  const inputType = event.nativeEvent instanceof InputEvent ? event.nativeEvent.inputType : "insertText";
                  onTyping(event.currentTarget.value, inputType);
                  event.currentTarget.setSelectionRange(event.currentTarget.value.length, event.currentTarget.value.length);
                }}
                onPaste={(event) => {
                  if (event.clipboardData.getData("text").length > 1) {
                    event.preventDefault();
                    setStatus("Pasted text does not count. Type the section a character at a time.");
                  }
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  setStatus("Dropped text does not count. Type the section a character at a time.");
                }}
                placeholder="Start typing here…"
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
              />
              <div className="bk-typing-metrics" aria-label="Typing metrics">
                <div><strong>{liveAccuracy.percent}%</strong><span>Accuracy</span></div>
                <div><strong>{liveWpm}</strong><span>WPM</span></div>
                <div><strong>{typed.length.toLocaleString()}</strong><span>Typed characters</span></div>
              </div>
            </>
          ) : (
            <div className="bk-empty-page">No selectable text found on this page. It has been recorded as empty and will not block finishing the book.</div>
          )}
          <div className="bk-reader-bottom">
            <span>{typed.length} / {target.length} characters</span>
            <div>
              <button className="bk-quiet" onClick={() => changePage(pageIndex - 1)} disabled={pageIndex === 0}>Previous</button>
              <button className="bk-primary" onClick={() => changePage(pageIndex + 1)} disabled={pageIndex >= book.sections.length - 1}>Next section</button>
            </div>
          </div>
        </section>
      )}
      <input
        ref={backupInput}
        className="bk-hidden"
        type="file"
        accept="application/json,.json"
        aria-label="Import Bookkeys backup"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          if (file) void importBackup(file);
        }}
      />
      {archiveOpen && (
        <div className="bk-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setArchiveOpen(false);
        }}>
          <section className="bk-archive-panel" role="dialog" aria-modal="true" aria-labelledby="bk-archive-title">
            <header className="bk-settings-header">
              <div>
                <p className="bk-eyebrow">BOOKKEYS · PERSONAL RECORD</p>
                <h2 id="bk-archive-title">The Akashic Archive</h2>
              </div>
              <button className="bk-quiet" onClick={() => setArchiveOpen(false)} aria-label="Close Archive">Close</button>
            </header>
            <div className="bk-archive-level">
              <div><span>Level {archive.level}</span><strong>{archive.rank}</strong></div>
              <strong>{archive.xp.toLocaleString()} Bookkeys XP</strong>
              <div className="bk-archive-track"><span style={{ width: archive.levelProgress + "%" }} /></div>
              <small>{archive.xpIntoLevel.toLocaleString()} / {archive.xpForNextLevel.toLocaleString()} XP to level {archive.level + 1}</small>
              <p>Bookkeys' own progression is kept separate from shared Limitless EXP.</p>
            </div>
            <div className="bk-archive-stats">
              <div><strong>{Number(gameProgress.books ?? 0).toLocaleString()}</strong><span>Books finished</span></div>
              <div><strong>{Number(gameProgress.chapters ?? 0).toLocaleString()}</strong><span>Chapters finished</span></div>
              <div><strong>{Number(gameProgress.pages ?? 0).toLocaleString()}</strong><span>Pages typed</span></div>
              <div><strong>{Number(gameProgress.words ?? 0).toLocaleString()}</strong><span>Words</span></div>
              <div><strong>{Number(gameProgress.chars ?? 0).toLocaleString()}</strong><span>Letters</span></div>
              <div><strong>{archive.bestWpm.toLocaleString()} WPM</strong><span>Best speed</span></div>
              <div><strong>{archive.perfectPages.toLocaleString()}</strong><span>Perfect pages</span></div>
              <div><strong>{archive.currentStreak} / {archive.bestStreak}</strong><span>Current / best streak</span></div>
              <div><strong>{archive.days.toLocaleString()}</strong><span>Days practised</span></div>
            </div>
            <div className="bk-archive-achievement-heading">
              <strong>Achievements</strong>
              <span>{archive.unlocked} of {archive.totalAchievements} unlocked</span>
            </div>
            <div className="bk-archive-achievements">
              {archive.achievements.map((achievement) => (
                <article className={"bk-archive-achievement" + (achievement.unlocked ? " is-unlocked" : "")} key={achievement.id}>
                  <div>
                    <strong>{theme === "light" && achievement.lightName ? achievement.lightName : achievement.name}</strong>
                    <span>{achievement.description}</span>
                  </div>
                  <div className="bk-archive-achievement-progress">
                    <strong>{achievement.unlocked ? "Unlocked" : achievement.reached ? "Threshold met · unlock record not saved" : achievement.value.toLocaleString() + " / " + achievement.target.toLocaleString()}</strong>
                    <div className="bk-archive-track"><span style={{ width: (achievement.value / achievement.target * 100) + "%" }} /></div>
                  </div>
                </article>
              ))}
            </div>
            <p className="bk-settings-note">New achievements are awarded when qualifying pages are completed. Existing unlock dates are preserved; achievements already above their threshold in an older save are not retroactively timestamped.</p>
          </section>
        </div>
      )}
      {settingsOpen && (
        <div className="bk-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSettingsOpen(false);
        }}>
          <section className="bk-settings-panel" role="dialog" aria-modal="true" aria-labelledby="bk-settings-title">
            <header className="bk-settings-header">
              <h2 id="bk-settings-title">Settings</h2>
              <button id="closeSettings" className="bk-quiet" onClick={() => setSettingsOpen(false)} aria-label="Close Settings">Close</button>
            </header>
            <nav className="bk-settings-tabs" aria-label="Settings sections">
              <button className={settingsTab === "appearance" ? "active" : ""} onClick={() => setSettingsTab("appearance")}>Appearance</button>
              <button className={settingsTab === "data" ? "active" : ""} onClick={() => setSettingsTab("data")}>Data</button>
            </nav>
            {settingsTab === "appearance" ? (
              <div className="bk-settings-content">
                <label className="bk-setting">
                  <span>Reading background</span>
                  <select
                    aria-label="Reader background"
                    value={settings.readerBackground ?? "none"}
                    onChange={(event) => persistSettings({
                      ...settings,
                      readerBackground: event.currentTarget.value as ReaderBackgroundId,
                    })}
                  >
                    <option value="none">Plain</option>
                    {artwork.gothic && <option value="gothic">Gothic artwork</option>}
                    {artwork.garden && <option value="garden">Garden artwork</option>}
                    <optgroup label="Static scenes">
                      {READER_BACKGROUND_PRESETS.map((preset) => <option key={preset.id} value={preset.id}>{preset.label}</option>)}
                    </optgroup>
                  </select>
                  {!artwork.gothic && !artwork.garden && (
                    <span className="bk-settings-note">No saved Bookkeys artwork was found in this browser.</span>
                  )}
                </label>
                <div className="bk-setting">
                  <span>Custom artwork <small>Stored in this browser, not in backups.</small></span>
                  <div className="bk-artwork-actions">
                    <label>Gothic picture
                      <input type="file" accept="image/*" aria-label="Upload Gothic artwork" disabled={!database || artworkBusy !== null}
                        onChange={(event) => { const file = event.currentTarget.files?.[0]; if (file) void saveArtwork("gothic", file); event.currentTarget.value = ""; }} />
                    </label>
                    {artwork.gothic && <button type="button" className="bk-quiet" disabled={artworkBusy !== null} onClick={() => void removeArtwork("gothic")}>Remove Gothic</button>}
                    <label>Garden picture
                      <input type="file" accept="image/*" aria-label="Upload Garden artwork" disabled={!database || artworkBusy !== null}
                        onChange={(event) => { const file = event.currentTarget.files?.[0]; if (file) void saveArtwork("garden", file); event.currentTarget.value = ""; }} />
                    </label>
                    {artwork.garden && <button type="button" className="bk-quiet" disabled={artworkBusy !== null} onClick={() => void removeArtwork("garden")}>Remove Garden</button>}
                  </div>
                  <span className="bk-settings-note" role="status">{artworkStatus || "Images are resized to at most 1600 × 900 before local storage."}</span>
                </div>
                <label className="bk-setting">
                  <span>Reading text size <strong>{settings.size}px</strong></span>
                  <input type="range" min="12" max="28" step="1" value={settings.size}
                    onChange={(event) => persistSettings({ ...settings, size: Number(event.currentTarget.value) })} />
                </label>
                <label className="bk-setting">
                  <span>Line spacing <strong>{settings.lineH.toFixed(1)}</strong></span>
                  <input type="range" min="1.2" max="2.4" step="0.1" value={settings.lineH}
                    onChange={(event) => persistSettings({ ...settings, lineH: Number(event.currentTarget.value) })} />
                </label>
                <label className="bk-setting bk-setting-check">
                  <span>Completion celebrations</span>
                  <input type="checkbox" checked={settings.celebrate}
                    onChange={(event) => persistSettings({ ...settings, celebrate: event.currentTarget.checked })} />
                </label>
                <p className="bk-settings-note">Theme can also be changed using the sun/moon control in the header.</p>
              </div>
            ) : (
              <div className="bk-settings-content">
                <h3>Backup and restore</h3>
                <p className="bk-settings-note">A v1 backup contains Bookkeys settings, typing progress, drafts, shelves and chapter choices. Original PDF/EPUB files and custom artwork stay in browser storage and are not included.</p>
                <div className="bk-settings-data-actions">
                  <button className="bk-primary" onClick={exportBackup}>Export backup</button>
                  <button className="bk-quiet" onClick={() => backupInput.current?.click()}>Import and merge backup</button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
      <p className="bk-status" role="status">{status}</p>
    </main>
  );
}
