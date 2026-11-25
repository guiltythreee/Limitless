# Probability Book 02 — Markdown source

**Introduction to Probability, Second Edition**  
Joseph K. Blitzstein and Jessica Hwang

This folder is the source location for Book 02 in the Limitless Probability archive.

- `book.json` defines the 13-chapter catalogue, printed starting pages, and the paths to chapter and solution Markdown.
- `chapters/` contains the chapter transcriptions.
- `solutions/` contains the matching detailed exercise solutions.

## Source archive

The source bundle is committed at:

`probability-source/book-02-markdown-source.zip`

The repository's Probability build workflow unpacks the archive into this folder before building the static site. The archive root contains `book2-markdown/`; the workflow validates all 13 chapter files and all 13 matching solution files before copying the content into the public reader path.

The supplied PDF text layer was extracted into Markdown with page-preserving text blocks. Mathematical glyphs are retained as extracted; this is not yet a semantic LaTeX transcription. Check ambiguous characters and equations against the source PDFs before treating them as verified.

PDFs are intentionally not included in the deployed reader. The reader loads the Markdown sources and preserves Book 01 and Probability course progress.
