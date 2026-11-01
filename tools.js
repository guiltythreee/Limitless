
 // ------------------------------------------------------------------
 // THE TOOL LIST — this is the only place you edit to add or change a card.
 //
 // status: "soon" = Coming Soon (card is not clickable)
 //         "dev"  = In Development (card is not clickable)
 //         "beta" = Beta (card opens its page)
 //         "live" = Live (card opens its page)
 // ------------------------------------------------------------------

const GROUPS = [
  { id: "trainers", title: "Trainers",
    note: "Practice tools to sharpen your mind and your hands." },
  { id: "studies", title: "Studies & Disciplines",
    note: "Explore the subjects you are studying and mastering." },
  { id: "next", title: "Coming Next",
    note: "Five chambers are reserved for future creations." },
  { id: "progression", title: "Progression",
    note: "Track shared EXP across modules registered with the Limitless reward standard." },
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
    desc: "Mental arithmetic from Acolyte to Abyss, with an 80-in-8 test mode, penalties and pace analysis.",
      href: "tools/math-refactored/index.html", status: "beta" },
 { group: "trainers", symbol: "✎", name: "Typing Trainer",
  desc: "Type through your own books and PDFs, track your weak keys, and level up.",
  href: "tools/typing/", status: "beta" },

  // ---- Studies & Disciplines (generated from app-owned registrations) ----
  ...(globalThis.LIMITLESS_STUDIES_CATALOG || []).map(study => ({
    group: "studies",
    symbol: study.symbol,
    name: study.title,
    desc: study.courses.length > 1
      ? study.description + " Courses: " + study.courses.map(course => course.title).join(", ") + "."
      : study.description,
    href: study.href,
    status: study.status,
    study
  })),

  // ---- Shared progression ----
  { group: "progression", symbol: "✧", name: "Meta Progression",
    desc: "View your global EXP, shared level, registered modules and the versioned Limitless reward standard.",
    href: "meta/", status: "beta" },

  // ---- Reserved slots for future tools ----
  { group: "next", symbol: "✧", name: "Hidden Chamber I",
    desc: "Something new is being forged here.", href: "", status: "soon" },
  { group: "next", symbol: "✧", name: "Hidden Chamber II",
    desc: "Something new is being forged here.", href: "", status: "soon" },
  { group: "next", symbol: "✧", name: "Hidden Chamber III",
    desc: "Something new is being forged here.", href: "", status: "soon" },
  { group: "next", symbol: "✧", name: "Hidden Chamber IV",
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

  if (tool.group === "studies" && tool.study) {
    const study = tool.study;
    card.classList.add("studies-card");
    card.dataset.studyId = study.id;

    const top = makeEl("div", "studies-card-top");
    const symbol = makeEl("span", "studies-card-symbol", study.symbol || "◇");
    symbol.setAttribute("aria-hidden", "true");
    top.appendChild(symbol);
    top.appendChild(makeEl("span", "studies-card-index",
      study.status === "beta" || study.status === "live" ? "AVAILABLE" : "IN PREPARATION"));
    card.appendChild(top);

    card.appendChild(makeEl("h3", "studies-card-title", study.title));
    card.appendChild(makeEl("p", "studies-card-description", study.description));

    const details = makeEl("div", "studies-card-details");
    details.appendChild(makeEl("span", "", study.courses.length + (study.courses.length === 1 ? " course" : " courses")));
    details.appendChild(makeEl("span", "", (study.capabilities || []).length + " study facilities"));
    card.appendChild(details);

    const courseList = makeEl("ul", "studies-card-courses");
    study.courses.forEach(course => courseList.appendChild(makeEl("li", "", course.title)));
    card.appendChild(courseList);

    const footer = makeEl("div", "studies-card-footer");
    footer.appendChild(makeEl("span", "studies-card-status", STATUS_LABELS[tool.status] || tool.status));
    footer.appendChild(makeEl("span", "studies-card-cta", "Explore discipline ↗"));
    card.appendChild(footer);
    return card;
  }

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
