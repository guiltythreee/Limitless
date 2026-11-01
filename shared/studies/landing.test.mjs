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
}));
assert.ok(probability.some((node) => node.type === "h1" && node.children[0] === "Probability"));
assert.equal(probability.filter((node) => node.props.className === "studies-landing__pathway").length, 5);
assert.ok(probability.some((node) => node.type === "Link" && node.props.href === "/"));

const metallurgy = flatten(createStudiesLanding(createElement, "Link", {
  registration: METALLURGY_STUDIES_REGISTRATION,
  snapshots: [],
  ready: true,
}));
const courseLinks = metallurgy.filter((node) =>
  node.type === "Link" && typeof node.props.href === "string" && node.props.href.startsWith("/mt")
);
assert.deepEqual(courseLinks.map((node) => node.props.href), ["/mt201", "/mt202", "/mt203"]);
assert.ok(metallurgy.some((node) => node.type === "h2" && node.children[0] === "Discipline capabilities"));
console.log("Shared Studies landing composition checks passed.");
