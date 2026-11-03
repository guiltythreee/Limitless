import assert from "node:assert/strict";
import { createStudiesLanding } from "./StudiesLanding.ts";
import { PROBABILITY_STUDIES_REGISTRATION } from "../../probability-source/app/studies/registration.ts";
import { METALLURGY_STUDIES_REGISTRATION } from "../../metallurgy-source/app/studies/registration.ts";

const createElement = (type, props, ...children) => ({
  type,
  props: props ?? {},
  children: children.flat().filter((child) => child !== null && child !== false),
});
const flatten = (node) => {
  if (!node || typeof node !== "object") return [];
  return [node, ...(node.children ?? []).flatMap(flatten)];
};

const probability = flatten(createStudiesLanding(createElement, "Link", {
  registration: PROBABILITY_STUDIES_REGISTRATION,
  snapshots: [],
  ready: true,
  pathwayHref: (pathwayId) => `/probability/?pathway=${encodeURIComponent(pathwayId)}#study`,
}));
assert.ok(probability.some((node) => node.type === "h1" && node.children[0] === "Probability"));
const pathwayCards = probability.filter((node) =>
  node.type === "Link" && String(node.props.className ?? "").split(/\s+/).includes("studies-landing__pathway")
);
assert.equal(pathwayCards.length, 5, "Probability keeps all five curated pathways");
assert.ok(pathwayCards.every((node) => /^\/probability\/\?pathway=[a-z-]+#study$/.test(node.props.href)), "Each pathway opens its own filtered Probability route under the deployment base path");
assert.ok(probability.some((node) => node.type === "span" && String(node.children?.[0] ?? "").startsWith("Sequences ")), "Pathway cards show their sequence coverage");
assert.ok(probability.some((node) => node.type === "div" && String(node.children?.[0] ?? "").includes("completed")), "Pathway cards show shared completion progress");
assert.ok(probability.some((node) => node.type === "Link" && node.props.href === "/"));

const metallurgy = flatten(createStudiesLanding(createElement, "Link", {
  registration: METALLURGY_STUDIES_REGISTRATION,
  snapshots: [],
  ready: true,
}));
const courseLinks = metallurgy.filter((node) =>
  node.type === "Link" && typeof node.props.href === "string" && node.props.href.startsWith("/mt")
);
assert.deepEqual(courseLinks.map((node) => node.props.href), ["/mt200", "/mt201", "/mt202", "/mt203"]);
assert.ok(metallurgy.some((node) => node.type === "h2" && node.children[0] === "Study progress"));
console.log("Shared Studies landing composition checks passed.");

import { readFileSync } from "node:fs";
const landingCss = readFileSync(new URL("./landing.css", import.meta.url), "utf8");
for (const token of [
  ".studies-landing__hero-copy {\n  min-width: 0;",
  "overflow-wrap: anywhere;",
  "@media (max-width:760px) {\n  .studies-landing__hero {\n    flex-wrap: wrap;",
  ".studies-landing__hero-mark {\n    flex: 0 0 auto;",
]) assert.ok(landingCss.includes(token), `missing responsive Studies landing rule: ${token}`);
assert.ok(landingCss.includes(".studies-landing a:focus-visible"), "Studies landing links expose a visible keyboard focus indicator");
assert.ok(landingCss.includes("outline-offset: 3px;"), "Studies landing focus indicator is offset from link text");
assert.ok(landingCss.includes("@media (forced-colors: active)"), "Studies landing focus indicator supports forced-colour mode");
assert.ok(landingCss.includes("outline-color: Highlight;"), "Studies landing uses the system highlight in forced-colour mode");
