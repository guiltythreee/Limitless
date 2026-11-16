# LSR-1 IndexedDB archive migration design

Status: design checkpoint only. No runtime storage behavior changes in this document's commit.

## Why a CP-only storage swap is unsafe

The current reward contract is synchronous and shared:

- `competition/competition-rewards.mjs` reads and writes the CP LSR-1 ledger in `localStorage`, compacts the complete ledger on each committed batch, and uses exact event IDs for idempotency. `competition/codeforces-sync.mjs` calls this adapter synchronously inside `syncCodeforcesSubmissions`; `competition/accounts.js` currently consumes that result synchronously after the API fetch.
- `shared/rewards.mjs` implements `readGlobalRewardSummary(storage)`. It synchronously reads every entry in `REWARD_SOURCE_REGISTRY`, expands every archive, and recomputes total EXP, award count, module breakdown, level, unlocks, and recent awards.
- `meta/meta.js` calls that global summary during dashboard rendering. It also renders recent awards and module totals.
- `shared/projects.mjs` reads the personal-project ledger synchronously when listing/completing projects. `completeProject` returns the global total after writing a project reward. Its callers in `meta/meta.js` must become asynchronous without allowing duplicate form submissions or stale project renders.
- `competition/competition-backup.mjs` includes the CP reward payload in backup export, validates it on import, restores it with the other Competition localStorage keys, and removes it during Competition reset. The UI in `competition/competition.js` currently calls export, restore, and reset synchronously after dynamically importing the module; all three call sites must await the new asynchronous APIs.
- Other reward-producing modules still write their own LSR-1 payloads to localStorage.

Moving only CP's archive to IndexedDB while leaving these contracts unchanged would either hide CP EXP from the global dashboard, create a split-brain ledger, or omit archived records from backup/reset.

## Target architecture

Use one shared IndexedDB repository for LSR-1 event records and derived indexes. Keep legacy module ledgers readable during a staged migration; do not migrate every module in the same release as the CP storage fix.

Database: `limitless-rewards`  
Database version: start at 1; schema changes must use explicit version upgrades.

Object stores:

| Store | Key | Purpose |
|---|---|---|
| `events` | `eventId` | Lossless canonical LSR-1 records; exact event identity is the idempotency authority |
| `moduleState` | `moduleId` | Per-module total EXP, qualifying award count, record count, and bounded recent-award projection |
| `repeatState` | `[moduleId, itemId, localDayKey]` | Exact repeat-cap counter used by the reward policy |
| `checkpointState` | `[moduleId, checkpointId]` | First-pass checkpoint bonus identity |
| `meta` | string key | Schema version, migration marker, and integrity metadata |

A single read-write transaction across the required stores must:
1. Check whether each incoming `eventId` already exists.
2. Read/update the relevant repeat counter and checkpoint identity.
3. Apply the unchanged LSR-1 calculation in chronological order.
4. Insert every accepted activity record (including zero-EXP capped completions and separate checkpoint-bonus records).
5. Update per-module aggregates and the bounded recent-award projection.
6. Commit all event and index changes together.

A transaction abort must leave all of those stores unchanged. The existing localStorage ledger remains authoritative until a complete migration has been validated and an explicit cutover marker is committed.

## Public API transition

Introduce asynchronous APIs alongside the synchronous legacy APIs first:

- `openRewardRepository()`
- `awardRewardBatch(moduleId, inputs)`
- `readRewardModuleSummary(moduleId)`
- `readGlobalRewardSummaryAsync(storage)`
- `exportRewardModule(moduleId)`
- `importRewardModule(moduleId, snapshot)`
- `deleteRewardModule(moduleId)`

The global reader combines IndexedDB module summaries with the existing localStorage module ledgers. It must not expand every historical event merely to render the Meta dashboard. Level, EXP, counts, module breakdown, and recent awards are computed from exact aggregate projections and cross-checked against the source records in tests. Return per-source integrity errors explicitly; never silently skip a malformed or unavailable registered ledger and present a plausible but understated total.

Do not make `readGlobalRewardSummary` return a Promise under its existing name/signature; that would silently break current callers. Migrate consumers explicitly and retain the synchronous function for legacy-only readers until cutover is complete.

## Migration and cutover protocol

1. **Inventory and compatibility:** keep the current localStorage format and all writers unchanged. Add IndexedDB repository, schema, transaction tests, and async summary API.
2. **Shadow import:** read and validate the entire existing CP payload (archive plus recent records); import with event-ID uniqueness checks. Verify record count, total EXP, qualifying award count, repeat counters, checkpoint identities, and the 20 most recent awards against the old ledger.
3. **Dual-read verification:** compute old and new summaries independently. Any mismatch, corrupt archive, unavailable IndexedDB, or quota error leaves the old ledger authoritative and visible.
4. **Controlled write cutover:** only after parity, write new CP rewards to IndexedDB. Persist a localStorage migration marker only after the IndexedDB transaction commits. The marker is a pointer/status indicator, not a second source of reward data.
5. **Backup v4:** make Competition backup export/import asynchronous and update the three UI call sites to await them. Export must include all CP event records and repository metadata. Import must validate the full snapshot before mutation. Restore must stage a complete IDB snapshot and preserve a recoverable previous snapshot; report partial/rollback failure explicitly. Never silently omit the IDB store.
6. **Reset:** make the reset API and UI handler asynchronous. Reset must delete only the CP module's IndexedDB records/indexes and CP legacy keys. Other module ledgers must remain unchanged. Reset failure must be surfaced and must not claim success.
7. **Retirement:** remove the old CP localStorage archive only after successful export, restore, reset, cross-tab, and real-browser quota tests. Keep a one-release rollback path.

## Required invariants and tests

- Exact `eventId` uniqueness; no probabilistic deduplication or truncation.
- Every completed valid activity remains represented, even when its EXP is zero due to the daily repeat cap.
- Repeat ordinals and first-checkpoint bonuses match the current sequential LSR-1 policy.
- A failed transaction changes neither events nor indexes nor summaries.
- Concurrent tabs cannot award the same event twice; the IndexedDB unique key and read-write transaction are authoritative.
- Duplicate IDs within a batch and across retries are idempotent.
- Chronological processing is deterministic for a batch; ordering is stable for equal timestamps.
- Summary projections match a full recomputation from canonical events.
- Corrupt or incomplete legacy payloads fail closed; no automatic destructive repair.
- Export/import round-trips all event identities and accounting fields.
- Quota errors, blocked upgrades, unavailable IndexedDB, private-browsing restrictions, and database version changes produce explicit errors without deleting the legacy source.
- `syncCodeforcesSubmissions`, account refresh, backup export/import/reset, global Meta rendering, project listing, and project completion all await the repository APIs and handle rejection explicitly.
- Cross-tab updates refresh Meta and CP views through `BroadcastChannel` or a storage-event-compatible notification.
- Real-browser tests cover multi-tab races, interrupted migration, blocked upgrades, quota failure, export/import, and reset.

## Scope boundary

This is a storage-capacity and durability migration, not a reward-policy redesign. Keep the LSR-1 EXP values, difficulty multipliers, three-full-awards-per-item-per-local-day rule, event IDs, account history, and CP revision scheduler semantics unchanged. Do not merge this migration into PR #262 until it exists as a separately testable implementation and has a recovery plan.
