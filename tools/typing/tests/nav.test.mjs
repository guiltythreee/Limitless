// Bookkeys must let the browser own trackpad/touch navigation gestures.
// This suite protects that boundary while preserving Bookkeys' internal history behavior.
import test from "node:test";
import assert from "node:assert/strict";
import { pageSource } from "./helpers.mjs";

const html = pageSource();
const navStart = html.indexOf("function navTo(v)");
assert.notEqual(navStart, -1, "Bookkeys navigation controller should exist");
const scriptEnd = html.indexOf("</script>", navStart);
assert.notEqual(scriptEnd, -1, "Bookkeys application script should close");
const navSource = html.slice(navStart, scriptEnd);

test("trackpad and touchscreen navigation gestures are left to the browser", () => {
  assert.equal(navSource.includes('window.addEventListener("wheel"'), false,
    "Bookkeys must not intercept horizontal trackpad wheel gestures");
  assert.equal(navSource.includes('window.addEventListener("touchstart"'), false,
    "Bookkeys must not install its own page-level touchscreen gesture recognizer");
  assert.equal(navSource.includes('window.addEventListener("touchmove"'), false,
    "Bookkeys must not cancel native two-finger touchscreen navigation");
  assert.equal(navSource.includes("function swipeIntent("), false,
    "the custom swipe classifier should be removed");
  assert.equal(navSource.includes("function navBackOrLeave("), false,
    "gesture-only back routing should be removed");
  assert.equal(navSource.includes("function leaveForHome("), false,
    "a gesture must not be replaced with a custom homepage redirect");
});

test("Bookkeys still records its own Home/book states in browser history", () => {
  assert.ok(navSource.includes('history.pushState({ i: NAV.i, v: v }'), "state transitions still use pushState");
  assert.ok(navSource.includes('window.addEventListener("popstate"'), "native Back/Forward still drives Bookkeys state");
  assert.ok(navSource.includes('function navBack() { if (NAV.i > 0) history.back(); }'));
  assert.ok(navSource.includes('function navForward() { if (NAV.i < NAV.max) history.forward(); }'));
  assert.ok(navSource.includes('history.replaceState({ i: 0, v: "home" }, "", "#home")'));
});

test("native Back still closes the top dialog without losing the Bookkeys history position", () => {
  assert.ok(navSource.includes(
    'if (anyDialogOpen()) { NAV.revert = true; history.go(NAV.i - st.i); closeTopDialog(); return; }'
  ));
});

test("the existing Alt+Left and Alt+Right keyboard navigation remains available", () => {
  assert.ok(navSource.includes('if (e.altKey && e.key === "ArrowLeft")'));
  assert.ok(navSource.includes('e.key === "ArrowRight"'));
});
