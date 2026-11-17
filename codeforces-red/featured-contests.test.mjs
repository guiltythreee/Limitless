import assert from "node:assert/strict";
import {
  FEATURED_CONTEST_GROUPS,
  renderFeaturedContestGroups,
} from "./featured-contests.mjs";

assert.equal(FEATURED_CONTEST_GROUPS.length, 4, "the featured archive should expose four useful contest groups");
const ids = FEATURED_CONTEST_GROUPS.flatMap((group) => group.contests.map((contest) => contest.id));
assert.equal(new Set(ids).size, ids.length, "a contest must not appear twice in the featured archive");
assert.ok(ids.length >= 35, "the archive should contain a useful selection of official rounds");

for (const group of FEATURED_CONTEST_GROUPS) {
  assert.ok(group.id && group.title && group.description, "each group needs a stable ID and explanation");
  assert.ok(group.contests.length > 0, "each group must contain at least one round");
  for (const contest of group.contests) {
    assert.ok(Number.isSafeInteger(contest.id) && contest.id > 0, "contest IDs must be positive integers");
    assert.ok(typeof contest.title === "string" && contest.title.length > 0, "each contest needs its official title");
  }
}
const html = renderFeaturedContestGroups();
assert.equal((html.match(/class="cf-featured-group"/g) || []).length, FEATURED_CONTEST_GROUPS.length);
assert.equal((html.match(/href="https:\/\/codeforces\.com\/contest\//g) || []).length, ids.length);
assert.ok(html.includes("historical upvote snapshot"));
assert.ok(html.includes("Hello 2018"));
assert.ok(html.includes("Codeforces Round 1134 (Div. 4)"));
assert.ok(html.includes("Educational Codeforces Round 196"));
assert.ok(html.includes("Codeforces Global Round 9"));
console.log("Featured Codeforces archive: all assertions passed (" + ids.length + " contests).");
