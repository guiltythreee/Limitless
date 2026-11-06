import JSZip from "jszip";
import {
  EpubBlock, EpubChapter, epubBlocksFromRoot, epubChapterList, epubErr,
  epubErrShort, epubExpandBlocks, epubFlattenToc, epubHash, epubHrefKey,
  epubNavDir, epubPackSections, epubResolveRel, epubSpineIndexFor, normalize,
} from "./epub-domain";

export interface EpubImportResult {
  readonly title: string;
  readonly author: string;
  readonly hash: string;
  readonly sections: EpubBlock[][];
  readonly chapters: EpubChapter[];
  readonly empty?: true;
}

interface ManifestItem {
  id: string;
  href: string;
  mediaType: string;
  properties: string;
}

interface TocLink { href: string; label: string; }

const SECTION_TARGET = 900;
const BLOCK_LIMIT = 1600;
const EPUB_NS = "http://www.idpf.org/2007/ops";
const DC_NS = "http://purl.org/dc/elements/1.1/";

function xmlDocument(parser: DOMParser, source: string): Document {
  const doc = parser.parseFromString(source, "application/xml");
  if (doc.querySelector("parsererror")) throw new Error("Invalid EPUB XML");
  return doc;
}

function textOf(parent: ParentNode, selector: string): string {
  return normalize(parent.querySelector(selector)?.textContent ?? "");
}

