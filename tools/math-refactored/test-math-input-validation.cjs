/* Answer-input parsing and grouping regression tests.
   Run: node tools/math-refactored/test-math-input-validation.cjs */
'use strict';
const assert = require('node:assert/strict');
const E = require('./engine.js');

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

for (const input of ['1,2', '12,34', '1234,567', '1,,000', ',123', '1,', '1,23,456', '1,000.2,3', '1/2,00', '1,000/2,00']) {
  expectInvalid(input);
}
for (const input of ['', '.', '-', '-.', '1/0', '1/2/3', '1e3']) expectInvalid(input);

console.log('Answer-input parsing checks passed (9 valid formats and 17 invalid inputs).');
