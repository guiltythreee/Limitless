// "Where this campaign fits": a read-only summary of the quant track from the Progression Map.
// Everything is computed by the shared roadmap evaluator; this file only draws it.
// If anything fails the card stays hidden: the Competition page must never depend on the map.
import { evaluateForStorage, definitionErrors } from "../roadmap/summary.mjs";
import { STAGE_STATE } from "../roadmap/engine.mjs";

const TRACK_ID = "quant";
const host = document.getElementById("roadmap-card");

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
const fmt = (key) => new Date(`${key}T00:00:00`).toLocaleDateString(undefined, { day: "numeric", month: "short" });

function draw() {
  if (!host) return;
  try {
    if (definitionErrors().length) { host.hidden = true; return; }
    const track = evaluateForStorage(window.localStorage).tracks.find((t) => t.track.id === TRACK_ID);
    if (!track) { host.hidden = true; return; }

    const percent = Math.round(track.progress * 100);
    const stage = track.stages.find((s) => s.state !== STAGE_STATE.DONE) ?? null;
    const next = track.next[0] ?? null;

    host.replaceChildren();
    host.append(el("div", "card-label", "PROGRESSION MAP · QUANT INTERNSHIP"));

    const metric = el("div", "metric-line");
    metric.append(el("strong", "", `${percent}%`), el("span", "", `${track.doneCount} of ${track.total} checkpoints done`));
    host.append(metric);

    const bar = el("div", "progress-track");
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-label", "Quant internship track progress");
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "100");
    bar.setAttribute("aria-valuenow", String(percent));
    const fill = el("span");
    fill.style.width = `${percent}%`;
    bar.append(fill);
    host.append(bar);

    if (stage?.stage.targetDate) {
      const overdue = stage.state === STAGE_STATE.OVERDUE;
      const when = overdue ? `was due ${fmt(stage.stage.targetDate)}` : `due ${fmt(stage.stage.targetDate)}`;
      host.append(el("p", overdue ? "roadmap-card-warn" : "", `Current stage: ${stage.stage.title}, ${when}.`));
    }
    if (next) host.append(el("p", "", `Next step: ${next.node.title}. ${next.reason}.`));
    else if (track.doneCount === track.total) host.append(el("p", "", "Every checkpoint on this track is done."));

    const link = el("a", "roadmap-card-link", "Open the Progression Map →");
    link.href = "../roadmap/#quant";
    host.append(link);
    host.hidden = false;
  } catch {
    host.hidden = true;
  }
}

draw();
// Same-tab saves announce themselves; other tabs fire 'storage'. Linked data can also change while the tab is hidden.
window.addEventListener("limitless:competition-updated", draw);
window.addEventListener("storage", draw);
document.addEventListener("visibilitychange", () => { if (!document.hidden) draw(); });
