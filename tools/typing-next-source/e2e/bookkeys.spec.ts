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

  await expect(page.locator(".bk-reader-meta")).toContainText("1/1 required complete");
  await expect.poll(async () => page.evaluate(() => {
    const value = localStorage.getItem("bookkeys-lsr1-v1");
    return value ? JSON.parse(value).rewardLedger?.length ?? 0 : 0;
  })).toBe(1);

  await page.reload();
  await expect(page.getByRole("heading", { name: "Your library" })).toBeVisible();
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
  await expect(dialog.locator(".bk-setting").first()).toContainText("22px");
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
  await page.getByRole("button", { name: /Bookkeys Migration Fixture/ }).click();
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
