/**
 * Shared navigation for course-owned learning utilities.
 *
 * The host application supplies the available items and selection callback.
 * This component owns presentation only: it does not read or write progress,
 * bookmarks, attempts, goals, or any other course data.
 */
export interface StudyUtilityItem {
  id: string;
  label: string;
  description?: string;
  count?: number;
  active?: boolean;
  tone?: "default" | "accent";
}

type ElementFactory = (...args: any[]) => any;

export function createStudyUtilityNav(
  createElement: ElementFactory,
  {
    items,
    onSelect,
    className,
    label = "Study utilities",
  }: {
    items: readonly StudyUtilityItem[];
    onSelect: (id: string) => void;
    className?: string;
    label?: string;
  },
) {
  const h = createElement;
  return h(
    "nav",
    {
      className: ["study-utility-nav", className].filter(Boolean).join(" "),
      "aria-label": label,
      "data-study-utility-nav": "true",
    },
    ...items.map((item) =>
      h(
        "button",
        {
          key: item.id,
          type: "button",
          className: [
            "study-utility-nav__item",
            item.active ? "is-active" : "",
            item.tone === "accent" ? "is-accent" : "",
          ].filter(Boolean).join(" "),
          "aria-current": item.active ? "page" : undefined,
          onClick: () => onSelect(item.id),
        },
        h("span", { className: "study-utility-nav__copy" },
          h("span", { className: "study-utility-nav__label" }, item.label),
          item.description
            ? h("span", { className: "study-utility-nav__description" }, item.description)
            : null,
        ),
        item.count !== undefined
          ? h("span", { className: "study-utility-nav__count", "aria-label": String(item.count) }, String(item.count))
          : null,
      ),
    ),
  );
}
