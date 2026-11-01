import { writeFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { PROBABILITY_STUDIES_REGISTRATION } from "../probability-source/app/studies/registration.ts";
import { METALLURGY_STUDIES_REGISTRATION } from "../metallurgy-source/app/studies/registration.ts";
import { validateStudyRegistry } from "../shared/studies/registry.ts";

const registrations = [
  PROBABILITY_STUDIES_REGISTRATION,
  METALLURGY_STUDIES_REGISTRATION,
];
const errors = validateStudyRegistry(registrations);
if (errors.length) {
  throw new Error("Invalid Studies registry:\\n" + errors.map((error) => "- " + error).join("\\n"));
}

const catalogue = registrations.map(({ descriptor, content }) => ({
  id: descriptor.id,
  title: descriptor.title,
  description: descriptor.description,
  href: descriptor.route.replace(/^\\//, "").replace(/\\/?$/, "/"),
  status: descriptor.status === "active" ? "beta" : "soon",
  symbol: descriptor.id === "probability" ? "◇" : descriptor.id === "metallurgy" ? "⚗" : "✧",
  courses: content.filter((item) => item.kind === "course").map(({ id, title, route, capabilities }) => ({
    id, title, route, capabilities: capabilities ?? [],
  })),
  capabilities: [...descriptor.capabilities],
}));

const output = "/* Generated from app-owned Studies registrations. Do not edit by hand. */\\n"
  + "globalThis.LIMITLESS_STUDIES_CATALOG = "
  + JSON.stringify(catalogue, null, 2)
  + ";\\n";
const outputPath = resolve("studies-catalog.js");

if (process.argv.includes("--write")) {
  await writeFile(outputPath, output, "utf8");
  process.stdout.write("Wrote studies-catalog.js\\n");
} else {
  let existing = "";
  try { existing = await readFile(outputPath, "utf8"); } catch {}
  if (existing !== output) {
    process.stderr.write("studies-catalog.js is stale. Run the generator with --write and commit the result.\\n");
    process.exitCode = 1;
  } else {
    process.stdout.write("Studies catalogue is current and registrations are valid.\\n");
  }
}
