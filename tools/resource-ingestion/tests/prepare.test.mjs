import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { prepareMt203Patch } from "../src/prepare.mjs";

async function fixture() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "limitless-ingest-"));
  const dir = path.join(root, "app/data/qbank");
  await fs.mkdir(dir, { recursive: true });
  for (let i = 1; i <= 11; i++) {
    const id = "t" + i;
    const count = i === 1 ? 1 : 0;
    const existing = i === 1 ? `, { id: "t1-01", type: "recall", diff: 1, text: "Existing item", options: [], answer: "a", why: "Because", sub: "T1.1" }` : "";
    await fs.writeFile(path.join(dir, id + ".ts"),
      `const T: any = { id: "${id}", module: "m1", title: "Topic", subtitle: "", subs: [{ id: "T${i}.1", title: "Basics" }], questions: [${existing}] }; export default T;\n`);
  }
  await fs.writeFile(path.join(root, "app/data/lessons-mt203.ts"), `export const LESSONS = { t1: { sections: [{ h: "Polymer basics", p: "Existing theory" }] }, t2: { sections: [] }, t3: { sections: [] }, t4: { sections: [] }, t5: { sections: [] }, t6: { sections: [] }, t7: { sections: [] }, t8: { sections: [] }, t9: { sections: [] }, t10: { sections: [] }, t11: { sections: [] } };
`);
  await fs.writeFile(path.join(dir, "meta.ts"), `export const M = [ { id: "t1", count: 1 }, ${Array.from({length:10},(_,i)=>`{ id: "t${i+2}", count: 0 }`).join(", ")} ];\n`);
  return root;
}
const artifact = (overrides = {}) => ({
  source: { filename: "source.pdf", sha256: "source-hash" },
  course: { id: "mt203" },
  analysis: { theory_updates: [], worked_examples: [], illustrations: [], source_questions: [{
    topic_id: "t1", subtopic: "T1.1", source_page: 4, source_question_text: "What is a new polymer?", evidence_quote: "What is a new polymer?",
    type: "recall", difficulty: 1, options: ["A correct option", "Distractor B", "Distractor C", "Distractor D"], assertion: "", reason: "", statements: [], table_rows: [],
    answer: "a", explanation: "The source says this is correct.", distractor_explanations: [], concept: "Polymer definition", tags: [],
    confidence: 0.98, status: "ready", ...overrides
  }] }
});

test("creates native MT203 question proposals without editing course files", async () => {
  const root = await fixture();
  try {
    const plan = await prepareMt203Patch({ artifact: artifact(), courseRoot: root });
    assert.equal(plan.mode, "proposal-only");
    assert.equal(plan.proposals.length, 1);
    assert.equal(plan.proposals[0].proposed_id, "t1-02");
    assert.equal(plan.proposals[0].question.diff, 1);
    assert.equal(plan.proposals[0].question.options[0].label, "a");
    assert.equal(plan.proposals[0].question.sub, "T1.1");
    assert.equal(plan.blocked.length, 0);
    const original = await fs.readFile(path.join(root,"app/data/qbank/t1.ts"),"utf8");
    assert.ok(!original.includes("What is a new polymer?"));
  } finally { await fs.rm(root,{recursive:true,force:true}); }
});

test("blocks exact duplicate stems and unreviewed source questions", async () => {
  const root = await fixture();
  try {
    const duplicate = artifact({ source_question_text: "Existing item" });
    const plan = await prepareMt203Patch({ artifact: duplicate, courseRoot: root });
    assert.equal(plan.proposals.length, 0);
    assert.match(plan.blocked[0].reason, /duplicate/);
    const review = artifact({ status: "review" });
    const reviewPlan = await prepareMt203Patch({ artifact: review, courseRoot: root });
    assert.equal(reviewPlan.proposals.length, 0);
    assert.match(reviewPlan.blocked[0].reason, /review/);
  } finally { await fs.rm(root,{recursive:true,force:true}); }
});

test("prepares theory and worked-example proposals without rewriting lesson source", async () => {
  const root = await fixture();
  try {
    const value = artifact();
    value.analysis.theory_updates.push({ topic_id: "t1", heading: "Polymer basics", proposed_markdown: "A polymer contains repeat units.", source_pages: [2], relation: "expansion", confidence: 0.97, status: "ready" });
    value.analysis.worked_examples.push({ topic_id: "t1", title: "Degree of polymerization", source_page: 3, problem: "Given values.", solution: "Substitute.", final_answer: "10", units: "dimensionless", confidence: 0.96, status: "ready" });
    const plan = await prepareMt203Patch({ artifact: value, courseRoot: root });
    assert.equal(plan.theory_proposals[0].placement, "expand-existing-section");
    assert.equal(plan.theory_proposals[0].status, "proposal");
    assert.equal(plan.worked_example_proposals[0].status, "proposal");
    const original = await fs.readFile(path.join(root,"app/data/lessons-mt203.ts"),"utf8");
    assert.ok(!original.includes("A polymer contains repeat units."));
  } finally { await fs.rm(root,{recursive:true,force:true}); }
});

test("blocks records that do not map to a real MT203 subtopic", async () => {
  const root = await fixture();
  try {
    const plan = await prepareMt203Patch({ artifact: artifact({ subtopic: "T1.99" }), courseRoot: root });
    assert.equal(plan.proposals.length, 0);
    assert.match(plan.blocked[0].reason, /subtopic/);
  } finally { await fs.rm(root,{recursive:true,force:true}); }
});
