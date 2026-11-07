// Progression Map page. All decisions live in engine.mjs / evidence.mjs; this file only draws them.
import { ROADMAP } from "./data.mjs";
import { ROADMAP_CATALOG } from "./catalog.generated.mjs";
import { STAGE_STATE, STATUS, daysBetween, evaluateRoadmap, localDateKey, validateRoadmap } from "./engine.mjs";
import { EVIDENCE_KINDS, createEvidenceReader } from "./evidence.mjs";
import { readManual, setManualState, setManualValue } from "./manual.mjs";
import { readGlobalRewardSummary } from "../shared/rewards.mjs";

const byId = (id) => document.getElementById(id);
const SVG_NS = "http://www.w3.org/2000/svg";
const STATUS_LABEL = { done: "Done", active: "In progress", ready: "Ready", locked: "Locked" };
const STAGE_LABEL = { done: "Done", overdue: "Overdue", active: "In progress", upcoming: "Upcoming" };
const reduceMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const isNarrow = () => window.matchMedia?.("(max-width: 760px)").matches;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function svgEl(tag, attrs = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  return node;
}

function getStorage() {
  try { return window.localStorage ?? null; } catch { return null; }
}
function fmtDate(key) {
  return new Date(`${key}T00:00:00`).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
const pctText = (fraction) => `${Math.round(fraction * 100)}%`;

function deadlineText(stage) {
  if (stage.stage.targetDate == null) return "No deadline set";
  const date = fmtDate(stage.stage.targetDate);
  if (stage.daysLeft > 0) return `By ${date} · ${plural(stage.daysLeft, "day")} left`;
  if (stage.daysLeft === 0) return `Due today · ${date}`;
  return `Was due ${date} · ${plural(-stage.daysLeft, "day")} ago`;
}

// ---------------------------------------------------------------- state
let activeTrackId = ROADMAP.tracks[0].id;
let selectedId = null;
let result = null;
let manual = {};

function compute() {
  const storage = getStorage();
  let level = null;
  try { level = readGlobalRewardSummary(storage).level.level; } catch { /* leave null: the level node reads as unknown */ }
  manual = storage ? readManual(storage) : {};
  const reader = createEvidenceReader({ storage, catalog: ROADMAP_CATALOG, readLevel: () => level });
  result = evaluateRoadmap(ROADMAP, reader, localDateKey());
}

function setStatus(message) { byId("rm-status").textContent = message; }

function saveManual(action, failureMessage) {
  const outcome = action();
  if (!outcome.ok) {
    setStatus(outcome.error === "storage-unavailable"
      ? "This browser would not let the page save. Your change was not stored."
      : failureMessage);
    return false;
  }
  setStatus("");
  render();
  return true;
}

// ---------------------------------------------------------------- track cards
function renderTracks() {
  const host = byId("rm-tracks");
  host.replaceChildren();
  for (const track of result.tracks) {
    const card = el("button", "rm-track-card");
    card.type = "button";
    card.dataset.focusKey = `track:${track.track.id}`;
    card.setAttribute("aria-pressed", String(track.track.id === activeTrackId));

    const top = el("div", "rm-track-top");
    top.append(el("span", "rm-track-name", `${track.track.symbol ?? ""} ${track.track.title}`.trim()), el("span", "rm-track-pct", pctText(track.progress)));
    const bar = el("div", "rm-bar");
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-label", `${track.track.title} overall progress`);
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "100");
    bar.setAttribute("aria-valuenow", String(Math.round(track.progress * 100)));
    const fill = el("span");
    fill.style.width = pctText(track.progress);
    bar.append(fill);

    const facts = el("div", "rm-track-facts");
    facts.append(el("span", "", `${track.doneCount} of ${track.total} checkpoints done`));
    if (track.behind.length) facts.append(el("span", "rm-warn", `${plural(track.behind.length, "checkpoint")} past deadline`));
    const upcoming = track.stages.find((s) => s.state !== STAGE_STATE.DONE && s.daysLeft !== null && s.daysLeft >= 0);
    if (upcoming) facts.append(el("span", "", `Next deadline: ${upcoming.stage.title}, ${upcoming.daysLeft === 0 ? "today" : `in ${plural(upcoming.daysLeft, "day")}`}`));

    card.append(top, el("p", "rm-track-goal", track.track.goal), bar, facts);
    card.addEventListener("click", () => setTrack(track.track.id));
    host.append(card);
  }
}

