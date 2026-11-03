"use client";

import { Fragment, type ReactNode } from "react";
import katex from "katex";

type Props = { source: string; className?: string };

function inlineParts(text: string): ReactNode[] {
  const parts = text.split(/(\$\$[\s\S]+?\$\$|\\\([\s\S]+?\\\)|\$[^$\n]+\$)/g);
  return parts.map((part, index) => {
    const display = part.startsWith("$$") && part.endsWith("$$");
    const bracket = part.startsWith("\\(") && part.endsWith("\\)");
    const inline = part.startsWith("$") && part.endsWith("$") && !display;
    if (!display && !bracket && !inline) return <Fragment key={index}>{part}</Fragment>;
    const expression = display ? part.slice(2, -2) : bracket ? part.slice(2, -2) : part.slice(1, -1);
    try {
      const html = katex.renderToString(expression, { displayMode: display, throwOnError: false, strict: "ignore", trust: false });
      return <span key={index} className={display ? "mt200-math-display" : "mt200-math-inline"} dangerouslySetInnerHTML={{ __html: html }} />;
    } catch {
      return <code key={index}>{expression}</code>;
    }
  });
}

export default function MarkdownMath({ source, className }: Props) {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let table: string[][] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push(<p key={blocks.length}>{inlineParts(paragraph.join(" "))}</p>);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      blocks.push(<ul key={blocks.length}>{list.map((item, i) => <li key={i}>{inlineParts(item)}</li>)}</ul>);
      list = [];
    }
  };
  const flushTable = () => {
    if (table.length) {
      const rows = table.filter((row) => !row.every((cell) => /^:?-{3,}:?$/.test(cell.trim())));
      blocks.push(<div className="mt200-markdown-table-wrap" key={blocks.length}><table className="mt200-markdown-table"><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => i === 0 ? <th key={j}>{inlineParts(cell.trim())}</th> : <td key={j}>{inlineParts(cell.trim())}</td>)}</tr>)}</tbody></table></div>);
      table = [];
    }
  };

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line) { flushParagraph(); flushList(); flushTable(); continue; }
    if (line.startsWith("$$") && line.endsWith("$$") && line.length > 4) {
      flushParagraph(); flushList(); flushTable();
      blocks.push(<div className="mt200-math-block" key={blocks.length}>{inlineParts(line)}</div>);
      continue;
    }
    if (line.startsWith("#")) {
      flushParagraph(); flushList(); flushTable();
      const level = Math.min(6, line.match(/^#+/)?.[0].length ?? 2);
      const title = line.replace(/^#+\s*/, "");
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      blocks.push(<Tag key={blocks.length}>{inlineParts(title)}</Tag>);
      continue;
    }
    if (line.startsWith("|") && line.endsWith("|")) {
      flushParagraph(); flushList();
      table.push(line.slice(1, -1).split("|"));
      continue;
    }
    if (/^(?:[-*•])\s+/.test(line) || /^\d+[.)]\s+/.test(line)) {
      flushParagraph(); flushTable();
      list.push(line.replace(/^(?:[-*•]|\d+[.)])\s+/, ""));
      continue;
    }
    flushList(); flushTable();
    paragraph.push(line);
  }
  flushParagraph(); flushList(); flushTable();

  return <div className={["mt200-markdown", className].filter(Boolean).join(" ")}>{blocks}</div>;
}
