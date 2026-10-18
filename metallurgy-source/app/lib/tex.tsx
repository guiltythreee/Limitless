import katex from "katex";

// KaTeX rendering helpers. `Tex` is the React component used by the lesson
// reader (formula cards, display equations); `texToHtml` is the string
// version used by the markdown renderer in lib/md.ts for prose and
// solutions. throwOnError:false means a malformed expression renders as
// red source text instead of crashing the page.

export function texToHtml(src: string, display = false): string {
  try {
    return katex.renderToString(src, {
      displayMode: display,
      throwOnError: false,
      strict: false,
      trust: false,
      output: "htmlAndMathml",
    });
  } catch {
    const safe = src.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] as string);
    return `<code class="tex-fallback">${safe}</code>`;
  }
}

export default function Tex({ t, display }: { t: string; display?: boolean }) {
  return (
    <span
      className={display ? "eq" : undefined}
      dangerouslySetInnerHTML={{ __html: texToHtml(t, display) }}
    />
  );
}
