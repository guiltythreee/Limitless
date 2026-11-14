import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const source = readFileSync(
  fileURLToPath(new URL("../../../site-theme.js", import.meta.url)),
  "utf8",
);

test("the global theme control remains visible and toggles the persisted site theme", () => {
  const dom = new JSDOM(
    '<!doctype html><html data-theme="dark"><head></head><body><button id="theme-toggle" class="icon-action" aria-label="Toggle theme">◐</button></body></html>',
    { url: "https://local.test/", runScripts: "outside-only" },
  );
  const { window } = dom;
  try {
    window.localStorage.setItem("limitless.site.theme", "dark");
    window.eval(source);

    const button = window.document.getElementById("theme-toggle");
    assert.ok(button);
    assert.notEqual(window.getComputedStyle(button).display, "none",
      "the global theme script must not hide the existing page control");

    button.click();
    assert.equal(window.document.documentElement.getAttribute("data-theme"), "light");
    assert.equal(window.localStorage.getItem("limitless.site.theme"), "light");

    button.click();
    assert.equal(window.document.documentElement.getAttribute("data-theme"), "dark");
    assert.equal(window.localStorage.getItem("limitless.site.theme"), "dark");
  } finally {
    window.close();
  }
});
