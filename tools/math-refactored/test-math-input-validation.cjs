/* Answer-input parsing and grouping regression tests.
   Run: node tools/math-refactored/test-math-input-validation.cjs */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const E = require('./engine.js');

// Exercise the actual UI cleaner before asking the engine parser to validate input.
const gameSource = fs.readFileSync(path.join(__dirname, 'game.js'), 'utf8');
const cleanerMatch = gameSource.match(/function cleanAnswer\(v\) \{([\s\S]*?)\n  \}/);
assert.ok(cleanerMatch, 'UI cleanAnswer function should be present');
const cleanAnswer = new Function('v', cleanerMatch[1]);
const beforeInputFilter = gameSource.match(/!\/(\^\[[^\]]+\]\$)\/\.test\(e\.data\)/);
assert.ok(beforeInputFilter, 'single-character beforeinput filter should be present');
assert.ok(beforeInputFilter[1].includes(','), 'single-character comma entry must not be blocked');
assert.ok(beforeInputFilter[1].includes('−'), 'single-character Unicode minus entry must not be blocked');

function expectValue(input, n, d, label) {
  const value = E.parseInput(input);
  assert.ok(value, label + ': expected input to parse');
  assert.equal(value.n, n, label + ': unexpected numerator');
  assert.equal(value.d, d, label + ': unexpected denominator');
}
function expectInvalid(input) {
  assert.equal(E.parseInput(input), null, 'malformed input should be rejected: ' + input);
}

expectValue('1234', 1234, 1, 'plain integer');
expectValue('1,234', 1234, 1, 'grouped integer');
expectValue('12,345,678', 12345678, 1, 'multiple groups');
expectValue('-1,234.50', -2469, 2, 'grouped decimal');
expectValue('−12.5', -25, 2, 'unicode minus');
expectValue('.5', 1, 2, 'leading decimal point');
expectValue('1,000/2', 500, 1, 'grouped fraction numerator');
expectValue('1/1,000', 1, 1000, 'grouped fraction denominator');
expectValue('0', 0, 1, 'zero');

for (const input of ['1,2', '12,34', '1234,567', '1,,000', ',123', '1,', '1,23,456', '1,000.2,3', '1/2,00', '1,000/2,00',
  '1/2/3', '1.2.3', '1-2', '--3']) {
  assert.equal(cleanAnswer(input), input, 'UI cleaning must preserve malformed numeric punctuation for validation: ' + input);
  expectInvalid(cleanAnswer(input));
}
for (const input of ['', '.', '-', '-.', '1/0', '1e3']) expectInvalid(input);

// Valid grouped input and Unicode minus survive UI cleaning and parse to exact values.
for (const input of ['1,234', '-1,234.50', '1,000/2', '1/1,000']) {
  assert.equal(cleanAnswer(input), input, 'UI cleaning must preserve valid grouped input: ' + input);
  assert.ok(E.parseInput(cleanAnswer(input)), 'valid grouped input should parse after UI cleaning: ' + input);
}
assert.equal(cleanAnswer('−12.5'), '-12.5', 'Unicode minus must normalize to ASCII minus');
expectValue(cleanAnswer('−12.5'), -25, 2, 'Unicode minus through UI cleaning');
console.log('Answer-input parsing and UI-to-parser checks passed (9 valid formats, 20 invalid inputs, UI grouping and negative signs preserved).');
