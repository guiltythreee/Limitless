/**
 * Shared structural shell for question players.
 *
 * React's createElement function is injected by each consuming application.
 * This keeps the shared module framework-neutral and lets the two independent
 * apps resolve their own React installation. Course-owned content is passed
 * through slots; the shell supplies only semantic regions and shared layout.
 */
export interface LearningPlayerShellProps {
  children: unknown;
  header?: unknown;
  palette?: unknown;
  footer?: unknown;
  className?: string;
  paletteClassName?: string;
  contentClassName?: string;
}

type ElementFactory = (...args: any[]) => any;

export function createLearningPlayerShell(
  createElement: ElementFactory,
  props: LearningPlayerShellProps,
) {
  const regions: unknown[] = [];

  if (props.header !== undefined) {
    regions.push(createElement(
      "header",
      { "data-learning-player-header": "true" },
      props.header,
    ));
  }

  if (props.palette !== undefined) {
    regions.push(createElement(
      "nav",
      {
        className: props.paletteClassName,
        "aria-label": "Question navigation",
        "data-learning-player-palette": "true",
      },
      props.palette,
    ));
  }

  regions.push(createElement(
    "div",
    {
      className: props.contentClassName,
      "data-learning-player-content": "true",
    },
    props.children,
  ));

  if (props.footer !== undefined) {
    regions.push(createElement(
      "footer",
      { "data-learning-player-footer": "true" },
      props.footer,
    ));
  }

  return createElement(
    "section",
    {
      className: props.className,
      "data-learning-player": "true",
    },
    ...regions,
  );
}
