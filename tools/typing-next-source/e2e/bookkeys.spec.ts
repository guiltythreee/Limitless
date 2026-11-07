import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import JSZip from "jszip";

async function makeFixtureEpub(twoChapters = false): Promise<Buffer> {
  const zip = new JSZip();
  const paragraph = (
    "This is a browser regression fixture for the Bookkeys reading and typing migration. " +
    "The text is intentionally long enough to qualify for verified page rewards. "
  ).repeat(4);
  const secondParagraph = (
    "This is the second chapter used to verify saved reading position and unfinished typing drafts. "
  ).repeat(4);

  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
  zip.file("META-INF/container.xml", `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>`);
  zip.file("OEBPS/content.opf", `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="book-id">bookkeys-e2e-fixture</dc:identifier>
    <dc:title>Bookkeys Migration Fixture</dc:title>
    <dc:creator>Limitless Tests</dc:creator>
    <dc:language>en</dc:language>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="chapter" href="chapter.xhtml" media-type="application/xhtml+xml"/>
    ${twoChapters ? '<item id="chapter-two" href="chapter-two.xhtml" media-type="application/xhtml+xml"/>' : ''}
  </manifest>
  <spine><itemref idref="chapter"/>${twoChapters ? '<itemref idref="chapter-two"/>' : ''}</spine>
</package>`);
  zip.file("OEBPS/nav.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
  <body><nav epub:type="toc"><ol>
    <li><a href="chapter.xhtml#chapter-start">Chapter One</a></li>
    ${twoChapters ? '<li><a href="chapter-two.xhtml#chapter-two-start">Chapter Two</a></li>' : ''}
  </ol></nav></body>
</html>`);
  zip.file("OEBPS/chapter.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head><title>Chapter One</title></head>
  <body><section><h1 id="chapter-start">Chapter One</h1><p>${paragraph}</p></section></body>
</html>`);
  if (twoChapters) {
    zip.file("OEBPS/chapter-two.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head><title>Chapter Two</title></head>
  <body><section><h1 id="chapter-two-start">Chapter Two</h1><p>${secondParagraph}</p></section></body>
</html>`);
  }
  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}

async function makeFixturePdf(): Promise<Buffer> {
  const lines = Array.from({ length: 8 }, () => "PDF import regression text for Bookkeys.");
  const stream = `BT /F1 12 Tf 72 720 Td ${lines.map((line, index) =>
    (index ? "0 -18 Td " : "") + "(" + line + ") Tj"
  ).join(" ")} ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
    "<< /Title (Bookkeys PDF Fixture) >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }
  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, "ascii");
}

test("EPUB import, progress, rewards and backup round-trip survive reload", async ({ page, browser }) => {
  await page.goto("/tools/typing-next-preview/");
  await expect(page.getByRole("heading", { name: "Bookkeys" })).toBeVisible();

  const epub = await makeFixtureEpub();
  await page.locator('input[type="file"][accept*=".epub"]').setInputFiles({
    name: "migration-fixture.epub",
    mimeType: "application/epub+zip",
    buffer: epub,
  });

  await expect(page.locator(".bk-book-title strong")).toHaveText("Bookkeys Migration Fixture");
  const source = await page.locator(".bk-source-text").textContent();
  expect(source).toBeTruthy();
  expect(source!.length).toBeGreaterThan(150);
  await page.locator("#bk-typing").fill(source!);

  await expect(page.locator(".bk-typing-metrics")).toContainText("100%");
  await expect(page.locator(".bk-reader-meta")).toContainText("1/1 required complete");
  await expect.poll(async () => page.evaluate(() => {
    const value = localStorage.getItem("bookkeys-lsr1-v1");
    return value ? JSON.parse(value).rewardLedger?.length ?? 0 : 0;
  })).toBe(1);

  await page.getByRole("button", { name: /Library/ }).click();
  await expect(page.locator(".bk-progress-stat").filter({ hasText: "Pages typed" }).locator("strong")).toHaveText("1");
  await page.reload();
  await expect(page.getByRole("heading", { name: "Your library" })).toBeVisible();
  await expect(page.locator(".bk-progress-stat").filter({ hasText: "Pages typed" }).locator("strong")).toHaveText("1");
  await page.getByRole("button", { name: /Bookkeys Migration Fixture/ }).click();
  await expect(page.locator("#bk-typing")).toHaveValue(source!);
  await expect(page.locator(".bk-reader-meta")).toContainText("1/1 required complete");

  await page.getByRole("button", { name: /Library/ }).click();
  await page.getByRole("button", { name: "Settings" }).click();
  const sourceSettings = page.getByRole("dialog", { name: "Settings" });
  const sourceSize = sourceSettings.locator('input[type="range"]').first();
  await sourceSize.focus();
  for (let step = 0; step < 5; step += 1) await sourceSize.press("ArrowRight");
  await sourceSettings.getByRole("button", { name: "Close Settings" }).click();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Export backup" }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/^bookkeys-backup-.*\.json$/);
  const backupPath = await download.path();
  expect(backupPath).toBeTruthy();
  const backupBytes = await readFile(backupPath!);

  const restoreContext = await browser.newContext();
  const restorePage = await restoreContext.newPage();
  await restorePage.goto("/tools/typing-next-preview/");
  await restorePage.locator('input[type="file"][accept="application/json,.json"]').setInputFiles({
    name: "bookkeys-backup.json",
    mimeType: "application/json",
    buffer: backupBytes,
  });
  await restorePage.getByRole("button", { name: "Settings" }).click();
  const restoredSettings = restorePage.getByRole("dialog", { name: "Settings" });
  await expect(restoredSettings.locator('input[type="range"]').first()).toHaveValue("22");
  await restoreContext.close();

  await page.goBack();
  await expect(page.locator("#bk-typing")).toBeVisible();
  await page.goForward();
  await expect(page.getByRole("heading", { name: "Your library" })).toBeVisible();
});

test("theme and reader settings are interactive and persist", async ({ page }) => {
  await page.goto("/tools/typing-next-preview/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.getByRole("button", { name: "Toggle light and dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await page.getByRole("button", { name: "Settings" }).click();
  const dialog = page.getByRole("dialog", { name: "Settings" });
  await expect(dialog).toBeVisible();

  const size = dialog.locator('input[type="range"]').first();
  await size.focus();
  for (let step = 0; step < 5; step += 1) await size.press("ArrowRight");
  await expect(dialog.locator(".bk-setting").filter({ hasText: "Reading text size" })).toContainText("22px");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("bookkeys:size"))).toBe("22");
  await dialog.getByRole("button", { name: "Close Settings" }).click();

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Settings" }).click();
  await expect(page.getByRole("dialog").locator('input[type="range"]').first()).toHaveValue("22");
});

