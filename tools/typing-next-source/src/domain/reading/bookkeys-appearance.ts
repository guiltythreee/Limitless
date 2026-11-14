// @ts-nocheck
/**
 * Original Bookkeys appearance catalogue and colour resolver.
 * Theme palettes, accent/text/cursor swatches and font stacks are preserved
 * from the legacy reader so the migration does not approximate its visual system.
 */
var TOK = ["bg", "panel", "ink", "dim", "accent", "on-accent", "bad", "bad-bg", "line"];
  var THEMES = [
    { id: "auto", name: "Auto (system)" },
    { id: "gothic", name: "Gothic Night", dark: 1, v: { bg: "#0B0D14", panel: "#12151F", ink: "#E9E1D0", dim: "#8A8399", accent: "#D2AE5C", "on-accent": "#15110A", bad: "#FF7B7B", "bad-bg": "#3B1D22", line: "#2C2B3A" } },
    { id: "garden", name: "Letter Garden", dark: 0, v: { bg: "#EEEAF6", panel: "#FFFCF6", ink: "#2A2540", dim: "#6F688C", accent: "#6A4DBF", "on-accent": "#FFFFFF", bad: "#C0304F", "bad-bg": "#F8DCE3", line: "#D9D2EA" } },
    { id: "paper", name: "Paper", v: { bg: "#ECECE8", panel: "#FAFAF8", ink: "#1E1E1C", dim: "#82827C", accent: "#3B5BDB", "on-accent": "#FFFFFF", bad: "#C92A2A", "bad-bg": "#FBE3E3", line: "#D6D6D0" } },
    { id: "sepia", name: "Sepia", v: { bg: "#E4D9C0", panel: "#F0E6CF", ink: "#3B2F20", dim: "#85755B", accent: "#8A5A2B", "on-accent": "#FFFFFF", bad: "#A62B1F", "bad-bg": "#EFC9C0", line: "#D0C2A3" } },
    { id: "contrast", name: "High contrast", v: { bg: "#FFFFFF", panel: "#FFFFFF", ink: "#000000", dim: "#595959", accent: "#0B57D0", "on-accent": "#FFFFFF", bad: "#B00020", "bad-bg": "#FFD9DE", line: "#9A9A9A" } },
    { id: "midnight", name: "Midnight", dark: 1, v: { bg: "#0B0F1A", panel: "#121829", ink: "#DDE3F5", dim: "#6B7799", accent: "#7C9CFF", "on-accent": "#0B0F1A", bad: "#FF7A8A", "bad-bg": "#3A1B25", line: "#232B45" } },
    { id: "nord", name: "Nord", dark: 1, v: { bg: "#2E3440", panel: "#3B4252", ink: "#ECEFF4", dim: "#8A96AE", accent: "#88C0D0", "on-accent": "#2E3440", bad: "#E27D87", "bad-bg": "#4B2F36", line: "#4C566A" } },
    { id: "terminal", name: "Terminal", dark: 1, v: { bg: "#050805", panel: "#0A110A", ink: "#B9F5B9", dim: "#4C8A4C", accent: "#39FF7A", "on-accent": "#021002", bad: "#FF5C5C", "bad-bg": "#2A0F0F", line: "#153015" } },
    { id: "amber", name: "Amber", dark: 1, v: { bg: "#0E0904", panel: "#17100A", ink: "#FFD79A", dim: "#9A7236", accent: "#FFB000", "on-accent": "#1A0F00", bad: "#FF6A4D", "bad-bg": "#33140C", line: "#3A2810" } },
    { id: "dusk", name: "Dusk", dark: 1, v: { bg: "#1B1424", panel: "#251B33", ink: "#EDE3F7", dim: "#8C7BA6", accent: "#FF8FB8", "on-accent": "#1B1424", bad: "#FF8A80", "bad-bg": "#3D1F2A", line: "#3A2C4E" } }
  ];

  function mixHex(a, b, p) {
    var x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16), ch = function (sh) {
      return Math.round(((x >> sh) & 255) * (1 - p) + ((y >> sh) & 255) * p);
    };
    return "#" + ((1 << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).slice(1).toUpperCase();
  }
  function mkTheme(id, name, dark, bg, panel, ink, dim, accent, bad, line) {
    return { id: id, name: name, dark: dark ? 1 : 0, v: { bg: bg, panel: panel, ink: ink, dim: dim, accent: accent, "on-accent": onColor(accent), bad: bad, "bad-bg": mixHex(bg, bad, dark ? 0.22 : 0.16), line: line } };
  }
  [
    // light themes
    mkTheme("solarlight", "Solarized Light", 0, "#F3ECD6", "#FDF6E3", "#44585F", "#8A9A9A", "#268BD2", "#DC322F", "#DDD6C1"),
    mkTheme("mint", "Mint", 0, "#E3EFE8", "#F3FAF6", "#17302A", "#6F8F84", "#0F9D74", "#C2362B", "#C9DDD3"),
    mkTheme("lavender", "Lavender", 0, "#E9E6F3", "#F6F4FC", "#26213D", "#857FA3", "#7C5CE0", "#C0304F", "#D4CFE8"),
    mkTheme("sky", "Sky", 0, "#E1EDF7", "#F2F8FD", "#12283D", "#6B88A3", "#1E78D2", "#C62F3B", "#C6D9EA"),
    mkTheme("blush", "Blush", 0, "#F4E6E6", "#FCF4F4", "#3A2326", "#A08387", "#D6456B", "#B3261E", "#E6D0D1"),
    mkTheme("peach", "Peach", 0, "#F6E7DA", "#FDF3EA", "#3A2619", "#A38468", "#E8702A", "#B3261E", "#E7D2BF"),
    mkTheme("mono", "Ink on Paper", 0, "#EDEDED", "#FFFFFF", "#111111", "#7A7A7A", "#111111", "#C62828", "#D0D0D0"),
    // dark themes
    mkTheme("dracula", "Dracula", 1, "#282A36", "#313442", "#F8F8F2", "#7B82A8", "#BD93F9", "#FF6E6E", "#44475A"),
    mkTheme("solardark", "Solarized Dark", 1, "#002B36", "#073642", "#D5DEDF", "#6E8B93", "#2AA198", "#F5605D", "#1B4B57"),
    mkTheme("gruvbox", "Gruvbox", 1, "#282828", "#32302F", "#EBDBB2", "#928374", "#FABD2F", "#FB4934", "#504945"),
    mkTheme("tokyo", "Tokyo Night", 1, "#1A1B26", "#202233", "#C0CAF5", "#6A729F", "#7AA2F7", "#F7768E", "#2F3350"),
    mkTheme("monokai", "Monokai", 1, "#272822", "#30312A", "#F8F8F2", "#8B8978", "#A6E22E", "#F92672", "#49483E"),
    mkTheme("mocha", "Mocha", 1, "#1E1E2E", "#272739", "#CDD6F4", "#7F849C", "#CBA6F7", "#F38BA8", "#3B3D54"),
    mkTheme("rosepine", "Rose Pine", 1, "#191724", "#211F30", "#E0DEF4", "#7E7A9A", "#EBBCBA", "#EB6F92", "#34314A"),
    mkTheme("ocean", "Ocean", 1, "#08141E", "#0E1F2D", "#D6E9F5", "#5F8197", "#38BDF8", "#FB7185", "#1B3447"),
    mkTheme("forest", "Forest", 1, "#0D1A12", "#13251A", "#DDEBDD", "#6C8F73", "#6FCF7B", "#F2766B", "#23402C"),
    mkTheme("crimson", "Crimson", 1, "#14080A", "#1E0E11", "#F3DDDF", "#94626A", "#FF4D5E", "#FFA64D", "#3A1A1F"),
    mkTheme("cyber", "Cyberpunk", 1, "#0A0612", "#130B22", "#F2E9FF", "#8467B0", "#00F0FF", "#FF2E88", "#2C1A4A"),
    mkTheme("coffee", "Coffee", 1, "#1C1410", "#261C16", "#EBD9C6", "#957B66", "#D9A066", "#E5736A", "#3B2D24"),
    mkTheme("graphite", "Graphite", 1, "#1E2328", "#272D33", "#E3E8EC", "#7B8794", "#34D399", "#F87171", "#38414A"),
    mkTheme("sunset", "Sunset", 1, "#1F1020", "#2A1830", "#FFE9DD", "#A5788A", "#FF7A59", "#FF5C7A", "#432545"),
    mkTheme("oled", "OLED Black", 1, "#000000", "#0B0B0B", "#EDEDED", "#6B6B6B", "#FFFFFF", "#FF6B6B", "#222222")
  ].forEach(function (t) { THEMES.push(t); });
  var ACC = [
    { v: "theme", name: "Theme default" },
    { v: "blue", name: "Blue", c: "#3B82F6" }, { v: "violet", name: "Violet", c: "#8B5CF6" },
    { v: "rose", name: "Rose", c: "#F43F5E" }, { v: "orange", name: "Orange", c: "#F97316" },
    { v: "yellow", name: "Yellow", c: "#EAB308" }, { v: "green", name: "Green", c: "#22C55E" },
    { v: "teal", name: "Teal", c: "#14B8A6" },
    { v: "red", name: "Red", c: "#EF4444" }, { v: "crimson", name: "Crimson", c: "#DC143C" },
    { v: "coral", name: "Coral", c: "#FF6F61" }, { v: "pink", name: "Pink", c: "#EC4899" },
    { v: "fuchsia", name: "Fuchsia", c: "#D946EF" }, { v: "lavender", name: "Lavender", c: "#A78BFA" },
    { v: "indigo", name: "Indigo", c: "#6366F1" }, { v: "sky", name: "Sky", c: "#0EA5E9" },
    { v: "cyan", name: "Cyan", c: "#06B6D4" }, { v: "mint", name: "Mint", c: "#5EEAD4" },
    { v: "emerald", name: "Emerald", c: "#10B981" }, { v: "lime", name: "Lime", c: "#84CC16" },
    { v: "amber", name: "Amber", c: "#F59E0B" }, { v: "gold", name: "Gold", c: "#D4A017" },
    { v: "brown", name: "Brown", c: "#A0522D" }, { v: "slate", name: "Slate", c: "#64748B" },
    { v: "white", name: "White", c: "#F8FAFC" }, { v: "black", name: "Black", c: "#111827" }
  ];
  var CARETS = [
    { v: "accent", name: "Match accent" },
    { v: "#FFB000", name: "Amber", c: "#FFB000" }, { v: "#39FF7A", name: "Green", c: "#39FF7A" },
    { v: "#FF5C8A", name: "Pink", c: "#FF5C8A" }, { v: "#5EC8FF", name: "Sky", c: "#5EC8FF" },
    { v: "#FFFFFF", name: "White", c: "#FFFFFF" }, { v: "#111111", name: "Black", c: "#111111" }
  ];
  var FCOLS = [
    { v: "theme", name: "Theme default" },
    { v: "white", name: "White", c: "#FFFFFF" }, { v: "silver", name: "Silver", c: "#C9D1D9" },
    { v: "cream", name: "Cream", c: "#F5EBD7" }, { v: "black", name: "Black", c: "#111111" },
    { v: "charcoal", name: "Charcoal", c: "#2B2F36" }, { v: "navy", name: "Navy", c: "#1E3A8A" },
    { v: "brown", name: "Brown", c: "#6B4423" }, { v: "forest", name: "Forest", c: "#166534" },
    { v: "sky", name: "Sky", c: "#7DD3FC" }, { v: "teal", name: "Teal", c: "#5EEAD4" },
    { v: "mint", name: "Mint", c: "#86EFAC" }, { v: "green", name: "Green", c: "#39FF7A" },
    { v: "lime", name: "Lime", c: "#BEF264" }, { v: "yellow", name: "Yellow", c: "#FDE047" },
    { v: "amber", name: "Amber", c: "#FFB000" }, { v: "orange", name: "Orange", c: "#FB923C" },
    { v: "coral", name: "Coral", c: "#FF6F61" }, { v: "rose", name: "Rose", c: "#FB7185" },
    { v: "pink", name: "Pink", c: "#F9A8D4" }, { v: "lavender", name: "Lavender", c: "#C4B5FD" },
    { v: "violet", name: "Violet", c: "#A78BFA" }
  ];
  var FONTS = [
    { id: "newsreader", name: "Newsreader", stack: '"Newsreader", Georgia, "Times New Roman", serif' },
    { id: "literata", name: "Literata", stack: '"Literata", Georgia, serif' },
    { id: "lora", name: "Lora", stack: '"Lora", Georgia, serif' },
    { id: "source", name: "Source Serif", stack: '"Source Serif 4", Georgia, serif' },
    { id: "baskerville", name: "Baskerville", stack: '"Libre Baskerville", Georgia, serif' },
    { id: "atkinson", name: "Atkinson", stack: '"Atkinson Hyperlegible", system-ui, sans-serif' },
    { id: "plex", name: "Plex Mono", stack: '"IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace' },
    { id: "jetbrains", name: "JetBrains Mono", stack: '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace' },
    { id: "courier", name: "Courier Prime", stack: '"Courier Prime", "Courier New", monospace' },
    { id: "elite", name: "Special Elite", stack: '"Special Elite", "Courier New", monospace' }
  ];
  var BGS = [
    { id: "none", name: "No Background", thumb: "var(--panel)" },
    { id: "tod", name: "Time of Day (automatic)", thumb: "linear-gradient(90deg,var(--tod1) 33%,var(--tod2) 33% 66%,var(--tod3) 66%)" },
    { id: "pic-morning", name: "Morning (picture)", thumb: "var(--thumb-pic-morning) center / cover" },
    { id: "pic-evening", name: "Evening (picture)", thumb: "var(--thumb-pic-evening) center / cover" },
    { id: "pic-night", name: "Night (picture)", thumb: "var(--thumb-pic-night) center / cover" },
    { id: "night", name: "Night Sky", thumb: "linear-gradient(#04081a,#1d2c57)" },
    { id: "snow", name: "Snow", thumb: "linear-gradient(#0a1422,#2a4160)" },
    { id: "aurora", name: "Aurora", thumb: "linear-gradient(#04122a,#1fa57a 70%,#7b6bff)" },
    { id: "rain", name: "Rain", thumb: "linear-gradient(#080e15,#33475a)" },
    { id: "digital", name: "Digital Rain", thumb: "linear-gradient(#000a05,#0f6b34)" },
    { id: "underwater", name: "Underwater", thumb: "linear-gradient(#0c7ea6,#021a30)" },
    { id: "shafts", name: "Light Shafts", thumb: "linear-gradient(115deg,#17120d 30%,#8a6a3a 50%,#17120d 70%)" },
    { id: "candle", name: "Candlelight", thumb: "radial-gradient(circle at 50% 85%,#ffb347,#0b0705 70%)" },
    { id: "hearth", name: "Hearth", thumb: "linear-gradient(#080303,#c2410c)" },
    { id: "crt", name: "CRT", thumb: "repeating-linear-gradient(#0a2a16 0 2px,#03100a 2px 4px)" },
    { id: "warp", name: "Warp Speed", thumb: "radial-gradient(circle at 50% 50%,#8fb4ff 0,#0a1030 25%,#02030a 70%)" },
    { id: "nebula", name: "Nebula", thumb: "radial-gradient(circle at 30% 40%,#7c3aed,transparent 55%),radial-gradient(circle at 70% 60%,#db2777,transparent 55%),#05030f" },
    { id: "fireflies", name: "Fireflies", thumb: "radial-gradient(circle at 30% 60%,#e8f27a 0 3px,transparent 4px),radial-gradient(circle at 65% 40%,#e8f27a 0 3px,transparent 4px),linear-gradient(#05100d,#0f2a1d)" },
    { id: "synthwave", name: "Synthwave", thumb: "linear-gradient(#0b0221,#6a0f7a 55%,#ff3e9a 56%,#1a0533 57%)" },
    { id: "sakura", name: "Sakura", thumb: "linear-gradient(#2a1236,#a14a82 70%,#f4a3bd)" },
    { id: "autumn", name: "Autumn Leaves", thumb: "linear-gradient(#2b1405,#a8541a)" },
    { id: "lava", name: "Lava Lamp", thumb: "radial-gradient(circle at 35% 70%,#ff5a8a,transparent 45%),radial-gradient(circle at 65% 35%,#ff9a3c,transparent 45%),#1a0630" },
    { id: "storm", name: "Thunderstorm", thumb: "linear-gradient(#05070d,#2b364d)" },
    { id: "bokeh", name: "Bokeh", thumb: "radial-gradient(circle at 25% 35%,#4cc9f0 0 10px,transparent 11px),radial-gradient(circle at 70% 60%,#f472b6 0 14px,transparent 15px),linear-gradient(#0a0f1f,#1b1030)" },
    { id: "mesh", name: "Gradient Mesh", thumb: "linear-gradient(135deg,#312e81,#be185d 50%,#0f766e)" },
    { id: "constellation", name: "Constellation", thumb: "radial-gradient(circle at 20% 30%,#9db4ff 0 2px,transparent 3px),radial-gradient(circle at 60% 60%,#9db4ff 0 2px,transparent 3px),radial-gradient(circle at 80% 25%,#9db4ff 0 2px,transparent 3px),linear-gradient(#050816,#0c1233)" },
    { id: "mist", name: "Misty Pines", thumb: "linear-gradient(#0b1217,#3a4f58)" }
  ];
  // Palette per scene, used when "Match colors to background" is on: bg, panel, ink, dim, accent, bad, line.
  function bp(bg, panel, ink, dim, accent, bad, line) { return mkTheme("bgm", "Match", 1, bg, panel, ink, dim, accent, bad, line); }
  var BGPAL = {
    "pic-morning": mkTheme("bgm", "Match", 0, "#EEEAF6", "#FFFCF6", "#2A2540", "#6F688C", "#6A4DBF", "#C0304F", "#D9D2EA"),
    "pic-evening": mkTheme("bgm", "Match", 1, "#1A1530", "#231C3C", "#F7EBDD", "#B3A8C6", "#F2A65A", "#FF8A8A", "#3B3358"),
    "pic-night": mkTheme("bgm", "Match", 1, "#0B0D14", "#12151F", "#E9E1D0", "#8A8399", "#D2AE5C", "#FF7B7B", "#2C2B3A"),
    night: bp("#04081A", "#0B1230", "#E3EAFF", "#6A7AAE", "#9DB4FF", "#FF8A9A", "#1D2C57"),
    snow: bp("#0A1422", "#12233A", "#EAF4FF", "#7C93AF", "#A9D4FF", "#FF8A80", "#2A4160"),
    aurora: bp("#04122A", "#0A2038", "#DFFFF2", "#5FA08A", "#4FE0A8", "#FF8A8A", "#14483F"),
    rain: bp("#080E15", "#101A24", "#DCE6EF", "#6B8196", "#7FB5E0", "#FF8A80", "#263645"),
    digital: bp("#000A05", "#03140A", "#B8FFCF", "#3F9B62", "#2BFF7A", "#FF6B6B", "#0F4A27"),
    underwater: bp("#021A30", "#06304D", "#E6F8FF", "#6FB4D0", "#5FE3FF", "#FF9A8A", "#0C6A8A"),
    shafts: bp("#17120D", "#221B13", "#F5E7CE", "#9A8466", "#E3B565", "#FF8A6A", "#4A3A22"),
    candle: bp("#0B0705", "#17100B", "#FFE6BF", "#A8814F", "#FFB347", "#FF7A5C", "#3A2814"),
    hearth: bp("#080303", "#1A0A07", "#FFE0CC", "#B06A48", "#FF8A3D", "#FF6A5C", "#4A1E10"),
    crt: bp("#03100A", "#072016", "#A8FFC4", "#3E9A62", "#39FF7A", "#FF6B6B", "#0F4A2A"),
    warp: bp("#02030A", "#0A1030", "#E8EEFF", "#7C8DC4", "#8FB4FF", "#FF8A9A", "#1C2A5E"),
    nebula: bp("#05030F", "#130A2A", "#F3E8FF", "#9577C4", "#D07CFF", "#FF7AA8", "#3A1F66"),
    fireflies: bp("#05100D", "#0C2018", "#F2F7C8", "#7A9A6A", "#E8F27A", "#FF8A7A", "#1B4A33"),
    synthwave: bp("#0B0221", "#1A0836", "#FFE8FA", "#A775C0", "#FF3E9A", "#FF6B6B", "#4A1A6B"),
    sakura: bp("#2A1236", "#3A1B4A", "#FFEFF6", "#C48AAE", "#F4A3BD", "#FF8A9A", "#6B3A7A"),
    autumn: bp("#2B1405", "#3D1D09", "#FFE9CF", "#B5804F", "#F0903A", "#FF7A5C", "#6B3A18"),
    lava: bp("#1A0630", "#2B0C4A", "#FFEAF2", "#C27AA0", "#FF7A8A", "#FFB05C", "#5A1F7A"),
    storm: bp("#05070D", "#101622", "#E1E8F5", "#6F7D96", "#8FB0FF", "#FF8A9A", "#2B364D"),
    bokeh: bp("#0A0F1F", "#151B33", "#EAF2FF", "#7D8CB8", "#4CC9F0", "#FF8AB0", "#2A2F5A"),
    mesh: bp("#1E1B4B", "#2B2670", "#FFEFFB", "#A890D0", "#F472B6", "#FF8A8A", "#4B3A8F"),
    constellation: bp("#050816", "#0C1233", "#E5ECFF", "#6F82BF", "#9DB4FF", "#FF8A9A", "#1C2760"),
    mist: bp("#0B1217", "#15222A", "#E3EEF1", "#6F8892", "#8FD0C4", "#FF8A80", "#2C3F48")
  };
  function pick(list, key, val) { var i; for (i = 0; i < list.length; i++) if (list[i][key] === val) return list[i]; return list[0]; }
  function onColor(hex) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) > 150 ? "#111111" : "#FFFFFF";
  }


