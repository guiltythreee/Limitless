"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { BOOKKEYS_BACKGROUND_CATALOG, BOOKKEYS_SCENE_IDS, createBookkeysBackgroundEngine } from "../domain/reading/bookkeys-backgrounds";
import { createBookkeysEffectsEngine } from "../domain/reading/bookkeys-effects";
import { createBookkeysSoundEngine } from "../domain/reading/bookkeys-sound";
import { ACC, BGPAL, CARETS, FCOLS, FONTS, THEMES, TOK, resolveBookkeysAppearance } from "../domain/reading/bookkeys-appearance";
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
  { id: "snow", label: "Snow", background: "radial-gradient(circle at 18% 28%,rgba(255,255,255,.75) 0 2px,transparent 3px), radial-gradient(circle at 72% 62%,rgba(255,255,255,.55) 0 3px,transparent 4px), linear-gradient(#0a1422,#162a40 60%,#2a4160)", motion: "bk-bg-snow" },
  { id: "aurora", label: "Aurora", background: "radial-gradient(ellipse at 52% 25%,rgba(45,255,154,.42),transparent 38%), radial-gradient(ellipse at 78% 48%,rgba(123,107,255,.35),transparent 42%), linear-gradient(#020712,#06142b 60%,#0b2236)", motion: "bk-bg-aurora" },
  { id: "rain", label: "Rain", background: "repeating-linear-gradient(105deg,transparent 0 18px,rgba(190,210,230,.13) 19px 20px), linear-gradient(#080e15,#101a24 60%,#1b2836)", motion: "bk-bg-rain" },
  { id: "digital", label: "Digital rain", background: "repeating-linear-gradient(90deg,transparent 0 18px,rgba(43,255,122,.13) 19px 20px), linear-gradient(#000a05,#03140a 60%,#0f4a27)", motion: "bk-bg-digital" },
  { id: "underwater", label: "Underwater", background: "radial-gradient(ellipse at 35% 15%,rgba(95,227,255,.32),transparent 45%), radial-gradient(ellipse at 75% 80%,rgba(12,106,138,.45),transparent 50%), linear-gradient(#021a30,#06304d)" },
  { id: "shafts", label: "Light shafts", background: "linear-gradient(115deg,#17120d 20%,rgba(227,181,101,.15) 36%,#3c2b18 48%,rgba(227,181,101,.22) 58%,#17120d 75%)" },
  { id: "candle", label: "Candlelight", background: "radial-gradient(circle at 50% 88%,rgba(255,179,71,.78),transparent 34%), linear-gradient(#0b0705,#17100b 65%,#3a2814)", motion: "bk-bg-candle" },
  { id: "hearth", label: "Hearth", background: "radial-gradient(ellipse at 50% 100%,rgba(255,138,61,.6),transparent 42%), linear-gradient(#080303,#1a0a07 65%,#4a1e10)", motion: "bk-bg-hearth" },
  { id: "crt", label: "CRT", background: "repeating-linear-gradient(0deg,rgba(57,255,122,.08) 0 2px,transparent 2px 4px), linear-gradient(#03100a,#072016)" },
  { id: "warp", label: "Warp speed", background: "radial-gradient(circle at 50% 50%,#8fb4ff 0,#0a1030 25%,#02030a 70%)" },
  { id: "nebula", label: "Nebula", background: "radial-gradient(circle at 30% 40%,#7c3aed,transparent 55%), radial-gradient(circle at 70% 60%,#db2777,transparent 55%), #05030f", motion: "bk-bg-nebula" },
  { id: "fireflies", label: "Fireflies", background: "radial-gradient(circle at 30% 60%,#e8f27a 0 3px,transparent 4px), radial-gradient(circle at 65% 40%,#e8f27a 0 3px,transparent 4px), linear-gradient(#05100d,#0f2a1d)", motion: "bk-bg-fireflies" },
  { id: "synthwave", label: "Synthwave", background: "linear-gradient(#0b0221,#6a0f7a 55%,#ff3e9a 56%,#1a0533 57%)", motion: "bk-bg-synthwave" },
  { id: "sakura", label: "Sakura", background: "linear-gradient(#2a1236,#a14a82 70%,#f4a3bd)" },
  { id: "autumn", label: "Autumn leaves", background: "radial-gradient(circle at 25% 25%,rgba(255,178,70,.3),transparent 32%), linear-gradient(#2b1405,#6e3211 60%,#a8541a)" },
  { id: "lava", label: "Lava lamp", background: "radial-gradient(circle at 35% 70%,#ff5a8a,transparent 45%), radial-gradient(circle at 65% 35%,#ff9a3c,transparent 45%), #1a0630", motion: "bk-bg-lava" },
  { id: "storm", label: "Thunderstorm", background: "radial-gradient(ellipse at 70% 20%,rgba(150,170,205,.25),transparent 35%), linear-gradient(#05070d,#2b364d)", motion: "bk-bg-storm" },
  { id: "bokeh", label: "Bokeh", background: "radial-gradient(circle at 25% 35%,#4cc9f0 0 10px,transparent 11px), radial-gradient(circle at 70% 60%,#f472b6 0 14px,transparent 15px), linear-gradient(#0a0f1f,#1b1030)", motion: "bk-bg-bokeh" },
  { id: "mesh", label: "Gradient mesh", background: "radial-gradient(ellipse at 18% 20%,#312e81,transparent 45%), radial-gradient(ellipse at 80% 35%,#be185d,transparent 50%), radial-gradient(ellipse at 48% 90%,#0f766e,transparent 55%), #090b1a" },
  { id: "constellation", label: "Constellation", background: "radial-gradient(circle at 20% 30%,#9db4ff 0 2px,transparent 3px), radial-gradient(circle at 60% 60%,#9db4ff 0 2px,transparent 3px), radial-gradient(circle at 80% 25%,#9db4ff 0 2px,transparent 3px), linear-gradient(#050816,#0c1233)" },
  { id: "mist", label: "Misty pines", background: "radial-gradient(ellipse at 50% 45%,rgba(180,205,210,.22),transparent 48%), linear-gradient(#0b1217,#243941 65%,#3a4f58)", motion: "bk-bg-mist" },
] as const;
type ReaderBackgroundId = "none" | "tod" | "gothic" | "garden" | (typeof READER_BACKGROUND_PRESETS)[number]["id"];

function isReaderBackgroundId(value: unknown): value is ReaderBackgroundId {
  return value === "none" || value === "tod" || value === "gothic" || value === "garden" ||
    READER_BACKGROUND_PRESETS.some((preset) => preset.id === value);
}

