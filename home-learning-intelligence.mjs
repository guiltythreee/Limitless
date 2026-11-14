import { buildCrossDisciplineOverview } from "./shared/studies/overview.mjs";

const STORAGE = {
  competition: "limitless.competition.regional-qualification.v1",
  mathAttempts: "limitless.math.v1.attempts",
  mathRuns: "limitless.math.v1.runs",
  probability: "hc3-progress-v3",
  mt201: "mm-mt201-v1",
  mt202: "mm-mt202-v1",
  mt203: "mm-mt203-v1",
  classifications: "limitless.study.mistake-classifications.v1",
};

function readStored(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function statusLabel(status) {
  if (status === "insufficient-data") return "Building baseline";
  if (status === "developing") return "Developing";
  if (status === "secure") return "Secure";
  return "Mastered";
}

function render(report, host) {
  if (!report.totalAttempts) {
    host.innerHTML = '<p class="learning-intel-empty">No dated practice attempts have been recorded yet. Start practising in any module and your existing progress will appear here automatically.</p>';
    return;
  }

  const cards = report.sections.map((section) => (
    '<article class="learning-intel-card">' +
      '<span class="learning-intel-label">' + escapeHtml(section.label) + '</span>' +
      '<strong class="learning-intel-count">' + section.attempts.toLocaleString() + '</strong>' +
      '<span class="learning-intel-caption">recorded attempts</span>' +
      '<small>' + section.concepts + ' tracked concepts · ' + section.secure + ' secure</small>' +
    '</article>'
  )).join("");

  const focus = report.focus.slice(0, 5).map((item) => {
    const section = report.sections.find((entry) => entry.id === item.disciplineId);
    const detail = item.status === "insufficient-data" ? "More evidence needed" : statusLabel(item.status);
    return '<div class="learning-intel-row"><strong>' + escapeHtml((section?.label || item.disciplineId) + " · " + item.label) +
      '</strong><span>' + detail + ' · ' + item.attempts + ' attempts · ' +
      Math.round(item.accuracy * 100) + '%</span></div>';
  }).join("");

  const mistakes = report.recurringMistakes.slice(0, 4).map((item) => {
    const section = report.sections.find((entry) => entry.id === item.disciplineId);
    return '<div class="learning-intel-row"><strong>' +
      escapeHtml((section?.label || item.disciplineId) + " · " + item.conceptLabel) +
      '</strong><span>' + escapeHtml(item.category) + ' · ' + item.occurrences + ' repeats</span></div>';
  }).join("");

  host.innerHTML =
    '<div class="learning-intel-totals"><div><strong>' + report.totalAttempts.toLocaleString() +
    '</strong><span>dated attempts</span></div><div><strong>' + report.trackedConcepts.toLocaleString() +
    '</strong><span>tracked concepts</span></div></div>' +
    '<div class="learning-intel-grid">' + cards + '</div>' +
    '<div class="learning-intel-details">' +
      '<div><h3>Suggested focus</h3>' +
        (focus || '<p class="learning-intel-empty">No developing concepts yet. Keep practising to build more evidence.</p>') +
      '</div>' +
      '<div><h3>Recurring mistakes</h3>' +
        (mistakes || '<p class="learning-intel-empty">Mistake patterns will appear as attempts are classified in their own modules.</p>') +
      '</div>' +
    '</div>' +
    '<p class="learning-intel-note">Read-only overview. Each module keeps its own saved progress, grading and revision rules.</p>';
}

/** Render a read-only overview from existing same-origin progress stores. */
export function renderLearningIntelligence() {
  const host = document.getElementById("learning-intelligence-content");
  if (!host) return;
  const snapshot = {
    competition: readStored(STORAGE.competition, {}),
    mathAttempts: readStored(STORAGE.mathAttempts, []),
    mathRuns: readStored(STORAGE.mathRuns, []),
    probability: readStored(STORAGE.probability, {}),
    metallurgy: {
      mt201: readStored(STORAGE.mt201, {}),
      mt202: readStored(STORAGE.mt202, {}),
      mt203: readStored(STORAGE.mt203, {}),
    },
    classifications: readStored(STORAGE.classifications, {}),
  };
  try {
    render(buildCrossDisciplineOverview(snapshot), host);
  } catch {
    host.innerHTML = '<p class="learning-intel-empty">The learning overview is temporarily unavailable. Your individual modules and saved progress are unaffected.</p>';
  }
}
