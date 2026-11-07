export interface BookkeysAchievement {
  readonly id: string;
  readonly category: string;
  readonly metric: string;
  readonly target: number;
  readonly name: string;
  readonly lightName?: string;
  readonly description: string;
  readonly icon?: string;
}

function group(category: string, metric: string, rows: readonly (readonly [number, string, string])[]): BookkeysAchievement[] {
  return rows.map(([target, name, description]) => ({
    id: metric + target, category, metric, target, name, description,
  }));
}

function special(
  category: string,
  rows: readonly (readonly [string, string, number, string, string, string, string?])[],
): BookkeysAchievement[] {
  return rows.map(([id, metric, target, name, lightName, description, icon]) => ({
    id, category, metric, target, name, lightName, description, ...(icon ? { icon } : {}),
  }));
}

/** Stable achievement IDs and thresholds copied from the preserved Bookkeys game catalogue. */
export const BOOKKEYS_ACHIEVEMENTS: readonly BookkeysAchievement[] = [
  ...group("Words", "words", [
    [500, "First Inscription", "Type 500 words"],
    [5000, "Scribe's Initiation", "Type 5,000 words"],
    [25000, "Keeper of Tomes", "Type 25,000 words"],
    [100000, "Master of the Quill", "Type 100,000 words"],
    [500000, "Walking Archive", "Type 500,000 words"],
  ]),
  ...group("Letters", "chars", [
    [10000, "Ten Thousand Sigils", "Type 10,000 letters"],
    [100000, "Hundred Thousand Runes", "Type 100,000 letters"],
    [1000000, "Millionfold Inscription", "Type 1,000,000 letters"],
  ]),
  ...group("Pages", "pages", [
    [10, "Page Initiate", "Finish 10 pages"],
    [100, "Hundredfold Record", "Finish 100 pages"],
    [1000, "Thousandfold Chronicle", "Finish 1,000 pages"],
  ]),
  ...group("Chapters", "chapters", [
    [1, "Chapter of Awakening", "Finish 1 chapter"],
    [5, "Seeker of Chapters", "Finish 5 chapters"],
    [25, "Chapter Conqueror", "Finish 25 chapters"],
    [100, "Chronicler of Legends", "Finish 100 chapters"],
  ]),
  ...group("Books", "books", [
    [1, "Tome Completed", "Finish 1 book"],
    [3, "Keeper of Three Tomes", "Finish 3 books"],
    [10, "Seeker of Knowledge", "Finish 10 books"],
    [25, "Curator of the Archive", "Finish 25 books"],
  ]),
  ...group("Speed", "bestWpm", [
    [40, "Steady Hand", "Finish a page at 40 WPM"],
    [60, "Swift Inscription", "Finish a page at 60 WPM"],
    [80, "Windborne Quill", "Finish a page at 80 WPM"],
    [100, "Hundredfold Velocity", "Finish a page at 100 WPM"],
    [120, "Lightning Inscription", "Finish a page at 120 WPM"],
  ]),
  ...group("Accuracy", "perfect", [
    [1, "Unblemished Manuscript", "Finish a page at 100% accuracy"],
    [10, "Path of Perfection", "Finish 10 pages at 100% accuracy"],
    [50, "Immaculate Inscription", "Finish 50 pages at 100% accuracy"],
  ]),
  ...group("Accuracy", "bestRun", [
    [5, "Fivefold Purification", "Finish 5 new pages consecutively at 98%+ accuracy"],
    [20, "Twentyfold Purification", "Finish 20 new pages consecutively at 98%+ accuracy"],
  ]),
  ...group("Streaks", "streak", [
    [3, "Three-Day Vigil", "Practise 3 consecutive days"],
    [7, "Seven-Day Vigil", "Practise 7 consecutive days"],
    [14, "Fourteen-Day Vigil", "Practise 14 consecutive days"],
    [30, "Thirty-Day Vigil", "Practise 30 consecutive days"],
    [100, "Unbroken Vigil", "Practise 100 consecutive days"],
  ]),
  ...group("Endurance", "bestDay", [
    [1000, "Daily Inscription", "Type 1,000 words in one day"],
    [5000, "Extended Ritual", "Type 5,000 words in one day"],
    [15000, "Grand Ritual", "Type 15,000 words in one day"],
  ]),
  ...group("Levels", "level", [
    [5, "Sequence Advancement V", "Reach level 5"],
    [10, "Sequence Advancement X", "Reach level 10"],
    [25, "Sequence Advancement XXV", "Reach level 25"],
    [50, "Sequence Advancement L", "Reach level 50"],
  ]),
  ...group("Time of day", "night", [[1, "Midnight Scribe", "Finish a new page between midnight and 5 AM"]]),
  ...group("Time of day", "early", [[1, "Dawn Scribe", "Finish a new page between 5 AM and 8 AM"]]),
  ...special("Improvement and personal records", [
    ["beat5", "beat5", 1, "First Breakthrough", "A Step Beyond", "Beat previous best speed by 5 WPM"],
    ["up20", "up20", 1, "Ascendant Proficiency", "Rising Star", "Improve speed by 20 WPM over baseline"],
    ["pro60", "pro60", 1, "Precision Under Pressure", "Grace Under Pressure", "Finish at 60+ WPM and 98%+ accuracy"],
    ["vir80", "vir80", 1, "Master of the Manuscript", "Virtuoso of the Quill", "Finish at 80+ WPM and 100% accuracy"],
    ["recs", "recs", 1, "Beyond Your Limits", "Beyond the Horizon", "Set new speed and accuracy records on one page"],
  ]),
  ...special("Endurance and discipline", [
    ["bestDay10000", "bestDay", 10000, "Relentless Scribe", "Tireless Traveler", "Type 10,000 words in one day"],
    ["bestDay25000", "bestDay", 25000, "Grand Marathon", "Epic Journey", "Type 25,000 words in one day"],
    ["sessMax10", "sessMax", 10, "Unbroken Focus", "A Day of Discovery", "Complete 10 pages in one session"],
    ["days30", "days", 30, "Return to the Archive", "Thirty Days of Wonder", "Practise on 30 distinct days"],
  ]),
  ...special("Mastery and completion", [
    ["books5", "books", 5, "Scholar's Journey", "Tales of Five Journeys", "Finish 5 books"],
    ["books50", "books", 50, "Keeper of the Collection", "Curator of Wonders", "Finish 50 books"],
    ["bigBook1", "bigBook", 1, "The Long Chronicle", "An Epic Tale", "Finish a book of at least 100 pages"],
    ["flawlessCh1", "flawlessCh", 1, "Flawless Chapter", "A Chapter Perfected", "Finish every page of a chapter at 100% accuracy"],
  ]),
  ...special("Rare feats", [["hund1", "hund", 1, "The Hundredfold Standard", "A Hundredfold Triumph", "Finish at 100 WPM and 100% accuracy"]]),
  ...special("The Eternal Record", [
    ["words1000000", "words", 1000000, "The Eternal Record: First Inscription", "A Thousand Thousand Words", "Reach 1,000,000 total words", "er1"],
    ["words10000000", "words", 10000000, "The Eternal Record: Thousandfold Legacy", "A Legacy in Ten Million Words", "Reach 10,000,000 total words", "er2"],
    ["words100000000", "words", 100000000, "The Eternal Record: Immortal Chronicle", "The Chronicle Beyond Time", "Reach 100,000,000 total words", "er3"],
  ]),
];

