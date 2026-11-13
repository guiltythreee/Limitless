import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const loadChapter = (id) =>
  JSON.parse(readFileSync(new URL("../public/data/mt202/" + id + ".json", import.meta.url), "utf8"));

const chapter = loadChapter("ch01");
const chapterSeven = loadChapter("ch07");
const chapterNine = loadChapter("ch09");

const expected = [
  {
    chapter,
    n: 10,
    answer: "a",
    includes: ["metals", "metalloids", "non-metals"],
    excludes: /\b(?:BCC|FCC)\b|lattice parameter|atomic radii/i,
  },
  {
    chapter,
    n: 11,
    answer: "a",
    includes: ["ionic", "covalent", "metallic", "van der Waals"],
    excludes: /\b(?:BCC|FCC)\b|lattice parameter|atomic radii/i,
  },
  {
    chapter,
    n: 12,
    answer: "a",
    includes: ["covalent bonds", "directional", "diamond"],
    excludes: /\b(?:BCC|FCC)\b|lattice parameter|atomic radii/i,
  },
  {
    chapter,
    n: 13,
    answer: "b",
    includes: ["metallic bonding", "conductivity", "ductility", "lustre"],
    excludes: /\b(?:BCC|FCC)\b|lattice parameter|atomic radii/i,
  },
  {
    chapter,
    n: 16,
    answer: "a",
    includes: ["Van der Waals", "weakest", "primary"],
    excludes: /increasing order|\*\*\(b\)\*\* gives the intended/i,
  },
  {
    chapter: chapterSeven,
    n: 9,
    answer: "a",
    includes: ["Hall–Petch", "initial yield stress", "grain boundaries"],
    excludes: /\*\*\(c\)\*\* is correct/i,
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
  {
    chapter: chapterNine,
    n: 20,
    answer: "a",
    includes: ["latent heat", "nucleation", "solidification"],
    excludes: /\*\*\(b\)\*\* is correct|0\.13 °C/i,
  },
];

for (const check of expected) {
  const matches = check.chapter.questions.filter((question) => question.n === check.n);
  assert.equal(matches.length, 1, "Expected exactly one MT202 question " + check.n);
  const question = matches[0];
  assert.equal(question.answer, check.answer, "MT202 question " + check.n + ": answer key changed");
  const explanation = question.detailed ?? "";
  for (const phrase of check.includes) {
    assert.ok(
      explanation.toLowerCase().includes(phrase.toLowerCase()),
      'MT202 question ' + check.n + ': detailed explanation is missing "' + phrase + '"',
    );
  }
  assert.doesNotMatch(
    explanation,
    check.excludes,
    "MT202 question " + check.n + ": detailed explanation contains unrelated material",
  );
}

// Check explicit answer-letter claims across the entire 522-question bank.
// These patterns stay within a sentence/phrase so a later distractor bullet
// cannot be mistaken for the stated correct option.
const explicitKeyPatterns = [
  /\*\*\(([a-d])\)\*\*\s*(?:is correct|is the correct answer|is the answer)/gi,
  /(?:therefore|thus|so|answer is|the answer is|correct answer is)\s*\*\*\(([a-d])\)\*\*/gi,
];

let explicitKeyCount = 0;
let questionCount = 0;
for (let chapterNumber = 1; chapterNumber <= 9; chapterNumber++) {
  const source = loadChapter("ch" + String(chapterNumber).padStart(2, "0"));
  for (const question of source.questions ?? []) {
    questionCount++;
    for (const field of ["keyExplanation", "concise", "detailed"]) {
      const explanation = question[field] ?? "";
      for (const pattern of explicitKeyPatterns) {
        pattern.lastIndex = 0;
        for (const match of explanation.matchAll(pattern)) {
          explicitKeyCount++;
          assert.equal(
            match[1],
            question.answer,
            "MT202 " + question.n + " (" + field + "): explanation names option " + match[1] + " but answer key is " + question.answer,
          );
        }
      }
    }
  }
}

assert.equal(questionCount, 522, "Expected to scan all 522 MT202 questions.");
console.log(
  "MT202 explanation-alignment regression passed (" +
    expected.length +
    " targeted questions; " +
    explicitKeyCount +
    " explicit answer references across " +
    questionCount +
    " questions).",
);
