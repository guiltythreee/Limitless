// ------------------------------------------------------------------
// THE TOOL LIST — this is the only place you edit to add or change a card.
//
// status: "soon" = Coming Soon (card is not clickable)
//         "dev"  = In Development (card is not clickable)
//         "beta" = Beta  (card opens its page)
//         "live" = Live  (card opens its page)
//
// To launch a tool: build its page (for example tools/math/index.html),
// then change its status from "soon" to "beta" or "live".
// To fill a reserved slot: change its name, symbol, desc and href, then
// set the status.
// ------------------------------------------------------------------

const GROUPS = [
  { id: "trainers", title: "Trainers",
    note: "Practice tools to sharpen your mind and your hands." },
  { id: "next", title: "Coming Next",
    note: "Five chambers are reserved for future creations." },
  { id: "misc", title: "Miscellaneous",
    note: "Everything else: applications, experiments and odds and ends." }
];

const STATUS_LABELS = {
  soon: "Coming Soon",
  dev: "In Development",
  beta: "Beta",
  live: "Live"
};

const TOOLS = [
  // ---- Trainers ----
  { group: "trainers", symbol: "∑", name: "Math Trainer",
    desc: "Rapid-fire arithmetic with integers and decimals, plus square roots and cube roots.",
    href: "tools/math/", status: "soon" },
  { group: "trainers", symbol: "✎", name: "Typing Trainer",
    desc: "Type through your own books and PDFs, track your weak keys, and level up.",
    href: "tools/typing/", status: "soon" },

  // ---- Reserved slots for future tools ----
  { group: "next", symbol: "✧", name: "Hidden Chamber I",
    desc: "Something new is being forged here.", href: "", status: "soon" },
  { group: "next", symbol: "✧", name: "Hidden Chamber II",
    desc: "Something new is being forged here.", href: "", status: "soon" },
  { group: "next", symbol: "✧", name: "Hidden Chamber III",
    desc: "Something new is being forged here.", href: "", status: "soon" },
  { group: "next", symbol: "✧", name: "Hidden Chamber IV",
    desc: "Something new is being forged here.", href: "", status: "soon" },
  { group: "next", symbol: "✧", name: "Hidden Chamber V",
    desc: "Something new is being forged here.", href: "", status: "soon" },

  // ---- Miscellaneous ----
  { group: "misc", symbol: "◇", name: "Windows Application",
    desc: "A desktop companion is in development. A download will appear here when it is ready.",
    href: "", status: "dev" },
  { group: "misc", symbol: "✦", name: "Miscellaneous",
    desc: "Odds, ends and experiments that do not fit anywhere else yet.",
    href: "", status: "soon" }
];

// ------------------------------------------------------------------
// Rendering (you should not need to edit below this line)
// ------------------------------------------------------------------

function makeEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function buildCard(tool) {
  const isLive = (tool.status === "live" || tool.status === "beta") && tool.href;
  const card = isLive ? makeEl("a", "card is-live") : makeEl("article", "card is-locked");
  if (isLive) card.href = tool.href;

  const symbol = makeEl("div", "card-symbol", tool.symbol);
  symbol.setAttribute("aria-hidden", "true");
  card.appendChild(symbol);

  card.appendChild(makeEl("h3", "", tool.name));
  card.appendChild(makeEl("p", "", tool.desc));

  const label = STATUS_LABELS[tool.status] || tool.status;
  card.appendChild(makeEl("span", "status status-" + tool.status, label));

  if (isLive) card.appendChild(makeEl("div", "card-cta", "Open →"));
  return card;
}

function renderTools() {
  const mount = document.getElementById("tool-groups");
  if (!mount) return;

  GROUPS.forEach(group => {
    const items = TOOLS.filter(t => t.group === group.id);
    if (!items.length) return;

    const section = makeEl("div", "group");
    section.id = group.id;
    section.appendChild(makeEl("h3", "group-title", group.title));
    section.appendChild(makeEl("p", "group-note", group.note));

    const grid = makeEl("div", "tool-grid");
    items.forEach(tool => grid.appendChild(buildCard(tool)));
    section.appendChild(grid);
    mount.appendChild(section);
  });
}

renderTools();
