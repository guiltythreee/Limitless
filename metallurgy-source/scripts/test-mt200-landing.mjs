import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const landingPath = fileURLToPath(new URL("../app/page.tsx", import.meta.url));
const source = readFileSync(landingPath, "utf8");

assert.match(source, /import \{ MT200_MANIFEST \} from "\.\/courses\/manifests\/mt200";/);
assert.match(source, /const COURSES = \[MT200_MANIFEST, MT201_MANIFEST, MT202_MANIFEST, MT203_MANIFEST\] as const;/);
assert.match(source, /course\.id === "mt200"\) \{ router\.push\("\/mt200\/"\); return; \}/);
assert.match(source, /5 modules · 4 practice papers/);
assert.match(source, /\{COURSES\.length\} courses available/);

console.log("MT200 semester-homepage registration and routing checks passed.");
