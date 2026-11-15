const CSES_TASKS = {
  graphs: {
    traversal: [["Building Roads", 1666], ["Message Route", 1667], ["Counting Rooms", 1192], ["Labyrinth", 1193], ["Round Trip", 1669]],
    bipartite: [["Building Teams", 1668]],
    dag: [["Course Schedule", 1679], ["Course Schedule II", 2534], ["Longest Flight Route", 1680]],
    shortest: [["Shortest Routes I", 1671], ["Shortest Routes II", 1672], ["High Score", 1673]],
    spanning: [["Road Reparation", 1675], ["Road Construction", 1676]],
  },
  dp: {
    coins: [["Dice Combinations", 1633], ["Minimizing Coins", 1634], ["Coin Combinations I", 1635], ["Coin Combinations II", 1636]],
    grid: [["Grid Paths", 1638], ["Array Description", 1746]],
    knapsack: [["Book Shop", 1158], ["Money Sums", 1745], ["Two Sets II", 1093]],
    sequence: [["Increasing Subsequence", 1145], ["Edit Distance", 1639]],
  },
  coding: {
    basics: [["Weird Algorithm", 1068], ["Missing Number", 1083], ["Repetitions", 1069], ["Increasing Array", 1094], ["Permutations", 1070]],
    sorting: [["Distinct Numbers", 1621], ["Apartments", 1084], ["Ferris Wheel", 1090], ["Concert Tickets", 1091], ["Restaurant Customers", 1619], ["Movie Festival", 1629]],
    search: [["Sum of Two Values", 1640], ["Maximum Subarray Sum", 1643], ["Stick Lengths", 1074], ["Playlist", 1141], ["Towers", 1073], ["Traffic Lights", 1163]],
  },
};

const CODEFORCES_TAGS = {
  "logical reasoning": ["constructive algorithms", "math"],
  combinatorics: ["combinatorics", "math"],
  probability: ["probabilities", "math"],
  "graph theory": ["dfs and similar", "bfs"],
  "dynamic programming": ["dp"],
  "c++ / implementation": ["implementation", "greedy"],
};

function selectCsesGroup(subject, concept) {
  const text = String(concept || "").toLowerCase();
  if (subject === "Graph Theory") {
    if (/bipart|colour|color/.test(text)) return "bipartite";
    if (/dag|topolog|directed acyclic/.test(text)) return "dag";
    if (/shortest|dijkstra|path weight/.test(text)) return "shortest";
    if (/spanning|mst|kruskal|disjoint|dsu|union.find/.test(text)) return "spanning";
    return "traversal";
  }
  if (subject === "Dynamic Programming") {
    if (/coin|change|dice/.test(text)) return "coins";
    if (/grid|path/.test(text)) return "grid";
    if (/knapsack|subset.sum|selection/.test(text)) return "knapsack";
    if (/subsequence|string|edit distance|lcs/.test(text)) return "sequence";
    return "coins";
  }
  if (subject === "C++ / Implementation") {
    if (/sort|search|two.pointer|binary.search|prefix.sum/.test(text)) return "sorting";
    if (/subarray|two.sum|sliding.window|ordered set/.test(text)) return "search";
    return "basics";
  }
  return "";
}

/** Return official, topic-filtered practice entry points for a CP concept. */
export function getPracticeRecommendations(subject, concept = "") {
  const subjectKey = String(subject || "").trim().toLowerCase();
  const tags = subjectKey === "codeforces" && String(concept || "").trim()
    ? [String(concept).trim().toLowerCase()]
    : CODEFORCES_TAGS[subjectKey] || [];
  const codeforces = tags.map((tag) => ({
    label: "Codeforces · " + tag,
    url: "https://codeforces.com/problemset?tags=" + encodeURIComponent(tag),
  }));
  const group = selectCsesGroup(subject, concept);
  const cses = group && CSES_TASKS[subject === "Graph Theory" ? "graphs" : subject === "Dynamic Programming" ? "dp" : "coding"][group]
    ? CSES_TASKS[subject === "Graph Theory" ? "graphs" : subject === "Dynamic Programming" ? "dp" : "coding"][group]
    : [];
  return {
    codeforces,
    cses: cses.map(([name, id]) => ({
      label: "CSES · " + name,
      url: "https://cses.fi/problemset/task/" + id,
    })),
  };
}
