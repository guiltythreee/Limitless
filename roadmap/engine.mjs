// Progression Map engine: pure functions, no DOM, no storage.
//
// Vocabulary (bottom-up):
//   node     one checkable capability, e.g. "Probability foundations pathway complete".
//   stage    a group of nodes with an optional target date.
//   track    an ordered list of stages that serves one goal (e.g. the quant internship).
//   evidence how a node's progress is measured. The engine never reads storage;
//            it is handed an `evaluate(node)` function that returns
//            { fraction: 0..1, known: boolean, detail: string, doing?: boolean }.
//
// Status rules (the whole model in four lines):
//   done    fraction >= 1
//   active  not done, and some progress exists (fraction > 0, or the learner marked it "doing")
//   ready   no progress yet, every prerequisite is done
//   locked  no progress yet, at least one prerequisite is not done
// Unknown data is never turned into progress: known=false reads as fraction 0.

export const STATUS = Object.freeze({ DONE: "done", ACTIVE: "active", READY: "ready", LOCKED: "locked" });
export const STAGE_STATE = Object.freeze({ DONE: "done", OVERDUE: "overdue", ACTIVE: "active", UPCOMING: "upcoming" });

const ID_RE = /^[a-z0-9]+(?:[-:][a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const clamp01 = (value) => (Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0);

/** Local calendar date as YYYY-MM-DD. ISO date strings compare correctly as plain strings. */
export function localDateKey(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function daysBetween(fromKey, toKey) {
  const from = Date.parse(`${fromKey}T00:00:00Z`);
  const to = Date.parse(`${toKey}T00:00:00Z`);
  return Math.round((to - from) / 86400000);
}

/**
 * Check the roadmap definition itself. Returns a list of human-readable errors
 * (empty = valid). `evidenceKinds` is the set of kinds the evidence layer implements.
 */
export function validateRoadmap(roadmap, evidenceKinds) {
  const errors = [];
  const tracks = Array.isArray(roadmap?.tracks) ? roadmap.tracks : [];
  const nodes = Array.isArray(roadmap?.nodes) ? roadmap.nodes : [];
  if (!tracks.length) errors.push("roadmap has no tracks");

  const trackIds = new Set();
  const stageOrder = new Map(); // stageId -> { trackId, index }
  for (const track of tracks) {
    if (!ID_RE.test(track.id ?? "")) errors.push(`invalid track id: ${track.id}`);
    if (trackIds.has(track.id)) errors.push(`duplicate track id: ${track.id}`);
    trackIds.add(track.id);
    if (!Array.isArray(track.stages) || !track.stages.length) errors.push(`track ${track.id} has no stages`);
    (track.stages ?? []).forEach((stage, index) => {
      if (!ID_RE.test(stage.id ?? "")) errors.push(`invalid stage id: ${stage.id}`);
      if (stageOrder.has(stage.id)) errors.push(`duplicate stage id: ${stage.id}`);
      stageOrder.set(stage.id, { trackId: track.id, index });
      if (stage.targetDate != null && !DATE_RE.test(stage.targetDate)) {
        errors.push(`stage ${stage.id} targetDate must be YYYY-MM-DD or null`);
      }
    });
  }

  const byId = new Map();
  for (const node of nodes) {
    if (!ID_RE.test(node.id ?? "")) { errors.push(`invalid node id: ${node.id}`); continue; }
    if (byId.has(node.id)) { errors.push(`duplicate node id: ${node.id}`); continue; }
    byId.set(node.id, node);
    const stage = stageOrder.get(node.stage);
    if (!stage) errors.push(`node ${node.id} references unknown stage ${node.stage}`);
    else if (stage.trackId !== node.track) errors.push(`node ${node.id} is in stage ${node.stage} which belongs to track ${stage.trackId}, not ${node.track}`);
    if (!node.title) errors.push(`node ${node.id} has no title`);
    if (node.weight != null && !(node.weight > 0)) errors.push(`node ${node.id} weight must be positive`);
    if (!node.evidence || typeof node.evidence.kind !== "string") errors.push(`node ${node.id} has no evidence.kind`);
    else if (evidenceKinds && !evidenceKinds.has(node.evidence.kind)) errors.push(`node ${node.id} uses unsupported evidence kind ${node.evidence.kind}`);
  }

  for (const node of byId.values()) {
    for (const prereq of node.prereqs ?? []) {
      const target = byId.get(prereq);
      if (!target) { errors.push(`node ${node.id} has unknown prerequisite ${prereq}`); continue; }
      if (prereq === node.id) errors.push(`node ${node.id} lists itself as a prerequisite`);
      const a = stageOrder.get(target.stage);
      const b = stageOrder.get(node.stage);
      if (a && b && a.trackId === b.trackId && a.index > b.index) {
        errors.push(`node ${node.id} (stage ${node.stage}) depends on ${prereq} which sits in a later stage ${target.stage}`);
      }
    }
  }

  // Cycle check (depth-first, three colours).
  const colour = new Map();
  const visit = (id, trail) => {
    if (colour.get(id) === 2) return;
    if (colour.get(id) === 1) { errors.push(`prerequisite cycle: ${[...trail, id].join(" -> ")}`); return; }
    colour.set(id, 1);
    for (const prereq of byId.get(id)?.prereqs ?? []) if (byId.has(prereq)) visit(prereq, [...trail, id]);
    colour.set(id, 2);
  };
  for (const id of byId.keys()) visit(id, []);
  return errors;
}

/**
 * Evaluate the whole roadmap.
 * @param roadmap  { tracks, nodes }
 * @param evaluate (node) => { fraction, known, detail, doing? }
 * @param today    YYYY-MM-DD
 */
export function evaluateRoadmap(roadmap, evaluate, today = localDateKey()) {
  const nodeById = new Map(roadmap.nodes.map((node) => [node.id, node]));

  // Direct and transitive dependents: how much a node unlocks.
  const dependents = new Map(roadmap.nodes.map((node) => [node.id, []]));
  for (const node of roadmap.nodes) {
    for (const prereq of node.prereqs ?? []) dependents.get(prereq)?.push(node.id);
  }
  const downstream = (id, seen = new Set()) => {
    for (const next of dependents.get(id) ?? []) {
      if (!seen.has(next)) { seen.add(next); downstream(next, seen); }
    }
    return seen;
  };

  // Pass 1: raw evidence for every node.
  const raw = new Map();
  for (const node of roadmap.nodes) {
    let result;
    try { result = evaluate(node); } catch { result = null; }
    raw.set(node.id, result && typeof result === "object"
      ? { fraction: clamp01(result.fraction), known: result.known !== false, detail: String(result.detail ?? ""), doing: !!result.doing }
      : { fraction: 0, known: false, detail: "Could not read progress", doing: false });
  }

  // Pass 2: status needs prerequisite completion, so it is computed after pass 1.
  const nodes = new Map();
  for (const node of roadmap.nodes) {
    const evidence = raw.get(node.id);
    const unmet = (node.prereqs ?? []).filter((id) => raw.get(id)?.fraction < 1);
    let status;
    if (evidence.fraction >= 1) status = STATUS.DONE;
    else if (evidence.fraction > 0 || evidence.doing) status = STATUS.ACTIVE;
    else status = unmet.length ? STATUS.LOCKED : STATUS.READY;
    nodes.set(node.id, {
      node,
      ...evidence,
      status,
      unmet,
      aheadOfPrereqs: status === STATUS.ACTIVE && unmet.length > 0,
      unlocks: downstream(node.id).size,
    });
  }

  const tracks = roadmap.tracks.map((track) => {
    const stages = track.stages.map((stage, index) => {
      const members = roadmap.nodes.filter((node) => node.stage === stage.id).map((node) => nodes.get(node.id));
      const totalWeight = members.reduce((sum, m) => sum + (m.node.weight ?? 1), 0);
      const progress = totalWeight
        ? members.reduce((sum, m) => sum + (m.node.weight ?? 1) * m.fraction, 0) / totalWeight
        : 0;
      const done = members.length > 0 && members.every((m) => m.status === STATUS.DONE);
      const started = members.some((m) => m.status === STATUS.DONE || m.status === STATUS.ACTIVE);
      const daysLeft = stage.targetDate ? daysBetween(today, stage.targetDate) : null;
      let state = STAGE_STATE.UPCOMING;
      if (done) state = STAGE_STATE.DONE;
      else if (daysLeft !== null && daysLeft < 0) state = STAGE_STATE.OVERDUE;
      else if (started) state = STAGE_STATE.ACTIVE;
      return {
        stage, index, members, progress, state, daysLeft,
        doneCount: members.filter((m) => m.status === STATUS.DONE).length,
      };
    });

    const members = stages.flatMap((s) => s.members);
    const totalWeight = members.reduce((sum, m) => sum + (m.node.weight ?? 1), 0);
    const progress = totalWeight
      ? members.reduce((sum, m) => sum + (m.node.weight ?? 1) * m.fraction, 0) / totalWeight
      : 0;
    // Nodes whose stage deadline has passed but which are not done: the honest "behind" count.
    const behind = stages
      .filter((s) => s.state === STAGE_STATE.OVERDUE)
      .flatMap((s) => s.members.filter((m) => m.status !== STATUS.DONE));

    // Next actions: overdue first, then earliest stage, then what unlocks most, then heavier, then nearly finished.
    const candidates = stages.flatMap((s) =>
      s.members
        .filter((m) => m.status === STATUS.ACTIVE || m.status === STATUS.READY)
        .map((m) => ({ ...m, stageIndex: s.index, overdue: s.state === STAGE_STATE.OVERDUE })));
    candidates.sort((a, b) =>
      (b.overdue - a.overdue) ||
      (a.stageIndex - b.stageIndex) ||
      (b.unlocks - a.unlocks) ||
      ((b.node.weight ?? 1) - (a.node.weight ?? 1)) ||
      (b.fraction - a.fraction) ||
      a.node.id.localeCompare(b.node.id));
    const next = candidates.slice(0, 5).map((m) => ({
      ...m,
      reason: m.overdue ? "Stage deadline has passed"
        : m.status === STATUS.ACTIVE ? "Already started — finish it"
        : m.unlocks > 0 ? `Unlocks ${m.unlocks} later checkpoint${m.unlocks === 1 ? "" : "s"}`
        : "Ready to start",
    }));

    return {
      track, stages, progress, next,
      doneCount: members.filter((m) => m.status === STATUS.DONE).length,
      total: members.length,
      behind,
    };
  });

  return { nodes, tracks, today, nodeById };
}
