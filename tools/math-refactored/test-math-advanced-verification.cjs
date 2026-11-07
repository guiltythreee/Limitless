/* Independent arithmetic checks for advanced generators that use verify metadata.
   Run: node tools/math-refactored/test-math-advanced-verification.cjs */
'use strict';
const assert = require('node:assert/strict');
const E = require('./engine.js');

function choose(n, k) {
  if (k < 0 || k > n) return 0;
  k = Math.min(k, n - k);
  let out = 1;
  for (let i = 1; i <= k; i++) out = out * (n - k + i) / i;
  return Math.round(out);
}
function perm(n, k) { let out = 1; for (let i = 0; i < k; i++) out *= n - i; return out; }
function close(actual, expected, label) {
  assert.ok(Number.isFinite(actual) && Number.isFinite(expected) &&
    Math.abs(actual - expected) <= 1e-8 * Math.max(1, Math.abs(expected)),
    label + ': got ' + actual + ', expected ' + expected);
}
function answer(q) { return q.answer.n / q.answer.d; }

function diceEvent(code, a, b) {
  let m;
  if ((m = code.match(/^d1\+d2(==|>=|<=)(\d+)$/))) {
    const v = a + b, n = Number(m[2]);
    return m[1] === '==' ? v === n : m[1] === '>=' ? v >= n : v <= n;
  }
  if (code === 'd1==d2') return a === b;
  if (code === 'd1==6 or d2==6') return a === 6 || b === 6;
  if (code === 'd1%2==1 and d2%2==1') return a % 2 === 1 && b % 2 === 1;
  if (code === '(d1*d2)%2==0') return (a * b) % 2 === 0;
  if (code === 'abs(d1-d2)==2') return Math.abs(a - b) === 2;
  if (code === 'max(d1,d2)>=5') return Math.max(a, b) >= 5;
  if (code === 'd1%2==0') return a % 2 === 0;
  if (code === 'd1>d2') return a > b;
  throw new Error('Unimplemented independent dice event: ' + code);
}
function independent(q) {
  const v = q.verify;
  assert.ok(v && typeof v.kind === 'string', 'expected verification metadata for ' + q.text);
  switch (v.kind) {
    case 'root':
      close(Math.pow(v.root, v.k), v.radicand, q.text + ' root identity');
      close(answer(q), v.root, q.text + ' root answer');
      break;
    case 'sqrt2dp': {
      const expected = Math.round(Math.sqrt(v.radicand) * 100) / 100;
      close(answer(q), expected, q.text + ' rounded square root');
      close(q.tol.center, Math.sqrt(v.radicand), q.text + ' square-root tolerance center');
      break;
    }
    case 'est': {
      const exact = Function('"use strict"; return (' + q.expr + ');')();
      close(q.tol.center, exact, q.text + ' estimation center');
      close(answer(q), Math.floor(exact + 0.5), q.text + ' displayed rounded estimate');
      break;
    }
    case 'dice': {
      let total = 0, success = 0;
      for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) {
        const condition = v.cond ? diceEvent(v.cond, a, b) : true;
        if (condition) {
          total++;
          if (diceEvent(v.event, a, b)) success++;
        }
      }
      assert.ok(total > 0, q.text + ': conditional event must be possible');
      close(answer(q), success / total, q.text + ' exact dice probability');
      break;
    }
    case 'coin': {
      let n = 0;
      if (v.atLeast) for (let i = v.k; i <= v.n; i++) n += choose(v.n, i);
      else n = choose(v.n, v.k);
      close(answer(q), n / Math.pow(2, v.n), q.text + ' binomial probability');
      break;
    }
    case 'bag': {
      const { red, blue, mode } = v, total = red + blue;
      const numerator = mode === 'red' ? red * (red - 1)
        : mode === 'blue' ? blue * (blue - 1) : 2 * red * blue;
      close(answer(q), numerator / (total * (total - 1)), q.text + ' without-replacement probability');
      break;
    }
    case 'ev2d6': {
      let sum = 0;
      for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) {
        switch (v.value) {
          case 'max(d1,d2)': sum += Math.max(a, b); break;
          case 'min(d1,d2)': sum += Math.min(a, b); break;
          case 'd1*d2': sum += a * b; break;
          case 'abs(d1-d2)': sum += Math.abs(a - b); break;
          case '(d1==6)+(d2==6)': sum += (a === 6 ? 1 : 0) + (b === 6 ? 1 : 0); break;
          case 'd1+d2': sum += a + b; break;
          default: throw new Error('Unimplemented expected-value event: ' + v.value);
        }
      }
      close(answer(q), sum / 36, q.text + ' two-dice expected value');
      break;
    }
    case 'comb':
      close(answer(q), v.perm ? perm(v.n, v.k) : choose(v.n, v.k), q.text + ' counting result');
      break;
    case 'mod': {
      let expected;
      if (v.op === 'rem') expected = v.a % v.m;
      else if (v.op === 'mul') expected = ((v.a % v.m) * (v.b % v.m)) % v.m;
      else if (v.op === 'pow') {
        expected = 1;
        for (let i = 0; i < v.e; i++) expected = (expected * v.a) % v.m;
      } else throw new Error('Unknown modular operation: ' + v.op);
      close(answer(q), expected, q.text + ' modular result');
      break;
    }
    case 'log': {
      const expectedArgument = v.argN / v.argD;
      const reconstructed = Math.pow(v.base, v.p / v.q);
      close(reconstructed, expectedArgument, q.text + ' logarithm identity');
      close(answer(q), v.p / v.q, q.text + ' logarithm answer');
      break;
    }
    default: throw new Error('Missing independent verifier for kind: ' + v.kind);
  }
  assert.equal(E.checkAnswer(q, q.answerText, true).status, 'correct',
    q.text + ': generated answer must be accepted');
}

const cases = [
  ['sqrtPerfect', { lo: 25, hi: 55 }, 250],
  ['cbrtPerfect', { lo: 8, hi: 20 }, 250],
  ['sqrtApprox', { lo: 20, hi: 500 }, 250],
  ['est', { kind: 'mul', alo: 31, ahi: 99, dpa: 1, blo: 201, bhi: 999, dpb: 1 }, 250],
  ['est', { kind: 'div', nlo: 2000, nhi: 99999, dlo: 13, dhi: 98 }, 250],
  ['probDice', { cond: false }, 500],
  ['probDice', { cond: true }, 500],
  ['probCoin', { nlo: 3, nhi: 10, atLeast: true }, 500],
  ['probBag', { lo: 4, hi: 10 }, 500],
  ['ev2d6', {}, 500],
  ['comb', { nlo: 5, nhi: 16, perm: 0.5 }, 500],
  ['mod', { kinds: ['rem', 'mul', 'pow'], alo: 100, ahi: 999, mlo: 7, mhi: 23, bmax: 9, emax: 9 }, 750],
  ['log', { kinds: ['int', 'neg', 'sum', 'frac'], bases: [2, 3, 5, 10], klo: 2, khi: 6 }, 1000]
];
let checked = 0;
for (let c = 0; c < cases.length; c++) {
  const [id, settings, count] = cases[c];
  const rng = E.makeRng(930000 + c * 1009);
  for (let i = 0; i < count; i++) {
    const q = E.GENERATORS[id](rng, settings);
    independent(q);
    checked++;
  }
}
console.log('Advanced independent verification passed for ' + checked + ' generated questions across roots, estimates, probability, expected value, combinatorics, modular arithmetic and logarithms.');
