import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (p) => readFile(new URL(p, import.meta.url), "utf8");
const [reg, cp, regHtml, cpHtml] = await Promise.all([
  read("../competition/competition.js"), read("../codeforces-red/cp-learning-centre.js"),
  read("../competition/index.html"), read("../codeforces-red/index.html")]);

// Both pages load the shared script BEFORE their own script, or window.LimitlessTopicLink is undefined.
for (const [name, html, own] of [["regionals", regHtml, 'competition.js"'], ["CP", cpHtml, 'cp-learning-centre.js"']]) {
  const shared = html.indexOf("../shared/topic-link.js"), page = html.indexOf(own);
  assert.ok(shared > 0 && page > shared, `${name}: topic-link.js must load before the page script`);
}
// Every place that changes a linked level must record it in the ledger before saving.
assert.equal((reg.match(/state\.mastery\[select\.(dataset\.mastery|getAttribute\('data-subject-mastery'\))\] = select\.value;\s*syncTopicLinks\(\);/g) || []).length, 2,
  "both regionals mastery dropdowns (weekly and subject roadmap) must call syncTopicLinks() right after the change");
assert.match(cp, /state\.checks\[input\.dataset\.lcCheck\]=input\.checked;save\(\);syncLinks\(\);/, "a CP tick must be recorded in the ledger");
assert.match(cp, /state=\{checks:\{\}\};save\(\);syncLinks\(\);/, "a CP reset must be recorded in the ledger too");
assert.match(cp, /confirm\('[^']*Regionals/, "the reset prompt must warn that shared topics reset in Regionals");
// First merge when each page opens, and re-read before merging when something else changed storage.
assert.match(reg, /function init\(\) \{\s*syncTopicLinks\(\);/, "regionals must merge once before drawing");
assert.match(cp, /load\(\);\s*syncLinks\(\);/, "CP must merge once when it opens");
assert.match(reg, /function onExternalTopicChange\(\) \{\s*state = load\(\);/, "regionals must re-read storage before merging an outside change");
assert.match(cp, /function onExternalChange\(\)\{load\(\);syncLinks\(\)/, "CP must re-read storage before merging an outside change");
assert.match(reg, /watchExternalChanges\(\[STORAGE_KEY, TopicLink\.LEDGER_KEY\]/);
assert.match(cp, /watchExternalChanges\(\[KEY,TL\.LEDGER_KEY\]/);
// Each page must write only its own store: no reaching into the other page's storage key.
assert.doesNotMatch(cp, /regional-qualification/, "the CP page must never touch the regionals store directly");
assert.doesNotMatch(reg, /limitless\.cp\.learning-centre/, "the regionals page must never touch the CP store directly");
console.log("Topic link wiring: all assertions passed.");
