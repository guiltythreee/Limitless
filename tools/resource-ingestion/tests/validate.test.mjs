import test from "node:test";
import assert from "node:assert/strict";
import { validateAnalysis } from "../src/validate.mjs";

const fixture = () => ({
  summary: "New material on polymer processing.",
  coverage: [{ source_heading: "Extrusion", source_pages: [1], topic_id: "t11", subtopic: "Processing", disposition: "expansion", rationale: "Existing topic", confidence: 0.96 }],
  theory_updates: [{ topic_id: "t11", heading: "Extrusion", proposed_markdown: "Extrusion forces melt through a die.", source_pages: [1], relation: "expansion", confidence: 0.95, status: "ready" }],
  illustrations: [{ topic_id: "t11", kind: "diagram", source_page: 1, description: "Screw extruder", caption: "Extruder", action: "add", confidence: 0.94 }],
  worked_examples: [{ topic_id: "t11", title: "Throughput", source_page: 1, problem: "Calculate throughput.", solution: "Use the stated relation.", final_answer: "5", units: "kg/h", confidence: 0.93, status: "ready" }],
  source_questions: [{ topic_id: "t11", subtopic: "Processing", source_page: 1, source_question_text: "What is extrusion?", evidence_quote: "What is extrusion?", type: "recall", difficulty: 1, options: ["A", "B"], assertion: "", reason: "", statements: [], table_rows: [], answer: "A", explanation: "Source explanation.", distractor_explanations: [], concept: "Extrusion", tags: [], confidence: 0.95, status: "ready" }],
  review_items: []
});
const pages = [{ page: 1, text: "Extrusion. What is extrusion? The process forces melt through a die." }];

test("accepts a well-sourced MT203 analysis", () => {
  const result = validateAnalysis(fixture(), pages);
  assert.deepEqual(result.errors, []);
});
test("rejects unknown topics and pages", () => {
  const value = fixture();
  value.theory_updates[0].topic_id = "t99";
  value.illustrations[0].source_page = 8;
  const result = validateAnalysis(value, pages);
  assert.ok(result.errors.some((x) => x.includes("unknown MT203 topic")));
  assert.ok(result.errors.some((x) => x.includes("not in the extracted PDF")));
});
test("routes source questions with unverified evidence to review", () => {
  const value = fixture();
  value.source_questions[0].evidence_quote = "This sentence is not in the PDF";
  const result = validateAnalysis(value, pages);
  assert.equal(value.source_questions[0].status, "review");
  assert.ok(result.warnings.some((x) => x.includes("evidence quote not found")));
});
test("warns on low confidence", () => {
  const value = fixture();
  value.theory_updates[0].confidence = 0.72;
  const result = validateAnalysis(value, pages);
  assert.ok(result.warnings.some((x) => x.includes("below 0.90")));
  assert.equal(value.theory_updates[0].status, "review");
});
