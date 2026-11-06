import { expect, test } from "@playwright/test";
import JSZip from "jszip";

async function makeFixtureEpub(): Promise<Buffer> {
  const zip = new JSZip();
  const paragraph = (
    "This is a browser regression fixture for the Bookkeys reading and typing migration. " +
    "The text is intentionally long enough to qualify for verified page rewards. "
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
  </manifest>
  <spine><itemref idref="chapter"/></spine>
</package>`);
  zip.file("OEBPS/nav.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
  <body><nav epub:type="toc"><ol><li><a href="chapter.xhtml#chapter-start">Chapter One</a></li></ol></nav></body>
</html>`);
  zip.file("OEBPS/chapter.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head><title>Chapter One</title></head>
  <body><section><h1 id="chapter-start">Chapter One</h1><p>${paragraph}</p></section></body>
</html>`);
  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}

test("EPUB import, typing progress, cloud-independent local persistence and reward ledger survive reload", async ({ page }) => {
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
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Export backup" }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/^bookkeys-backup-.*\.json$/);
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
