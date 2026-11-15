import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const dataRoot = fileURLToPath(new URL("../public/data/mt200/", import.meta.url));
const papers = [
  { id: "i", expected: 22 },
  { id: "ii", expected: 22 },
  { id: "iii", expected: 22 },
  { id: "iv", expected: 21 },
];

function questionIds(source) {
  const matches = [...source.matchAll(/^\s*([A-D]\d{1,2})\.\s*/gm)];
  return matches.map((match, index) => {
    const start = match.index ?? 0;
    const end = index + 1 < matches.length ? (matches[index + 1].index ?? source.length) : source.length;
    return { id: match[1], text: source.slice(start, end).trim() };
  }).filter((question) => question.text.length > 12).map((question) => question.id);
}

function hasSolution(source, id) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp("^\\s*" + escaped + "(?:\\s|[.)])", "m").test(source);
}

let total = 0;
for (const paper of papers) {
  const questions = readFileSync(`${dataRoot}papers/paper-${paper.id}.md`, "utf8");
  const solutions = readFileSync(`${dataRoot}solutions/paper-${paper.id}.md`, "utf8");
  const ids = questionIds(questions);

  assert.equal(ids.length, paper.expected, `Paper ${paper.id.toUpperCase()} question count changed`);
  assert.equal(new Set(ids).size, ids.length, `Paper ${paper.id.toUpperCase()} contains duplicate question IDs`);

  const missing = ids.filter((id) => !hasSolution(solutions, id));
  assert.deepEqual(missing, [], `Paper ${paper.id.toUpperCase()} is missing model solutions`);
  total += ids.length;
}

assert.equal(total, 87, "MT200 total parsed question count changed");
console.log(`MT200 practice parser and solution coverage passed (${total} questions across 4 papers).`);
