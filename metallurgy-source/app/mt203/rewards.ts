"use client";

// Module-level bonus settlement. Called after a quiz/practice run finishes and
// after an exam is submitted (and once on the dashboard, to catch up any
// milestone that became true while the tab was closed).
//
// Every award goes through awardOnce with a stable key, so a module clear or
// mastery bonus is paid exactly once no matter how many times this runs, in
// which mode, or across reloads. Nothing here touches other modules' storage.

import { MODULE_META, moduleQuestionIds, topicsOfModule, TOPIC_OF } from "../data/qbank/meta";
import { awardOnce, BONUS, moduleAgg } from "../lib/mt203-progress";
import type { Progress } from "../lib/mt203-progress";

export function settleModuleBonuses(p: Progress): { progress: Progress; xp: number } {
  let cur = p;
  let xp = 0;
  for (const m of MODULE_META) {
    const agg = moduleAgg(cur, m.id, moduleQuestionIds(m.id), TOPIC_OF, topicsOfModule(m.id));
    if (agg.clear) {
      const r = awardOnce(cur, `clear:${m.id}`, BONUS.moduleClear(m.num));
      cur = r.progress;
      xp += r.xp;
    }
    if (agg.mastery) {
      const r = awardOnce(cur, `mastery:${m.id}`, BONUS.mastery(m.num));
      cur = r.progress;
      xp += r.xp;
    }
  }
  return { progress: cur, xp };
}
