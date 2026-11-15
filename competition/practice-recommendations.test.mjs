import assert from "node:assert/strict";
import { getPracticeRecommendations } from "./practice-recommendations.mjs";

const graph = getPracticeRecommendations("Graph Theory", "Bipartite graphs and odd-cycle reasoning");
assert.ok(graph.codeforces.some((item) => item.url.includes("dfs%20and%20similar")));
assert.deepEqual(graph.cses.map((item) => item.url), ["https://cses.fi/problemset/task/1668"]);

const dag = getPracticeRecommendations("Graph Theory", "Topological sorting and DAG paths");
assert.ok(dag.cses.some((item) => item.url.endsWith("/1679")));
assert.ok(dag.cses.some((item) => item.url.endsWith("/1680")));

const dp = getPracticeRecommendations("Dynamic Programming", "0/1 knapsack state and transition");
assert.ok(dp.cses.some((item) => item.url.endsWith("/1158")));
assert.ok(dp.codeforces.some((item) => item.url.includes("tags=dp")));

const probability = getPracticeRecommendations("Probability", "Conditional probability and Bayes theorem");
assert.ok(probability.codeforces.some((item) => item.url.includes("probabilities")));
assert.equal(probability.cses.length, 0, "do not invent a CSES mapping for subjects without curated CSES tasks");

const combinatorics = getPracticeRecommendations("Combinatorics", "Pigeonhole principle");
assert.ok(combinatorics.codeforces.some((item) => item.url.includes("combinatorics")));
assert.equal(combinatorics.cses.length, 0);

const codeforcesConcept = getPracticeRecommendations("Codeforces", "implementation");
assert.ok(codeforcesConcept.codeforces.some((item) => item.url.endsWith("?tags=implementation")),
  "Codeforces mastery concepts should link directly to their matching Codeforces tag");
assert.equal(codeforcesConcept.cses.length, 0,
  "do not invent CSES mappings for raw Codeforces tags");

const unknown = getPracticeRecommendations("Unclassified subject", "unknown concept");
assert.equal(unknown.codeforces.length, 0, "unknown subjects must not receive misleading default tags");
assert.equal(unknown.cses.length, 0);

console.log("CP practice recommendations: all assertions passed.");
