"use client";

// app/mt203/qview.tsx — compatibility wrapper.
//
// Public API and rendering are unchanged from the original MT203 renderer
// (difficulty chip, name-only type chip, distractor notes, verdict banner,
// is-picked option state). All markup lives in the shared renderer
// (app/platform/qview.tsx).
//
// Since PHASE 4b the MT203 page feeds canonical questions
// (app/courses/types.ts) straight from the course registry adapter, and a
// canonical Question already satisfies the shared QuestionView, so no mapping
// is needed. The MT203-specific fields survive the projection: `diff` becomes
// `difficulty`/`rawDifficulty`, and `why`/`distractors`/`concept` become
// `solution.keyExplanation`/`solution.distractors`/`solution.concept`.

import { DIFF_NAMES, TYPE_NAMES } from "./types";
import {
  OptionList as BaseOptionList,
  QuestionBody as BaseQuestionBody,
  QuestionMeta as BaseQuestionMeta,
  SolutionPanel as BaseSolutionPanel,
  type QuestionView,
  type QViewVariant,
} from "../platform/qview";
import type { Question } from "../courses/types";

const DIFF_CHIPS = ["", "chip-diff1", "chip-diff2", "chip-diff3", "chip-diff4"];

const VARIANT: QViewVariant = {
  metaStyle: "difficulty",
  difficultyChipClasses: DIFF_CHIPS,
  // DIFF_NAMES is Record<1|2|3|4, string>; widen for the course-agnostic variant.
  difficultyNames: DIFF_NAMES as Record<number, string>,
  typeChip: "name-only",
  typeNames: TYPE_NAMES as Record<string, string>,
  tableClassName: "mdtable qtable",
  markPickedUnlocked: true,
  solutionStyle: "verdict",
};

// A canonical Question is structurally a QuestionView.
const view = (q: Question): QuestionView => q;

export function QuestionMeta({ q }: { q: Question }) {
  return <BaseQuestionMeta q={view(q)} variant={VARIANT} />;
}

export function QuestionBody({ q }: { q: Question }) {
  return <BaseQuestionBody q={view(q)} variant={VARIANT} />;
}

export function OptionList({
  q,
  picked,
  onPick,
  locked,
}: {
  q: Question;
  picked?: string;
  onPick?: (label: string) => void;
  locked: boolean;
}) {
  return (
    <BaseOptionList
      q={view(q)}
      picked={picked}
      onPick={onPick}
      locked={locked}
      variant={VARIANT}
    />
  );
}

export function SolutionPanel({ q, picked }: { q: Question; picked?: string }) {
  return <BaseSolutionPanel q={view(q)} picked={picked} variant={VARIANT} />;
}
