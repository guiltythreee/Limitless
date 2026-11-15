const DEFAULT_MIN_INTERVAL_MS = 2100;

/**
 * Create a serialized Codeforces API requester.
 * Codeforces documents a limit of one API request per two seconds; this
 * queue spaces request start times even when callers use Promise.all.
 */
export function createCodeforcesApiRequester(fetchImpl, options = {}) {
  if (typeof fetchImpl !== "function") throw new TypeError("A fetch implementation is required");
  const minIntervalMs = Number.isFinite(options.minIntervalMs) && options.minIntervalMs >= 0
    ? options.minIntervalMs : DEFAULT_MIN_INTERVAL_MS;
  const now = typeof options.now === "function" ? options.now : () => Date.now();
  const sleep = typeof options.sleep === "function"
    ? options.sleep
    : (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let queue = Promise.resolve();
  let lastStartedAt = 0;
  let hasStarted = false;

  return function requestCodeforcesApi(url, init) {
    const task = queue.then(async () => {
      const elapsed = now() - lastStartedAt;
      const waitMs = hasStarted ? Math.max(0, minIntervalMs - elapsed) : 0;
      if (waitMs > 0) await sleep(waitMs);
      lastStartedAt = now();
      hasStarted = true;

      const response = await fetchImpl(url, init);
      if (!response || !response.ok) throw new Error("Codeforces API request failed.");
      const payload = await response.json();
      if (!payload || payload.status !== "OK") {
        throw new Error(payload?.comment || "Codeforces API request failed.");
      }
      return payload;
    });
    // Keep the queue usable after a failed request while returning the original
    // rejection to the caller.
    queue = task.catch(() => undefined);
    return task;
  };
}

export const requestCodeforcesApi = createCodeforcesApiRequester((url, init) => fetch(url, init));
