/**
 * Shared keyboard navigation for learning and exam players.
 * Arrow keys move one question; editable controls retain normal cursor/
 * selection behaviour. Holding a key does not skip through multiple items.
 */
export function handleNextQuestionKey(
  event: KeyboardEvent,
  onNext: () => void,
  onPrevious?: () => void,
): boolean {
  if (
    (event.key !== "ArrowRight" && event.key !== "ArrowLeft") ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.repeat
  ) return false;

  const target = event.target;
  if (target && typeof (target as Element).closest === "function") {
    const element = target as Element;
    if (
      element.closest("input, textarea, select, [contenteditable='true'], [role='textbox']")
    ) return false;
  }
  if ((target as HTMLElement | null)?.isContentEditable) return false;

  event.preventDefault();
  if (event.key === "ArrowRight") onNext();
  else onPrevious?.();
  return true;
}


export function handleQuestionShortcut(
  event: KeyboardEvent,
  options: {
    optionCount: number;
    onSelectOption: (index: number) => void;
    onSubmit: () => void;
    hasSelection: boolean;
  },
): boolean {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.repeat) return false;
  const target = event.target as HTMLElement | null;
  if (
    target?.closest("input, textarea, select, [contenteditable='true'], [role='textbox']") ||
    target?.isContentEditable
  ) return false;

  if (/^[1-4]$/.test(event.key)) {
    const index = Number(event.key) - 1;
    if (index >= options.optionCount) return false;
    event.preventDefault();
    options.onSelectOption(index);
    return true;
  }
  if (event.key === "Enter" && options.hasSelection) {
    event.preventDefault();
    options.onSubmit();
    return true;
  }
  return false;
}