// ---------------------------------------------------------------- do this next
function renderNext() {
  const host = byId("rm-next");
  host.replaceChildren();
  for (const track of result.tracks) {
    const column = el("div", "rm-next-col");
    column.append(el("h3", "", track.track.title));
    const list = el("ul", "rm-next-list");
    const items = track.next.slice(0, 3);
    if (!items.length) {
      column.append(el("p", "rm-empty", track.doneCount === track.total ? "Every checkpoint on this track is done." : "Nothing is ready yet. Finish a prerequisite first."));
    } else {
      for (const item of items) {
        const row = el("li", "rm-next-item");
        row.append(el("span", "rm-next-title", item.node.title), el("span", "rm-next-reason", `${item.reason} · ${item.detail}`));
        const actions = el("div", "rm-next-actions");
        const show = el("button", "rm-chip-btn", "Show on map");
        show.type = "button";
        show.dataset.focusKey = `next:${item.node.id}`;
        show.addEventListener("click", () => focusNode(item.node.id));
        actions.append(show);
        if (item.node.href) {
          const open = el("a", "rm-open", "Open module");
          open.href = item.node.href;
          actions.append(open);
        }
        row.append(actions);
        list.append(row);
      }
      column.append(list);
    }
    host.append(column);
  }
}

// ---------------------------------------------------------------- timeline
function renderTimeline(trackResult) {
  const host = byId("rm-timeline");
  host.replaceChildren();
  const { startDate } = trackResult.track;
  const dated = trackResult.stages.filter((s) => s.stage.targetDate);
  if (!startDate || dated.length < 2) { host.hidden = true; return; }
  const end = dated.reduce((latest, s) => (s.stage.targetDate > latest ? s.stage.targetDate : latest), startDate);
  const total = Math.max(1, daysBetween(startDate, end));
  const place = (key) => Math.min(100, Math.max(0, (daysBetween(startDate, key) / total) * 100));
  host.hidden = false;
  host.setAttribute("role", "img");
  host.setAttribute("aria-label", `Timeline from ${fmtDate(startDate)} to ${fmtDate(end)}. ${dated.map((s) => `${s.stage.title}: ${STAGE_LABEL[s.state]}, ${fmtDate(s.stage.targetDate)}`).join("; ")}.`);
  const inner = el("div", "rm-timeline-inner");
  inner.append(el("div", "rm-timeline-bar"));
  const fill = el("div", "rm-timeline-fill");
  fill.style.width = `${place(result.today)}%`;
  inner.append(fill);
  for (const s of dated) {
    const mark = el("div", `rm-tl-mark${s.state === STAGE_STATE.DONE ? " rm-done" : s.state === STAGE_STATE.OVERDUE ? " rm-overdue" : ""}`);
    mark.style.left = `${place(s.stage.targetDate)}%`;
    mark.title = `${s.stage.title}: ${deadlineText(s)}`;
    mark.append(el("span", "", `${s.stage.title} · ${new Date(`${s.stage.targetDate}T00:00:00`).toLocaleDateString(undefined, { day: "numeric", month: "short" })}`));
    inner.append(mark);
  }
  const today = el("div", "rm-tl-today", "Today");
  today.style.left = `${place(result.today)}%`;
  inner.append(today);
  host.append(inner);
}

// ---------------------------------------------------------------- node cards
function manualCheckControl(node) {
  const current = manual[node.id]?.state ?? "todo";
  const group = el("div", "rm-seg");
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", `Status of ${node.title}`);
  for (const [value, label] of [["todo", "To do"], ["doing", "Doing"], ["done", "Done"]]) {
    const button = el("button", "", label);
    button.type = "button";
    button.dataset.focusKey = `set:${node.id}:${value}`;
    button.setAttribute("aria-pressed", String(current === value));
    button.addEventListener("click", () => saveManual(() => setManualState(getStorage(), node.id, value), "Could not save that change."));
    group.append(button);
  }
  return group;
}

function manualNumberControl(node) {
  const { label = "Value", unit = "" } = node.evidence;
  const form = el("form", "rm-num");
  const inputId = `rm-num-${node.id}`;
  const lab = el("label", "", `${label}${unit ? ` (${unit})` : ""}`);
  lab.htmlFor = inputId;
  const input = el("input");
  input.id = inputId;
  input.type = "number";
  input.step = "any";
  input.inputMode = "decimal";
  input.dataset.focusKey = `num:${node.id}`;
  const saved = manual[node.id]?.value;
  if (saved !== null && saved !== undefined) input.value = String(saved);
  const button = el("button", "", "Save");
  button.type = "submit";
  button.dataset.focusKey = `save:${node.id}`;
  form.append(lab, input, button);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (text === "") {
      saveManual(() => setManualValue(getStorage(), node.id, null), "Could not clear that value.");
      return;
    }
    const value = Number(text);
    if (!Number.isFinite(value)) { setStatus("Enter a number."); return; }
    saveManual(() => setManualValue(getStorage(), node.id, value), "Enter a number.");
  });
  return form;
}

