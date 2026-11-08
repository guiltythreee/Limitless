// Builds codeforces-red/catalogue.json: the FIXED list of 250 topic-balanced problems per rating.
// Run once (Node 18+):   node scripts/build-codeforces-catalogue.mjs
// Offline test:          node scripts/build-codeforces-catalogue.mjs --input saved-problemset.json
// Once catalogue.json is committed, the site always shows exactly this list until you run this again.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sitePath = resolve(root, 'codeforces-red/codeforces-problems.js');
const outPath = resolve(root, 'codeforces-red/catalogue.json');

// Reuse the exact selection code from the site so the two can never drift apart.
const src = readFileSync(sitePath, 'utf8');
function slice(from, to) {
  const a = src.indexOf(from), b = src.indexOf(to, a);
  if (a < 0 || b < 0) throw new Error('Could not find "' + from + '" in codeforces-problems.js');
  return src.slice(a, b);
}
const code = [
  slice('  const MAX_PER_RATING', '  const $ = id'),
  slice('  const CATEGORIES', '  function readSaved'),
  slice('  function categoriesFor', '  function esc('),
  slice('  function curateProblemset', '  async function readSnapshot')
].join('\\n') + '\\nreturn curateProblemset;';
const curateProblemset = new Function(code)();

const inputIndex = process.argv.indexOf('--input');
let result;
if (inputIndex > -1) {
  const raw = JSON.parse(readFileSync(process.argv[inputIndex + 1], 'utf8'));
  result = raw.result || raw;
} else {
  const response = await fetch('https://codeforces.com/api/problemset.problems');
  if (!response.ok) throw new Error('Codeforces API request failed (' + response.status + ').');
  const data = await response.json();
  if (data.status !== 'OK') throw new Error(data.comment || 'Codeforces API returned an error.');
  result = data.result;
}

const problems = curateProblemset(result);
writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), problems }) + '\\n');

const perRating = {};
problems.forEach(p => { perRating[p.rating] = (perRating[p.rating] || 0) + 1; });
console.log('Wrote ' + problems.length + ' problems to codeforces-red/catalogue.json');
console.log(perRating);
