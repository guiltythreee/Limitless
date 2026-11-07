"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { BookkeysChapter, BookkeysLibraryMetadata, BookkeysShelf } from "../domain/persistence/bookkeys-v1-contracts";
import { openBookkeysDatabase, type BookkeysDatabase } from "../domain/persistence/bookkeys-v1-database";
import { readEpub } from "../domain/epub/epub-importer";
import type { EpubBlock, EpubChapter } from "../domain/epub/epub-domain";
import { readPdf } from "../domain/pdf/pdf-importer";
import {
  completeBookkeysPage, createPageDraft, emptyBookkeysGame,
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

type BookFormat = "pdf" | "epub";
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
  readonly [extension: string]: unknown;
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
  const [book, setBook] = useState<ReaderBook | null>(null);
  const [view, setView] = useState<"home" | "book">("home");
  const navState = useRef({ i: 0, max: 0 });
  const bookCache = useRef<Record<string, ReaderBook>>({});
  const [pageIndex, setPageIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState("Import a PDF or EPUB to begin.");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [settings, setSettings] = useState<BookkeysSettings>({ bg: "dark", size: 17, lineH: 1.8, celebrate: true });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"appearance" | "data">("appearance");
  const [themeReady, setThemeReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [chaptersOpen, setChaptersOpen] = useState(false);
  const [globalExp, setGlobalExp] = useState(0);
  const [gameProgress, setGameProgress] = useState<ReturnType<typeof emptyBookkeysGame>>(() => emptyBookkeysGame());
  const [completedPageIndexes, setCompletedPageIndexes] = useState<number[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const backupInput = useRef<HTMLInputElement>(null);
  const startedAt = useRef(Date.now());
  const completedThisPage = useRef(false);

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
    setSettings({ ...savedSettings, bg: initialTheme });
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
        if (!active) { opened.close(); return; }
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

  const visibleLibrary = useMemo(() => library.filter((entry) => entry.shelf === selectedShelf), [library, selectedShelf]);
  const continueEntry = visibleLibrary[0];
  const target = useMemo(
    () => book?.sections[pageIndex]?.map((block) => block.text).join("\n") ?? "",
    [book, pageIndex],
  );
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
      const format: BookFormat = entry.fmt === "epub" ? "epub" : "pdf";
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
    if (extension !== "pdf" && extension !== "epub") {
      setStatus("Choose a PDF or EPUB file.");
      return;
    }
    const format: BookFormat = extension === "epub" ? "epub" : "pdf";
    setBusy(true);
    setStatus("Reading book locally…");
    try {
      const bytes = await file.arrayBuffer();
      const temporaryId = window.crypto.randomUUID();
      const parsed = await parseBook(temporaryId, format, bytes, file.name.replace(/\.(pdf|epub)$/i, ""));
      const existing = library.find((entry) => entry.fp === parsed.fingerprint &&
        (entry.fmt === "epub" ? "epub" : "pdf") === format);
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
          ...(format === "epub" ? { fmt: "epub" as const } : {}),
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

  function onTyping(value: string) {
    setTyped(value);
    if (!book) return;
    if (book.isSample) {
      if (!completedThisPage.current && target.length > 0 && value.length >= target.length) {
        completedThisPage.current = true;
        setStatus("Sample page complete · no XP awarded and no book progress saved.");
      }
      return;
    }
    try {
      const draft = createPageDraft(pageIndex, target, value, startedAt.current);
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
              <button className="bk-quiet" onClick={startSample}>Try sample text</button>
              <button className="bk-quiet" onClick={exportBackup}>Export backup</button>
              <button className="bk-quiet" onClick={() => backupInput.current?.click()}>Import backup</button>
              <button className="bk-primary" onClick={() => fileInput.current?.click()} disabled={busy}>
                {busy ? "Working…" : "Import PDF / EPUB"}
              </button>
            </div>
            <input
              ref={fileInput}
              className="bk-hidden"
              type="file"
              accept=".pdf,.epub,application/pdf,application/epub+zip"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) void importFile(file);
              }}
            />
          </div>
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
          {visibleLibrary.length ? (
            <div className="bk-book-grid">
              {visibleLibrary.map((entry) => (
                <button className="bk-book" key={entry.id} onClick={() => void loadEntry(entry)} disabled={busy}>
                  <span className="bk-book-format">{entry.fmt === "epub" ? "EPUB" : "PDF"}</span>
                  <strong>{entry.name}</strong>
                  <span>{entry.pages} {entry.fmt === "epub" ? "sections" : "pages"}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="bk-empty">
              <strong>No books yet</strong>
              <span>Import a PDF or EPUB to create your local library.</span>
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
              <span>{book.author || (book.format === "epub" ? "EPUB" : "PDF")}</span>
            </div>
            <div className="bk-counter">{book.format === "epub" ? "Section" : "Page"} {pageIndex + 1} / {book.sections.length}</div>
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
              <article className="bk-source-text">{target}</article>
              <label className="bk-type-label" htmlFor="bk-typing">Type the section below</label>
              <textarea
                id="bk-typing"
                className="bk-typing"
                value={typed}
                onChange={(event) => onTyping(event.currentTarget.value)}
                placeholder="Start typing here…"
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
              />
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
