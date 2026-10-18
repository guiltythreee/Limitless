"use client";

// Four instruments for the numericals in the bank: lever rule, Schmid
// factor, Hall–Petch yield stress and the carburising √(Dt) solver.

import { useState } from "react";

// Abramowitz & Stegun 7.1.26 — max error 1.5 × 10⁻⁷.
function erf(x: number): number {
  const s = x < 0 ? -1 : 1;
  const a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-a * a);
  return s * y;
}

function erfinv(y: number): number {
  if (y <= -1 || y >= 1) return NaN;
  let x = 0;
  for (let i = 0; i < 80; i++) {
    const fx = erf(x) - y;
    const dfx = (2 / Math.sqrt(Math.PI)) * Math.exp(-x * x);
    const step = fx / dfx;
    x -= step;
    if (Math.abs(step) < 1e-12) break;
  }
  return x;
}

const num = (v: string) => (v.trim() === "" ? NaN : Number(v));

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="rline">
      <span>{k}</span>
      <span className="rval">{v}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function LeverCalc() {
  const [c0, setC0] = useState("30");
  const [ca, setCa] = useState("10");
  const [cb, setCb] = useState("50");
  const C0 = num(c0), Ca = num(ca), Cb = num(cb);
  const ok = [C0, Ca, Cb].every((x) => !Number.isNaN(x)) && Cb !== Ca;
  const wa = ok ? ((Cb - C0) / (Cb - Ca)) * 100 : NaN;
  const wb = ok ? 100 - wa : NaN;
  const inside = ok && wa >= 0 && wa <= 100;

  return (
    <>
      <h3>Lever rule</h3>
      <p className="desc">
        Two-phase region: overall composition C₀, tie-line ends Cα and Cβ. Mass fractions:
        Wα = (Cβ − C₀)/(Cβ − Cα), Wβ = (C₀ − Cα)/(Cβ − Cα) — each is the <em>opposite-side</em> arm over the whole tie line.
      </p>
      <div className="fields">
        <div className="field"><label>C₀ overall (wt%)</label><input value={c0} onChange={(e) => setC0(e.target.value)} /></div>
        <div className="field"><label>Cα (wt%)</label><input value={ca} onChange={(e) => setCa(e.target.value)} /></div>
        <div className="field"><label>Cβ (wt%)</label><input value={cb} onChange={(e) => setCb(e.target.value)} /></div>
      </div>
      <div className="result">
        {ok ? (
          <>
            <Row k="Wα" v={`${wa.toFixed(2)} %`} />
            <Row k="Wβ" v={`${wb.toFixed(2)} %`} />
            <div className="steps">
              Wα = ({Cb} − {C0})/({Cb} − {Ca}) = {((Cb - C0) / (Cb - Ca)).toFixed(4)}
              &nbsp;·&nbsp; Wβ = ({C0} − {Ca})/({Cb} − {Ca}) = {((C0 - Ca) / (Cb - Ca)).toFixed(4)}
              {!inside && " — C₀ lies outside the tie line: single-phase region, the lever does not apply."}
            </div>
          </>
        ) : (
          <div className="steps">Enter three numbers with Cα ≠ Cβ.</div>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

function SchmidCalc() {
  const [sigma, setSigma] = useState("100");
  const [phi, setPhi] = useState("30");
  const [lambda, setLambda] = useState("60");
  const [tau, setTau] = useState("40");
  const s = num(sigma), p = (num(phi) * Math.PI) / 180, l = (num(lambda) * Math.PI) / 180, tcr = num(tau);
  const okS = ![s, p, l].some(Number.isNaN);
  const m = okS ? Math.cos(p) * Math.cos(l) : NaN;
  const tauR = okS ? s * m : NaN;
  const okT = !Number.isNaN(tcr) && m > 0;
  const sigmaY = okT ? tcr / m : NaN;

  return (
    <>
      <h3>Schmid factor</h3>
      <p className="desc">
        τ_R = σ cos φ cos λ — slip starts when τ_R reaches τ_crss. The maximum Schmid factor is
        0.5 (at φ = λ = 45°); a soft orientation needs a much larger σ to reach the same τ_crss.
      </p>
      <div className="fields">
        <div className="field"><label>σ applied (MPa)</label><input value={sigma} onChange={(e) => setSigma(e.target.value)} /></div>
        <div className="field"><label>φ angle (°)</label><input value={phi} onChange={(e) => setPhi(e.target.value)} /></div>
        <div className="field"><label>λ angle (°)</label><input value={lambda} onChange={(e) => setLambda(e.target.value)} /></div>
        <div className="field"><label>τ_crss (MPa)</label><input value={tau} onChange={(e) => setTau(e.target.value)} /></div>
      </div>
      <div className="result">
        {okS ? (
          <>
            <Row k="Schmid factor m = cos φ cos λ" v={m.toFixed(4)} />
            <Row k="Resolved shear stress τ_R = σ·m" v={`${tauR.toFixed(2)} MPa`} />
            {okT && <Row k="Yield σ_y = τ_crss / m" v={`${sigmaY.toFixed(2)} MPa`} />}
            <div className="steps">
              m = cos({phi}°)·cos({lambda}°) = {Math.cos(p).toFixed(4)} × {Math.cos(l).toFixed(4)}
              {okT && ` · σ_y = ${tcr}/${m.toFixed(4)}`}
              {m <= 0 && " — with these angles the slip system is parallel to the stress axis: no slip."}
            </div>
          </>
        ) : (
          <div className="steps">Enter numbers for σ, φ and λ.</div>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

function HallPetchCalc() {
  const [s0, setS0] = useState("50");
  const [ky, setKy] = useState("0.74");
  const [d, setD] = useState("50");
  const s0v = num(s0), kyv = num(ky), dv = num(d); // d in micrometres
  const ok = ![s0v, kyv, dv].some(Number.isNaN) && dv > 0;
  const dm = dv * 1e-6;
  const sy = ok ? s0v + kyv / Math.sqrt(dm) : NaN;
  const inv = ok ? 1 / Math.sqrt(dm) : NaN;

  return (
    <>
      <h3>Hall–Petch</h3>
      <p className="desc">
        σ_y = σ₀ + k_y · d^(−1/2) — smaller grains, stronger metal. d in micrometres here;
        k_y in MPa·m^(1/2) (≈ 0.74 for low-carbon steel, ≈ 0.07 for copper).
      </p>
      <div className="fields">
        <div className="field"><label>σ₀ friction (MPa)</label><input value={s0} onChange={(e) => setS0(e.target.value)} /></div>
        <div className="field"><label>k_y (MPa·√m)</label><input value={ky} onChange={(e) => setKy(e.target.value)} /></div>
        <div className="field"><label>d grain size (µm)</label><input value={d} onChange={(e) => setD(e.target.value)} /></div>
      </div>
      <div className="result">
        {ok ? (
          <>
            <Row k="d^(−1/2)" v={`${inv.toFixed(2)} m^(−1/2)`} />
            <Row k="σ_y" v={`${sy.toFixed(1)} MPa`} />
            <div className="steps">
              σ_y = {s0v} + {kyv}/√({dv}×10⁻⁶) = {s0v} + {(kyv / Math.sqrt(dm)).toFixed(1)}
              {ok && " — halving d raises the second term by √2 ≈ 1.41×."}
            </div>
          </>
        ) : (
          <div className="steps">Enter numbers with d &gt; 0.</div>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

function DiffusionCalc() {
  const [cs, setCs] = useState("1.20");
  const [c0, setC0] = useState("0.20");
  const [cx, setCx] = useState("0.40");
  const [x, setX] = useState("200");
  const [d, setD] = useState("1.5"); // ×10⁻¹¹ m²/s
  const Cs = num(cs), C0 = num(c0), Cx = num(cx), Xum = num(x), Dv = num(d) * 1e-11;
  const ratio = (Cs - Cx) / (Cs - C0);
  const ok = ![Cs, C0, Cx, Xum, Dv].some(Number.isNaN) && Cs !== C0 && ratio > 0 && ratio < 1 && Xum > 0 && Dv > 0;
  const xi = ok ? erfinv(ratio) : NaN;
  const Xm = Xum * 1e-6;
  const t = ok ? Math.pow(Xm / (2 * xi), 2) / Dv : NaN; // seconds
  const tH = t / 3600;
  const rootDt = ok ? Math.sqrt(Dv * t) * 1e6 : NaN; // µm

  return (
    <>
      <h3>Carburising — √(Dt) solver</h3>
      <p className="desc">
        C(x,t) = C_s − (C_s − C₀)·erf( x / (2√(Dt)) ). Given the target concentration C_x at depth
        x, this solves for the required time. The penetration depth scales as √(Dt): four times
        the time buys twice the depth.
      </p>
      <div className="fields">
        <div className="field"><label>C_s surface (wt%)</label><input value={cs} onChange={(e) => setCs(e.target.value)} /></div>
        <div className="field"><label>C₀ initial (wt%)</label><input value={c0} onChange={(e) => setC0(e.target.value)} /></div>
        <div className="field"><label>C_x target (wt%)</label><input value={cx} onChange={(e) => setCx(e.target.value)} /></div>
        <div className="field"><label>x depth (µm)</label><input value={x} onChange={(e) => setX(e.target.value)} /></div>
        <div className="field"><label>D (×10⁻¹¹ m²/s)</label><input value={d} onChange={(e) => setD(e.target.value)} /></div>
      </div>
      <div className="result">
        {ok ? (
          <>
            <Row k="x / (2√Dt) = erf⁻¹((Cs−Cx)/(Cs−C0))" v={xi.toFixed(4)} />
            <Row k="Required time" v={`${tH.toFixed(2)} h (${Math.round(t)} s)`} />
            <Row k="√(Dt) penetration" v={`${rootDt.toFixed(1)} µm`} />
            <div className="steps">
              ratio = ({Cs} − {Cx})/({Cs} − {C0}) = {ratio.toFixed(4)} → erf⁻¹ = {xi.toFixed(4)};
              t = (x/2ξ)²/D with x = {Xum} µm, D = {num(d)}×10⁻¹¹ m²/s.
              {ratio >= 1 && " (C_x ≥ C_s is impossible — the surface is the richest point.)"}
            </div>
          </>
        ) : (
          <div className="steps">
            Need C₀ &lt; C_x &lt; C_s, x &gt; 0 and D &gt; 0.
          </div>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

export default function Calculators() {
  const [tab, setTab] = useState<"lever" | "schmid" | "hp" | "diff">("lever");
  const tabs: { id: typeof tab; label: string }[] = [
    { id: "lever", label: "Lever rule" },
    { id: "schmid", label: "Schmid factor" },
    { id: "hp", label: "Hall–Petch" },
    { id: "diff", label: "Carburising √(Dt)" },
  ];
  return (
    <div>
      <div className="calc-tabs">
        {tabs.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="panel calc">
        {tab === "lever" && <LeverCalc />}
        {tab === "schmid" && <SchmidCalc />}
        {tab === "hp" && <HallPetchCalc />}
        {tab === "diff" && <DiffusionCalc />}
      </div>
    </div>
  );
}
