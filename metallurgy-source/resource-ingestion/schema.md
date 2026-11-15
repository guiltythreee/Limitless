# Resource ingestion record contract

## Source manifest

Each ingestion run records:
- `sourceId`: stable identifier derived from the source SHA-256.
- `fileName`, `sha256`, `mimeType`, `pageCount`.
- extraction tool names/versions and timestamp.
- optional course/topic/subtopic mapping hints (not authoritative).
- image inventory and extraction status.

## Knowledge record

Every record has:
- stable `id` derived from source hash, page, block index and content;
- `sourceId`, `sourcePage`, `blockIndex`;
- `kind`: `paragraph | heading | equation | table-row | bullet | image-reference`;
- `text` (or relative asset path for image references);
- `candidateType`: `definition | mechanism | property | equation | example | table | figure | explanation | unknown`;
- `mappingHint` (optional course/topic/subtopic only);
- `reviewStatus: "needs-review"`;
- `extractionMethod` and conservative `confidence`.

Candidate types are heuristics for triage, not semantic assertions. No record is approved by extraction.

## Review decisions and proposed patch

`review.mjs` accepts explicit decisions keyed by `recordId`:
- `approved`: requires a destination (`theory`, `illustration`, `worked-example`, or `reference`).
- `corrected`: requires a destination and non-empty `correctedText`.
- `rejected`: excluded from the proposed patch; may include a reviewer note.

Unknown IDs, duplicate decisions, invalid statuses and missing required fields are rejected. The tool emits review results and a proposed patch in JSON and Markdown. The patch is marked `proposed-not-applied`; it never writes to course content, question banks, learner progress or deployment assets. Application requires a separate human review and implementation step. Questions remain manually authored.
