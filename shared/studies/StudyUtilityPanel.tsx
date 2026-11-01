import type { ReactNode } from "react";

export type StudyUtilityPanelProps = {
  title: string;
  description?: string;
  count?: number;
  countLabel?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Shared visual frame for course-owned learning utilities.
 * Data, filtering, state and persistence stay with each discipline.
 */
export default function StudyUtilityPanel({
  title,
  description,
  count,
  countLabel,
  children,
  className,
}: StudyUtilityPanelProps) {
  return (
    <section className={["study-utility-panel", className].filter(Boolean).join(" ")} aria-label={title}>
      <header className="study-utility-panel__header">
        <div className="study-utility-panel__heading">
          <h2 className="study-utility-panel__title">{title}</h2>
          {description ? <p className="study-utility-panel__description">{description}</p> : null}
        </div>
        {count !== undefined ? (
          <span className="study-utility-panel__count">
            {count}{countLabel ? ` ${countLabel}` : ""}
          </span>
        ) : null}
      </header>
      <div className="study-utility-panel__content">{children}</div>
    </section>
  );
}
