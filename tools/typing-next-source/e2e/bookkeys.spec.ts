
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
  }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport + 1);
});