export {
  TOK,
  THEMES,
  ACC,
  CARETS,
  FCOLS,
  FONTS,
  BGPAL,
  pick,
  onColor,
};

export function resolveBookkeysAppearance(settings, effectiveBackground, systemDark) {
  const matchedTheme = settings.bgMatch && BGPAL[effectiveBackground]
    ? BGPAL[effectiveBackground]
    : pick(THEMES, "id", settings.skin);
  const theme = matchedTheme || THEMES[0];
  const variables = { ...(theme.v || {}) };

  const accent = settings.accent === "custom" && /^#[0-9a-fA-F]{6}$/.test(settings.accentCustom || "")
    ? { c: settings.accentCustom }
    : pick(ACC, "v", settings.accent);
  if (accent && accent.c) {
    variables.accent = accent.c;
    variables["on-accent"] = onColor(accent.c);
  }

  const textColor = settings.fontColor === "custom" && /^#[0-9a-fA-F]{6}$/.test(settings.fontColorCustom || "")
    ? { c: settings.fontColorCustom }
    : pick(FCOLS, "v", settings.fontColor);
  if (textColor && textColor.c) variables.typed = textColor.c;
  else delete variables.typed;

  const font = pick(FONTS, "id", settings.font);
  const tone = theme.v ? (theme.dark ? "dark" : "light") : (systemDark ? "dark" : "light");
  const decoration = settings.deco === "off" ? "off"
    : settings.skin === "gothic" ? "gothic"
    : settings.skin === "garden" ? "garden"
    : settings.skin === "auto" ? (tone === "dark" ? "gothic" : "garden")
    : "none";

  return {
    variables,
    tone,
    decoration,
    fontStack: font.stack,
    caret: settings.ccolor === "accent" ? "var(--accent)" : settings.ccolor,
    fontSize: `${Number(settings.size) || 20}px`,
    lineHeight: String(Number(settings.lineH) || 1.7),
    letterSpacing: `${Number(settings.spacing) || 0}em`,
    textGlow: settings.lglow ? "on" : "off",
    punctuationExact: settings.punct === "exact",
    cursorStyle: settings.cstyle,
    cursorBlink: settings.cblink,
    cursorGlow: settings.cglow ? "on" : "off",
    cursorSmooth: settings.csmooth ? "on" : "off",
    centered: settings.centered ? "on" : "off",
    typingEffect: settings.tfx,
    calm: settings.motion === "reduce" || (settings.motion !== "full" && systemDark === "reduced") ? "on" : "off",
  };
}