test("PDF import extracts readable text and records page completion", async ({ page }) => {
  await page.goto("/tools/typing-next-preview/");
  const pdf = await makeFixturePdf();
  await page.locator('input[type="file"][accept*=".pdf"]').setInputFiles({
    name: "bookkeys-pdf-fixture.pdf",
    mimeType: "application/pdf",
    buffer: pdf,
  });

  await expect(page.locator(".bk-book-title strong")).toHaveText("Bookkeys PDF Fixture");
  const source = await page.locator(".bk-source-text").textContent();
  expect(source).toBeTruthy();
  expect(source!.length).toBeGreaterThan(150);
  await page.locator("#bk-typing").fill(source!);
  await expect.poll(async () => page.evaluate(() => {
    const value = localStorage.getItem("bookkeys-lsr1-v1");
    return value ? JSON.parse(value).rewardLedger?.length ?? 0 : 0;
  })).toBe(1);
});

test("reader remains usable without horizontal overflow on a phone viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/tools/typing-next-preview/");
  const epub = await makeFixtureEpub();
  await page.locator('input[type="file"][accept*=".epub"]').setInputFiles({
    name: "mobile-fixture.epub",
    mimeType: "application/epub+zip",
    buffer: epub,
  });

  await expect(page.locator(".bk-reader")).toBeVisible();
  await expect(page.locator("#bk-typing")).toBeVisible();
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    offenders: Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName,
          className: String(element.className).slice(0, 80),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          scrollWidth: element.scrollWidth,
        };
      })
      .filter((element) => element.right > window.innerWidth + 1 || element.left < -1)
      .slice(0, 15),
  }));
  expect(dimensions.document, JSON.stringify(dimensions.offenders))
    .toBeLessThanOrEqual(dimensions.viewport + 1);
});

