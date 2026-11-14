import {
  epubHash,
  epubLongPieces,
  epubPackSections,
  normalize,
  type EpubBlock,
} from "../epub/epub-domain";

/** Convert pasted or .txt content into the same local reading-section shape used by PDF/EPUB. */
export function pagesFromText(value: string, target = 900): EpubBlock[][] {
  const source = String(value ?? "").replace(/\r\n?/g, "\n").replace(/\u0000/g, "");
  const paragraphs = source.split(/\n\s*\n/).map(normalize).filter(Boolean);
  if (!paragraphs.length) {
    const single = normalize(source);
    if (single) paragraphs.push(single);
  }
  const blocks: EpubBlock[] = [];
  for (const paragraph of paragraphs) {
    for (const text of epubLongPieces(paragraph, target)) {
      if (text) blocks.push({ t: "p", text });
    }
  }
  return epubPackSections(blocks, Math.max(1, Math.floor(target))).sections;
}

export function textFingerprint(value: string): string {
  return epubHash(new TextEncoder().encode(normalize(value)));
}
