import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Guards the reading assignments: every section number must exist in its source and
// must match the topic it is attached to. Facts below were checked against the sources
// (LearnCpp table of contents, Rosen ch. 6 and 8, CPH ch. 1, MIT 6.042J Fall 2010 problem sets).
var src = await readFile(new URL('./competition.js', import.meta.url), 'utf8');

// ---- LearnCpp: every referenced lesson exists --------------------------------------------
// Highest lesson number in each chapter of the current LearnCpp table of contents.
var LEARNCPP_LAST_LESSON = { 1: 11, 2: 13, 3: 10, 4: 12, 5: 9, 6: 8, 7: 14, 8: 15, 9: 6, 10: 9, 11: 10, 12: 15, 13: 15, 14: 17, 15: 10, 16: 12, 17: 13, 18: 4, 19: 5, 20: 7 };
var weekly = /var LEARNCPP_WEEKLY = \[([\s\S]*?)\n  \];/.exec(src);
assert.ok(weekly, 'LEARNCPP_WEEKLY block must exist');
var weeks = weekly[1].split(/\n    \{/).filter(function (chunk) { return /sections:\[/.test(chunk); });
assert.equal(weeks.length, 16, 'one LearnCpp assignment per roadmap week');
weeks.forEach(function (chunk, wi) {
  var list = /sections:\[([\s\S]*?)\],extra:/.exec(chunk);
  assert.ok(list, 'week ' + (wi + 1) + ' has a sections list');
  var items = list[1].match(/'((?:[^'\\]|\\.)*)'/g).map(function (item) { return item.slice(1, -1); });
  items.forEach(function (item) {
    var colon = item.indexOf(': ');
    var numbers = item.slice(0, colon);
    numbers.split(/,\s*/).forEach(function (part) {
      var match = /^(\d+)\.(\d+)(?:–(\d+)\.(\d+)|–(\d+))?$/.exec(part);
      assert.ok(match, 'week ' + (wi + 1) + ': unreadable lesson reference "' + part + '"');
      var chapter = Number(match[1]), first = Number(match[2]);
      var last = match[4] ? Number(match[4]) : match[5] ? Number(match[5]) : first;
      if (match[4]) assert.equal(Number(match[3]), chapter, 'week ' + (wi + 1) + ': a range must stay inside one chapter: ' + part);
      assert.ok(LEARNCPP_LAST_LESSON[chapter], 'week ' + (wi + 1) + ': LearnCpp has no chapter ' + chapter);
      assert.ok(first >= 1 && last >= first && last <= LEARNCPP_LAST_LESSON[chapter],
        'week ' + (wi + 1) + ': lesson ' + part + ' is outside LearnCpp chapter ' + chapter + ' (1-' + LEARNCPP_LAST_LESSON[chapter] + ')');
    });
    // Lessons 4.x are data types; arithmetic and conditions live in chapter 6.
    if (/^4\./.test(numbers)) assert.ok(!/arithmetic/i.test(item), 'week ' + (wi + 1) + ': chapter 4 is about types, not arithmetic: ' + item);
  });
});

// Day 2 / week 1 specifically: arithmetic = 6.1-6.3, conditions = 6.7-6.8, plus CPH chapter 1 with its own numbers.
var week1 = weeks[0];
assert.match(week1, /'6\.1–6\.3: Operator precedence, arithmetic operators, remainder'/);
assert.match(week1, /'6\.7–6\.8: Relational and logical operators/);
assert.match(week1, /'4\.4–4\.6: Integer types/);
assert.match(week1, /cph:'Ch\. 1: §1\.1 Programming languages, §1\.2 Input and output, §1\.3 Working with numbers'/);

// The reading line must say which source owns the numbers (CPH and LearnCpp both have a 1.1-1.5).
assert.match(src, /'LearnCpp lessons '\+week\.sections\.join\('; '\)/);
assert.match(src, /coding'\s*\n\s*\? learnCppReading\(weekIndex\)/);

// ---- Rosen: each single-concept counting topic gets its own section -----------------------
var block = /var COMBINATORICS_SECTIONS = \[[\s\S]*?\n  function combinatoricsSection\(title\)\{[\s\S]*?\n  \}/.exec(src);
assert.ok(block, 'COMBINATORICS_SECTIONS and combinatoricsSection must exist');
var combinatoricsSection = new Function(block[0] + '\n return combinatoricsSection;')();
var titles = [];
// Skip the weekday schedule entry ['combinatorics','coding'], which is a subject pair, not a topic title.
src.replace(/\['combinatorics','([^']+)'\]/g, function (_, title) { if (title !== 'coding') titles.push(title); return ''; });
assert.equal(titles.length, 16, 'one combinatorics topic per week');
var expected = {
  'Addition and multiplication counting principles': /§6\.1 The basics of counting/,
  'Permutations and combinations; ordered versus unordered choices': /§6\.3 /,
  'Binomial coefficients, Pascal identity and counting subsets': /§6\.4 /,
  'Pigeonhole principle and simple extremal counting': /§6\.2 /,
  'Stars and bars; non-negative versus positive integer solutions': /§6\.5 /,
  'Inclusion-exclusion for two and three sets': /§8\.5 /
};
Object.keys(expected).forEach(function (title) {
  assert.ok(titles.indexOf(title) !== -1, 'expected topic is missing: ' + title);
  var section = combinatoricsSection(title.toLowerCase());
  assert.ok(section && expected[title].test(section), title + ' -> ' + section);
});
// Day 2 topic is the sum and product rules only: it must not claim the whole chapter.
var day2 = combinatoricsSection('addition and multiplication counting principles');
assert.ok(!/6\.1–6\.5|6\.2|6\.3|6\.4|6\.5/.test(day2), 'Day 2 counting topic must cite §6.1 only: ' + day2);
// Mixed, review and timed topics have no single section and keep the chapter-level fallback.
titles.filter(function (title) { return /mixed|unseen|rebuild|timed|final review/i.test(title); }).forEach(function (title) {
  assert.equal(combinatoricsSection(title.toLowerCase()), null, 'mixed/review topic should use the chapter-level list: ' + title);
});

// ---- MIT 6.042J Fall 2010: PS9 is counting, PS8 is recurrences --------------------------------
var counting = src.match(/lecture\(16,'counting-rules-i'[^}]*?ps\((\d+)\);/g) || [];
assert.equal(counting.length, 2, 'counting companion appears for logic and combinatorics');
counting.forEach(function (entry) { assert.match(entry, /ps\(9\);/, 'counting must point to Problem Set 9: ' + entry); });
assert.match(src, /lecture\(15,'linear-recurrences','Linear Recurrences'\);ps\(8\);/, 'recurrences must point to Problem Set 8');

console.log('Reading sections match their topics: all assertions passed.');
