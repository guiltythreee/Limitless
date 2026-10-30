import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const chapterPath = new URL("../public/data/mt202/ch01.json", import.meta.url);
const chapter = JSON.parse(readFileSync(chapterPath, "utf8"));
const chapterSevenPath = new URL("../public/data/mt202/ch07.json", import.meta.url);
const chapterSeven = JSON.parse(readFileSync(chapterSevenPath, "utf8"));
const expected = [
  {
    chapter: chapter,
    n: 10,
    answer: "a",
    includes: ["metals", "metalloids", "non-metals"],
    excludes: /\b(?:BCC|FCC)\b|lattice parameter|atomic radii/i,
  },
  {
    chapter: chapter,
    n: 11,
    answer: "a",
    includes: ["ionic", "covalent", "metallic", "van der Waals"],
    excludes: /\b(?:BCC|FCC)\b|lattice parameter|atomic radii/i,
  },
  {
    chapter: chapter,
    n: 12,
    answer: "a",
    includes: ["covalent bonds", "directional", "diamond"],
    excludes: /\b(?:BCC|FCC)\b|lattice parameter|atomic radii/i,
  },
  {
    chapter: chapter,
    n: 13,
    answer: "b",
    includes: ["metallic bonding", "conductivity", "ductility", "lustre"],
    excludes: /\b(?:BCC|FCC)\b|lattice parameter|atomic radii/i,
  },
  {
    chapter: chapterSeven,
    n: 35,
    answer: "a",
    includes: ["overaging", "coarsen", "spacing", "Orowan stress"],
    excludes: /Cottrell atmosphere|upper yield point/i,
  },
  {
    chapter: chapterSeven,
    n: 49,
    answer: "c",
    includes: ["anti-phase boundary", "coherency", "modulus mismatch", "Orowan looping"],
    excludes: /Stage II|dynamic recovery|easy glide/i,
  },
];

for (const check of expected) {
  const matches = check.chapter.questions.filter((question) => question.n === check.n);
  assert.equal(matches.length, 1, `Expected exactly one MT202 question ${check.n}`);
  const question = matches[0];
  assert.equal(question.answer, check.answer, `MT202 question ${check.n}: answer key changed`);
  const explanation = question.detailed ?? "";
  for (const phrase of check.includes) {
    assert.ok(
      explanation.toLowerCase().includes(phrase.toLowerCase()),
      `MT202 question ${check.n}: detailed explanation is missing "${phrase}"`,
    );
  }
  assert.doesNotMatch(
    explanation,
    check.excludes,
    `MT202 question ${check.n}: detailed explanation contains unrelated material`,
  );
  const explicitKey = explanation.match(/(?:is correct|gives|therefore|giving|answer is)[^*]{0,30}\*\*\\(([a-d])\\)\*\*/i);
  if (explicitKey) {
    assert.equal(
      explicitKey[1],
      question.answer,
      `MT202 question ${check.n}: explanation names option ${explicitKey[1]} but answer key is ${question.answer}`,
    );
  }
}

console.log("MT202 explanation-alignment regression passed (6 targeted questions).");
