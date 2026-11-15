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

## Review gate

The review packet is a staging artifact. Any future promotion tool must:
1. require explicit approval per record;
2. show source page and extracted text beside the proposed destination;
3. generate a patch/diff instead of writing directly to production;
4. preserve existing question IDs, metadata, and learner progress;
5. exclude question creation from automated processing.
