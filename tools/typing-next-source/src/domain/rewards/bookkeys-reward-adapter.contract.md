# Bookkeys reward adapter — extraction contract

Source: `tools/typing/bookkeys-rewards.mjs` on `main`.

The TypeScript port is in `bookkeys-reward-adapter.ts`. It is intentionally not imported by production code.

## Preserved behaviour

- Ledger key: `bookkeys-lsr1-v1`; module id: `bookkeys`.
- Completion evidence is allow-listed to fresh finished pages, completed chapters, and completed required book sections.
- Page awards require a 16-character lowercase hexadecimal content signature and at least 150 characters. The item id must equal `bookkeys:page:<signature>`.
- Chapter and book item ids must retain their exact prefixes.
- The adapter rejects incomplete events, wrong modules, malformed ids and malformed page evidence before reading/writing the ledger.
- Existing event ids are idempotent: the original record is returned and storage is not written again.
- The adapter reads only the LSR-1 ledger. It never reads or converts legacy `bookkeys:game` XP.
- Existing top-level payload fields are retained when the ledger is written.
- LSR-1 policy calculation, sanitisation and update notification are injected; the adapter does not duplicate reward policy.
- Storage read/parse failures produce an empty ledger. Storage write failures return null and do not dispatch an update.
- Browser globals are absent from the module; the caller owns storage and notification wiring.

## Compatibility gates before adoption

1. Port the existing `bookkeys-rewards.test.mjs` cases to this adapter and run both implementations against the same fixtures.
2. Verify exact record equality for normal, capped, duplicate and checkpoint-bonus awards.
3. Verify corrupt JSON, unavailable storage, failed writes, and preservation of unknown payload fields.
4. Keep the existing MJS adapter active until all parity tests pass.
5. Do not change the reward bridge or legacy Bookkeys EXP system as part of this extraction.
