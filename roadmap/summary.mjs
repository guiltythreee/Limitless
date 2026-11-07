// One place that turns "the browser's saved data" into an evaluated roadmap.
// Used by the Progression Map page and by the card on the Regional Qualification page,
// so the two can never disagree about the same numbers.
import { ROADMAP } from "./data.mjs";
import { ROADMAP_CATALOG } from "./catalog.generated.mjs";
import { evaluateRoadmap, localDateKey, validateRoadmap } from "./engine.mjs";
import { EVIDENCE_KINDS, createEvidenceReader } from "./evidence.mjs";
import { readGlobalRewardSummary } from "../shared/rewards.mjs";

/** Problems with the map definition in data.mjs (empty = fine). */
export function definitionErrors() {
  return validateRoadmap(ROADMAP, EVIDENCE_KINDS);
}

/** Read-only: never writes to storage. A global-level read failure only affects the level checkpoint. */
export function evaluateForStorage(storage, today = localDateKey()) {
  let level = null;
  try { level = readGlobalRewardSummary(storage).level.level; } catch { /* level checkpoint reads as unknown */ }
  const reader = createEvidenceReader({ storage, catalog: ROADMAP_CATALOG, readLevel: () => level });
  return evaluateRoadmap(ROADMAP, reader, today);
}
