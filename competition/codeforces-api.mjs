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


/**
 * Fetch a complete Codeforces submission history in bounded pages.
 * A small overlap between pages protects against a new submission shifting
 * the offset while a multi-page sync is in progress. Submission IDs remove
 * the overlap without changing the original API records.
 */
export async function fetchAllCodeforcesSubmissions(handle, options = {}) {
  if (typeof handle !== "string" || !handle.trim()) {
    throw new TypeError("A Codeforces handle is required");
  }
  const request = options.request || requestCodeforcesApi;
  if (typeof request !== "function") throw new TypeError("A Codeforces API requester is required");
  const pageSize = Number.isInteger(options.pageSize) && options.pageSize > 0
    ? Math.min(options.pageSize, 1000) : 1000;
  const overlap = Number.isInteger(options.overlap) && options.overlap >= 0
    ? Math.min(options.overlap, pageSize - 1) : 10;
  const maxPages = Number.isInteger(options.maxPages) && options.maxPages > 0
    ? options.maxPages : 100;
  const signal = options.signal;
  const submissions = new Map();
  let from = 1;

  for (let pageNumber = 0; pageNumber < maxPages; pageNumber += 1) {
    const url = "https://codeforces.com/api/user.status?handle=" +
      encodeURIComponent(handle.trim()) + "&from=" + from + "&count=" + pageSize;
    const payload = await request(url, signal ? { signal } : undefined);
    if (!payload || !Array.isArray(payload.result)) {
      throw new Error("Codeforces returned an invalid submission-history page.");
    }
    const page = payload.result;
    let added = 0;
    for (const submission of page) {
      const key = submission && submission.id != null
        ? String(submission.id)
        : JSON.stringify([
            submission?.creationTimeSeconds, submission?.contestId,
            submission?.problem?.index, submission?.verdict,
            submission?.programmingLanguage
          ]);
      if (!submissions.has(key)) {
        submissions.set(key, submission);
        added += 1;
      }
    }
    if (page.length < pageSize) return Array.from(submissions.values());
    if (added === 0) {
      throw new Error("Codeforces submission pagination stopped making progress.");
    }
    from += Math.max(1, page.length - overlap);
  }
  throw new Error("Codeforces submission history exceeded the safe pagination limit. No partial sync was saved.");
}


/**
 * Fetch only submissions in a recent time window.
 * user.status is ordered by descending submission ID, so once a full page
 * crosses the time boundary, older pages cannot contain newer submissions.
 * A small overlap is expected; IDs deduplicate it across pages.
 */
export async function fetchCodeforcesSubmissionsSince(handle, sinceSeconds, options = {}) {
  if (typeof handle !== "string" || !handle.trim()) {
    throw new TypeError("A Codeforces handle is required");
  }
  if (!Number.isFinite(sinceSeconds) || sinceSeconds < 0) {
    throw new TypeError("A valid submission time boundary is required");
  }
  const request = options.request || requestCodeforcesApi;
  if (typeof request !== "function") throw new TypeError("A Codeforces API requester is required");
  const pageSize = Number.isInteger(options.pageSize) && options.pageSize > 0
    ? Math.min(options.pageSize, 1000) : 1000;
  const overlap = Number.isInteger(options.overlap) && options.overlap >= 0
    ? Math.min(options.overlap, pageSize - 1) : 10;
  const maxPages = Number.isInteger(options.maxPages) && options.maxPages > 0
    ? options.maxPages : 100;
  const signal = options.signal;
  const submissions = new Map();
  let from = 1;

  for (let pageNumber = 0; pageNumber < maxPages; pageNumber += 1) {
    const url = "https://codeforces.com/api/user.status?handle=" +
      encodeURIComponent(handle.trim()) + "&from=" + from + "&count=" + pageSize;
    const payload = await request(url, signal ? { signal } : undefined);
    if (!payload || !Array.isArray(payload.result)) {
      throw new Error("Codeforces returned an invalid submission-history page.");
    }
    const page = payload.result;
    let added = 0;
    let pageIsOlderThanBoundary = page.length > 0;
    for (const submission of page) {
      const seconds = Number(submission?.creationTimeSeconds);
      if (!Number.isFinite(seconds)) {
        pageIsOlderThanBoundary = false;
        continue;
      }
      if (seconds >= sinceSeconds) pageIsOlderThanBoundary = false;
      if (seconds < sinceSeconds) continue;
      const key = submission && submission.id != null
        ? String(submission.id)
        : JSON.stringify([
            submission?.creationTimeSeconds, submission?.contestId,
            submission?.problem?.index, submission?.verdict,
            submission?.programmingLanguage
          ]);
      if (!submissions.has(key)) {
        submissions.set(key, submission);
        added += 1;
      }
    }
    if (page.length < pageSize || pageIsOlderThanBoundary) {
      return Array.from(submissions.values());
    }
    if (added === 0) {
      throw new Error("Codeforces submission pagination stopped making progress.");
    }
    from += Math.max(1, page.length - overlap);
  }
  throw new Error("Codeforces recent submission window exceeded the safe pagination limit. No partial sync was saved.");
}
