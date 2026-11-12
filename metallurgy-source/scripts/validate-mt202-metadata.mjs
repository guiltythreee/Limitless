import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "public", "data", "mt202");
const metadataDir = path.join(root, "content-metadata", "mt202");
const registry = JSON.parse(fs.readFileSync(path.join(metadataDir, "question-metadata.v1.json"), "utf8"));
const catalogue = JSON.parse(fs.readFileSync(path.join(metadataDir, "topics.v1.json"), "utf8"));

const topicIds = new Set(catalogue.chapters.flatMap(chapter => chapter.topics.map(topic => topic[0])));
const objectiveIds = new Set((catalogue.learningObjectives ?? []).map(objective => objective.id));
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
    if (!Array.isArray(record.learningObjectiveIds) || record.learningObjectiveIds.length === 0) {
      errors.push(`${questionId}: at least one learning objective is required`);
    } else if (record.learningObjectiveIds.some(id => !objectiveIds.has(id))) {
      errors.push(`${questionId}: unknown learning objective`);
    }
    const sourceType = questions[index]?.type ?? null;
    if (record.questionType !== sourceType) {
      errors.push(`${questionId}: questionType does not match source type (${record.questionType} vs ${sourceType})`);
    }
    if (record.curriculumTopicId && !topicIds.has(record.curriculumTopicId)) {
      errors.push(`${questionId}: unknown primary topic ${record.curriculumTopicId}`);
    }
    for (const relatedId of record.relatedTopicIds ?? []) {
      if (!topicIds.has(relatedId)) errors.push(`${questionId}: unknown related topic ${relatedId}`);
    }
    if (![1, 2, 3, 4, 5].includes(record.assessedDifficulty)) {
      errors.push(`${questionId}: assessedDifficulty must be an integer from 1 to 5`);
    }
    if (!Array.isArray(record.reasoningSkills) || record.reasoningSkills.length === 0) {
      errors.push(`${questionId}: at least one reasoning skill is required`);
    }
    const allowedSkills = ["recall", "distinguish", "classify", "apply", "calculate", "interpret", "analyse", "synthesise"];
    if ((record.reasoningSkills ?? []).some(skill => !allowedSkills.includes(skill))) {
      errors.push(`${questionId}: unknown reasoning skill`);
    }
    if (!Array.isArray(record.misconceptionTags) || record.misconceptionTags.length === 0) {
      errors.push(`${questionId}: at least one misconception tag is required`);
    }
    if (record.questionType === null || !["A", "B", "C", "D", "E", "F", "G"].includes(record.questionType)) {
      errors.push(`${questionId}: invalid questionType`);
    }

    const qualityFields = { conceptualAccuracy: 20, distractorPlausibility: 20, reasoning: 15, noGiveaways: 15, clarity: 15, explanation: 10, syllabusRelevance: 5 };
    if (!record.quality || Object.entries(qualityFields).some(([field, max]) => !Number.isInteger(record.quality[field]) || record.quality[field] < 0 || record.quality[field] > max)) {
      errors.push(`${questionId}: quality dimensions must be integer scores within rubric limits`);
    } else {
      const total = Object.keys(qualityFields).reduce((sum, field) => sum + record.quality[field], 0);
      if (record.quality.total !== total) errors.push(`${questionId}: quality total does not equal dimension sum`);
      if (!["approved", "review", "rejected"].includes(record.status)) errors.push(`${questionId}: invalid post-review status`);
      if (record.status === "approved" && total < 80) errors.push(`${questionId}: approved status requires a score of at least 80`);
      if (total < 70 && record.status !== "rejected") errors.push(`${questionId}: scores below 70 must be rejected`);
      if (record.status !== "approved" && (typeof record.reviewNotes !== "string" || !record.reviewNotes.trim())) errors.push(`${questionId}: non-approved records require reviewNotes`);
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
