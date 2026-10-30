/**
 * Shared structural shell for question players.
 *
 * React's createElement function is injected by each consuming application.
 * This keeps the shared module framework-neutral and lets the two independent
 * apps resolve their own React installation.
 */
export interface LearningPlayerShellProps {
  children: unknown;
  palette?: unknown;
  className?: string;
  paletteClassName?: string;
  contentClassName?: string;
}

type ElementFactory = (...args: any[]) => any;

export function createLearningPlayerShell(
  createElement: ElementFactory,
  props: LearningPlayerShellProps,
) {
  const palette = props.palette === undefined
    ? null
    : createElement(
        "nav",
        {
          className: props.paletteClassName,
          "aria-label": "Question navigation",
          "data-learning-player-palette": "true",
        },
        props.palette,
      );

  const content = createElement(
    "div",
    {
      className: props.contentClassName,
      "data-learning-player-content": "true",
    },
    props.children,
  );

  return createElement(
    "section",
    {
      className: props.className,
      "data-learning-player": "true",
    },
    palette,
    content,
  );
}
