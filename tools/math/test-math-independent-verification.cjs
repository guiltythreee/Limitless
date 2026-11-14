#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const E = require('./engine.js');

const SAMPLE_COUNT = 200;
const SEED = 20261028;
const ADVANCED = new Set([
  'sqrtPerfect', 'cbrtPerfect', 'sqrtApprox', 'est', 'probDice', 'probCoin',
  'probBag', 'evGame', 'evDie', 'ev2d6', 'comb', 'mod', 'log'
]);
let checked = 0;

function near(actual, expected, label) {
  assert.ok(Number.isFinite(actual), label + ': actual answer is not finite');
  assert.ok(Math.abs(actual - expected) <= 1e-8 * Math.max(1, Math.abs(expected)),
    label + ': independently calculated ' + expected + ', engine stored ' + actual);
}
function value(q) { return q.answer.n / q.answer.d; }
function choose(n, k) {
  k = Math.min(k, n - k);
  let out = 1;
  for (let i = 1; i <= k; i++) out = out * (n - k + i) / i;
  return Math.round(out);
}
function factorial(n) {
  let out = 1;
  for (let i = 2; i <= n; i++) out *= i;
  return out;
}
function subscript(n) {
  const map = {'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉'};
  return String(n).replace(/\d/g, d => map[d]);
}
function superscript(n) {
  const map = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
  return String(n).replace(/\d/g, d => map[d]);
}

function diceEvent(expr, a, b) {
  let m = expr.match(/^d1\+d2(==|>=|<=)(\d+)$/);
  if (m) {
    const sum = a + b, n = Number(m[2]);
    return m[1] === '==' ? sum === n : m[1] === '>=' ? sum >= n : sum <= n;
  }
  if (expr === 'd1==d2') return a === b;
  if (expr === 'd1==6 or d2==6') return a === 6 || b === 6;
  if (expr === 'd1%2==1 and d2%2==1') return a % 2 === 1 && b % 2 === 1;
  if (expr === '(d1*d2)%2==0') return (a * b) % 2 === 0;
  if (expr === 'abs(d1-d2)==2') return Math.abs(a - b) === 2;
  if (expr === 'max(d1,d2)>=5') return Math.max(a, b) >= 5;
  if (expr === 'd1%2==0') return a % 2 === 0;
  if (expr === 'd1>d2') return a > b;
  throw new Error('Independent dice evaluator missing expression: ' + expr);
}
function diceLabel(expr) {
  let m = expr.match(/^d1\+d2(==|>=|<=)(\d+)$/);
  if (m) return 'the sum is ' + (m[1] === '==' ? '' : m[1] === '>=' ? 'at least ' : 'at most ') + m[2];
  const labels = {
    'd1==d2': 'the dice show a double',
    'd1==6 or d2==6': 'at least one die shows a 6',
    'd1%2==1 and d2%2==1': 'both dice are odd',
    '(d1*d2)%2==0': 'the product is even',
    'abs(d1-d2)==2': 'the dice differ by exactly 2',
    'max(d1,d2)>=5': 'the larger die is at least 5',
    'd1%2==0': 'the first die is even',
    'd1>d2': 'the first die is higher than the second'
  };
  assert.ok(labels[expr], 'No independent dice label for ' + expr);
  return labels[expr];
}

const DIE_PAY = {
  'the number shown': [1,2,3,4,5,6],
  'the number shown, squared': [1,4,9,16,25,36],
  'twice the number, minus 3': [-1,1,3,5,7,9],
  '12 if you roll a 6, otherwise 0': [0,0,0,0,0,12],
  'the number if it is even, otherwise 0': [0,2,0,4,0,6],
  'the larger of the number and 3': [3,3,3,4,5,6],
  '7 minus the number': [6,5,4,3,2,1],
  'the number cubed': [1,8,27,64,125,216],
  '5 for a 1 or 2, 2 for a 3 or 4, 0 for a 5 or 6': [5,5,2,2,0,0]
};

