# Limitless Resource Ingestion

A **private, local maintainer tool** for reducing the manual work involved in adding study resources to Limitless. It is not part of the student-facing application, is not deployed to Cloudflare, and exposes no upload endpoint.

## First pilot

- Course: MT203 — Polymer Science and Technology.
- Input: PDF.
- Processing: local PDF text extraction with PDF.js, followed by AI-assisted analysis using the OpenAI Responses API with the original PDF attached for visual inspection.
- Context: the current MT203 manifest, lesson theory, topic metadata and all 11 native question-bank source files.
- Output: a JSON proposal and a Markdown review report.
- Writes: only to the chosen local output directory. Existing course source files are never modified.

The analyzer identifies topic coverage, overlap, possible theory additions, illustrations, worked examples and **questions already present in the supplied source**. It must not invent practice questions.

## Setup

Requirements: Node.js 22+ and an OpenAI API key with access to a model that supports PDF input and Structured Outputs.

From the repository root:

```powershell
cd tools/resource-ingestion
npm install
$env:OPENAI_API_KEY = "your-key"
# Optional: choose a model available to your API account.
$env:OPENAI_MODEL = "gpt-6-astra"
```

Do not put API keys in source files, committed .env files, command history, or reports.

## Run

```powershell
node src/cli.mjs analyze --input "C:\path\to\lecture-notes.pdf" --course mt203
```

Optional arguments:

```text
--output-dir <directory>
--model <model-name>
```

Default output is a sibling directory named `limitless-ingestion-output`. The source PDF is hashed before analysis. A temporary copy is uploaded for model-side page inspection and the tool requests its deletion after analysis.

## Safety and review rules

1. Original resources are read-only; source SHA-256 is recorded.
2. The analyzer receives current course structure and content to identify duplicates and gaps.
3. Every proposal must carry source page references.
4. Source questions are extracted, not generated. Evidence quotes are checked against locally extracted PDF text; scanned-page cases that cannot be matched are routed to review.
5. Confidence below 0.90 triggers a review warning. Confidence is a triage signal, not proof of scientific correctness.
6. Unknown topic IDs, invalid page references and malformed provenance fail validation.
7. No course source, generated export, user progress or deployment configuration is changed.
8. This first version produces proposals only. A separate guarded integration stage must be designed and tested before it can write course-native files.

## Tests

```powershell
npm test
```

## Planned stages

- Add PPTX and DOCX extraction with slide/page provenance.
- Improve diagram, table and equation inventory, including image-only pages.
- Add semantic diffing and stable duplicate fingerprints.
- Prepare course-native patches behind explicit apply flags, pre-change backups and stale-file guards.
- Add adapters for MT202, MT201, Testing of Materials, Thermodynamics and Probability after the MT203 pilot meets its acceptance criteria.