test("last section and unfinished typing draft restore after reopening a book", async ({ page }) => {
  await page.goto("/tools/typing-next-preview/");
  const epub = await makeFixtureEpub(true);
  await page.locator('input[type="file"][accept*=".epub"]').setInputFiles({
    name: "two-chapter-position-fixture.epub",
    mimeType: "application/epub+zip",
    buffer: epub,
  });

  await expect(page.locator(".bk-counter")).toHaveText("Section 1 / 2");
  const firstText = await page.locator(".bk-source-text").textContent();
  expect(firstText).toBeTruthy();
  await page.locator("#bk-typing").fill(firstText!);
  await expect(page.locator(".bk-reader-meta")).toContainText("1/2 required complete");

  await page.getByRole("button", { name: "Next section" }).click();
  await expect(page.locator(".bk-counter")).toHaveText("Section 2 / 2");
  const secondText = await page.locator(".bk-source-text").textContent();
  expect(secondText).toBeTruthy();
  const partialDraft = secondText!.slice(0, 55);
  await page.locator("#bk-typing").fill(partialDraft);

  const savedPosition = await page.evaluate(() =>
    Object.entries(localStorage).some(([key, value]) =>
      (key.startsWith("bookkeys:f:") || key.startsWith("bookkeys:lib:")) && value === "1"
    )
  );
  expect(savedPosition).toBe(true);

  await page.reload();
  await page.getByRole("button", { name: "Continue reading" }).click();
  await expect(page.locator(".bk-counter")).toHaveText("Section 2 / 2");
  await expect(page.locator("#bk-typing")).toHaveValue(partialDraft);
  await expect(page.locator(".bk-reader-meta")).toContainText("1/2 required complete");
});

test("sample text is typable but never writes XP, reward or book progress", async ({ page }) => {
  await page.goto("/tools/typing-next-preview/");
  await page.getByRole("button", { name: "Try sample text" }).click();
  await expect(page.locator(".bk-book-title strong")).toHaveText("Sample Passage");

  const source = await page.locator(".bk-source-text").textContent();
  expect(source).toBeTruthy();
  expect(source!.length).toBeGreaterThan(150);
  await page.locator("#bk-typing").fill(source!);
  await expect(page.getByRole("status")).toContainText("no XP awarded");

  const saved = await page.evaluate(() => ({
    game: localStorage.getItem("bookkeys:game"),
    rewards: localStorage.getItem("bookkeys-lsr1-v1"),
    sampleDrafts: Object.keys(localStorage).filter((key) => key.includes("sample")),
  }));
  expect(saved.game).toBeNull();
  expect(saved.rewards).toBeNull();
  expect(saved.sampleDrafts).toEqual([]);

  await page.getByRole("button", { name: /Library/ }).click();
  await expect(page.locator(".bk-empty")).toBeVisible();
});

test("legacy bookkeys:size is used when the settings object has no size", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("bookkeys:size", "22"));
  await page.goto("/tools/typing-next-preview/");
  await page.getByRole("button", { name: "Settings" }).click();
  await expect(page.getByRole("dialog", { name: "Settings" }).locator('input[type="range"]').first())
    .toHaveValue("22");
});

test("removing a book deletes its local library entry but retains typing progress", async ({ page }) => {
  await page.goto("/tools/typing-next-preview/");
  const epub = await makeFixtureEpub();
  await page.locator('input[type="file"][accept*=".epub"]').setInputFiles({
    name: "remove-fixture.epub",
    mimeType: "application/epub+zip",
    buffer: epub,
  });
  const source = await page.locator(".bk-source-text").textContent();
  expect(source).toBeTruthy();
  await page.locator("#bk-typing").fill(source!);

  page.on("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Remove book" }).click();
  await expect(page.locator(".bk-empty")).toBeVisible();
  const retainedProgress = await page.evaluate(() => {
    const raw = localStorage.getItem("bookkeys:game");
    if (!raw) return false;
    const game = JSON.parse(raw);
    return Object.values(game.book ?? {}).some((record: any) => Array.isArray(record.p) && record.p.length > 0);
  });
  expect(retainedProgress).toBe(true);
});

test("manual chapter edits save to both legacy keys and restore after reload", async ({ page }) => {
  await page.goto("/tools/typing-next-preview/");
  const epub = await makeFixtureEpub(true);
  await page.locator('input[type="file"][accept*=".epub"]').setInputFiles({
    name: "chapter-editor-fixture.epub",
    mimeType: "application/epub+zip",
    buffer: epub,
  });

  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByRole("button", { name: "Remove Chapter Two" }).click();
  await page.getByRole("button", { name: "Next section" }).click();
  page.once("dialog", (dialog) => dialog.accept("Custom Opening"));
  await page.getByRole("button", { name: "Add chapter" }).click();
  await expect(page.locator(".bk-chapter-list")).toContainText("Custom Opening");

  const chapterKeys = await page.evaluate(() =>
    Object.keys(localStorage).filter((key) => key.startsWith("bookkeys:chap:"))
  );
  expect(chapterKeys).toHaveLength(2);

  await page.reload();
  await page.getByRole("button", { name: "Continue reading" }).click();
  await page.getByRole("button", { name: "Edit" }).click();
  await expect(page.locator(".bk-chapter-list")).toContainText("Custom Opening");
});

