"use client";

import { Fragment, type ElementType, type ReactNode } from "react";
import katex from "katex";

type Props = { source: string; className?: string };

function inlineParts(text: string): ReactNode[] {
  const parts = text.split(/(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^$\n]+\$)/g);
  return parts.map((part, index) => {
    const display = (part.startsWith("$") && part.endsWith("$")) || (part.startsWith("\\[") && part.endsWith("\\]"));
    const bracket = part.startsWith("\\(") && part.endsWith("\\)");
    const inline = part.startsWith("$") && part.endsWith("$") && !display;
    if (!display && !bracket && !inline) return <Fragment key={index}>{part}</Fragment>;
    const expression = part.startsWith("$") || part.startsWith("\\[") || bracket ? part.slice(2, -2) : part.slice(1, -1);
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
  let listKind: "ol" | "ul" | null = null;
  let table: string[][] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push(<p key={blocks.length}>{inlineParts(paragraph.join(" "))}</p>);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      const ListTag = listKind === "ol" ? "ol" : "ul";
      blocks.push(<ListTag key={blocks.length}>{list.map((item, i) => <li key={i}>{inlineParts(item)}</li>)}</ListTag>);
      list = [];
      listKind = null;
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
    if (line === "$$") {
      flushParagraph(); flushList(); flushTable();
      const equation: string[] = [];
      i += 1;
      while (i < lines.length && lines[i].trim() !== "$$") {
        equation.push(lines[i]);
        i += 1;
      }
      blocks.push(<div className="mt200-math-block" key={blocks.length}>{inlineParts("$$" + equation.join("\n") + "$$")}</div>);
      continue;
    }
    if (line.startsWith("$$") && line.endsWith("$$") && line.length > 4) {
      flushParagraph(); flushList(); flushTable();
      blocks.push(<div className="mt200-math-block" key={blocks.length}>{inlineParts(line)}</div>);
      continue;
    }
    const imageMatch = line.match(/^!\[([^\]]*)\]\((\/data\/mt200\/figures\/[a-z0-9-]+\.svg)\)$/i);
    if (imageMatch) {
      flushParagraph(); flushList(); flushTable();
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
      blocks.push(<figure className="mt200-markdown-figure" key={blocks.length}><img src={basePath + imageMatch[2]} alt={imageMatch[1]} /><figcaption>{imageMatch[1]}</figcaption></figure>);
      continue;
    }
    if (line.startsWith("#")) {
      flushParagraph(); flushList(); flushTable();
      const level = Math.min(6, line.match(/^#+/)?.[0].length ?? 2);
      const title = line.replace(/^#+\s*/, "");
      const Tag = `h${level}` as ElementType;
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
      const kind = /^\d+[.)]\s+/.test(line) ? "ol" : "ul";
      if (list.length && listKind !== kind) flushList();
      listKind = kind;
      list.push(line.replace(/^(?:[-*•]|\d+[.)])\s+/, ""));
      continue;
    }
    flushList(); flushTable();
    paragraph.push(line);
  }
  flushParagraph(); flushList(); flushTable();

  return <div className={["mt200-markdown", className].filter(Boolean).join(" ")}>{blocks}</div>;
}
