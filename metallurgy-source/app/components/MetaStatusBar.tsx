"use client";

import { useEffect, useState } from "react";
import { readMetaStatus, type MetaStatus } from "../../../shared/meta/status.mjs";

const emptyStatus: MetaStatus = {
  totalExp: 0, level: 1, xpIntoLevel: 0, xpForNextLevel: 100,
  xpToNextLevel: 100, progressPct: 0, nextReward: null,
  equipped: [], equippedEffect: null, pendingNotifications: 0,
};

export default function MetaStatusBar() {
  const [status, setStatus] = useState<MetaStatus>(emptyStatus);
  useEffect(() => {
    const refresh = () => {
      try {
        const next = readMetaStatus(window.localStorage);
        setStatus(next);
        if (next.equippedEffect) document.body.setAttribute("data-lsr1-effect", next.equippedEffect);
        else document.body.removeAttribute("data-lsr1-effect");
      } catch {
        setStatus(emptyStatus);
        document.body.removeAttribute("data-lsr1-effect");
      }
    };
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("limitless:rewards-updated", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("limitless:rewards-updated", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  return (
    <aside className="limitless-meta-strip" aria-label="Global Limitless progression">
      <a className="limitless-meta-summary" href="/meta/" aria-label={`Global Level ${status.level}, ${status.totalExp.toLocaleString()} EXP. Open Meta progression.`}>
        <span className="limitless-meta-level">LV {status.level}</span>
        <span className="limitless-meta-exp">{status.totalExp.toLocaleString()} EXP</span>
        <span className="limitless-meta-track" aria-hidden="true"><span style={{ width: `${Math.max(0, Math.min(100, status.progressPct))}%` }} /></span>
        <span className="limitless-meta-next">{status.nextReward ? `Next level in ${status.xpToNextLevel.toLocaleString()} EXP · ${status.nextReward.name} at Lv ${status.nextReward.level}` : "All current rewards unlocked"}</span>
      </a>
      <span className="limitless-meta-details">
        {status.equipped.length ? status.equipped.join(" · ") : "Profile rewards not equipped"}
        {status.pendingNotifications > 0 && <span className="limitless-meta-notice">{status.pendingNotifications} level-up notice{status.pendingNotifications === 1 ? "" : "s"}</span>}
      </span>
      <a className="limitless-meta-open" href="/meta/">Meta ↗</a>
    </aside>
  );
}
