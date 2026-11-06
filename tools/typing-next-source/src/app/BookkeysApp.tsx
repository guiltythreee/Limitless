"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { BookkeysLibraryMetadata } from "../domain/persistence/bookkeys-v1-contracts";
import { openBookkeysDatabase, type BookkeysDatabase } from "../domain/persistence/bookkeys-v1-database";
import { readEpub } from "../domain/epub/epub-importer";
import type { EpubBlock, EpubChapter } from "../domain/epub/epub-domain";
import { readPdf } from "../domain/pdf/pdf-importer";
import {
  completeBookkeysPage, createPageDraft, emptyBookkeysGame, pageSignature,
  readPageDraft,
} from "../domain/reading/bookkeys-reading-session";
import { typingDraftKey } from "../domain/persistence/bookkeys-v1-contracts";

type BookFormat = "pdf" | "epub";
interface ReaderBook {
  readonly libraryId: string;
  readonly bookKey: string;
  readonly format: BookFormat;
  readonly title: string;
  readonly author: string;
  readonly fingerprint: string;
  readonly sections: EpubBlock[][];
  readonly chapters: EpubChapter[];
}
interface LibraryEntry extends BookkeysLibraryMetadata {}

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
      chapters: result.chapters,
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
    chapters: result.chapters,
  };
}

export default function BookkeysApp() {
  const [database, setDatabase] = useState<BookkeysDatabase | null>(null);
  const [library, setLibrary] = useState<LibraryEntry[]>([]);
  const [book, setBook] = useState<ReaderBook | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState("Import a PDF or EPUB to begin.");
  const [busy, setBusy] = useState(false);
  const [gameXp, setGameXp] = useState(0);
  const fileInput = useRef<HTMLInputElement>(null);
  const startedAt = useRef(Date.now());
  const completedThisPage = useRef(false);

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
        setGameXp(Number(readGame().xp ?? 0));
      } catch {
        if (active) setStatus("Browser storage is unavailable. You can still import a book for this session.");
      }
    })();
    return () => {
      active = false;
      opened?.close();
    };
  }, []);

  const target = useMemo(
    () => book?.sections[pageIndex]?.map((block) => block.text).join("\n") ?? "",
    [book, pageIndex],
  );
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
    try {
      const key = typingDraftKey(book.bookKey, pageIndex);
      const draft = readPageDraft(window.localStorage.getItem(key), pageIndex, target);
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
      setBook(parsed);
      setPageIndex(0);
      await database.putBook({ ...entry, opened: Date.now() }, file);
      setLibrary(await database.listMetadata());
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
    const format: BookFormat = extension;
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
          shelf: existing?.shelf ?? "default",
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
        setLibrary(await database.listMetadata());
      }
      setBook(savedBook);
      setPageIndex(0);
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
    try {
      const draft = createPageDraft(pageIndex, target, value, startedAt.current);
      window.localStorage.setItem(typingDraftKey(book.bookKey, pageIndex), JSON.stringify(draft));
    } catch {
      setStatus("Typing is active, but this browser could not save the draft.");
    }

    if (completedThisPage.current || !target || value.length < target.length) return;
    completedThisPage.current = true;
    const result = completeBookkeysPage(
      readGame(), book.bookKey, pageIndex, target, value, Date.now() - startedAt.current,
    );
    try {
      window.localStorage.setItem("bookkeys:game", JSON.stringify(result.game));
      setGameXp(Number(result.game.xp ?? 0));
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

  function changePage(next: number) {
    if (!book || next < 0 || next >= book.sections.length) return;
    setPageIndex(next);
  }

  return (
    <main className="bk-shell">
      <header className="bk-header">
        <div>
          <p className="bk-eyebrow">LIMITLESS / BOOKKEYS PREVIEW</p>
          <h1>Bookkeys</h1>
        </div>
        <div className="bk-xp"><span>Bookkeys XP</span><strong>{gameXp.toLocaleString()}</strong></div>
      </header>

      {!book ? (
        <section className="bk-library">
          <div className="bk-intro">
            <div>
              <h2>Your library</h2>
              <p>Books are parsed locally. Original files and typing drafts stay in this browser.</p>
            </div>
            <button className="bk-primary" onClick={() => fileInput.current?.click()} disabled={busy}>
              {busy ? "Working…" : "Import PDF / EPUB"}
            </button>
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
          {library.length ? (
            <div className="bk-book-grid">
              {library.map((entry) => (
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
            <button className="bk-quiet" onClick={() => { setBook(null); setTyped(""); }}>← Library</button>
            <div className="bk-book-title">
              <strong>{book.title}</strong>
              <span>{book.author || (book.format === "epub" ? "EPUB" : "PDF")}</span>
            </div>
            <div className="bk-counter">{book.format === "epub" ? "Section" : "Page"} {pageIndex + 1} / {book.sections.length}</div>
          </div>
          <div className="bk-reader-meta">
            <span>{currentChapter?.title ?? "Beginning"}</span>
            <span>{Math.round(((pageIndex + 1) / book.sections.length) * 100)}% through book</span>
          </div>
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
          <div className="bk-reader-bottom">
            <span>{typed.length} / {target.length} characters</span>
            <div>
              <button className="bk-quiet" onClick={() => changePage(pageIndex - 1)} disabled={pageIndex === 0}>Previous</button>
              <button className="bk-primary" onClick={() => changePage(pageIndex + 1)} disabled={pageIndex >= book.sections.length - 1}>Next section</button>
            </div>
          </div>
        </section>
      )}
      <p className="bk-status" role="status">{status}</p>
    </main>
  );
}
