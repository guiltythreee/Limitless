// Tiny markdown → HTML renderer. Escapes everything first, then applies
// block-level (code fences, display equations, semantic containers, tables,
// lists, headings) and inline (**bold**, *italic*, `code`, $inline maths$)
// rules. Used for question text, solution bodies and lesson prose.
//
// Maths extensions (the source files contain no other $ characters, so the
// syntax is collision-free):
//   $ ... $        inline KaTeX
//   $$ ... $$      display equation (single- or multi-line)
//   :::kind Title  semantic container — definition | theorem | example |
//                  warning | note | assumption | takeaway (closed by :::)

import { texToHtml } from "./tex";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function inline(raw: string): string {
  const codes: string[] = [];
  let t = raw.replace(/`([^`]+)`/g, (_m, c: string) => {
    codes.push(c);
    return `\u0000${codes.length - 1}\u0000`;
  });
  // inline maths: $...$ (single-line, no nesting). Hidden behind the same
  // kind of placeholder as code spans so escaping and bold/italic cannot
  // touch the generated markup. (No lookbehind: it would be a parse error
  // on older Safari and take the whole bundle down with it.)
  const maths: string[] = [];
  t = t.replace(/\$\$([^$\n]+?)\$\$|\$([^$\n]+?)\$/g, (_m, disp: string, inl: string) => {
    maths.push(texToHtml(disp ?? inl, false));
    return `\u0001${maths.length - 1}\u0001`;
  });
  t = esc(t);
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  t = t.replace(/\u0001(\d+)\u0001/g, (_m, i: string) => maths[+i]);
  t = t.replace(/\u0000(\d+)\u0000/g, (_m, i: string) => `<code>${esc(codes[+i])}</code>`);
  return t;
}

/** Inline-only rendering (bold/italic/code/maths) for short strings like question text. */
export function mdInline(s: string): string {
  return inline(s ?? "");
}

const CONTAINER_RE = /^:::(definition|theorem|lemma|example|warning|note|assumption|takeaway)(?:\s+(.*))?$/;

export function mdToHtml(md: string): string {
  const lines = md.replace(/\r/g, "").split("\n");
  const out: string[] = [];
  let i = 0;

  const isTableRow = (L: string) => /^\s*\|.*\|\s*$/.test(L);
  const isSepRow = (L: string) => /^\s*\|[\s:|-]+\|\s*$/.test(L);

  while (i < lines.length) {
    const L = lines[i];

    if (/^```/.test(L)) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      out.push(`<pre class="code"><code>${esc(buf.join("\n"))}</code></pre>`);
      continue;
    }

    // display maths: $$ ... $$ (same line) or a fenced $$ ... $$ block
    const t = L.trim();
    if (t.startsWith("$$")) {
      let body = t.slice(2);
      if (body.endsWith("$$")) {
        body = body.slice(0, -2);
        i++;
      } else {
        const buf: string[] = [body];
        i++;
        while (i < lines.length && !lines[i].trim().endsWith("$$")) buf.push(lines[i++]);
        if (i < lines.length) {
          buf.push(lines[i].trim().slice(0, -2));
          i++;
        }
        body = buf.join("\n");
      }
      out.push(`<div class="eq">${texToHtml(body.trim(), true)}</div>`);
      continue;
    }

    // semantic containers
    const cm = L.trim().match(CONTAINER_RE);
    if (cm) {
      const kind = cm[1];
      const title = (cm[2] ?? "").trim();
      const buf: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ":::") buf.push(lines[i++]);
      if (i < lines.length) i++; // closing :::
      out.push(
        `<aside class="box box-${kind}">` +
          (title ? `<div class="box-title">${inline(title)}</div>` : "") +
          mdToHtml(buf.join("\n")) +
          `</aside>`
      );
      continue;
    }

    if (isTableRow(L) && !isSepRow(L)) {
      const rows: string[][] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        if (!isSepRow(lines[i])) {
          rows.push(lines[i].trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim()));
        }
        i++;
      }
      const [head, ...body] = rows;
      out.push(
        `<table class="mdtable"><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead>` +
          `<tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`
      );
      continue;
    }

    if (/^#{1,4}\s/.test(L)) {
      const level = Math.min(4, L.match(/^#+/)![0].length + 1);
      out.push(`<h${level}>${inline(L.replace(/^#+\s*/, ""))}</h${level}>`);
      i++;
      continue;
    }

    if (/^---\s*$/.test(L)) {
      out.push("<hr>");
      i++;
      continue;
    }

    if (/^-\s+/.test(L)) {
      const items: string[] = [];
      while (i < lines.length && /^-\s+/.test(lines[i])) {
        let item = lines[i].replace(/^-\s+/, "");
        i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^-\s+/.test(lines[i])) {
          item += " " + lines[i].trim();
          i++;
        }
        items.push(inline(item));
      }
      out.push(`<ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(L)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(inline(lines[i].replace(/^\d+\.\s+/, "")));
        i++;
      }
      out.push(`<ol>${items.map((x) => `<li>${x}</li>`).join("")}</ol>`);
      continue;
    }

    if (!L.trim()) {
      i++;
      continue;
    }

    const buf: string[] = [L.trim()];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^```|^#{1,4}\s|^---\s|^-\s|^\d+\.\s/.test(lines[i]) &&
      !/^:::|^\$\$/.test(lines[i].trim()) &&
      !isTableRow(lines[i])
    ) {
      buf.push(lines[i].trim());
      i++;
    }
    out.push(`<p>${buf.map(inline).join(" ")}</p>`);
  }

  return out.join("\n");
}
