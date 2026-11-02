"use client";

import { useMemo, useState } from "react";
import { coverageAreas, pathways } from "../content";

type RouteFilter = "all" | "foundations" | "statistics" | "quant-finance" | "stochastic" | "computation";

const routeTags: Record<Exclude<RouteFilter, "all">, string> = {
  foundations: "Foundations",
  statistics: "Statistics",
  "quant-finance": "Quant Finance",
  stochastic: "Stochastic",
  computation: "Computation",
};

const statusMeta = {
  expanded: { label: "Expanded", detail: "Substantial authored material exists; not exhaustive textbook coverage.", className: "border-gold/30 text-gold" },
  starter: { label: "Starter", detail: "A foundation exists; further lessons, proofs, or problems are needed.", className: "border-amber-400/30 text-amber-300" },
  planned: { label: "Planned", detail: "Explicit remaining curriculum work.", className: "border-white/15 text-dim" },
} as const;

export default function Coverage() {
  const [route, setRoute] = useState<RouteFilter>("all");
  const visible = useMemo(
    () => route === "all" ? coverageAreas : coverageAreas.filter((area) => area.pathways.includes(routeTags[route])),
    [route],
  );
  const counts = useMemo(() => ({
    expanded: visible.filter((area) => area.status === "expanded").length,
    starter: visible.filter((area) => area.status === "starter").length,
    planned: visible.filter((area) => area.status === "planned").length,
  }), [visible]);

  return (
    <div className="space-y-6">
      <section className="panel p-5 sm:p-7">
        <div className="eyebrow">Scope and standards</div>
        <h3 className="serif mt-3 text-2xl text-parchment sm:text-3xl">Curriculum coverage ledger</h3>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-dim">
          Blitzstein–Hwang and Sheldon Ross guide topic selection and sequencing. This ledger distinguishes substantial authored material from starter coverage and remaining work; it does not claim that the entire contents of both textbooks are already covered.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <label htmlFor="coverage-pathway" className="text-[10px] uppercase tracking-[.14em] text-mutedgold">Filter by pathway</label>
          <select
            id="coverage-pathway"
            value={route}
            onChange={(event) => setRoute(event.target.value as RouteFilter)}
            className="border border-gold/20 bg-ink px-3 py-2 text-xs text-parchment outline-none focus:border-gold/60"
          >
            <option value="all">All coverage areas</option>
            {pathways.map((pathway) => <option key={pathway.id} value={pathway.id}>{pathway.label}</option>)}
          </select>
          <span className="text-[10px] text-faint">{visible.length} topic areas shown</span>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {(["expanded", "starter", "planned"] as const).map((status) => (
            <div key={status} className="border border-gold/10 bg-ink/40 p-3">
              <div className="serif text-2xl text-parchment">{counts[status]}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[.12em] text-mutedgold">{statusMeta[status].label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="space-y-3">
        {visible.map((area) => {
          const meta = statusMeta[area.status];
          return (
            <article key={area.area} className="panel p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h4 className="serif max-w-3xl text-xl text-parchment">{area.area}</h4>
                <span className={`border px-2 py-1 text-[9px] uppercase tracking-[.13em] ${meta.className}`}>{meta.label}</span>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-[10px] uppercase tracking-[.13em] text-mutedgold">Blitzstein–Hwang scope</div>
                  <p className="mt-1 text-sm leading-6 text-body">{area.blitzsteinHwang}</p>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[.13em] text-mutedgold">Sheldon Ross scope</div>
                  <p className="mt-1 text-sm leading-6 text-body">{area.ross}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {area.pathways.map((tag) => <span key={tag} className="border border-gold/15 px-2 py-1 text-[9px] uppercase tracking-[.09em] text-dim">{tag}</span>)}
              </div>
              <p className="mt-4 border-t border-gold/10 pt-3 text-xs leading-5 text-dim">{area.acceptance}</p>
              <p className="mt-2 text-[10px] leading-4 text-faint">{meta.detail}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}