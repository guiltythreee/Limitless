/**
 * TypeScript port of tools/typing/bookkeys-rewards.mjs.
 *
 * This module is deliberately dependency-injected and has no browser globals.
 * It preserves the LSR-1 storage key, validation rules, event identity,
 * idempotency, payload merge semantics and failure behaviour. It is not wired
 * into the production reader or preview UI yet.
 */

export const BOOKKEYS_REWARD_STORAGE_KEY = "bookkeys-lsr1-v1" as const;
export const BOOKKEYS_REWARD_MODULE_ID = "bookkeys" as const;

export type BookkeysCompletionEvidence =
  | "finished-book-page"
  | "completed-book-chapter"
  | "completed-required-book-sections";

export interface RewardRecord {
  readonly eventId: string;
  readonly [key: string]: unknown;
}

export interface RewardActivity {
  readonly eventId: string;
  readonly moduleId: string;
  readonly itemId: string;
  readonly completionEvidence: BookkeysCompletionEvidence | string;
  readonly completed: boolean;
  readonly ts?: number;
  readonly quality?: number;
  readonly contentSignature?: string;
  readonly characterCount?: number;
  readonly [key: string]: unknown;
}

export interface RewardStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface RewardPolicy {
  buildRewardRecords(activity: RewardActivity, prior: readonly RewardRecord[]): RewardRecord[];
  sanitiseRewardRecords(raw: unknown): RewardRecord[];
  dispatchRewardUpdate(): void;
}

interface LedgerPayload {
  readonly rewardLedger?: unknown;
  readonly [key: string]: unknown;
}

interface LoadedLedger {
  readonly payload: LedgerPayload;
  readonly records: RewardRecord[];
}

interface ActivityRule {
  readonly activityClass: "standard-task" | "unit-milestone" | "major-completion";
  readonly difficulty: "foundational" | "intermediate" | "advanced";
  readonly prefix: string;
}

const ACTIVITY_RULES: Readonly<Record<BookkeysCompletionEvidence, ActivityRule>> = Object.freeze({
  "finished-book-page": {
    activityClass: "standard-task",
    difficulty: "foundational",
    prefix: "bookkeys:page:",
  },
  "completed-book-chapter": {
    activityClass: "unit-milestone",
    difficulty: "intermediate",
    prefix: "bookkeys:chapter:",
  },
  "completed-required-book-sections": {
    activityClass: "major-completion",
    difficulty: "advanced",
    prefix: "bookkeys:book:",
  },
});

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;
const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);
const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export interface BookkeysRewardAdapterOptions {
  readonly now?: () => number;
}

/**
 * Storage is injectable for deterministic tests. award() stays synchronous so
 * the reader can call it only after its own progress save has succeeded.
 */
export function createBookkeysRewardAdapter(
  storage: RewardStorage,
  policy: RewardPolicy,
  options: BookkeysRewardAdapterOptions = {},
) {
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function") {
    throw new TypeError("Bookkeys rewards require getItem/setItem storage");
  }
  const now = typeof options.now === "function" ? options.now : () => Date.now();

  function loadState(): LoadedLedger {
    try {
      const raw = storage.getItem(BOOKKEYS_REWARD_STORAGE_KEY);
      if (!raw) return { payload: {}, records: [] };
      const payload: unknown = JSON.parse(raw);
      if (!isObject(payload)) return { payload: {}, records: [] };
      return {
        payload,
        records: policy.sanitiseRewardRecords(payload.rewardLedger),
      };
    } catch {
      return { payload: {}, records: [] };
    }
  }

  function award(input: RewardActivity): RewardRecord | null {
    if (!isObject(input) || input.completed !== true || !isString(input.eventId)) return null;
    const rule = ACTIVITY_RULES[input.completionEvidence as BookkeysCompletionEvidence];
    if (!rule || input.moduleId !== BOOKKEYS_REWARD_MODULE_ID) return null;
    if (!isString(input.itemId) || !input.itemId.startsWith(rule.prefix)) return null;

    if (input.completionEvidence === "finished-book-page") {
      const signature = isString(input.contentSignature) ? input.contentSignature : "";
      const characters = isFiniteNumber(input.characterCount)
        ? Math.floor(input.characterCount)
        : 0;
      if (!/^[a-f0-9]{16}$/.test(signature) || characters < 150) return null;
      if (input.itemId !== rule.prefix + signature) return null;
    }

    const state = loadState();
    const existing = state.records.find((record) => record.eventId === input.eventId);
    if (existing) return existing;

    const activity: RewardActivity = {
      ...input,
      moduleId: BOOKKEYS_REWARD_MODULE_ID,
      ts: isFiniteNumber(input.ts) && input.ts > 0 ? Math.round(input.ts) : Math.round(now()),
      activityClass: rule.activityClass,
      difficulty: rule.difficulty,
      quality: isFiniteNumber(input.quality) ? clamp(input.quality, 0, 1) : 0,
      completed: true,
    };

    const records = policy.buildRewardRecords(activity, state.records);
    const record = records[0];
    if (!record) return null;
    try {
      storage.setItem(
        BOOKKEYS_REWARD_STORAGE_KEY,
        JSON.stringify({
          ...state.payload,
          rewardLedger: [...state.records, ...records],
        }),
      );
    } catch {
      return null;
    }
    policy.dispatchRewardUpdate();
    return record;
  }

  function getRecords(): RewardRecord[] {
    return loadState().records;
  }

  return { award, getRecords };
}
