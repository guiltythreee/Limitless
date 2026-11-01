type ElementFactory = (...args: any[]) => any;

export interface StudyModeTab {
  id: string;
  label: string;
}

export function createStudyModeTabs(
  createElement: ElementFactory,
  {
    items,
    activeId,
    onSelect,
    className = "tabs",
    itemClassName = "tab",
    activeClassName = "active",
    label = "Study sections",
  }: {
    items: readonly StudyModeTab[];
    activeId: string;
    onSelect: (id: string) => void;
    className?: string;
    itemClassName?: string;
    activeClassName?: string;
    label?: string;
  },
) {
  const h = createElement;
  return h(
    "div",
    { className, role: "tablist", "aria-label": label, "data-study-mode-tabs": "true" },
    ...items.map((item) => {
      const active = item.id === activeId;
      return h(
        "button",
        {
          key: item.id,
          type: "button",
          role: "tab",
          "aria-selected": active,
          className: [itemClassName, active ? activeClassName : ""].filter(Boolean).join(" "),
          onClick: () => onSelect(item.id),
        },
        item.label,
      );
    }),
  );
}
