import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("prepare CLI reports a useful error when --analysis is missing", () => {
  const result = spawnSync(process.execPath, ["src/cli.mjs", "prepare"], {
    cwd: root,
    encoding: "utf8"
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /--analysis <analysis\.json> is required/);
  assert.doesNotMatch(result.stderr, /prepare is not defined/);
});
