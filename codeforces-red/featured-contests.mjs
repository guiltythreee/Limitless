const CONTEST_URL = "https://codeforces.com/contest/";

export const FEATURED_CONTEST_GROUPS = [
  {
    id: "division-3-4",
    title: "Division 3 and Division 4 progression",
    description: "Accessible full-round practice. Start with the early problems, then upsolve the first one you cannot solve under contest conditions.",
    contests: [
      { id: 2290, title: "Codeforces Round 1134 (Div. 4)" },
      { id: 2218, title: "Codeforces Round 1090 (Div. 4)" },
      { id: 2185, title: "Codeforces Round 1074 (Div. 4)" },
      { id: 2278, title: "Codeforces Round 1131 (Div. 3)" },
      { id: 2275, title: "Codeforces Round 1125 (Div. 3)" },
      { id: 2266, title: "Codeforces Round 1122 (Div. 3)" },
      { id: 2259, title: "Codeforces Round 1119 (Div. 3)" },
      { id: 2254, title: "Codeforces Round 1114 (Div. 3)" },
      { id: 2244, title: "Codeforces Round 1109 (Div. 3)" },
      { id: 2241, title: "Codeforces Round 1107 (Div. 3)" },
      { id: 2236, title: "Codeforces Round 1103 (Div. 3)" },
      { id: 2227, title: "Codeforces Round 1096 (Div. 3)" },
      { id: 2200, title: "Codeforces Round 1084 (Div. 3)" }
    ]
  },
  {
    id: "educational",
    title: "Educational Codeforces Rounds",
    description: "Rated for Division 2. Use these as structured practice: attempt the round independently, then upsolve every problem you could not finish.",
    contests: [
      { id: 2283, title: "Educational Codeforces Round 196" },
      { id: 2276, title: "Educational Codeforces Round 195" },
      { id: 2260, title: "Educational Codeforces Round 194" },
      { id: 2253, title: "Educational Codeforces Round 193" },
      { id: 2242, title: "Educational Codeforces Round 192" },
      { id: 2233, title: "Educational Codeforces Round 191" },
      { id: 2230, title: "Educational Codeforces Round 190" },
      { id: 2225, title: "Educational Codeforces Round 189" },
      { id: 2204, title: "Educational Codeforces Round 188" },
      { id: 2203, title: "Educational Codeforces Round 187" }
    ]
  },
  {
    id: "global",
    title: "Codeforces Global Rounds",
    description: "Broad mixed-difficulty rounds. Best used after you are comfortable completing regular Division 2 or Division 3 contests.",
    contests: [
      { id: 1178, title: "Codeforces Global Round 4" },
      { id: 1326, title: "Codeforces Global Round 7" },
      { id: 1368, title: "Codeforces Global Round 8" },
      { id: 1375, title: "Codeforces Global Round 9" }
    ]
  },
  {
    id: "community-favourites",
    title: "Community favourites — historical upvote snapshot",
    description: "A set selected from the most-upvoted Codeforces rounds list published in September 2019. This is a historical community snapshot, not a live popularity ranking.",
    sourceUrl: "https://codeforces.com/blog/entry/69672",
    contests: [
      { id: 913, title: "Hello 2018" },
      { id: 773, title: "VK Cup 2017 — Round 3" },
      { id: 806, title: "Codeforces Round 412 — Div. 1" },
      { id: 807, title: "Codeforces Round 412 — Div. 2" },
      { id: 1097, title: "Hello 2019" },
      { id: 549, title: "Looksery Cup 2015" },
      { id: 611, title: "Good Bye 2015" },
      { id: 1205, title: "Codeforces Round 580 — Div. 1" },
      { id: 1206, title: "Codeforces Round 580 — Div. 2" },
      { id: 908, title: "Good Bye 2017" },
      { id: 538, title: "Codeforces Round 300" },
      { id: 515, title: "Codeforces Round 292 — Div. 2" },
      { id: 1149, title: "Codeforces Round 556 — Div. 1" },
      { id: 1150, title: "Codeforces Round 556 — Div. 2" }
    ]
  }
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

export function renderFeaturedContestGroups(groups = FEATURED_CONTEST_GROUPS) {
  return groups.map((group) => {
    const cards = group.contests.map((contest) => (
      '<article class="cf-featured-card">' +
        '<div class="cf-featured-card-copy">' +
          '<strong>' + escapeHtml(contest.title) + '</strong>' +
          '<small>Contest #' + contest.id + '</small>' +
        '</div>' +
        '<a href="' + CONTEST_URL + contest.id + '" target="_blank" rel="noopener noreferrer">Open round ↗</a>' +
      '</article>'
    )).join("");
    const source = group.sourceUrl
      ? '<a class="cf-featured-source" href="' + escapeHtml(group.sourceUrl) + '" target="_blank" rel="noopener noreferrer">Why this group was selected ↗</a>'
      : "";
    return '<details class="cf-featured-group">' +
      '<summary>' +
        '<span><strong>' + escapeHtml(group.title) + '</strong><small>' + escapeHtml(group.description) + '</small></span>' +
        '<span class="cf-featured-count">' + group.contests.length + ' rounds</span>' +
      '</summary>' +
      '<div class="cf-featured-list">' + cards + '</div>' + source +
    '</details>';
  }).join("");
}
