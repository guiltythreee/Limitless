import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "public", "data", "mt202");
const metadataDir = path.join(root, "content-metadata", "mt202");
const registry = JSON.parse(fs.readFileSync(path.join(metadataDir, "question-metadata.v1.json"), "utf8"));
const catalogue = JSON.parse(fs.readFileSync(path.join(metadataDir, "topics.v1.json"), "utf8"));

const topicIds = new Set(catalogue.chapters.flatMap(chapter => chapter.topics.map(topic => topic[0])));
const seen = new Set();
const errors = [];

for (const chapter of catalogue.chapters) {
  const sourcePath = path.join(dataDir, `${chapter.chapterId}.json`);
  const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  const questions = Array.isArray(source) ? source : source.questions ?? source.items ?? [];
  const records = registry.questions.filter(record => record.chapterId === chapter.chapterId);

  if (records.length !== questions.length) {
    errors.push(`${chapter.chapterId}: metadata count ${records.length}, source count ${questions.length}`);
  }

  for (let index = 0; index < questions.length; index++) {
    const questionId = `${chapter.chapterId}-q${index + 1}`;
    const record = registry.questions.find(item => item.questionId === questionId);
    if (!record) {
      errors.push(`Missing metadata record: ${questionId}`);
      continue;
    }
    if (seen.has(questionId)) errors.push(`Duplicate metadata ID: ${questionId}`);
    seen.add(questionId);
    if (record.curriculumTopicId && !topicIds.has(record.curriculumTopicId)) {
      errors.push(`${questionId}: unknown primary topic ${record.curriculumTopicId}`);
    }
    for (const relatedId of record.relatedTopicIds ?? []) {
      if (!topicIds.has(relatedId)) errors.push(`${questionId}: unknown related topic ${relatedId}`);
    }
    if (record.assessedDifficulty !== null && ![1, 2, 3, 4, 5].includes(record.assessedDifficulty)) {
      errors.push(`${questionId}: assessedDifficulty must be 1–5 or null`);
    }
    if (record.questionType !== null && !["A", "B", "C", "D", "E", "F", "G"].includes(record.questionType)) {
      errors.push(`${questionId}: invalid questionType`);
    }
  }
}

if (registry.questions.length !== 522) errors.push(`Expected 522 registry records, found ${registry.questions.length}`);
if (seen.size !== registry.questions.length) errors.push(`Unique source IDs ${seen.size} do not match registry size ${registry.questions.length}`);

if (errors.length) {
  console.error("MT202 metadata validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`MT202 metadata validation passed: ${seen.size} questions across ${catalogue.chapters.length} chapters.`);