export function bookkeysLevelForXp(xp: number): number {
  const safeXp = Math.max(0, Number.isFinite(xp) ? xp : 0);
  let level = 1;
  while (level < 100000 && bookkeysXpToReach(level + 1) <= safeXp) level += 1;
  return level;
}

export function bookkeysXpToReach(level: number): number {
  const n = Math.max(0, Math.floor(level) - 1);
  return n === 0 ? 0 : 400 * n + 50 * n * (n - 1);
}

export function bookkeysRankForLevel(level: number): string {
  const ranks = ["Novice Typist", "Page Turner", "Keystroke Cadet", "Wordsmith", "Scribe", "Chronicler", "Bookwright", "Loremaster", "Grand Archivist", "Typing Legend"];
  return ranks[Math.min(ranks.length - 1, Math.floor((Math.max(1, level) - 1) / 5))];
}

export function bookkeysAchievementValue(game: Readonly<Record<string, unknown>>, metric: string): number {
  if (metric === "level") return bookkeysLevelForXp(Number(game.xp ?? 0));
  if (metric === "streak") {
    const streak = game.streak && typeof game.streak === "object" ? game.streak as Record<string, unknown> : {};
    return Number(streak.best ?? 0);
  }
  return Number(game[metric] ?? 0);
}

export function bookkeysAchievementProgress(game: Readonly<Record<string, unknown>>) {
  const earned = game.ach && typeof game.ach === "object" ? game.ach as Record<string, unknown> : {};
  return BOOKKEYS_ACHIEVEMENTS.map((achievement) => {
    const value = Math.max(0, bookkeysAchievementValue(game, achievement.metric));
    const storedUnlock = earned[achievement.id];
    const unlocked = storedUnlock !== undefined && storedUnlock !== null && storedUnlock !== false;
    return {
      ...achievement,
      value: Math.min(value, achievement.target),
      unlocked,
      reached: value >= achievement.target,
      unlockDate: typeof storedUnlock === "number" && storedUnlock > 0 ? storedUnlock : null,
    };
  });
}

export function bookkeysArchiveSummary(game: Readonly<Record<string, unknown>>) {
  const streak = game.streak && typeof game.streak === "object" ? game.streak as Record<string, unknown> : {};
  const level = bookkeysLevelForXp(Number(game.xp ?? 0));
  const currentXp = Math.max(0, Number(game.xp ?? 0));
  const base = bookkeysXpToReach(level);
  const next = bookkeysXpToReach(level + 1);
  const achievements = bookkeysAchievementProgress(game);
  return {
    level,
    rank: bookkeysRankForLevel(level),
    xp: currentXp,
    xpIntoLevel: currentXp - base,
    xpForNextLevel: next - base,
    levelProgress: next > base ? Math.max(0, Math.min(100, ((currentXp - base) / (next - base)) * 100)) : 0,
    currentStreak: Number(streak.cur ?? 0),
    bestStreak: Number(streak.best ?? 0),
    days: Number(game.days ?? 0),
    bestWpm: Number(game.bestWpm ?? 0),
    perfectPages: Number(game.perfect ?? 0),
    unlocked: achievements.filter((item) => item.unlocked).length,
    totalAchievements: achievements.length,
    achievements,
  };
}
