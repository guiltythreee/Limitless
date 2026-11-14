// scripts/quality/ledger.mjs
//
// The scientific-accuracy gate. A script cannot certify that a polymer-science
// claim is true, so the layer records *who* verified each question and *what
// they verified*, and refuses to trust a review once the question has changed.
//
// scripts/quality/review-ledger-mt203.json:
//   { "schema": 1, "entries": { "t1-07": {
//       "fingerprint": "<hash of the reviewed content>",
//       "status":  "verified" | "needs-edit" | "rejected",
//       "level":   "expert"   | "assisted",      // expert = subject expert / lecturer; assisted = AI-assisted, student-confirmed
//       "reviewer": "name", "date": "YYYY-MM-DD", "note": "optional" } } }

import { readFileSync, existsSync } from "node:fs";
import { finding, fingerprint } from "./lib.mjs";

export const LEDGER_STATUSES = new Set(["verified", "needs-edit", "rejected"]);
export const LEDGER_LEVELS = new Set(["expert", "assisted"]);

export function loadLedger(path) {
  if (!existsSync(path)) return { schema: 1, entries: {} };
  const parsed = JSON.parse(readFileSync(path, "utf8"));
  return { schema: parsed.schema ?? 1, entries: parsed.entries ?? {} };
}

/** Validate the ledger against the live bank and compute coverage. */
export function checkLedger(questions, ledger) {
  const findings = [];
  const byId = new Map(questions.map((q) => [q.id, q]));
  const stats = { total: questions.length, verified: 0, expert: 0, assisted: 0, stale: 0, open: 0, unreviewed: 0 };

  for (const [id, e] of Object.entries(ledger.entries)) {
    const q = byId.get(id);
    if (!q) {
      findings.push({ id, topic: id.split("-")[0], dim: "review", rule: "review-unknown-question", sev: "error", msg: "ledger entry refers to a question that no longer exists" });
      continue;
    }
    if (!LEDGER_STATUSES.has(e.status) || !e.reviewer || !e.date)
      findings.push(finding(q, "review", "review-entry-invalid", "error", "ledger entry needs a valid status, reviewer and date"));
    if (e.status === "verified" && !LEDGER_LEVELS.has(e.level))
      findings.push(finding(q, "review", "review-entry-invalid", "error", 'verified entries must declare level "expert" or "assisted"'));
    if (e.fingerprint !== fingerprint(q)) {
      stats.stale++;
      findings.push(finding(q, "review", "review-stale", "error", "question changed after it was reviewed — the review no longer applies"));
      continue;
    }
    if (e.status === "verified") {
      stats.verified++;
      if (e.level === "expert") stats.expert++;
      else stats.assisted++;
    } else {
      stats.open++;
      findings.push(finding(q, "review", "review-open-defect", "error", `reviewer marked this "${e.status}"${e.note ? `: ${e.note}` : ""}`));
    }
  }
  stats.unreviewed = stats.total - stats.verified - stats.open - stats.stale;
  return { findings, stats };
}
