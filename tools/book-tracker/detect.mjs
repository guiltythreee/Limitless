// Finds chapters, exercise sections and problem numbers in the text of a book.
// Pure logic (no DOM, no pdf.js), so it can be tested in Node.
//
// Input: pages = [{ height, lines: [{ text, x, y, size }] }]  (lines in reading order, top first)
// Output: { book: { title, chapters: [{ title, sections: [{ title, problems }] }] }, stats }

const WORD_NUMBERS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };

const CHAPTER_RE = /^chapter\s+(\d{1,3}|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b[\s.:—–-]*(.*)$/i;
const NUMBERED_HEADING_RE = /^(\d{1,2})\s+([A-Z][^.]{2,70})$/;

// "Problems", "Theoretical Exercises", "Self-Test Problems and Exercises", "1.3 Exercises", "Exercises 1.2"
const SECTION_RE = new RegExp(
  '^(?:\\d+(?:\\.\\d+)*\\s+)?' +
  '(?:(?:theoretical|review|additional|supplementary|supplemental|self[- ]test|practice|chapter|end[- ]of[- ]chapter|' +
  'conceptual|numerical|computational|programming|challenge|mixed|applied|concept check|warm[- ]up)\\s+)*' +
  '(?:problems?|exercises?|questions?)' +
  '(?:\\s+(?:and|&)\\s+(?:problems?|exercises?|questions?))?' +
  '(?:\\s+\\d+(?:\\.\\d+)*)?\\s*:?$', 'i');

// Where problems stop: answers, references, the next kind of material.
const STOP_RE = /^(?:answers?|solutions?|hints?)\b.{0,60}$|^(?:references|bibliography|index|glossary|summary|key terms|further reading|appendix\b.{0,50})$/i;

const PLAIN_PROBLEM_RE = /^\(?(\d{1,3})\s*[.)]\s*(?=\S)/;
const DOTTED_PROBLEM_RE = /^(\d{1,2})\.(\d{1,3})(?![\d.])\s+(?=\S)/;

const clean = s => String(s).replace(/\s+/g, ' ').trim();

function chapterNumber(token) {
  const t = token.toLowerCase();
  return WORD_NUMBERS[t] ?? Number(t);
}

function median(values) {
  const v = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!v.length) return 0;
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
}

