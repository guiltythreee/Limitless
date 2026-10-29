#!/usr/bin/env python3
"""Read-only validator for durable MT201/MT202 revision overlays and output mirrors."""
from __future__ import annotations
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

EXPECTED_COUNTS = {"mt201": 289, "mt202": 522}
HEX40 = re.compile(r"^[0-9a-f]{40}$")
HEX8 = re.compile(r"^[0-9a-f]{8}$")

class ValidationError(RuntimeError):
    pass

def json_read(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValidationError(f"Cannot read JSON {path}: {exc}") from exc

def fingerprint(q: dict) -> str:
    normalized = [
        q.get("text") or "",
        q.get("statements") or [],
        q.get("tableRows") or [],
        q.get("assertion") or "",
        q.get("reason") or "",
        [[o.get("label"), o.get("text")] for o in (q.get("options") or [])],
        q.get("answer") or "",
        q.get("type") or "",
    ]
    raw = json.dumps(normalized, ensure_ascii=False, separators=(",", ":"))
    h = 2166136261
    for ch in raw:
        h = ((h ^ ord(ch)) * 16777619) & 0xFFFFFFFF
    return f"{h:08x}"

def git_show(repo: Path, commit: str, path: str) -> str:
    result = subprocess.run(
        ["git", "show", f"{commit}:{path}"],
        cwd=repo, text=True, encoding="utf-8",
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False,
    )
    if result.returncode:
        raise ValidationError(f"git show failed for {commit}:{path}: {result.stderr.strip()}")
    return result.stdout

def unique_question(chapter_obj: dict, n: int, label: str) -> dict:
    matches = [q for q in chapter_obj.get("questions", []) if q.get("n") == n]
    if len(matches) != 1:
        raise ValidationError(f"{label}: expected exactly one question n={n}, found {len(matches)}")
    return matches[0]

def validate_course(repo: Path, sub: str) -> dict:
    root = repo / "metallurgy-source"
    overlay_path = root / "content-revisions" / f"{sub}.json"
    overlay = json_read(overlay_path)
    records = overlay.get("replacements")
    if not isinstance(records, list):
        raise ValidationError(f"{overlay_path}: replacements must be a list")
    source_commit = overlay.get("sourceCommit")
    if not isinstance(source_commit, str) or not HEX40.fullmatch(source_commit):
        raise ValidationError(f"{overlay_path}: missing/invalid pinned sourceCommit")

    public_dir = root / "public" / "data" / sub
    mirror_dir = repo / "metallurgy" / "data" / sub
    index = json_read(public_dir / "index.json")
    chapters = [p for p in sorted(public_dir.glob("ch*.json")) if re.fullmatch(r"ch\d+\.json", p.name)]
    if not chapters:
        raise ValidationError(f"No chapter JSONs in {public_dir}")
    public_by_chapter = {}
    count = 0
    for public_path in chapters:
        chapter = json_read(public_path)
        chapter_id = chapter.get("id")
        if chapter_id != public_path.stem:
            raise ValidationError(f"{public_path}: chapter id does not match file name")
        mirror_path = mirror_dir / public_path.name
        mirror = json_read(mirror_path)
        if chapter != mirror:
            raise ValidationError(f"Public/mirror JSON mismatch: {public_path.relative_to(repo)} vs {mirror_path.relative_to(repo)}")
        count += len(chapter.get("questions", []))
        public_by_chapter[chapter_id] = chapter
    if index.get("total") != count:
        raise ValidationError(f"{sub}: index total {index.get('total')} != chapter question count {count}")
    if count != EXPECTED_COUNTS[sub]:
        raise ValidationError(f"{sub}: question count changed unexpectedly: {count} != {EXPECTED_COUNTS[sub]}")
    indexed_count = sum(int(row.get("count", -1)) for row in index.get("chapters", []))
    if indexed_count != count:
        raise ValidationError(f"{sub}: chapter-index sum {indexed_count} != question count {count}")

    seen = set()
    for rec in records:
        if not isinstance(rec, dict):
            raise ValidationError(f"{overlay_path}: non-object revision record")
        chapter_id, n = rec.get("chapter"), rec.get("n")
        locator = (chapter_id, n)
        if not isinstance(chapter_id, str) or not isinstance(n, int):
            raise ValidationError(f"{overlay_path}: invalid locator {locator!r}")
        if locator in seen:
            raise ValidationError(f"{overlay_path}: duplicate locator {chapter_id} Q{n}")
        seen.add(locator)
        if not isinstance(rec.get("originalType"), str) or not isinstance(rec.get("sourceText"), str):
            raise ValidationError(f"{overlay_path}: {chapter_id} Q{n} is missing originalType/sourceText")
        src_fp = rec.get("sourceFingerprint")
        if not isinstance(src_fp, str) or not HEX8.fullmatch(src_fp):
            raise ValidationError(f"{overlay_path}: {chapter_id} Q{n} is missing a valid sourceFingerprint")
        updates = rec.get("updates")
        if not isinstance(updates, dict) or not updates:
            raise ValidationError(f"{overlay_path}: {chapter_id} Q{n} has no updates object")
        if chapter_id not in public_by_chapter:
            raise ValidationError(f"{overlay_path}: references absent chapter {chapter_id}")
        live_q = unique_question(public_by_chapter[chapter_id], n, f"{sub}/{chapter_id}")
        if live_q.get("type") != rec["originalType"]:
            raise ValidationError(f"{sub}/{chapter_id} Q{n}: current question type differs from recorded original type")
        for key, value in updates.items():
            if live_q.get(key) != value:
                raise ValidationError(f"{sub}/{chapter_id} Q{n}: generated output does not contain overlay update for {key}")
        base_path = f"metallurgy-source/public/data/{sub}/{chapter_id}.json"
        base = json.loads(git_show(repo, source_commit, base_path))
        base_q = unique_question(base, n, f"pinned baseline {sub}/{chapter_id}")
        if base_q.get("type") != rec["originalType"]:
            raise ValidationError(f"{sub}/{chapter_id} Q{n}: pinned baseline type mismatch")
        if (base_q.get("text") or "") != rec["sourceText"]:
            raise ValidationError(f"{sub}/{chapter_id} Q{n}: pinned baseline stem/sourceText mismatch")
        actual_fp = fingerprint(base_q)
        if actual_fp != src_fp:
            raise ValidationError(f"{sub}/{chapter_id} Q{n}: pinned baseline fingerprint {actual_fp} != recorded {src_fp}")

    # Confirm the sync script guards are active, so a later external-bank drift stops instead of silently applying by locator.
    sync_name = "sync-mt201.mjs" if sub == "mt201" else "sync.mjs"
    sync_text = (root / "scripts" / sync_name).read_text(encoding="utf-8")
    if "content-revisions" not in sync_text or f'"{sub}.json"' not in sync_text or "revision.sourceFingerprint" not in sync_text:
        raise ValidationError(f"Durable fingerprint guard missing from scripts/{sync_name}")
    return {"course": sub.upper(), "questions": count, "chapters": len(chapters), "overlayRecords": len(records), "fingerprintsVerified": len(records), "sourceCommit": source_commit}

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", required=True, help="Path to the Limitless repository")
    args = parser.parse_args()
    repo = Path(args.repo).expanduser().resolve()
    if not (repo / ".git").exists():
        raise ValidationError(f"Not a repository root: {repo}")
    results = [validate_course(repo, sub) for sub in ("mt201", "mt202")]
    print("PASS — durable question-quality overlays and generated mirrors")
    for row in results:
        print(f"{row['course']}: {row['questions']} questions, {row['chapters']} chapters, {row['overlayRecords']} overlays/fingerprints verified")
        print(f"  source commit: {row['sourceCommit']}")
    return 0

if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ValidationError as exc:
        print(f"VALIDATION FAILED: {exc}", file=sys.stderr)
        raise SystemExit(1)
