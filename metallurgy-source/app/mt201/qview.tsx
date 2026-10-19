"use client";

// app/mt201/qview.tsx — compatibility wrapper.
//
// Public API and rendering are unchanged from the original MT201 renderer.
// All markup lives in the shared renderer (app/platform/qview.tsx); this file
// only selects the MT201 variant. Since PHASE 3 the MT201 page feeds canonical
// questions (app/courses/types.ts) straight from the course registry, and a
// canonical Question already satisfies the shared QuestionView, so no mapping
// is needed.

import { TYPE_NAMES } from "./types";
import {
  OptionList as BaseOptionList,
  QuestionBody as BaseQuestionBody,
  QuestionMeta as BaseQuestionMeta,
  SolutionPanel as BaseSolutionPanel,
  type QuestionView,
  type QViewVariant,
} from "../platform/qview";
import type { Question } from "../courses/types";

const VARIANT: QViewVariant = {
  metaStyle: "stars",
  typeChip: "code-and-name",
  typeNames: TYPE_NAMES,
  unknownTypeName: "question",
  tableClassName: "mdtable",
  markPickedUnlocked: false,
  buttonType: "button",
  solutionStyle: "concise",
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

export function SolutionPanel({ q, showKey = true }: { q: Question; showKey?: boolean }) {
  return <BaseSolutionPanel q={view(q)} showKey={showKey} variant={VARIANT} />;
}