export function detectBook(pages, fallbackTitle = 'Untitled book') {
  const medianSize = median(pages.flatMap(p => p.lines.map(l => l.size)));
  const chapters = [];
  let chapter = null;
  let chapterNo = 0;
  let section = null;
  let lastN = 0;          // last problem number seen in the current section
  let prevEnd = 0;        // last problem number of the previous section in this chapter

  const openChapter = (no, title) => {
    chapter = { title, sections: [] };
    chapters.push(chapter);
    chapterNo = no;
    section = null;
    lastN = 0;
    prevEnd = 0;
  };

  const closeSection = () => {
    if (section && section.problems.length) prevEnd = lastN;
    section = null;
  };

  for (const page of pages) {
    const { lines, height } = page;
    // A running header ("CHAPTER 3 Probability") can sit above the real chapter heading,
    // so on each page only the largest "Chapter N" lines count as headings.
    const candidateSizes = lines
      .filter(l => l.y >= height * 0.6 && CHAPTER_RE.test(clean(l.text)))
      .map(l => l.size);
    const biggest = candidateSizes.length ? Math.max(...candidateSizes) : 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const text = clean(line.text);
      if (!text) continue;
      const topArea = line.y >= height * 0.6;                     // pdf.js y grows upward
      const margin = line.y >= height * 0.93 || line.y <= height * 0.07; // running headers and footers

      // ---- chapter headings ----
      let m = CHAPTER_RE.exec(text);
      if (m && topArea && line.size >= biggest * 0.9) {
        const no = chapterNumber(m[1]);
        let rest = clean(m[2]);
        const looksLikeContents = /\.{3,}|\s\d{1,4}$/.test(rest);
        if (!looksLikeContents && no > chapterNo && no <= chapterNo + 3) {
          if (!rest) {
            const next = lines[i + 1] && clean(lines[i + 1].text);
            if (next && next.length <= 70 && !/^\d+$/.test(next) && !CHAPTER_RE.test(next)) rest = next;
          }
          openChapter(no, rest ? `Chapter ${no}: ${rest}` : `Chapter ${no}`);
          continue;
        }
        if (no <= chapterNo) continue;   // running header repeating the current chapter
      }
      m = NUMBERED_HEADING_RE.exec(text);
      if (m && topArea && medianSize && line.size >= medianSize * 1.4) {
        const no = Number(m[1]);
        if (no === chapterNo + 1 && !/\s\d{1,4}$/.test(m[2])) {
          openChapter(no, `Chapter ${no}: ${clean(m[2])}`);
          continue;
        }
      }

      // ---- end of problems ----
      if (text.length <= 70 && STOP_RE.test(text) && !margin) { closeSection(); continue; }

      // ---- section headings ----
      if (text.length <= 60 && SECTION_RE.test(text) && !margin) {
        closeSection();
        if (!chapter) openChapter(0, 'All problems');   // book without recognisable chapter headings
        section = { title: text.replace(/:$/, '').trim(), problems: [] };
        chapter.sections.push(section);
        lastN = 0;
        continue;
      }

      // ---- problem numbers ----
      if (!section || margin) continue;
      let n = 0;
      let label = '';
      const dotted = DOTTED_PROBLEM_RE.exec(text);
      if (dotted && (chapterNo === 0 || Number(dotted[1]) === chapterNo)) {
        n = Number(dotted[2]);
        label = `${dotted[1]}.${dotted[2]}`;
      } else {
        const plain = PLAIN_PROBLEM_RE.exec(text);
        if (!plain) continue;
        n = Number(plain[1]);
        label = String(n);
      }
      const prefix = label.includes('.') ? label.split('.')[0] + '.' : '';
      const startsHere = lastN === 0 && (n === 1 || n === prevEnd + 1);
      const continues = lastN > 0 && n > lastN && n <= lastN + 3;
      if (!startsHere && !continues) continue;
      // Fill small gaps: a number that the page layout hid is still in the book.
      for (let k = lastN > 0 ? lastN + 1 : n; k < n; k++) section.problems.push(prefix + k);
      section.problems.push(label);
      lastN = n;
    }
  }
  closeSection();

  // Only keep sections that actually have problems, and chapters that have sections.
  const kept = chapters
    .map(c => ({ ...c, sections: c.sections.filter(s => s.problems.length) }))
    .filter(c => c.sections.length);

  const problems = kept.reduce((sum, c) => sum + c.sections.reduce((s, x) => s + x.problems.length, 0), 0);
  return {
    book: { title: fallbackTitle, chapters: kept },
    stats: { chapters: kept.length, sections: kept.reduce((s, c) => s + c.sections.length, 0), problems }
  };
}

// Turns a detected book into the outline text used by the tracker, with runs like 1-20.
export function outlineText(book) {
  const out = [`# ${book.title}`];
  for (const chapter of book.chapters) {
    out.push(`## ${chapter.title}`);
    for (const section of chapter.sections) {
      out.push(`### ${section.title}`, compressLabels(section.problems));
    }
  }
  return out.join('\n') + '\n';
}

function compressLabels(labels) {
  const parts = [];
  let i = 0;
  while (i < labels.length) {
    const start = parse(labels[i]);
    let j = i;
    while (start && j + 1 < labels.length) {
      const next = parse(labels[j + 1]);
      if (!next || next.prefix !== start.prefix || next.n !== parse(labels[j]).n + 1) break;
      j++;
    }
    parts.push(j - i >= 2 ? `${labels[i]}-${labels[j]}` : labels.slice(i, j + 1).join(', '));
    i = j + 1;
  }
  return parts.join(', ');
}

function parse(label) {
  const m = /^(?:(\d+)\.)?(\d+)$/.exec(label);
  return m ? { prefix: m[1] || '', n: Number(m[2]) } : null;
}
