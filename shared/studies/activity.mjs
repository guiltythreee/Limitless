const DAY_MS = 86_400_000;

function isRecord(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function localDayKey(timestamp) {
  const date = new Date(timestamp);
  if (!Number.isFinite(date.getTime())) return "";
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

function shiftLocalDay(date, offset) {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + offset);
  return next;
}

/**
 * Build a conservative activity calendar from already-normalized attempts.
 * It counts only attempts with real timestamps; it never estimates missing
 * activity or writes to module storage.
 */
export function buildGlobalActivitySummary(attempts, now = Date.now(), historyDays = 84, dailyGoal = 1) {
  const today = new Date(now);
  if (!Number.isFinite(today.getTime())) throw new TypeError("now must be a valid timestamp");
  const days = Number.isInteger(historyDays) ? Math.min(366, Math.max(1, historyDays)) : 84;
  const goal = Number.isInteger(dailyGoal) ? Math.min(1000, Math.max(1, dailyGoal)) : 1;
  const counts = new Map();

  for (const attempt of Array.isArray(attempts) ? attempts : []) {
    if (!isRecord(attempt) || !Number.isFinite(attempt.occurredAt) || attempt.occurredAt <= 0) continue;
    const key = localDayKey(attempt.occurredAt);
    if (key) counts.set(key, (counts.get(key) || 0) + 1);
  }

  const todayKey = localDayKey(today.getTime());
  const history = [];
  for (let offset = days - 1; offset >= 0; offset--) {
    const date = shiftLocalDay(today, -offset);
    const key = localDayKey(date.getTime());
    const count = counts.get(key) || 0;
    history.push({ date: key, count, goalMet: count >= goal });
  }

  let streakDays = 0;
  const cursor = counts.has(todayKey) ? 0 : -1;
  for (let offset = cursor; offset > -days; offset--) {
    const key = localDayKey(shiftLocalDay(today, offset).getTime());
    if (!counts.has(key)) break;
    streakDays++;
  }

  const todayCount = counts.get(todayKey) || 0;
  return {
    today: todayKey,
    todayCount,
    dailyGoal: goal,
    todayGoalMet: todayCount >= goal,
    streakDays,
    activeDays: history.filter((day) => day.count > 0).length,
    history,
  };
}
