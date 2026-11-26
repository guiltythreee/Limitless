/* Reading-view maths tests.
   Run from the repository root:
     node tools/lectern/tests/test-viewer-math.mjs
*/
import assert from 'node:assert/strict';
import { fitScale, clampZoom, pageAtScroll } from '../viewer-math.mjs';

// zoom 1 = the page fills the width of the reading area
assert.equal(fitScale(600, 900, 1), 1.5);
assert.equal(fitScale(600, 900, 2), 3);
assert.equal(fitScale(600, 300, 1), 0.5, 'a wide page shrinks to fit a narrow screen');

// zoom is limited to 0.5 .. 4
assert.equal(clampZoom(10), 4);
assert.equal(clampZoom(0.1), 0.5);
assert.equal(clampZoom(1.25), 1.25);
assert.equal(fitScale(600, 900, 10), 6, 'zoom above 4 is treated as 4');
assert.equal(fitScale(600, 900, 0.1), 0.75, 'zoom below 0.5 is treated as 0.5');

// bad input never produces NaN or Infinity
assert.equal(fitScale(0, 900, 1), 1);
assert.equal(clampZoom(NaN), 1);

// ---- which page is at the top of the screen ----
const pages = [{ top: 16, height: 900 }, { top: 1016, height: 900 }, { top: 2016, height: 900 }];
const at = scrollTop => pageAtScroll(pages, scrollTop);
assert.deepEqual(at(0), { n: 1, frac: (0 - 16) / 900 }, 'before the first page you are still on page 1');
assert.equal(at(16).n, 1);
assert.equal(at(500).n, 1);
assert.equal(at(1016).n, 2, 'exactly at the top of page 2');
assert.equal(at(1016 + 450).n, 2, 'halfway down page 2');
assert.equal(at(1016 + 450).frac, 0.5);
assert.equal(at(2016 + 10).n, 3);
assert.equal(at(99999).n, 3, 'beyond the end is the last page');
assert.equal(at(900).n, 2, 'when under 40px of page 1 is left, page 2 counts as current');
assert.deepEqual(pageAtScroll([], 100), { n: 1, frac: 0 }, 'no pages: page 1');

console.log('viewer-math: all tests passed');
