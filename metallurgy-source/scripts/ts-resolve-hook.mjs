// scripts/ts-resolve-hook.mjs
//
// Minimal Node ESM resolve/load hook used by the read-only validators and the
// rendering test so they can import the app's TypeScript modules.
//
//   - resolve(): the app uses extensionless relative specifiers (idiomatic for
//     Next.js/webpack), which Node rejects; this adds extension fallbacks.
//   - load(): Node's native type stripping handles .ts, but it cannot parse
//     JSX in .tsx. For .tsx only, transpile with the installed TypeScript
//     compiler (react-jsx runtime). No file is written.
//
// .ts loading is deliberately left to Node's built-in stripper (nextLoad), so
// behaviour matches the Phase 1 validator.
//
// Usage:
//   node --import ./scripts/ts-resolve-hook.mjs scripts/validate-courses.mjs
//   node --import ./scripts/ts-resolve-hook.mjs scripts/test-qview.mjs

import { registerHooks } from "node:module";
import { readFileSync } from "node:fs";
import ts from "typescript";

const EXTENSIONS = [".ts", ".tsx", ".mts", ".js", ".jsx"];

registerHooks({
  resolve(specifier, context, nextResolve) {
    // Only intervene for relative/absolute/file specifiers; bare specifiers and
    // node: builtins go straight through.
    if (
      specifier.startsWith(".") ||
      specifier.startsWith("/") ||
      specifier.startsWith("file:")
    ) {
      try {
        return nextResolve(specifier, context);
      } catch (err) {
        for (const ext of EXTENSIONS) {
          try {
            return nextResolve(specifier + ext, context);
          } catch {
            /* try the next candidate */
          }
        }
        for (const ext of EXTENSIONS) {
          try {
            return nextResolve(specifier + "/index" + ext, context);
          } catch {
            /* try the next candidate */
          }
        }
        throw err;
      }
    }
    return nextResolve(specifier, context);
  },

  load(url, context, nextLoad) {
    if (url.startsWith("file:") && url.endsWith(".tsx")) {
      const source = readFileSync(new URL(url), "utf8");
      const { outputText } = ts.transpileModule(source, {
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
          esModuleInterop: true,
          sourceMap: false,
        },
        fileName: url,
      });
      return { format: "module", source: outputText, shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});
