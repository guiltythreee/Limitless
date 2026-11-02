import type { CSSProperties } from "react";

// Every Probability lesson uses the same site-wide theme artwork.
// Theme selection and persistence are owned by the unified Limitless theme system.
export const EXPERIMENT_BACKGROUND = "sample-space";

export function backgroundStyle(_id: string): CSSProperties {
  return {
    "--bg-dark": "var(--limitless-bg-dark)",
    "--bg-light": "var(--limitless-bg-light)",
    "--bg-phone": "var(--limitless-bg-dark-mobile)",
    "--bg-phone-light": "var(--limitless-bg-light-mobile)",
  } as CSSProperties;
}
