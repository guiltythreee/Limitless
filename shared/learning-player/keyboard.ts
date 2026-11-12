/**
 * Shared keyboard navigation for learning and exam players.
 * ArrowRight advances one question; editable controls retain normal cursor/
 * selection behaviour. Holding the key does not skip through multiple items.
 */
export function handleNextQuestionKey(
  event: KeyboardEvent,
  onNext: () => void,
): boolean {
  if (
    event.key !== "ArrowRight" ||
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
  onNext();
  return true;
}
