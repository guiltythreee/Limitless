// The pure helpers behind the two-finger swipe and the way back to the Limitless homepage.
// These are what decide a gesture's meaning and the homepage address; the DOM wiring that calls
// them cannot be exercised in jsdom (no touchscreen), so the decision itself is kept pure here.
import test from "node:test";
import assert from "node:assert/strict";
import { loadHelpers } from "./helpers.mjs";

const N = loadHelpers(["swipeIntent", "homeHref", "SWIPE_MIN", "SWIPE_MAX_MS"]);

// ---------------------------------------------------------------------------
// swipeIntent: direction, threshold, and which way is even possible
// ---------------------------------------------------------------------------

test("a two-finger swipe from left to right means back", () => {
  assert.equal(N.swipeIntent(200, 4, 0, 0), "back");
  assert.equal(N.swipeIntent(N.SWIPE_MIN, 0, 3, 3), "back");
});

test("a swipe from right to left means forward only when there is somewhere to go", () => {
  assert.equal(N.swipeIntent(-200, 4, 1, 3), "forward");
  assert.equal(N.swipeIntent(-200, 4, 3, 3), "", "already at the newest place: nothing forward");
});

test("a mostly vertical drag is a scroll, not a swipe", () => {
  assert.equal(N.swipeIntent(200, 300, 0, 0), "");
  assert.equal(N.swipeIntent(-160, 160, 1, 2), "", "a diagonal scroll is not treated as a swipe");
});

test("a short sideways drag is ignored", () => {
  assert.equal(N.swipeIntent(N.SWIPE_MIN - 1, 0, 0, 0), "");
  assert.equal(N.swipeIntent(-30, 0, 0, 1), "");
});

test("sideways must clearly beat vertical for a swipe to count", () => {
  // 150 across and 60 down: 150 >= 1.5 * 60, so it is a swipe
  assert.equal(N.swipeIntent(150, 60, 0, 0), "back");
  // 120 across and 100 down: 120 < 150, so it stays a scroll
  assert.equal(N.swipeIntent(120, 100, 0, 0), "");
});

// ---------------------------------------------------------------------------
// homeHref: where "back to the Limitless homepage" points
// ---------------------------------------------------------------------------

test("inside Limitless the shell's own Back-to-Limitless link is used", () => {
  assert.equal(N.homeHref("https://limitless.example/", "/tools/typing/bookkeys.html"), "https://limitless.example/");
});

test("a standalone copy served from the site's tools/typing folder uses the site root", () => {
  assert.equal(N.homeHref("", "/tools/typing/bookkeys.html"), "../../");
  assert.equal(N.homeHref("", "/tools/typing/index.html"), "../../");
});

test("nowhere to go: no link and not on the site, so nothing happens", () => {
  assert.equal(N.homeHref("", "/bookkeys.html"), "");
  assert.equal(N.homeHref("", "/somewhere/else/bookkeys.html"), "");
  assert.equal(N.homeHref("", ""), "");
});

test("the swipe threshold is conservative and a slow drag is not a swipe", () => {
  assert.ok(N.SWIPE_MIN >= 100, "a deliberate, clearly sideways drag is required");
  assert.ok(N.SWIPE_MAX_MS <= 2000, "a swipe is a flick, not a slow drag");
});
