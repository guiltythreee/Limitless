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
    inactiveClassName = "",
    label = "Study sections",
  }: {
    items: readonly StudyModeTab[];
    activeId: string;
    onSelect: (id: string) => void;
    className?: string;
    itemClassName?: string;
    activeClassName?: string;
    inactiveClassName?: string;
    label?: string;
  },
) {
  const h = createElement;
  return h(
    "div",
    { className, role: "tablist", "aria-label": label, "data-study-mode-tabs": "true" },
    ...items.map((item, index) => {
      const active = item.id === activeId;
      return h(
        "button",
        {
          key: item.id,
          type: "button",
          role: "tab",
          "aria-selected": active,
          tabIndex: active ? 0 : -1,
          onKeyDown: (event: any) => {
            const key = event.key;
            if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(key)) return;
            event.preventDefault();
            const nextIndex = key === "Home" ? 0
              : key === "End" ? items.length - 1
              : key === "ArrowRight" ? (index + 1) % items.length
              : (index - 1 + items.length) % items.length;
            const tabs = event.currentTarget.parentElement?.querySelectorAll?.('[role="tab"]');
            tabs?.[nextIndex]?.focus?.();
            onSelect(items[nextIndex].id);
          },
          className: [itemClassName, active ? activeClassName : inactiveClassName].filter(Boolean).join(" "),
          onClick: () => onSelect(item.id),
        },
        item.label,
      );
    }),
  );
}