function independentlyVerify(q) {
  const v = q.verify;
  const ans = value(q);
  let m, expected;

  if (v && v.kind === 'root') {
    assert.equal(Math.pow(v.root, v.k), v.radicand, q.text + ': root metadata must satisfy the power identity');
    assert.ok(q.text.startsWith((v.k === 2 ? '√' : '∛') + v.radicand), q.text + ': prompt radicand disagrees with metadata');
    near(ans, v.root, q.text);
  } else if (v && v.kind === 'sqrt2dp') {
    m = q.text.match(/^√(\d+)\s+\(2 d\.p\.\)/);
    assert.ok(m, 'Unexpected approximate-root prompt: ' + q.text);
    const n = Number(m[1]), root = Math.sqrt(n);
    assert.equal(n, v.radicand, q.text + ': prompt and metadata radicands differ');
    near(v.tolCenter || q.tol.center, root, q.text + ': tolerance centre');
    near(ans, Math.round(root * 100) / 100, q.text + ': rounded square root');
    near(q.tol.center, root, q.text + ': tolerance centre');
  } else if (v && v.kind === 'est') {
    m = q.text.match(/^(.+?)\s+≈ \?\s+\(within 1%\)$/);
    assert.ok(m, 'Unexpected estimation prompt: ' + q.text);
    const stem = m[1].trim();
    const op = stem.includes(' × ') ? '×' : '÷';
    const parts = stem.split(' ' + op + ' ');
    assert.equal(parts.length, 2, q.text + ': could not parse estimation operands');
    expected = op === '×' ? Number(parts[0]) * Number(parts[1]) : Number(parts[0]) / Number(parts[1]);
    near(q.tol.center, expected, q.text + ': exact value used for tolerance');
    near(ans, Math.floor(expected + 0.5), q.text + ': rounded estimate target');
    assert.equal(q.tol.rel, 0.01, q.text + ': tolerance should be 1%');
  } else if (v && v.kind === 'dice') {
    let numerator = 0, denominator = 0;
    for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) {
      const inCondition = !v.cond || diceEvent(v.cond, a, b);
      if (inCondition) {
        denominator++;
        if (diceEvent(v.event, a, b)) numerator++;
      }
    }
    assert.ok(q.text.includes(diceLabel(v.event)), q.text + ': event description disagrees with verification metadata');
    if (v.cond) assert.ok(q.text.includes('given ' + diceLabel(v.cond)), q.text + ': condition description disagrees with metadata');
    near(ans, numerator / denominator, q.text);
  } else if (v && v.kind === 'coin') {
    const numerator = v.atLeast
      ? Array.from({length: v.n - v.k + 1}, (_, i) => choose(v.n, v.k + i)).reduce((a, b) => a + b, 0)
      : choose(v.n, v.k);
    near(ans, numerator / Math.pow(2, v.n), q.text);
    assert.ok(q.text.includes('Flip a fair coin ' + v.n + ' times'), q.text + ': coin count differs from metadata');
    assert.ok(q.text.includes((v.atLeast ? 'at least ' : 'exactly ') + v.k + ' head'), q.text + ': requested heads differ from metadata');
  } else if (v && v.kind === 'bag') {
    const total = v.red + v.blue;
    expected = v.mode === 'red' ? v.red * (v.red - 1) / (total * (total - 1))
      : v.mode === 'blue' ? v.blue * (v.blue - 1) / (total * (total - 1))
      : 2 * v.red * v.blue / (total * (total - 1));
    near(ans, expected, q.text);
    assert.ok(q.text.includes(v.red + ' red, ' + v.blue + ' blue'), q.text + ': bag counts differ from metadata');
    assert.ok(q.text.includes(v.mode === 'mixed' ? 'one of each colour' : 'both ' + v.mode), q.text + ': requested event differs from metadata');
  } else if (v && v.kind === 'ev2d6') {
    const f = {
      'max(d1,d2)': (a,b) => Math.max(a,b),
      'min(d1,d2)': (a,b) => Math.min(a,b),
      'd1*d2': (a,b) => a*b,
      'abs(d1-d2)': (a,b) => Math.abs(a-b),
      '(d1==6)+(d2==6)': (a,b) => (a === 6 ? 1 : 0) + (b === 6 ? 1 : 0),
      'd1+d2': (a,b) => a+b
    }[v.value];
    assert.ok(f, 'No independent two-dice expected-value evaluator for ' + v.value);
    let sum = 0;
    for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) sum += f(a,b);
    near(ans, sum / 36, q.text);
  } else if (v && v.kind === 'comb') {
    expected = v.perm ? factorial(v.n) / factorial(v.n - v.k)
      : factorial(v.n) / (factorial(v.k) * factorial(v.n - v.k));
    near(ans, expected, q.text);
    assert.ok(q.text.includes(v.perm ? 'Arrange ' + v.k + ' of ' + v.n : v.n + ' choose ' + v.k),
      q.text + ': prompt does not match the combinatorics parameters');
  } else if (v && v.kind === 'mod') {
    if (v.op === 'rem') expected = v.a % v.m;
    else if (v.op === 'mul') expected = ((v.a % v.m) * (v.b % v.m)) % v.m;
    else {
      expected = 1;
      for (let i = 0; i < v.e; i++) expected = (expected * v.a) % v.m;
    }
    near(ans, expected, q.text);
    assert.ok(q.text.includes(String(v.m)), q.text + ': modulus differs from metadata');
  } else if (v && v.kind === 'log') {
    near(ans, v.p / v.q, q.text + ': logarithm exponent');
    const left = Math.pow(v.base, v.p);
    const right = Math.pow(v.argN / v.argD, v.q);
    near(left, right, q.text + ': logarithm identity');
    assert.ok(q.text.startsWith('log' + subscript(v.base)), q.text + ': prompt base differs from metadata');
  } else if (q.id === 'evGame') {
    m = q.text.match(/^Win (\d+) with probability (\d+)\/(\d+), otherwise lose (\d+)\. Expected value\?$/);
    assert.ok(m, 'Unexpected expected-value prompt: ' + q.text);
    const W = Number(m[1]), a = Number(m[2]), den = Number(m[3]), L = Number(m[4]);
    near(ans, (W * a - L * (den - a)) / den, q.text);
  } else if (q.id === 'evDie') {
    m = q.text.match(/^Roll a fair die and win (?:(\d+) × \((.+)\)|(.+))\. Expected winnings\?$/);
    assert.ok(m, 'Unexpected die expected-value prompt: ' + q.text);
    const mult = m[1] ? Number(m[1]) : 1;
    const rule = m[2] || m[3];
    assert.ok(DIE_PAY[rule], 'No independent payout table for rule: ' + rule);
    near(ans, DIE_PAY[rule].reduce((sum, payout) => sum + payout * mult, 0) / 6, q.text);
  } else {
    assert.fail(q.text + ': missing independent evaluator for ' + (v ? v.kind : q.id));
  }
}

for (const tier of E.TIERS) {
  for (const recipe of tier.recipes) {
    if (!ADVANCED.has(recipe[0])) continue;
    const [id, , settings] = recipe;
    const rng = E.makeRng(SEED + tier.index * 10000 + E.TIERS.indexOf(tier) * 31 + id.length);
    for (let i = 0; i < SAMPLE_COUNT; i++) {
      const q = E.GENERATORS[id](rng, settings);
      q.id = id;
      q.tier = tier.id;
      q.settings = settings;
      q.target = E.targetFor(q.diff);
      assert.ok(q && q.answer && Number.isFinite(q.answer.n) && Number.isFinite(q.answer.d) && q.answer.d > 0,
        tier.id + '/' + id + ': malformed answer');
      assert.equal(E.checkAnswer(q, q.answerText, true).status, 'correct',
        tier.id + '/' + id + ': displayed answer should be accepted');
      independentlyVerify(q);
      checked++;
    }
  }
}

console.log('Independent advanced-generator checks passed: ' + checked +
  ' generated questions across roots, estimates, probability, expected value, combinatorics, modular arithmetic and logarithms.');