test("Bookkeys EXP display uses LSR-1 and never imports the legacy module XP total", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("bookkeys:game", JSON.stringify({ xp: 987654, book: {}, paid: {} }));
    localStorage.setItem("hc3-progress-v3", JSON.stringify({
      rewardLedger: [{
        policyVersion: "LSR-1",
        eventId: "probability:existing-award",
        moduleId: "probability",
        itemId: "probability:existing-item",
        ts: 1800000000000,
        activityClass: "standard-task",
        difficulty: "foundational",
        completionEvidence: "completed-problem",
        completed: true,
        eligible: true,
        reason: "awarded",
        countsTowardRepeatCap: true,
        repeatOrdinal: 1,
        baseExp: 10,
        difficultyMultiplier: 1,
        qualityBonus: 0,
        passBonus: 0,
        totalExp: 10,
        checkpointId: null,
      }],
    }));
  });
  await page.goto("/tools/typing-next-preview/");
  const display = page.locator(".bk-xp strong");
  await expect(display).toHaveText("10");

  // A different Limitless module can award EXP in another tab while Bookkeys is open.
  const otherTab = await page.context().newPage();
  await otherTab.goto("/tools/typing-next-preview/");
  await otherTab.evaluate(() => localStorage.setItem("mm-mt201-v1", JSON.stringify({
    rewardLedger: [{
      policyVersion: "LSR-1",
      eventId: "metallurgy:existing-award",
      moduleId: "metallurgy-mt201",
      itemId: "metallurgy:existing-item",
      ts: 1800000000000,
      activityClass: "focused-practice",
      difficulty: "foundational",
      completionEvidence: "completed-exercise",
      completed: true,
      eligible: true,
      reason: "awarded",
      countsTowardRepeatCap: true,
      repeatOrdinal: 1,
      baseExp: 20,
      difficultyMultiplier: 1,
      qualityBonus: 0,
      passBonus: 0,
      totalExp: 20,
      checkpointId: null,
    }],
  })));
  await expect(display).toHaveText("30");
  await otherTab.close();

  const epub = await makeFixtureEpub();
  await page.locator('input[type="file"][accept*=".epub"]').setInputFiles({
    name: "reward-ledger-fixture.epub",
    mimeType: "application/epub+zip",
    buffer: epub,
  });
  const source = await page.locator(".bk-source-text").textContent();
  expect(source).toBeTruthy();
  await page.locator("#bk-typing").fill(source!);
  await expect.poll(async () => Number((await display.textContent())?.replace(/,/g, "")))
    .toBeGreaterThan(0);
  expect(Number((await display.textContent())?.replace(/,/g, ""))).toBeGreaterThan(30);
  expect(Number((await display.textContent())?.replace(/,/g, ""))).toBeLessThan(987654);
});

