// Manual checkpoints for the Progression Map.
//
// Some milestones live outside Limitless (a Codeforces rating, "applied to 10 firms",
// a semester result). Those are recorded here by the learner. This is plan state, not
// learning progress: it never feeds EXP and never touches another module's storage.
//
// Shape under one key:
//   { schemaVersion: 1, manual: { [nodeId]: { state: "todo"|"doing"|"done", value: number|null, updatedAt: ms } } }
// Unknown root fields are preserved on every write.

export const ROADMAP_STORAGE_KEY = "limitless.roadmap.v1";
export const MANUAL_STATES = Object.freeze(["todo", "doing", "done"]);

const NODE_ID_RE = /^[a-z0-9]+(?:[-:][a-z0-9]+)*$/;
const isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);

function readRoot(storage) {
  try {
    const raw = storage?.getItem(ROADMAP_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

/** Read-only view: { [nodeId]: { state, value, updatedAt } }. Never writes. */
export function readManual(storage) {
  const root = readRoot(storage);
  const source = isRecord(root.manual) ? root.manual : {};
  const result = {};
  for (const [id, entry] of Object.entries(source)) {
    if (!NODE_ID_RE.test(id) || !isRecord(entry)) continue;
    result[id] = {
      state: MANUAL_STATES.includes(entry.state) ? entry.state : "todo",
      value: typeof entry.value === "number" && Number.isFinite(entry.value) ? entry.value : null,
      updatedAt: typeof entry.updatedAt === "number" ? entry.updatedAt : 0,
    };
  }
  return result;
}

function writeEntry(storage, nodeId, patch, now) {
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function") {
    return { ok: false, error: "storage-unavailable" };
  }
  if (!NODE_ID_RE.test(nodeId ?? "")) return { ok: false, error: "invalid-node-id" };
  const root = readRoot(storage);
  const manual = isRecord(root.manual) ? root.manual : {};
  const previous = isRecord(manual[nodeId]) ? manual[nodeId] : {};
  const entry = { state: "todo", value: null, ...previous, ...patch, updatedAt: now };
  try {
    storage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify({
      ...root,
      schemaVersion: 1,
      manual: { ...manual, [nodeId]: entry },
    }));
  } catch {
    return { ok: false, error: "storage-unavailable" };
  }
  return { ok: true, entry };
}

export function setManualState(storage, nodeId, state, now = Date.now()) {
  if (!MANUAL_STATES.includes(state)) return { ok: false, error: "invalid-state" };
  return writeEntry(storage, nodeId, { state }, now);
}

/** Log a number (e.g. a rating). A finite number is required; pass null to clear it. */
export function setManualValue(storage, nodeId, value, now = Date.now()) {
  if (value !== null && !(typeof value === "number" && Number.isFinite(value))) {
    return { ok: false, error: "invalid-value" };
  }
  return writeEntry(storage, nodeId, { value }, now);
}