function relationRow(heading, ids, current) {
  const row = el("div", "rm-rel");
  row.append(el("strong", "", heading));
  for (const id of ids) {
    const related = result.nodes.get(id);
    if (!related) continue;
    const chip = el("button", "rm-chip-btn", `${related.status === STATUS.DONE ? "✓ " : ""}${related.node.title}`);
    chip.type = "button";
    chip.title = related.node.track === current.track ? STATUS_LABEL[related.status] : `${STATUS_LABEL[related.status]} · on the ${related.node.track} track`;
    chip.addEventListener("click", () => focusNode(id));
    row.append(chip);
  }
  return row;
}

function renderNode(m) {
  const { node } = m;
  const selected = node.id === selectedId;
  const selectedNode = selectedId ? result.nodes.get(selectedId) : null;
  let classes = `rm-node rm-s-${m.status}`;
  if (selected) classes += " rm-selected";
  else if (selectedNode?.node.prereqs?.includes(node.id)) classes += " rm-related-in";
  else if (node.prereqs?.includes(selectedId)) classes += " rm-related-out";

  const card = el("article", classes);
  card.dataset.nodeId = node.id;

  const top = el("div", "rm-node-top");
  const dot = el("span", `rm-dot rm-s-${m.status}`);
  dot.setAttribute("aria-hidden", "true");
  const heading = el("div");
  const title = el("button", "rm-node-title", node.title);
  title.type = "button";
  title.dataset.focusKey = `title:${node.id}`;
  title.setAttribute("aria-expanded", String(selected));
  title.addEventListener("click", () => { selectedId = selected ? null : node.id; render(); });
  const sourceNote = m.source === "linked" ? " · from your linked data" : "";
  const state = el("div", "rm-node-state", (m.status === STATUS.DONE ? STATUS_LABEL.done : `${STATUS_LABEL[m.status]}${m.fraction > 0 ? ` · ${pctText(m.fraction)}` : ""}`) + sourceNote);
  heading.append(title, state);
  top.append(dot, heading);
  card.append(top);

  if (node.evidence.kind !== "manual-check") {
    const bar = el("div", "rm-bar");
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-label", `${node.title} progress`);
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "100");
    bar.setAttribute("aria-valuenow", String(Math.round(m.fraction * 100)));
    const fill = el("span");
    fill.style.width = pctText(m.fraction);
    bar.append(fill);
    card.append(bar);
  }
  card.append(el("p", `rm-node-detail${m.known ? "" : " rm-unknown"}`, m.detail));

  if (node.evidence.kind === "manual-check") card.append(manualCheckControl(node));
  // A typed number is offered when the value is yours to report. A linked Codeforces rating needs no box.
  if (node.evidence.kind === "manual-number" || (node.evidence.kind === "codeforces-rating" && m.source === "manual")) {
    card.append(manualNumberControl(node));
  }

  if (selected) {
    const expand = el("div", "rm-expand");
    expand.append(el("p", "", node.why));
    if (m.aheadOfPrereqs) expand.append(el("p", "rm-ahead", "You are ahead of a prerequisite here. That is fine, but check that the earlier step is not being skipped."));
    if (node.prereqs?.length) expand.append(relationRow("Needs", node.prereqs, node));
    const unlocksIds = ROADMAP.nodes.filter((other) => other.prereqs?.includes(node.id)).map((other) => other.id);
    if (unlocksIds.length) expand.append(relationRow("Unlocks", unlocksIds, node));
    if (node.href) {
      const open = el("a", "rm-open", "Open module");
      open.href = node.href;
      expand.append(open);
    }
    card.append(expand);
  }
  return card;
}

function renderMap() {
  const trackResult = result.tracks.find((t) => t.track.id === activeTrackId) ?? result.tracks[0];
  byId("rm-map-title").textContent = `${trackResult.track.title} map`;
  byId("rm-map-goal").textContent = trackResult.track.goal;
  renderTimeline(trackResult);

  const host = byId("rm-stages");
  host.replaceChildren();
  for (const stage of trackResult.stages) {
    const column = el("section", `rm-stage${stage.state === STAGE_STATE.OVERDUE ? " rm-overdue" : ""}`);
    column.setAttribute("aria-label", stage.stage.title);

    const head = el("div", "rm-stage-head");
    const titleRow = el("div", "rm-stage-title");
    titleRow.append(el("h3", "", stage.stage.title), el("span", `rm-pill rm-${stage.state}`, STAGE_LABEL[stage.state]));
    const bar = el("div", "rm-bar");
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-label", `${stage.stage.title} progress`);
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "100");
    bar.setAttribute("aria-valuenow", String(Math.round(stage.progress * 100)));
    const fill = el("span");
    fill.style.width = pctText(stage.progress);
    bar.append(fill);
    const meta = el("div", "rm-stage-meta");
    meta.append(el("span", "", `${stage.doneCount} of ${stage.members.length} done`), el("span", "", deadlineText(stage)));
    head.append(titleRow, el("p", "rm-stage-objective", stage.stage.objective), bar, meta);
    column.append(head);

    for (const member of stage.members) column.append(renderNode(member));
    host.append(column);
  }
}

