export function renderReviewReport({ sourceName, sourceSha256, pageCount, analysis, validation }) {
  const lines = [
    "# Resource ingestion review", "",
    "- **Source:** " + sourceName,
    "- **SHA-256:** " + sourceSha256,
    "- **Pages:** " + pageCount,
    "- **Generated:** " + new Date().toISOString(), "",
    "> This is a proposal, not a course-bank update. No existing Limitless source files are modified.", "",
    "## Summary", "", analysis.summary, "",
    "## Proposed changes", "",
    "- Theory proposals: " + analysis.theory_updates.length,
    "- Illustrations: " + analysis.illustrations.length,
    "- Worked examples: " + analysis.worked_examples.length,
    "- Questions extracted from source: " + analysis.source_questions.length,
    "- Review warnings: " + validation.warnings.length,
    "- Model review items: " + analysis.review_items.length, "",
    "## Coverage map", "",
    "| Source heading | Pages | MT203 topic | Disposition | Confidence |",
    "|---|---:|---|---|---:|",
    ...analysis.coverage.map((x) => "|" + cell(x.source_heading) + "|" + x.source_pages.join(", ") + "|" + cell(x.topic_id + (x.subtopic ? " / " + x.subtopic : "")) + "|" + x.disposition + "|" + Math.round(x.confidence * 100) + "%|"),
    "", "## Theory proposals", "",
    ...analysis.theory_updates.map((x) => "### " + x.topic_id + ": " + x.heading + "\n\n- Relation: " + x.relation + "\n- Pages: " + x.source_pages.join(", ") + "\n- Confidence: " + Math.round(x.confidence * 100) + "%\n- Status: " + x.status + "\n\n" + x.proposed_markdown + "\n"),
    "## Illustrations", "",
    ...analysis.illustrations.map((x) => "- **" + x.topic_id + ", page " + x.source_page + " (" + x.kind + "; " + x.action + "):** " + x.description + " " + x.caption),
    "", "## Worked examples", "",
    ...analysis.worked_examples.map((x) => "### " + x.topic_id + ": " + x.title + " (page " + x.source_page + ")\n\n**Problem:** " + x.problem + "\n\n**Solution:** " + x.solution + "\n\n**Answer:** " + x.final_answer + " " + x.units + "\n\nStatus: " + x.status + "; confidence: " + Math.round(x.confidence * 100) + "%\n"),
    "## Source questions (extraction only)", "",
    ...analysis.source_questions.map((x) => "- **" + x.topic_id + ", page " + x.source_page + " [" + x.type + "]** — " + x.source_question_text + "\n  - Answer in source: " + (x.answer || "not stated") + "\n  - Status: " + x.status + "; confidence: " + Math.round(x.confidence * 100) + "%\n  - Evidence: " + x.evidence_quote),
    "", "## Review queue", "",
    ...analysis.review_items.map((x) => "- **" + x.severity.toUpperCase() + " — " + x.source_reference + ":** " + x.issue + "\n  - Recommended action: " + x.recommended_action),
    ...validation.warnings.map((x) => "- **VALIDATION:** " + x),
    "", "## Validation errors", "",
    ...(validation.errors.length ? validation.errors.map((x) => "- " + x) : ["None"]),
    "", "## Next step", "",
    "Review only flagged items, then prepare a separate course-native patch. Do not copy proposals into the live bank directly.", ""
  ];
  return lines.join("\n");
}
function cell(value) { return String(value ?? "").replaceAll("|", "\\|").replace(/\s+/g, " ").trim(); }
