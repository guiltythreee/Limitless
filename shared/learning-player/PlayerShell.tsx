"use client";

import type { ReactNode } from "react";

/**
 * Shared structural shell for question players.
 *
 * The shell owns only the question-palette region and the content boundary.
 * Course-specific question renderers, answer controls, timers, and actions
 * remain supplied by each discipline.
 */
export interface LearningPlayerShellProps {
  children: ReactNode;
  palette?: ReactNode;
  className?: string;
  paletteClassName?: string;
  contentClassName?: string;
}

export function LearningPlayerShell({
  children,
  palette,
  className,
  paletteClassName,
  contentClassName,
}: LearningPlayerShellProps) {
  return (
    <section className={className}>
      {palette !== undefined && (
        <div className={paletteClassName} aria-label="Question navigation">
          {palette}
        </div>
      )}
      <div className={contentClassName}>{children}</div>
    </section>
  );
}