function parseNcx(doc: Document): TocLink[] {
  const links: TocLink[] = [];
  const walk = (nodes: Element[]) => {
    for (const node of nodes) {
      const href = node.querySelector(":scope > content")?.getAttribute("src") ?? "";
      const label = textOf(node, ":scope > navLabel text");
      if (href) links.push({ href, label });
      walk(Array.from(node.children).filter((child) => child.localName === "navPoint"));
    }
  };
  walk(Array.from(doc.getElementsByTagNameNS("*", "navPoint")));
  // Nested navPoints are visited recursively from their parent; remove duplicate visits.
  const seen = new Set<string>();
  return links.filter((link) => {
    const key = link.href + "\u0000" + link.label;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function parseNav(doc: Document): TocLink[] {
  const links: TocLink[] = [];
  const navs = Array.from(doc.getElementsByTagNameNS("*", "nav"));
  const toc = navs.find((nav) =>
    nav.getAttributeNS(EPUB_NS, "type") === "toc" ||
    nav.getAttribute("role") === "doc-toc",
  ) ?? navs[0];
  if (!toc) return links;
  for (const anchor of Array.from(toc.getElementsByTagNameNS("*", "a"))) {
    const href = anchor.getAttribute("href") ?? "";
    const label = normalize(anchor.textContent);
    if (href) links.push({ href, label });
  }
  return links;
}

function tocForItem(links: readonly TocLink[], tocPath: string, spinePath: string): TocLink[] {
  return links.filter((link) => {
    const resolved = epubHrefKey(epubResolveRel(epubNavDir(tocPath), link.href));
    return resolved === epubHrefKey(spinePath);
  });
}

/** Reads EPUB bytes without relying on the legacy embedded epub.js runtime. */
export async function readEpub(
  input: ArrayBuffer | Uint8Array,
  parser: DOMParser = new DOMParser(),
): Promise<EpubImportResult> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(input instanceof Uint8Array ? input : new Uint8Array(input));
  } catch {
    throw Object.assign(new Error("This is not a valid EPUB file."), { epubInvalid: true });
  }

  const readText = async (path: string): Promise<string | null> => {
    const file = zip.file(path);
    return file ? file.async("string") : null;
  };

  try {
    const containerText = await readText("META-INF/container.xml");
    if (!containerText) throw new Error("Missing EPUB container");
    const container = xmlDocument(parser, containerText);
    const opfPath = container.getElementsByTagNameNS("*", "rootfile")[0]?.getAttribute("full-path");
    if (!opfPath) throw new Error("Missing EPUB package path");
    const opfText = await readText(opfPath);
    if (!opfText) throw new Error("Missing EPUB package");
    const opf = xmlDocument(parser, opfText);
    const opfDir = opfPath.includes("/") ? opfPath.slice(0, opfPath.lastIndexOf("/")) : "";

    const title = textOf(opf, "title") ||
      normalize(opf.getElementsByTagNameNS(DC_NS, "title")[0]?.textContent ?? "") || "Untitled";
    const author = textOf(opf, "creator") ||
      normalize(opf.getElementsByTagNameNS(DC_NS, "creator")[0]?.textContent ?? "");

    const manifest = new Map<string, ManifestItem>();
    for (const item of Array.from(opf.getElementsByTagNameNS("*", "item"))) {
      const id = item.getAttribute("id") ?? "";
      const href = item.getAttribute("href") ?? "";
      if (!id || !href) continue;
      manifest.set(id, {
        id, href: epubResolveRel(opfDir, href),
        mediaType: item.getAttribute("media-type") ?? "",
        properties: item.getAttribute("properties") ?? "",
      });
    }

    const spine = opf.getElementsByTagNameNS("*", "spine")[0];
    if (!spine) throw new Error("Missing EPUB spine");
    const spinePaths = Array.from(spine.getElementsByTagNameNS("*", "itemref"))
      .map((ref) => manifest.get(ref.getAttribute("idref") ?? ""))
      .filter((item): item is ManifestItem => !!item && item.mediaType === "application/xhtml+xml");

    const navItem = [...manifest.values()].find((item) => item.properties.split(/\s+/).includes("nav"));
    const ncxId = spine.getAttribute("toc");
    const ncxItem = (ncxId && manifest.get(ncxId)) ||
      [...manifest.values()].find((item) => item.mediaType === "application/x-dtbncx+xml");
    let tocPath = "";
    let toc: TocLink[] = [];
    const tocItem = navItem ?? ncxItem;
    if (tocItem) {
      tocPath = tocItem.href;
      const source = await readText(tocPath);
      if (source) {
        const doc = xmlDocument(parser, source);
        toc = navItem ? parseNav(doc) : parseNcx(doc);
      }
    }

    const sections: EpubBlock[][] = [];
    const chapterStarts: { start: number; count: number; title: string }[] = [];
    const anchorPositions: { p: number; title: string }[] = [];

    for (const item of spinePaths) {
      const source = await readText(item.href);
      if (!source) continue;
      let doc: Document;
      try { doc = xmlDocument(parser, source); } catch { continue; }
      const rawBlocks = epubBlocksFromRoot(doc, normalize);
      if (!rawBlocks?.length) continue;
      const blocks = epubExpandBlocks(rawBlocks, BLOCK_LIMIT);
      if (!blocks.length) continue;

      const packed = epubPackSections(blocks, SECTION_TARGET);
      const baseSection = sections.length;
      sections.push(...packed.sections);

      const links = tocForItem(toc, tocPath, item.href);
      const mainLabel = links.find((link) => !link.href.includes("#") && link.label)?.label;
      const heading = blocks.find((block) => block.t === "h")?.text ?? "";
      chapterStarts.push({
        start: baseSection,
        count: packed.sections.length,
        title: mainLabel || heading || title,
      });

      for (const link of links) {
        const hashAt = link.href.indexOf("#");
        if (hashAt < 0 || !link.label) continue;
        let anchor = link.href.slice(hashAt + 1).split("?")[0];
        try { anchor = decodeURIComponent(anchor); } catch { /* keep source fragment */ }
        const blockIndex = blocks.findIndex((block) => block.id === anchor);
        if (blockIndex < 0) continue;
        const localSection = packed.secOf[blockIndex];
        if (localSection !== undefined) anchorPositions.push({ p: baseSection + localSection, title: link.label });
      }
    }

    if (!sections.length) {
      throw Object.assign(new Error("This EPUB contains no readable text."), { epubEmpty: true });
    }

    return {
      title,
      author,
      hash: epubHash(input instanceof Uint8Array ? input : new Uint8Array(input)),
      sections,
      chapters: epubChapterList(chapterStarts, sections.length, anchorPositions),
    };
  } catch (error) {
    if (typeof error === "object" && error !== null &&
      ((error as Record<string, unknown>).epubInvalid === true ||
       (error as Record<string, unknown>).epubEmpty === true)) throw error;
    throw Object.assign(new Error(epubErr(error) || "This is not a valid EPUB file."), { epubInvalid: true, cause: error });
  }
}

export { epubErr, epubErrShort };