// ---------------------------------------------------------------- dependency lines (selected node only)
function drawEdges() {
  const svg = byId("rm-edges");
  svg.replaceChildren();
  if (!selectedId || isNarrow()) return;
  const canvas = byId("rm-canvas");
  const selectedNode = result.nodes.get(selectedId)?.node;
  if (!selectedNode) return;

  const base = canvas.getBoundingClientRect();
  svg.setAttribute("viewBox", `0 0 ${canvas.scrollWidth} ${canvas.scrollHeight}`);
  const defs = svgEl("defs");
  const marker = svgEl("marker", { id: "rm-arrow", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" });
  marker.append(svgEl("path", { d: "M0 0 L10 5 L0 10 z", class: "rm-edge-head" }));
  defs.append(marker);
  svg.append(defs);

  const rectOf = (id) => {
    const card = canvas.querySelector(`[data-node-id="${CSS.escape(id)}"]`);
    if (!card) return null;
    const r = card.getBoundingClientRect();
    return { left: r.left - base.left, right: r.right - base.left, top: r.top - base.top, bottom: r.bottom - base.top, midY: (r.top + r.bottom) / 2 - base.top };
  };
  const link = (from, to, kind) => {
    if (!from || !to) return;
    let d;
    if (from.right <= to.left + 1) {
      const dx = Math.max(28, (to.left - from.right) / 2);
      d = `M${from.right} ${from.midY} C${from.right + dx} ${from.midY} ${to.left - dx} ${to.midY} ${to.left} ${to.midY}`;
    } else if (to.right <= from.left + 1) {
      const dx = Math.max(28, (from.left - to.right) / 2);
      d = `M${from.left} ${from.midY} C${from.left - dx} ${from.midY} ${to.right + dx} ${to.midY} ${to.right} ${to.midY}`;
    } else {
      // Same column: bow out through the left gutter.
      d = `M${from.left} ${from.midY} C${from.left - 40} ${from.midY} ${to.left - 40} ${to.midY} ${to.left} ${to.midY}`;
    }
    svg.append(svgEl("path", { d, class: `rm-edge ${kind === "out" ? "rm-out" : "rm-in"}`, "marker-end": "url(#rm-arrow)" }));
  };

  const me = rectOf(selectedId);
  for (const prereq of selectedNode.prereqs ?? []) link(rectOf(prereq), me, "in");
  for (const other of ROADMAP.nodes) if (other.prereqs?.includes(selectedId)) link(me, rectOf(other.id), "out");
}

// ---------------------------------------------------------------- navigation
function setTrack(id) {
  if (!ROADMAP.tracks.some((t) => t.id === id)) return;
  activeTrackId = id;
  selectedId = null;
  try { history.replaceState(null, "", `#${id}`); } catch { /* hash is a convenience only */ }
  render();
}

function focusNode(id) {
  const node = ROADMAP.nodes.find((n) => n.id === id);
  if (!node) return;
  activeTrackId = node.track;
  selectedId = id;
  try { history.replaceState(null, "", `#${node.track}`); } catch { /* ignore */ }
  render();
  const card = byId("rm-canvas").querySelector(`[data-node-id="${CSS.escape(id)}"]`);
  card?.scrollIntoView({ block: "center", inline: "center", behavior: reduceMotion() ? "auto" : "smooth" });
  card?.querySelector(".rm-node-title")?.focus({ preventScroll: true });
  requestAnimationFrame(drawEdges);
}

// ---------------------------------------------------------------- main render
function render() {
  const focusKey = document.activeElement?.dataset?.focusKey;
  const scroller = byId("rm-map-scroll");
  const scrollLeft = scroller.scrollLeft;
  compute();
  renderTracks();
  renderNext();
  renderMap();
  scroller.scrollLeft = scrollLeft;
  if (focusKey) document.querySelector(`[data-focus-key="${CSS.escape(focusKey)}"]`)?.focus({ preventScroll: true });
  drawEdges();
}

function start() {
  const errors = validateRoadmap(ROADMAP, EVIDENCE_KINDS);
  if (errors.length) {
    const box = byId("rm-error");
    box.hidden = false;
    box.textContent = `The map definition in roadmap/data.mjs has problems, so it cannot be drawn:\n- ${errors.join("\n- ")}`;
    return;
  }
  const hash = window.location.hash.replace(/^#/, "");
  if (ROADMAP.tracks.some((t) => t.id === hash)) activeTrackId = hash;
  render();

  let resizeTimer = null;
  window.addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(drawEdges, 120); });
  window.addEventListener("storage", render);
  window.addEventListener("limitless:rewards-updated", render);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) render(); });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && selectedId) { selectedId = null; render(); }
  });
}

start();
