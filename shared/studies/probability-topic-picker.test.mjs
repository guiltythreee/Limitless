import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const page = readFileSync(resolve(root, "probability-source/app/page.tsx"), "utf8");
assert.ok(page.includes("useId"), "mobile topic disclosure uses a stable unique panel id");
assert.ok(page.includes('type="button" onClick={() => setShown(!shown)}'), "topic disclosure cannot submit an enclosing form");
assert.ok(page.includes("aria-expanded={shown}"), "topic disclosure exposes its expanded state");
assert.ok(page.includes("aria-controls={panelId}"), "topic disclosure identifies the controlled panel");
assert.ok(page.includes('id={panelId} hidden={!shown}'), "controlled panel remains mounted and is hidden when collapsed");
assert.ok(page.includes("max-h-[65dvh]"), "mobile topic panel accounts for dynamic viewport height");
assert.ok(page.includes("overscroll-contain"), "mobile topic panel contains scroll chaining");

console.log("Probability responsive topic disclosure: 7 assertions passed");
