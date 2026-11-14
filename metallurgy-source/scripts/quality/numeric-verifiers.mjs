// scripts/quality/numeric-verifiers.mjs
//
// Independent recalculation for every MT203 numerical question.
//
// Each entry recomputes the answer from the *givens in the stem* using ordinary
// code. It never reads the keyed option or the `why` text, so it can disagree
// with them. `expect()` returns the quantities in the order the keyed option
// states them; `steps` is the number of distinct calculation steps (an
// independent signal for the difficulty check). `unit` / `sigfigs` document what
// the answer should be reported in.
//
// A numerical question with no entry here is an error: adding a new numerical
// item to the bank requires adding its recalculation (or an explicit waiver).

const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

/** Mn and Mw for a list of [count, M] populations. */
const MnMw = (pops) => {
  const n = pops.reduce((a, [N]) => a + N, 0);
  const nm = pops.reduce((a, [N, M]) => a + N * M, 0);
  const nm2 = pops.reduce((a, [N, M]) => a + N * M * M, 0);
  return { Mn: nm / n, Mw: nm2 / nm };
};

export const NUMERIC_VERIFIERS = {
  // ---- T1 ----
  "t1-07": { steps: 1, expect: () => [56000 / 28] },
  "t1-21": { steps: 1, expect: () => [22600 / 113] },
  "t1-30": { steps: 2, expect: () => [0.4 * 100 + 0.6 * 50] },

  // ---- T2 ----
  "t2-03": { steps: 3, expect: () => [100 * 5 * Math.sqrt(1e-2 / 1e6)] },
  "t2-10": { steps: 1, expect: () => [1 / (1 - 0.99)] },
  "t2-14": { steps: 2, expect: () => [(1 + 0.995) / (1 - 0.995)] },
  "t2-16": { steps: 1, expect: () => [Math.sqrt(4)] },
  // Termination events: each event consumes two kinetic chains (2ν monomers).
  // Combination (60%) leaves ONE dead chain; disproportionation (40%) leaves TWO.
  // DPn = monomers consumed / dead chains formed.
  "t2-22": {
    steps: 3,
    expect: () => {
      const nu = 1000, comb = 0.6, disp = 0.4;
      return [(2 * nu) / (comb * 1 + disp * 2)];
    },
  },
  "t2-28": { steps: 1, expect: () => [(1 - 1 / 200) * 100] },
  "t2-34": { steps: 2, expect: () => [2 * Math.sqrt(1 / 2)] },

  // ---- T3 ----
  "t3-11": { steps: 1, expect: () => [(1 - 1 / 100) * 100] },

  // ---- T4 ----
  "t4-02": {
    steps: 4,
    expect: () => {
      const { Mn, Mw } = MnMw([[1, 20000], [3, 10000]]);
      return [Mn, Mw, Mw / Mn];
    },
  },
  "t4-06": { steps: 1, expect: () => [1 + 0.999] }, // Flory PDI = 1 + p
  "t4-09": { steps: 3, expect: () => [1 / (0.99 / 50000 + 0.01 / 500)] },
  "t4-11": { steps: 1, expect: () => [33900 / 113] },
  "t4-14": { steps: 2, expect: () => [(1.0 / 1e-4) ** (1 / (2 / 3))] },
  "t4-18": { steps: 1, expect: () => [50000 / 200] },
  "t4-21": {
    steps: 3,
    expect: () => {
      // equal masses: Mn is the harmonic (mass-weighted) mean, Mw the arithmetic mean
      const Mn = 1 / (0.5 / 20000 + 0.5 / 80000);
      const Mw = 0.5 * 20000 + 0.5 * 80000;
      return [Mn, Mw];
    },
  },
  "t4-26": { steps: 1, expect: () => [2 * 500] },
  "t4-30": {
    steps: 3,
    expect: () => {
      const { Mn, Mw } = MnMw([[0.6, 10000], [0.4, 40000]]);
      return [Mn, Mw];
    },
  },

  // ---- T5 ----
  "t5-02": {
    steps: 2,
    // mass fraction: rho_c (rho - rho_a) / (rho (rho_c - rho_a)), as a percentage
    expect: () => [((1.0 * (0.93 - 0.855)) / (0.93 * (1.0 - 0.855))) * 100],
  },
  "t5-03": { steps: 1, expect: () => [(42 / 140) * 100] },

  // ---- T6 ----
  "t6-04": { steps: 3, expect: () => [1 / (0.5 / 373 + 0.5 / 473) - 273] },
  "t6-05": { steps: 2, expect: () => [373 - 1.0e5 / 10000 - 273] },
  "t6-17": { steps: 1, expect: () => [(2 / 3) * 540] },

  // ---- T7 ----
  "t7-14": { steps: 1, expect: () => [100 * 110] },

  // ---- T9 ----
  "t9-04": { steps: 3, expect: () => [1 / (0.7 / 0.92 + 0.3 / 1.05)] },
  "t9-05": { steps: 2, expect: () => [0.4 * 70 + 0.6 * 3] },
  "t9-16": { steps: 2, expect: () => [0.6 * 230 + 0.4 * 3.5] },

  // ---- T10 ----
  "t10-02": { steps: 3, expect: () => [(600 / 20 / 0.005) / 1000] }, // N/mm² = MPa → GPa
  "t10-03": { steps: 1, expect: () => [((250 - 50) / 50) * 100] },
  "t10-12": { steps: 1, expect: () => [1e9 / 1e6] },
  "t10-21": { steps: 2, expect: () => [5 * Math.exp(-100 / 100)] },
  "t10-24": { steps: 1, expect: () => [2e-8 * 3e-2] },

  // ---- explicit waivers (recorded, not silent) ----
  "t11-15": { waive: "interpretive MFI question typed as numerical; no calculation exists to verify" },
};

export const NUMERIC_TOLERANCE = 0.015; // 1.5 % relative — covers legitimate rounding of the keyed value