function effectiveReaderBackground(value: ReaderBackgroundId, now = new Date()): ReaderBackgroundId {
  if (value !== "tod") return value;
  const hour = now.getHours();
  return hour >= 20 || hour < 6 ? "pic-night" : hour >= 17 ? "pic-evening" : "pic-morning";
}

function readerBackgroundTileStyle(id: string): CSSProperties {
  const preset = READER_BACKGROUND_PRESETS.find((item) => item.id === id);
  if (preset && "image" in preset) {
    return { backgroundImage: `url("${preset.image}")`, backgroundSize: "cover", backgroundPosition: "center" };
  }
  if (id === "none") return { background: "linear-gradient(135deg, #211d2a, #09080e)" };
  if (id === "tod") return { background: "linear-gradient(90deg, #e8c79a 0 33%, #77577c 33% 66%, #101a35 66%)" };
  const original = BOOKKEYS_BACKGROUND_CATALOG.find((item) => item.id === id);
  if (original) return { background: original.thumb };
  if (preset && "background" in preset) return { background: preset.background };
  return {};
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

function safeReaderTextColor(value: unknown): string | undefined {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value : undefined;
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
  const defaults: BookkeysSettings = {
    skin: "auto",
    accent: "theme",
    accentCustom: "#E11D48",
    fontColor: "theme",
    fontColorCustom: "#FF8A00",
    bgMatch: true,
    deco: "on",
    bg: "pic-morning",
    bgDensity: 1,
    bgAnim: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    backdrop: 0,
    picVeil: 0,
    picBlur: 0,
    font: "newsreader",
    size: 20,
    lineH: 1.7,
    spacing: 0,
    punct: "simplify",
    lglow: true,
    tfx: "none",
    fxInt: 1,
    efx: "flash",
    sparks: "off",
    sound: "off",
    volume: 50,
    errSound: true,
    centered: false,
    celebrate: true,
    motion: "system",
    cstyle: "block",
    cblink: "blink",
    csmooth: true,
    cglow: false,
    ccolor: "accent",
  };
  const legacySize = readLegacySize(defaults.size);
  let settings: BookkeysSettings = { ...defaults, size: legacySize };
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem("bookkeys:settings") ?? "{}");
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const record = value as Record<string, unknown>;
      settings = {
        ...defaults,
        ...record,
        bg: typeof record.bg === "string" ? record.bg : defaults.bg,
        size: typeof record.size === "number" && Number.isFinite(record.size) ? record.size : legacySize,
        lineH: typeof record.lineH === "number" && Number.isFinite(record.lineH) ? record.lineH : defaults.lineH,
        celebrate: typeof record.celebrate === "boolean" ? record.celebrate : defaults.celebrate,
      };
    }
  } catch { /* Keep the complete defaults and the separately stored legacy size. */ }

  // Preserve the original one-time background migrations. The two flags are
  // independent of bookkeys:settings and must never be replayed after set.
  let migrated = false;
  try {
    if (!window.localStorage.getItem("bookkeys:bgdef1")) {
      window.localStorage.setItem("bookkeys:bgdef1", "1");
      if (settings.bg === "none") {
        settings = { ...settings, bg: "shafts", bgMatch: true };
        migrated = true;
      }
    }
    if (!window.localStorage.getItem("bookkeys:bgdef2")) {
      window.localStorage.setItem("bookkeys:bgdef2", "1");
      if (settings.bg === "shafts") {
        settings = {
          ...settings,
          bg: "pic-morning",
          bgMatch: true,
          picVeil: settings.picVeil === 45 ? 0 : settings.picVeil,
        };
        migrated = true;
      }
    }
    if (migrated) window.localStorage.setItem("bookkeys:settings", JSON.stringify(settings));
  } catch { /* Storage failures must not prevent opening the reader. */ }

  const readerBackground = isReaderBackgroundId(settings.readerBackground)
    ? settings.readerBackground
    : isReaderBackgroundId(settings.bg) ? settings.bg : "none";
  return { ...settings, readerBackground };
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
  const [shelves, setShelves] = useState<BookkeysShelf[]>([{ id: "main", name: "Library" }]);
  const [selectedShelf, setSelectedShelf] = useState("main");
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
  const [themeOverride, setThemeOverride] = useState(false);
  const [settings, setSettings] = useState<BookkeysSettings>({ bg: "pic-morning", size: 20, lineH: 1.7, celebrate: true });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"theme" | "background" | "font" | "typing" | "cursor" | "data">("theme");
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundEngineRef = useRef<ReturnType<typeof createBookkeysBackgroundEngine> | null>(null);
  const effectsCanvasRef = useRef<HTMLCanvasElement>(null);
  const effectsEngineRef = useRef<ReturnType<typeof createBookkeysEffectsEngine> | null>(null);
  const soundEngineRef = useRef<ReturnType<typeof createBookkeysSoundEngine> | null>(null);
  const sourceTextRef = useRef<HTMLElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef(settings);
  const reducedMotionRef = useRef(false);
  const caretTypingTimerRef = useRef<number | null>(null);
  const errorFeedbackTimerRef = useRef<number | null>(null);
  const [clockMinute, setClockMinute] = useState(() => new Date().getMinutes());
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);
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
  const composingRef = useRef(false);
  const [keyStats, setKeyStats] = useState({ ok: 0, all: 0 });
  settingsRef.current = settings;

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
    // The legacy "bg" field is the reader scene (for example "pic-morning"),
    // not the light/dark UI theme. Keep it untouched in the persisted settings.
    const initialTheme = savedTheme === "light" ? "light" : "dark";
    setThemeOverride(window.localStorage.getItem("limitless.typing.v1.themeOverride") === "1");
    const mappedScene: ReaderBackgroundId =
      isReaderBackgroundId(savedSettings.bg) ? savedSettings.bg : "none";
    setSettings({
      ...savedSettings,
      readerBackground: isReaderBackgroundId(savedSettings.readerBackground)
        ? savedSettings.readerBackground
        : mappedScene,
    });
    setTheme(initialTheme);
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    try { window.localStorage.setItem("limitless.typing.v1.theme", theme); } catch { /* theme is a preference */ }
  }, [theme, themeReady]);

  useEffect(() => {
    const canvas = backgroundCanvasRef.current;
    if (!canvas) return;
    const engine = createBookkeysBackgroundEngine(canvas);
    backgroundEngineRef.current = engine;
    return () => {
      engine.destroy();
      backgroundEngineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const canvas = effectsCanvasRef.current;
    if (!canvas) return;
    const effects = createBookkeysEffectsEngine(
      canvas,
      () => Number(settingsRef.current.fxInt ?? 1),
      () => reducedMotionRef.current,
    );
    const sound = createBookkeysSoundEngine(() => settingsRef.current);
    effectsEngineRef.current = effects;
    soundEngineRef.current = sound;
    return () => {
      effects.destroy();
      sound.destroy();
      effectsEngineRef.current = null;
      soundEngineRef.current = null;
      if (caretTypingTimerRef.current !== null) window.clearTimeout(caretTypingTimerRef.current);
      if (errorFeedbackTimerRef.current !== null) window.clearTimeout(errorFeedbackTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setClockMinute(new Date().getMinutes()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const selectedBackground = (settings.readerBackground ?? "none") as ReaderBackgroundId;
  const effectiveBackground = useMemo(
    () => effectiveReaderBackground(selectedBackground),
    [selectedBackground, clockMinute],
  );
  const backgroundPreset = READER_BACKGROUND_PRESETS.find((preset) => preset.id === effectiveBackground);
  const picturePreset = backgroundPreset && "image" in backgroundPreset ? backgroundPreset : undefined;
  const staticPreset = backgroundPreset && !("image" in backgroundPreset) && !BOOKKEYS_SCENE_IDS.includes(effectiveBackground)
    ? backgroundPreset : undefined;
  const selectedArtwork = effectiveBackground === "gothic" ? artwork.gothic
    : effectiveBackground === "garden" ? artwork.garden : undefined;
  const safeBackgroundArtwork = safeArtworkDataUrl(selectedArtwork);
  const backgroundArtworkTiles = [
    { id: "gothic" as const, label: "Gothic artwork", image: safeArtworkDataUrl(artwork.gothic) },
    { id: "garden" as const, label: "Garden artwork", image: safeArtworkDataUrl(artwork.garden) },
  ].filter((item) => Boolean(item.image));
  const chooseBackground = (nextBackground: ReaderBackgroundId) => {
    clearThemeOverride();
    const isCustomArtwork = nextBackground === "gothic" || nextBackground === "garden";
    persistSettings({
      ...settings,
      readerBackground: nextBackground,
      ...(!isCustomArtwork ? { bg: nextBackground } : {}),
    });
  };
  const chooseTheme = (themeOption: (typeof THEMES)[number]) => {
    clearThemeOverride();
    persistSettings({ ...settings, skin: themeOption.id, bgMatch: false });
    if (themeOption.v) setTheme(themeOption.dark ? "dark" : "light");
  };
  const isPictureBackground = effectiveBackground.startsWith("pic-");
  const isCanvasScene = BOOKKEYS_SCENE_IDS.includes(effectiveBackground);
  const backdropPercent = Math.max(
    Number(settings.backdrop ?? 0),
    isPictureBackground ? 70 : 0,
  );
  const backgroundStyle = {
    "--bk-picture-blur": `${Number(settings.picBlur ?? 0)}px`,
    "--bk-picture-veil": String(Number(settings.picVeil ?? 0) / 100),
    "--bk-panel-opacity": `${backdropPercent}%`,
  } as CSSProperties;
  const resolvedAppearance = useMemo(
    () => resolveBookkeysAppearance(
      themeOverride ? { ...settings, skin: "auto", bgMatch: false } : settings,
      effectiveBackground,
      theme === "dark",
      systemReducedMotion,
    ),
    [settings, effectiveBackground, theme, systemReducedMotion, themeOverride],
  );
  const homeArtwork = resolvedAppearance.decoration === "gothic" ? safeArtworkDataUrl(artwork.gothic)
    : resolvedAppearance.decoration === "garden" ? safeArtworkDataUrl(artwork.garden) : null;
  const shellStyle = {
    ...backgroundStyle,
    "--bk-home-art": homeArtwork ? `url("${homeArtwork}")` : "none",
  } as CSSProperties;
  const activeTone = resolvedAppearance.tone;
  const contrastHintText = useMemo(() => {
    const scenePalette = BGPAL[effectiveBackground as keyof typeof BGPAL];
    const background = scenePalette?.v?.bg ?? resolvedAppearance.variables.bg;
    const selectedText = settings.fontColor === "custom"
      ? settings.fontColorCustom
      : FCOLS.find((option) => option.v === settings.fontColor)?.c;
    const textColor = selectedText || resolvedAppearance.variables.ink;
    const luminance = (hex: string) => {
      if (!/^#[0-9a-fA-F]{6}$/.test(hex || "")) return null;
      const channels = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255)
        .map((value) => value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4));
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    };
    const bgLuminance = luminance(background);
    const textLuminance = luminance(textColor);
    if (bgLuminance === null || textLuminance === null) return "";
    const high = Math.max(bgLuminance, textLuminance);
    const low = Math.min(bgLuminance, textLuminance);
    const ratio = (high + 0.05) / (low + 0.05);
    const rating = ratio >= 7 ? "excellent" : ratio >= 4.5 ? "good"
      : ratio >= 3 ? "low, tiring to read" : "very low, may be hard to see";
    let message = `Contrast with the background: ${ratio.toFixed(1)}:1 (${rating}).`;
    if (scenePalette && !settings.bgMatch && ratio < 4.5) {
      message += " Try turning on “Match colors to background”.";
    }
    return message;
  }, [effectiveBackground, resolvedAppearance, settings.fontColor, settings.fontColorCustom, settings.bgMatch]);
  const isReducedMotion = settings.motion === "reduce" || (settings.motion !== "full" && systemReducedMotion);
  reducedMotionRef.current = isReducedMotion;

  useEffect(() => {
    if (!themeReady) return;
    const motion = settings.motion === "reduce" ||
      (settings.motion !== "full" && systemReducedMotion);
    const shouldAnimate = settings.bgAnim !== false && !motion;
    backgroundEngineRef.current?.set(
      isCanvasScene ? effectiveBackground : "none",
      Number(settings.bgDensity ?? 1),
      shouldAnimate,
    );
    const canvas = backgroundCanvasRef.current;
    if (canvas) canvas.dataset.animated = String(isCanvasScene && shouldAnimate);
  }, [
    themeReady, effectiveBackground, isCanvasScene, settings.bgDensity,
    settings.bgAnim, settings.motion, systemReducedMotion,
  ]);

  useEffect(() => {
    if (!themeReady) return;
    const root = document.documentElement;
    TOK.forEach((token) => root.style.removeProperty(`--${token}`));
    Object.entries(resolvedAppearance.variables).forEach(([token, value]) => {
      root.style.setProperty(`--${token}`, String(value));
    });
    if (!resolvedAppearance.variables.typed) root.style.removeProperty("--typed");
    root.style.setProperty("--caret", resolvedAppearance.caret || "var(--accent)");
    root.style.setProperty("--font-text", resolvedAppearance.fontStack);
    root.style.setProperty("--tsize", resolvedAppearance.fontSize);
    root.style.setProperty("--lh", resolvedAppearance.lineHeight);
    root.style.setProperty("--ls", resolvedAppearance.letterSpacing);
    root.style.setProperty("--panel-op", `${backdropPercent}%`);
    root.style.setProperty("--pic-veil", `${Number(settings.picVeil ?? 0)}%`);
    root.style.setProperty("--pic-blur", `${Number(settings.picBlur ?? 0)}px`);
    root.dataset.tone = resolvedAppearance.tone;
    root.dataset.theme = resolvedAppearance.tone;
    root.dataset.deco = resolvedAppearance.decoration;
    root.dataset.bg = effectiveBackground;
    root.dataset.pic = isPictureBackground ? "on" : "off";
    root.dataset.calm = resolvedAppearance.calm;
    root.dataset.lglow = resolvedAppearance.textGlow;
    root.dataset.centered = resolvedAppearance.centered;
    root.dataset.tfx = String(settings.tfx ?? "none");
    root.dataset.cstyle = String(settings.cstyle ?? "block");
    root.dataset.cblink = String(settings.cblink ?? "blink");
    root.dataset.cglow = resolvedAppearance.cursorGlow;
    root.dataset.csmooth = resolvedAppearance.cursorSmooth;
    root.dataset.punct = String(settings.punct ?? "simplify");
  }, [
    themeReady, resolvedAppearance, effectiveBackground, isPictureBackground,
    backdropPercent, settings.picVeil, settings.picBlur, settings.tfx,
    settings.cstyle, settings.cblink, settings.punct,
  ]);

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
  const target = useMemo(() => {
    const text = book?.sections[pageIndex]?.map((block) => block.text).join("\n") ?? "";
    if (book?.format !== "pdf" || settings.punct !== "simplify") return text;
    return text
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[—–]/g, "-")
      .replace(/…/g, "...");
  }, [book, pageIndex, settings.punct]);
  const readerBlocks = useMemo(() => {
    let offset = 0;
    const blocks = book?.sections[pageIndex] ?? [];
    return blocks.map((block, blockIndex) => {
      let text = block.text;
      if (book?.format === "pdf" && settings.punct === "simplify") {
        text = text.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[—–]/g, "-").replace(/…/g, "...");
      }
      const characters = Array.from(text, (character) => {
        const index = offset;
        offset += character.length;
        return { character, index };
      });
      const newline = blockIndex < blocks.length - 1 ? { index: offset } : null;
      if (newline) offset += 1;
      return { type: block.t, characters, newline };
    });
  }, [book, pageIndex, settings.punct]);

  useEffect(() => {
    const article = sourceTextRef.current;
    const caret = caretRef.current;
    if (!article || !caret || !target.length) {
      if (caret) caret.style.display = "none";
      return;
    }
    const place = () => {
      const spans = Array.from(article.querySelectorAll<HTMLElement>("[data-char-index]"));
      const span = spans.find((item) => typed.length < Number(item.dataset.charEndIndex)) ?? spans[spans.length - 1];
      if (!span) { caret.style.display = "none"; return; }
      const lineTop = span.offsetTop;
      const paneHeight = article.clientHeight;
      const scrollTop = article.scrollTop;
      if (settings.centered) {
        article.scrollTop = Math.max(0, lineTop - paneHeight * 0.4);
      } else if (lineTop < scrollTop + paneHeight * 0.12 || lineTop > scrollTop + paneHeight * 0.55) {
        article.scrollTop = Math.max(0, lineTop - paneHeight * 0.3);
      }
      const rect = span.getBoundingClientRect();
      const parent = article.getBoundingClientRect();
      const atEnd = typed.length >= target.length;
      let left = rect.left - parent.left + (atEnd ? rect.width : 0);
      let top = rect.top - parent.top;
      let width = Math.max(8, rect.width);
      let height = rect.height || Number.parseFloat(getComputedStyle(article).lineHeight) || 20;
      if (settings.cstyle === "bar") { left -= 1; width = 2; }
      else if (settings.cstyle === "underline") { top += height - 3; height = 3; }
      caret.style.display = "";
      caret.style.left = left + "px";
      caret.style.top = top + "px";
      caret.style.width = width + "px";
      caret.style.height = height + "px";
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [typed, target, settings.cstyle, settings.font, settings.size, settings.lineH, settings.spacing, effectiveBackground]);

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
          // Preserve metadata fields written by the legacy reader or future
          // versions when an existing local book is imported again.
          ...(existing ?? {}),
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


  function playKeystrokeEffects(previousValue: string, nextValue: string) {
    const currentSettings = settingsRef.current;
    const sound = soundEngineRef.current;
    const caret = caretRef.current;
    if (caret) {
      caret.classList.add("typing");
      if (caretTypingTimerRef.current !== null) window.clearTimeout(caretTypingTimerRef.current);
      caretTypingTimerRef.current = window.setTimeout(() => {
        caret.classList.remove("typing");
        caretTypingTimerRef.current = null;
      }, 650);
    }

    if (nextValue.length < previousValue.length) {
      sound?.key(false);
      return;
    }
    if (nextValue.length === previousValue.length) return;

    const inserted = Array.from(nextValue.slice(previousValue.length));
    let hasMistake = false;
    let lastCorrect = false;
    let lastIndex = -1;
    let lastCharacter = "";
    let targetOffset = previousValue.length;

    for (let index = 0; index < inserted.length; index += 1) {
      const character = inserted[index];
      const correct = target.slice(targetOffset, targetOffset + character.length) === character;
      if (!correct) hasMistake = true;
      lastCorrect = correct;
      lastIndex = targetOffset;
      lastCharacter = character;
      if (index < 3) {
        if (correct) sound?.key(character === "\n");
        else sound?.err();
      }
      targetOffset += character.length;
    }

    if (hasMistake && currentSettings.efx !== "off" && !reducedMotionRef.current) {
      const shell = document.querySelector<HTMLElement>(".bk-shell");
      if (shell) {
        shell.classList.remove("errshake", "errflash");
        void shell.offsetWidth;
        shell.classList.add(currentSettings.efx === "shake" ? "errshake" : "errflash");
        if (errorFeedbackTimerRef.current !== null) window.clearTimeout(errorFeedbackTimerRef.current);
        errorFeedbackTimerRef.current = window.setTimeout(() => {
          shell.classList.remove("errshake", "errflash");
          errorFeedbackTimerRef.current = null;
        }, 380);
      }
    }

    if (!lastCorrect || lastIndex < 0 || (currentSettings.tfx === "none" && currentSettings.sparks === "off")) return;
    if (!lastCharacter || lastCharacter === " " || lastCharacter === "\n") return;
    const span = sourceTextRef.current?.querySelector<HTMLElement>(`[data-char-index="${lastIndex}"]`);
    if (!span) return;
    const rect = span.getBoundingClientRect();
    const style = getComputedStyle(span);
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const effects = effectsEngineRef.current;
    if (currentSettings.sparks === "sparks") effects?.sparks(x, y);
    else if (currentSettings.sparks === "ripple") effects?.ripple(x, y);
    if (effects?.has(currentSettings.tfx)) {
      effects.effect(currentSettings.tfx, {
        ch: lastCharacter,
        x0: rect.left,
        y0: rect.top,
        w: rect.width,
        h: rect.height,
        font: `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
      });
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
        if (settingsRef.current.celebrate) effectsEngineRef.current?.confetti();
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
    if (settingsRef.current.celebrate) effectsEngineRef.current?.confetti();
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
    if (!database || selectedShelf === "main") return;
    const current = shelves.find((shelf) => shelf.id === selectedShelf);
    if (!window.confirm("Delete " + (current?.name ?? "this shelf") + " and move its books to Library?")) return;
    setBusy(true);
    try {
      for (const entry of library.filter((item) => item.shelf === selectedShelf)) {
        const file = await database.getFile(entry.id);
        if (file) await database.putBook({ ...entry, shelf: "main" }, file);
      }
      setLibrary(await database.listMetadata());
      persistShelves(deleteShelf(shelves, selectedShelf));
      setSelectedShelf("main");
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
    settingsRef.current = next;
    setSettings(next);
    try {
      window.localStorage.setItem("bookkeys:settings", JSON.stringify(next));
      window.localStorage.setItem("bookkeys:size", JSON.stringify(next.size));
    } catch {
      setStatus("Settings could not be saved in this browser.");
    }
  }

  function clearThemeOverride() {
    setThemeOverride(false);
    try { window.localStorage.removeItem("limitless.typing.v1.themeOverride"); } catch { /* preference cleanup */ }
  }

  function toggleTheme() {
    const nextTheme = activeTone === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    setThemeOverride(true);
    try { window.localStorage.setItem("limitless.typing.v1.themeOverride", "1"); } catch { /* preference persistence */ }
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
      clearThemeOverride();
      if (book) {
        const progress = game.book?.[book.bookKey];
        setCompletedPageIndexes([...new Set([...(progress?.p ?? []), ...(progress?.e ?? [])])]);
      }
      setStatus("Backup merged · " + result.written + " entries brought in · " +
        result.unchanged + " already up to date · " + result.failed + " could not be restored.");
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
    <main className="bk-shell" style={shellStyle}>
      <canvas ref={backgroundCanvasRef} className="bk-background-canvas" aria-hidden="true" hidden />
      <canvas ref={effectsCanvasRef} className="bk-effects-canvas" aria-hidden="true" />
      {picturePreset && (
        <div
          className="bk-picture-background"
          aria-hidden="true"
          style={{
            "--bk-photo-desktop": `url("${picturePreset.image}")`,
            "--bk-photo-mobile": `url("${picturePreset.mobileImage}")`,
          } as CSSProperties}
        />
      )}
      {staticPreset && (
        <div className="bk-static-background" aria-hidden="true" style={{ backgroundImage: staticPreset.background }} />
      )}
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
            {activeTone === "dark" ? "Light mode" : "Dark mode"}
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
              <button className="bk-quiet" onClick={() => void removeShelf()} disabled={busy || selectedShelf === "main"}>Delete</button>
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
                ref={sourceTextRef}
                className="bk-source-text"
                data-reader-background={effectiveBackground}
                data-reader-centered={settings.centered ? "true" : "false"}
                style={(() => {
                  const color = settings.fontColor === "custom"
                    ? safeReaderTextColor(settings.fontColorCustom) : undefined;
                  if (safeBackgroundArtwork) return {
                    color,
                    backgroundImage: `linear-gradient(var(--bk-reader-art-overlay), var(--bk-reader-art-overlay)), url("${safeBackgroundArtwork}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  };
                  return color ? { color } : undefined;
                })()}
              >{readerBlocks.map((block, blockIndex) => (
                <div key={blockIndex} className={"bk-text-block" + (block.type === "h" ? " bk-text-heading" : "")}>
                  {block.characters.map(({ character, index }) => {
                    const entered = typed.length > index;
                    const correct = entered && typed.slice(index, index + character.length) === character;
                    const wrong = entered && !correct;
                    const animated = correct && settings.tfx !== "none" && character !== " " && character !== "\n";
                    return (
                      <span
                        key={index}
                        data-char-index={index}
                        data-char-end-index={index + character.length}
                        className={"bk-char c" + (correct ? " ok" : "") + (wrong ? " bad" : "") + (animated ? " fx" : "")}
                      >{character}</span>
                    );
                  })}
                  {block.newline && (
                    <span
                      data-char-index={block.newline.index}
                      data-char-end-index={block.newline.index + 1}
                      className={"bk-char c nl" + (typed.length > block.newline.index ? " ok" : "")}
                    >{"\n"}</span>
                  )}
                </div>
              ))}<div ref={caretRef} className="bk-reader-caret" aria-hidden="true" /></article>
              <label className="bk-type-label" htmlFor="bk-typing">Type the section below</label>
              <textarea
                id="bk-typing"
                className="bk-typing"
                value={typed}
                onChange={(event) => {
                  const nativeEvent = event.nativeEvent;
                  if (composingRef.current || (nativeEvent instanceof InputEvent && nativeEvent.isComposing)) return;
                  const inputType = nativeEvent instanceof InputEvent ? nativeEvent.inputType : "insertText";
                  playKeystrokeEffects(typed, event.currentTarget.value);
                  onTyping(event.currentTarget.value, inputType);
                  event.currentTarget.setSelectionRange(event.currentTarget.value.length, event.currentTarget.value.length);
                }}
                onCompositionStart={() => {
                  composingRef.current = true;
                }}
                onCompositionEnd={(event) => {
                  composingRef.current = false;
                  playKeystrokeEffects(typed, event.currentTarget.value);
                  onTyping(event.currentTarget.value, "insertCompositionText");
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
              <button className={settingsTab === "theme" ? "active" : ""} onClick={() => setSettingsTab("theme")}>Theme</button>
              <button className={settingsTab === "background" ? "active" : ""} onClick={() => setSettingsTab("background")}>Background</button>
              <button className={settingsTab === "font" ? "active" : ""} onClick={() => setSettingsTab("font")}>Font</button>
              <button className={settingsTab === "typing" ? "active" : ""} onClick={() => setSettingsTab("typing")}>Typing</button>
              <button className={settingsTab === "cursor" ? "active" : ""} onClick={() => setSettingsTab("cursor")}>Cursor</button>
              <button className={settingsTab === "data" ? "active" : ""} onClick={() => setSettingsTab("data")}>Data</button>
            </nav>
            {settingsTab === "theme" ? (
              <div className="bk-settings-content">
                <label className="bk-setting bk-setting-check">
                  <span>Match colors to background</span>
                  <input type="checkbox" checked={settings.bgMatch !== false}
                    onChange={(event) => { clearThemeOverride(); persistSettings({ ...settings, bgMatch: event.currentTarget.checked }); }} />
                </label>
                <p className="bk-settings-note">Takes the theme colors (text, panels, accent) from the selected background. Your own text color and accent picks still apply on top.</p>
                <div className="bk-setting">
                  <span>Color theme</span>
                  <div className="bk-theme-tiles" role="group" aria-label="Color theme">
                    {THEMES.map((option) => (
                      <button key={option.id} type="button" className="bk-theme-tile"
                        aria-pressed={settings.skin === option.id}
                        style={{ background: option.v?.bg ?? "linear-gradient(90deg, #EEEAF6 0 50%, #0B0D14 50% 100%)" }}
                        onClick={() => chooseTheme(option)}>
                        <span className="bk-theme-preview-swatches" aria-hidden="true">
                          <i style={{ background: option.v?.panel ?? "#FFFCF6" }} />
                          <i style={{ background: option.v?.accent ?? "#D2AE5C" }} />
                          <i style={{ background: option.v?.ink ?? "#2A2540" }} />
                        </span>
                        <span className="bk-theme-name" style={{ color: option.v?.ink ?? "#FFFFFF" }}>{option.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bk-setting">
                  <span>Accent color</span>
                  <div className="bk-accent-swatches" role="group" aria-label="Accent color">
                    {ACC.map((option) => (
                      <button key={option.v} type="button" className="bk-accent-swatch"
                        aria-label={option.name} title={option.name} aria-pressed={settings.accent === option.v}
                        style={{ background: option.c ?? "linear-gradient(135deg, #EEEAF6, #0B0D14)" }}
                        onClick={() => persistSettings({ ...settings, accent: option.v })}>
                        <span>{option.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <label className="bk-setting">
                  <span>Custom accent</span>
                  <input type="color" aria-label="Custom accent"
                    value={safeReaderTextColor(settings.accentCustom) ?? "#E11D48"}
                    onChange={(event) => persistSettings({ ...settings, accent: "custom", accentCustom: event.currentTarget.value })} />
                </label>
                <label className="bk-setting bk-setting-check">
                  <span>Decorative details</span>
                  <input type="checkbox" checked={settings.deco !== "off"}
                    onChange={(event) => persistSettings({ ...settings, deco: event.currentTarget.checked ? "on" : "off" })} />
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
              </div>
            ) : settingsTab === "background" ? (
              <div className="bk-settings-content">
                <label className="bk-setting">
                  <span>Reading background</span>
                  <select
                    className="bk-visually-hidden"
                    aria-label="Reader background"
                    value={settings.readerBackground ?? "none"}
                    onChange={(event) => chooseBackground(event.currentTarget.value as ReaderBackgroundId)}
                  >
                    <option value="none">No Background</option>
                    <option value="tod">Time of Day (automatic)</option>
                    {artwork.gothic && <option value="gothic">Gothic artwork</option>}
                    {artwork.garden && <option value="garden">Garden artwork</option>}
                    <optgroup label="Background scenes">
                      {READER_BACKGROUND_PRESETS.map((preset) => <option key={preset.id} value={preset.id}>{preset.label}</option>)}
                    </optgroup>
                  </select>
                  {!artwork.gothic && !artwork.garden && (
                    <span className="bk-settings-note">No saved Bookkeys artwork was found in this browser.</span>
                  )}
                </label>
                <div className="bk-background-tiles" role="group" aria-label="Background choices">
                  {BOOKKEYS_BACKGROUND_CATALOG.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="bk-background-tile"
                      aria-pressed={selectedBackground === item.id}
                      title={item.name}
                      style={readerBackgroundTileStyle(item.id)}
                      onClick={() => chooseBackground(item.id as ReaderBackgroundId)}
                    >
                      <span>{item.name}</span>
                    </button>
                  ))}
                  {READER_BACKGROUND_PRESETS.filter((preset) => preset.id === "morning" || preset.id === "evening").map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      className="bk-background-tile"
                      aria-pressed={selectedBackground === preset.id}
                      title={preset.label}
                      style={readerBackgroundTileStyle(preset.id)}
                      onClick={() => chooseBackground(preset.id)}
                    >
                      <span>{preset.label} · preview</span>
                    </button>
                  ))}
                  {backgroundArtworkTiles.map((tile) => tile.image && (
                    <button
                      key={tile.id}
                      type="button"
                      className="bk-background-tile"
                      aria-pressed={selectedBackground === tile.id}
                      title={tile.label}
                      style={{ backgroundImage: `url("${tile.image}")`, backgroundSize: "cover", backgroundPosition: "center" }}
                      onClick={() => chooseBackground(tile.id)}
                    >
                      <span>{tile.label}</span>
                    </button>
                  ))}
                </div>
                <label className="bk-setting">
                  <span>Intensity <strong>{Number(settings.bgDensity ?? 1).toFixed(1)}×</strong></span>
                  <input type="range" min="0.3" max="2" step="0.1" value={Number(settings.bgDensity ?? 1)}
                    onChange={(event) => persistSettings({ ...settings, bgDensity: Number(event.currentTarget.value) })} />
                </label>
                <label className="bk-setting">
                  <span>Text backdrop <strong>{Number(settings.backdrop ?? 0)}%</strong></span>
                  <input type="range" min="0" max="100" step="5" value={Number(settings.backdrop ?? 0)}
                    onChange={(event) => persistSettings({ ...settings, backdrop: Number(event.currentTarget.value) })} />
                </label>
                <label className="bk-setting">
                  <span>Picture dimming <strong>{Number(settings.picVeil ?? 0)}%</strong></span>
                  <input type="range" min="0" max="90" step="5" value={Number(settings.picVeil ?? 0)}
                    onChange={(event) => persistSettings({ ...settings, picVeil: Number(event.currentTarget.value) })} />
                </label>
                <label className="bk-setting">
                  <span>Picture blur <strong>{Number(settings.picBlur ?? 0)} px</strong></span>
                  <input type="range" min="0" max="12" step="1" value={Number(settings.picBlur ?? 0)}
                    onChange={(event) => persistSettings({ ...settings, picBlur: Number(event.currentTarget.value) })} />
                </label>
                <label className="bk-setting bk-setting-check">
                  <span>Animate background</span>
                  <input type="checkbox" checked={settings.bgAnim !== false}
                    onChange={(event) => persistSettings({ ...settings, bgAnim: event.currentTarget.checked })} />
                </label>
                <label className="bk-setting bk-setting-check">
                  <span>Match colors to background</span>
                  <input type="checkbox" checked={settings.bgMatch !== false}
                    onChange={(event) => { clearThemeOverride(); persistSettings({ ...settings, bgMatch: event.currentTarget.checked }); }} />
                </label>
                {themeOverride && <p className="bk-settings-note">The header's quick theme override is active. Change this setting or choose a background to return to matched colors.</p>}
                <p className="bk-settings-note">Time of Day switches from Morning at 06:00, to Evening at 17:00, and Night at 20:00. The three photographs use portrait crops on tall screens. Picture backgrounds always keep at least 70% text backdrop for readability.</p>                <p className="bk-settings-note">Theme can also be changed using the sun/moon control in the header.</p>
              </div>
            ) : settingsTab === "font" ? (
              <div className="bk-settings-content">
                <div className="bk-setting">
                  <span>Typeface</span>
                  <div className="bk-font-tiles" role="group" aria-label="Typeface">
                    {FONTS.map((fontOption) => (
                      <button key={fontOption.id} type="button" className="bk-font-tile"
                        aria-pressed={settings.font === fontOption.id}
                        onClick={() => persistSettings({ ...settings, font: fontOption.id })}>
                        <span>{fontOption.name}</span>
                        <strong style={{ fontFamily: fontOption.stack }}>Aa</strong>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bk-setting">
                  <span>Text color</span>
                  <div className="bk-font-color-swatches" role="group" aria-label="Text color">
                    {FCOLS.map((option) => (
                      <button key={option.v} type="button" className="bk-font-color-swatch"
                        aria-label={option.name} title={option.name} aria-pressed={settings.fontColor === option.v}
                        style={{ background: option.c ?? "linear-gradient(135deg, var(--panel), var(--ink))" }}
                        onClick={() => persistSettings({ ...settings, fontColor: option.v })}>
                        <span>{option.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <label className="bk-setting">
                  <span>Custom text color</span>
                  <input type="color" aria-label="Custom text color"
                    value={safeReaderTextColor(settings.fontColorCustom) ?? "#FF8A00"}
                    onInput={(event) => persistSettings({ ...settingsRef.current, fontColor: "custom", fontColorCustom: event.currentTarget.value })} />
                </label>
                {contrastHintText && <p className="bk-settings-note" aria-live="polite">{contrastHintText}</p>}
                <label className="bk-setting">
                  <span>Size <strong>{settings.size}px</strong></span>
                  <input type="range" min="14" max="34" step="1" value={settings.size}
                    onChange={(event) => persistSettings({ ...settings, size: Number(event.currentTarget.value) })} />
                </label>
                <label className="bk-setting">
                  <span>Line height <strong>{settings.lineH.toFixed(2)}</strong></span>
                  <input type="range" min="1.3" max="2.4" step="0.05" value={settings.lineH}
                    onChange={(event) => persistSettings({ ...settings, lineH: Number(event.currentTarget.value) })} />
                </label>
                <label className="bk-setting">
                  <span>Letter spacing <strong>{Number(settings.spacing ?? 0).toFixed(2)}em</strong></span>
                  <input type="range" min="0" max="0.15" step="0.01" value={Number(settings.spacing ?? 0)}
                    onChange={(event) => persistSettings({ ...settings, spacing: Number(event.currentTarget.value) })} />
                </label>
                <div className="bk-setting">
                  <span>Quotes and dashes</span>
                  <div className="bk-choice-chips" role="group" aria-label="Quotes and dashes">
                    <button type="button" aria-pressed={(settings.punct ?? "simplify") === "simplify"}
                      onClick={() => persistSettings({ ...settings, punct: "simplify" })}>Plain keys</button>
                    <button type="button" aria-pressed={settings.punct === "exact"}
                      onClick={() => persistSettings({ ...settings, punct: "exact" })}>As printed</button>
                  </div>
                  <span className="bk-settings-note">Plain keys converts curly quotes, long dashes and ellipses to ordinary keyboard characters. Accents are kept. This applies to PDF pages.</span>
                </div>
                <label className="bk-setting bk-setting-check">
                  <span>Letter glow</span>
                  <input type="checkbox" checked={settings.lglow !== false}
                    onChange={(event) => persistSettings({ ...settings, lglow: event.currentTarget.checked })} />
                </label>
                <p className="bk-settings-note">Letter glow is a soft halo for typed text over dark scenes. It is suppressed on light palettes.</p>
              </div>
            ) : settingsTab === "typing" ? (
              <div className="bk-settings-content">
                <div className="bk-setting">
                  <span>Motion</span>
                  <div className="bk-choice-chips" role="group" aria-label="Motion">
                    {(["system", "reduce", "full"] as const).map((value) => (
                      <button key={value} type="button" aria-pressed={(settings.motion ?? "system") === value}
                        onClick={() => persistSettings({ ...settings, motion: value })}>
                        {value === "system" ? "Follow system" : value === "reduce" ? "Reduce" : "Full"}
                      </button>
                    ))}
                  </div>
                  <span className="bk-settings-note">Reduce stops moving backgrounds, letter animations, keystroke particles, confetti and mistake flashes. Follow system respects your device's reduced-motion setting.</span>
                </div>
                <div className="bk-setting">
                  <span>Letter animation</span>
                  <div className="bk-choice-chips" role="group" aria-label="Letter animation">
                    {[
                      ["none", "None"], ["glow", "Glow"], ["rise", "Rise"], ["fade", "Fade in"], ["flash", "Flash"],
                      ["crunch", "Crunch"], ["explode", "Explode"], ["fireworks", "Fireworks"], ["shatter", "Shatter"],
                      ["sparkle", "Sparkle"], ["burn", "Burn"], ["float", "Float"], ["shock", "Shock"],
                      ["ink", "Ink corrupt"], ["pixelate", "Pixelate"], ["embers", "Embers"],
                    ].map(([value, label]) => (
                      <button key={value} type="button" aria-pressed={(settings.tfx ?? "none") === value}
                        onClick={() => persistSettings({ ...settings, tfx: value })}>{label}</button>
                    ))}
                  </div>
                </div>
                <label className="bk-setting">
                  <span>Effect intensity <strong>{Number(settings.fxInt ?? 1).toFixed(1)}×</strong></span>
                  <input type="range" min="0.4" max="2" step="0.1" value={Number(settings.fxInt ?? 1)}
                    onChange={(event) => persistSettings({ ...settings, fxInt: Number(event.currentTarget.value) })} />
                </label>
                <div className="bk-setting">
                  <span>Mistake feedback</span>
                  <div className="bk-choice-chips" role="group" aria-label="Mistake feedback">
                    {[["off", "Off"], ["flash", "Red flash"], ["shake", "Shake"]].map(([value, label]) => (
                      <button key={value} type="button" aria-pressed={(settings.efx ?? "flash") === value}
                        onClick={() => persistSettings({ ...settings, efx: value })}>{label}</button>
                    ))}
                  </div>
                </div>
                <div className="bk-setting">
                  <span>Keystroke particles</span>
                  <div className="bk-choice-chips" role="group" aria-label="Keystroke particles">
                    {[["off", "Off"], ["sparks", "Sparks"], ["ripple", "Ripple"]].map(([value, label]) => (
                      <button key={value} type="button" aria-pressed={(settings.sparks ?? "off") === value}
                        onClick={() => persistSettings({ ...settings, sparks: value })}>{label}</button>
                    ))}
                  </div>
                </div>
                <div className="bk-setting">
                  <span>Key sound</span>
                  <div className="bk-choice-chips" role="group" aria-label="Key sound">
                    {[["off", "Off"], ["click", "Click"], ["soft", "Soft"], ["typewriter", "Typewriter"]].map(([value, label]) => (
                      <button key={value} type="button" aria-pressed={(settings.sound ?? "off") === value}
                        onClick={() => persistSettings({ ...settings, sound: value })}>{label}</button>
                    ))}
                  </div>
                </div>
                <label className="bk-setting">
                  <span>Volume <strong>{Number(settings.volume ?? 50)}%</strong></span>
                  <input type="range" min="0" max="100" step="5" value={Number(settings.volume ?? 50)}
                    onChange={(event) => persistSettings({ ...settings, volume: Number(event.currentTarget.value) })} />
                </label>
                <label className="bk-setting bk-setting-check">
                  <span>Low thud on a mistake</span>
                  <input type="checkbox" checked={settings.errSound !== false}
                    onChange={(event) => persistSettings({ ...settings, errSound: event.currentTarget.checked })} />
                </label>
                <label className="bk-setting bk-setting-check">
                  <span>Keep the current line centered</span>
                  <input type="checkbox" aria-label="Center reading text" checked={settings.centered === true}
                    onChange={(event) => persistSettings({ ...settings, centered: event.currentTarget.checked })} />
                </label>
                <label className="bk-setting bk-setting-check">
                  <span>Confetti when a page is finished</span>
                  <input type="checkbox" checked={settings.celebrate !== false}
                    onChange={(event) => persistSettings({ ...settings, celebrate: event.currentTarget.checked })} />
                </label>
                <p className="bk-settings-note">Typewriter plays a bell on a line break. Effect intensity scales particle counts. Motion effects and particles stop when reduced motion is active.</p>
              </div>
            ) : settingsTab === "cursor" ? (
              <div className="bk-settings-content">
                <div className="bk-setting">
                  <span>Cursor shape</span>
                  <div className="bk-choice-chips" role="group" aria-label="Cursor shape">
                    {[["block", "Block"], ["bar", "Bar"], ["underline", "Underline"], ["outline", "Outline"]].map(([value, label]) => (
                      <button key={value} type="button" aria-pressed={(settings.cstyle ?? "block") === value}
                        onClick={() => persistSettings({ ...settings, cstyle: value })}>{label}</button>
                    ))}
                  </div>
                </div>
                <div className="bk-setting">
                  <span>Blink</span>
                  <div className="bk-choice-chips" role="group" aria-label="Cursor blink">
                    {[["off", "Steady"], ["blink", "Blink"], ["pulse", "Pulse"]].map(([value, label]) => (
                      <button key={value} type="button" aria-pressed={(settings.cblink ?? "blink") === value}
                        onClick={() => persistSettings({ ...settings, cblink: value })}>{label}</button>
                    ))}
                  </div>
                </div>
                <label className="bk-setting bk-setting-check">
                  <span>Smooth movement</span>
                  <input type="checkbox" checked={settings.csmooth !== false}
                    onChange={(event) => persistSettings({ ...settings, csmooth: event.currentTarget.checked })} />
                </label>
                <label className="bk-setting bk-setting-check">
                  <span>Cursor glow</span>
                  <input type="checkbox" checked={settings.cglow === true}
                    onChange={(event) => persistSettings({ ...settings, cglow: event.currentTarget.checked })} />
                </label>
                <div className="bk-setting">
                  <span>Cursor color</span>
                  <div className="bk-font-color-swatches" role="group" aria-label="Cursor color">
                    {CARETS.map((option) => (
                      <button key={option.v} type="button" className="bk-font-color-swatch"
                        aria-label={option.name} title={option.name}
                        aria-pressed={(settings.ccolor ?? "accent") === option.v}
                        style={{ background: option.c ?? "linear-gradient(135deg, var(--accent), var(--panel))" }}
                        onClick={() => persistSettings({ ...settings, ccolor: option.v })}>
                        <span>{option.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
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
