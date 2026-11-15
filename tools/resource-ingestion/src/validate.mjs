import { TOPIC_IDS } from "./schema.mjs";
const normalize = (value) => String(value ?? "").normalize("NFKC").replace(/\s+/g, " ").trim().toLowerCase();
const validConfidence = (value) => Number.isFinite(value) && value >= 0 && value <= 1;

export function validateAnalysis(analysis, extractedPages) {
  const errors = [], warnings = [];
  const pages = new Set(extractedPages.map((p) => p.page));
  const textByPage = new Map(extractedPages.map((p) => [p.page, normalize(p.text)]));
  const topic = (id, where) => { if (!TOPIC_IDS.has(id)) errors.push(where + ': unknown MT203 topic "' + id + '"'); };
  const confidence = (value, where) => {
    if (!validConfidence(value)) errors.push(where + ": confidence must be between 0 and 1");
    else if (value < 0.9) warnings.push(where + ": confidence below 0.90; keep in targeted review");
  };
  const page = (value, where) => { if (!Number.isInteger(value) || !pages.has(value)) errors.push(where + ": source page " + value + " is not in the extracted PDF"); };
  if (!analysis || typeof analysis !== "object") return { errors: ["Analysis must be an object"], warnings };
  for (const field of ["coverage","theory_updates","illustrations","worked_examples","source_questions","review_items"]) {
    if (!Array.isArray(analysis[field])) errors.push("Missing or invalid array: " + field);
  }
  if (errors.length) return { errors, warnings };

  analysis.coverage.forEach((item, i) => {
    const where = "coverage[" + i + "]";
    if (item.topic_id !== "unmapped") topic(item.topic_id, where);
    if (!Array.isArray(item.source_pages) || !item.source_pages.length) errors.push(where + ": source page references are required");
    else item.source_pages.forEach((p) => page(p, where));
    confidence(item.confidence, where);
  });
  analysis.theory_updates.forEach((item, i) => {
    const where = "theory_updates[" + i + "]";
    topic(item.topic_id, where);
    if (!item.proposed_markdown.trim()) errors.push(where + ": proposed content is empty");
    if (!item.source_pages.length) errors.push(where + ": source page references are required");
    item.source_pages.forEach((p) => page(p, where));
    confidence(item.confidence, where);
    if (item.status === "ready" && item.confidence < 0.9) warnings.push(where + ": confidence is below the ready threshold");
  });
  analysis.illustrations.forEach((item, i) => {
    const where = "illustrations[" + i + "]";
    topic(item.topic_id, where); page(item.source_page, where); confidence(item.confidence, where);
  });
  analysis.worked_examples.forEach((item, i) => {
    const where = "worked_examples[" + i + "]";
    topic(item.topic_id, where); page(item.source_page, where); confidence(item.confidence, where);
    if (!item.problem.trim() || !item.solution.trim()) errors.push(where + ": problem and worked solution are required");
    if (!item.units.trim()) warnings.push(where + ": explicitly state units or 'not applicable'");
  });
  analysis.source_questions.forEach((item, i) => {
    const where = "source_questions[" + i + "]";
    topic(item.topic_id, where); page(item.source_page, where); confidence(item.confidence, where);
    if (!item.source_question_text.trim()) errors.push(where + ": question text is empty");
    const pageText = textByPage.get(item.source_page) ?? "";
    const quote = normalize(item.evidence_quote);
    const quoteMatches = Boolean(quote && pageText.includes(quote));
    if (!quoteMatches) {
      warnings.push(where + ": evidence quote not found in extracted page text; visually verify scanned/image questions");
      item.status = "review";
    }
    if (!item.answer.trim()) { warnings.push(where + ": source does not provide a clear answer key"); item.status = "review"; }
    if (item.status === "ready" && (item.confidence < 0.9 || !quoteMatches)) item.status = "review";
    if (item.options.length && item.options.length < 2) { warnings.push(where + ": incomplete option set"); item.status = "review"; }
    if (item.difficulty < 1 || item.difficulty > 4) { warnings.push(where + ": difficulty does not map to MT203's 1–4 scale"); item.status = "review"; }
  });
  return { errors, warnings };
}