test("opens a pre-populated Bookkeys IndexedDB v1 library without upgrading its schema", async ({ page }) => {
  await page.goto("/tools/typing-next-preview/");
  await expect(page.getByRole("heading", { name: "Your library" })).toBeVisible();

  const epub = await makeFixtureEpub();
  const bytes = Array.from(epub);
  await page.evaluate(async ({ bytes }) => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("bookkeys-lib", 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    if (database.version !== 1) throw new Error("Unexpected IndexedDB version");
    if (!database.objectStoreNames.contains("meta") || !database.objectStoreNames.contains("files")) {
      throw new Error("The existing v1 stores were not preserved");
    }

    const transaction = database.transaction(["meta", "files"], "readwrite");
    const id = "pre-existing-library-book";
    transaction.objectStore("meta").put({
      id,
      shelf: "default",
      name: "Existing v1 Book",
      size: bytes.length,
      pages: 1,
      added: 1_800_000_000_000,
      fp: "existing-v1-fingerprint",
      cover: "",
      fmt: "epub",
    });
    transaction.objectStore("files").put(
      new Blob([new Uint8Array(bytes)], { type: "application/epub+zip" }),
      id,
    );
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" fill="#30243a"/></svg>';
    transaction.objectStore("files").put(
      "data:image/svg+xml;base64," + btoa(svg),
      "art:gothic",
    );
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
    database.close();
    localStorage.setItem("bookkeys:lib:" + id, "0");
  }, { bytes });

  await page.reload();
  await expect(page.getByRole("button", { name: /Existing v1 Book/ })).toBeVisible();
  await page.getByRole("button", { name: /Existing v1 Book/ }).click();
  await expect(page.locator(".bk-book-title strong")).toHaveText("Bookkeys Migration Fixture");
  await expect(page.locator(".bk-source-text")).toContainText("browser regression fixture");
  await expect(page.locator(".bk-counter")).toHaveText("Section 1 / 1");
  await page.getByRole("button", { name: "Settings" }).click();
  const settings = page.getByRole("dialog", { name: "Settings" });
  await settings.getByLabel("Reader background").selectOption("gothic");
  await settings.getByRole("button", { name: "Close Settings" }).click();
  const background = await page.locator(".bk-source-text").evaluate((element) =>
    getComputedStyle(element).backgroundImage
  );
  expect(background).toContain("data:image/svg+xml;base64");

  await page.reload();
  await page.getByRole("button", { name: /Existing v1 Book/ }).click();
  await expect(page.locator(".bk-source-text")).toHaveCSS("background-image", /data:image\/svg\+xml;base64/);
  const version = await page.evaluate(async () => new Promise<number>((resolve, reject) => {
    const request = indexedDB.open("bookkeys-lib");
    request.onsuccess = () => { resolve(request.result.version); request.result.close(); };
    request.onerror = () => reject(request.error);
  }));
  expect(version).toBe(1);
});

test("pasted text becomes a persistent local text book with reading progress", async ({ page }) => {
  await page.goto("/tools/typing-next-preview/");
  await page.getByRole("button", { name: "Paste text" }).click();
  const pasted = [
    "Pasted-text import regression. This passage checks that plain text can be turned into a local Bookkeys reading session.",
    "A second paragraph verifies paragraph boundaries, Unicode punctuation, and local persistence. The original text remains in this browser.",
  ].join("\n\n");
  await page.locator("#bk-paste-text").fill(pasted);
  await page.getByRole("button", { name: "Create text book" }).click();

  await expect(page.locator(".bk-book-title strong")).toHaveText("Pasted text");
  await expect(page.locator(".bk-source-text")).toContainText("Pasted-text import regression");
  await expect(page.locator(".bk-counter")).toHaveText("Section 1 / 1");
  const source = await page.locator(".bk-source-text").textContent();
  expect(source).toBeTruthy();
  await page.locator("#bk-typing").fill(source!);
  await page.getByRole("button", { name: /Library/ }).click();

  const textBook = page.getByRole("button", { name: /Pasted text/ });
  await expect(textBook).toBeVisible();
  await expect(textBook).toContainText("TXT");
  await expect(page.locator(".bk-progress-stat").filter({ hasText: "Pages typed" }).locator("strong")).toHaveText("1");

  await page.reload();
  await page.getByRole("button", { name: /Pasted text/ }).click();
  await expect(page.locator(".bk-book-title strong")).toHaveText("Pasted text");
  await expect(page.locator("#bk-typing")).toHaveValue(source!);
});


test("Akashic Archive restores saved Bookkeys achievements without changing their records", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("bookkeys:game", JSON.stringify({
      xp: 900, words: 600, chars: 12000, pages: 12, chapters: 2, books: 1,
      bestWpm: 55, perfect: 1, days: 4,
      streak: { cur: 3, best: 7, last: "2026-11-07" },
      ach: { words500: 123456789 },
      book: {},
    }));
  });
  await page.goto("/tools/typing-next-preview/");
  await page.getByRole("button", { name: "Archive · Lv 3" }).click();
  const archive = page.getByRole("dialog", { name: "The Akashic Archive" });
  await expect(archive).toBeVisible();
  await expect(archive.getByText("Novice Typist")).toBeVisible();
  await expect(archive.getByText("1 of 60 unlocked")).toBeVisible();
  await expect(archive.getByText("First Inscription")).toBeVisible();
  await expect(archive.getByText("Unlocked", { exact: true })).toBeVisible();
  await expect(archive.getByText("Threshold met · unlock record not saved")).toBeVisible();
  const saved = await page.evaluate(() => localStorage.getItem("bookkeys:game"));
  await archive.getByRole("button", { name: "Close Archive" }).click();
  expect(await page.evaluate(() => localStorage.getItem("bookkeys:game"))).toBe(saved);
});
