// Shared types + loaders for the MT203 Polymers archive.
// Mirrors the MT202 archive's shape so the two courses stay consistent,
// but adds subtopic / difficulty / question-type metadata and the
// topic-level records the dashboard, revision and mastery features need.
//
// Question sources live in app/data/qbank/t*.ts (typed, so `tsc` enforces
// the schema at build time) and are code-split: each topic is a dynamic
// import fetched only when opened. Module/topic metadata + question counts
// sit in app/data/qbank/meta.ts (tiny, bundled; counts are cross-checked
// against the real files by scripts/validate-mt203.mjs).

export type Option = { label: string; text: string };

/** Question taxonomy — every question declares exactly one type. */
export type QType =
  | "recall" // A. definitions, terminology, direct facts
  | "concept" // B. explain why / predict behaviour
  | "compare" // C. discriminate between commonly confused ideas
  | "apply" // D. engineering judgment, material/process selection
  | "numerical" // E. quantitative problems
  | "assertreason" // F. assertion–reason
  | "statement" // G. one-or-more-statements
  | "match" // H. match the following
  | "sequence" // I. order / mechanism steps
  | "graph" // J. read a plot, table or data set
  | "higher"; // K. multi-step, cross-topic, exam-challenge

export type Difficulty = 1 | 2 | 3 | 4; // basic | intermediate | advanced | exam-challenge

export const TYPE_NAMES: Record<QType, string> = {
  recall: "recall",
  concept: "conceptual",
  compare: "comparison",
  apply: "application",
  numerical: "numerical",
  assertreason: "assertion–reason",
  statement: "statements",
  match: "match",
  sequence: "sequence",
  graph: "data & graphs",
  higher: "exam challenge",
};

export const TYPE_ORDER: QType[] = [
  "recall", "concept", "compare", "apply", "numerical",
  "assertreason", "statement", "match", "sequence", "graph", "higher",
];

export const DIFF_NAMES: Record<Difficulty, string> = {
  1: "Basic",
  2: "Intermediate",
  3: "Advanced",
  4: "Exam challenge",
};

export type Question = {
  /** stable unique id, e.g. "t4-014" — never reuse or renumber */
  id: string;
  n: number; // 1-based display index inside its topic (injected by loader)
  topic: string; // lesson id, e.g. "t4" (injected by loader)
  type: QType;
  diff: Difficulty;
  /** Stem. Optional for assertion–reason items, whose stem is A + R. */
  text?: string;
  statements?: { num: number; text: string }[]; // statement-style items
  tableRows?: string[][]; // match tables / data tables
  assertion?: string; // assertion–reason stem
  reason?: string;
  options: Option[];
  answer: string; // correct option label, e.g. "c"
  why: string; // why the key is correct (markdown)
  distractors?: Record<string, string>; // label -> why it is wrong
  concept?: string; // governing equation / concept reference
  tags?: string[]; // "revision", "numeric", "confused", "formula"
  timedOk?: boolean; // safe to serve in a timed exam (default true)
};

/** Exactly the shape source files store (topic/n injected by the loader). */
export type StoredQuestion = Omit<Question, "topic" | "n">;

/** What each app/data/qbank/t*.ts default-exports (schema-enforced by tsc). */
export type TopicSource = {
  id: string;
  module: string;
  title: string;
  subtitle: string;
  subs: { id: string; title: string }[];
  questions: StoredQuestion[];
};

export type TopicMeta = { id: string; title: string; count: number };
export type ModuleMeta = { id: string; num: number; title: string; topics: TopicMeta[] };

export type TopicData = {
  id: string;
  module: string; // "m1"
  title: string;
  subtitle: string;
  /** subtopic ids + titles shown on the lesson/quiz header */
  subs: { id: string; title: string }[];
  questions: Question[]; // topic + n injected
};

export type ModuleData = {
  id: string;
  num: number;
  title: string;
  topics: TopicMeta[];
  questions: Question[]; // every question of every topic in the module
};

export const MODULE_IDS = ["m1", "m2", "m3", "m4"] as const;
export const TOPIC_IDS = [
  "t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10", "t11",
] as const;

export type TopicId = (typeof TOPIC_IDS)[number];

const IMPORTS: Record<TopicId, () => Promise<{ default: unknown }>> = {
  t1: () => import("../data/qbank/t1"),
  t2: () => import("../data/qbank/t2"),
  t3: () => import("../data/qbank/t3"),
  t4: () => import("../data/qbank/t4"),
  t5: () => import("../data/qbank/t5"),
  t6: () => import("../data/qbank/t6"),
  t7: () => import("../data/qbank/t7"),
  t8: () => import("../data/qbank/t8"),
  t9: () => import("../data/qbank/t9"),
  t10: () => import("../data/qbank/t10"),
  t11: () => import("../data/qbank/t11"),
};

const topicCache = new Map<string, Promise<TopicData>>();

export function loadTopic(id: string): Promise<TopicData> {
  let p = topicCache.get(id);
  if (!p) {
    const imp = IMPORTS[id as TopicId];
    if (!imp) return Promise.reject(new Error(`unknown topic ${id}`));
    p = imp().then((mod) => {
      const data = mod.default as TopicData & { questions: StoredQuestion[] };
      return {
        ...data,
        questions: data.questions.map((q, i) => ({ ...q, topic: data.id, n: i + 1 })),
      };
    });
    topicCache.set(id, p);
  }
  return p;
}

/** All questions of one module (for mixed practice / exams). */
export async function loadModule(id: string): Promise<ModuleData> {
  const { MODULE_META } = await import("../data/qbank/meta");
  const meta = MODULE_META.find((m) => m.id === id);
  if (!meta) throw new Error(`unknown module ${id}`);
  const parts = await Promise.all(meta.topics.map((t) => loadTopic(t.id)));
  return {
    id: meta.id,
    num: meta.num,
    title: meta.title,
    topics: meta.topics,
    questions: parts.flatMap((p) => p.questions),
  };
}

/** Every topic in the bank (cached, code-split fetches). */
export function loadEverything(): Promise<TopicData[]> {
  return Promise.all(TOPIC_IDS.map((t) => loadTopic(t)));
}
