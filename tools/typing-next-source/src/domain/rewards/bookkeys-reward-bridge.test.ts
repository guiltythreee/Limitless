
test("awards a book-completion milestone only after the verified page save clears", () => {
  const target = new EventTarget();
  const activities: Record<string, unknown>[] = [];
  const stop = installBookkeysRewardBridge(target, {
    award(activity) { activities.push(activity); return activity; },
  }, {
    now: () => 3_000,
    getPageEvidence: () => ({ contentSignature: "0123456789abcdef", characterCount: 220 }),
  });

  const before = { check: null, paid: {}, book: { bookA: { p: [], x: [] } } };
  const pageSaved = {
    check: { key: "bookA", page: 2 },
    paid: {},
    book: { bookA: { p: [0, 1, 2], x: [0, 1, 2] } },
  };
  storageChange(target, before, pageSaved);
  const bookSaved = {
    check: null,
    paid: { "b:bookA": 2_000 },
    book: { bookA: { p: [0, 1, 2], x: [0, 1, 2] } },
  };
  storageChange(target, pageSaved, bookSaved);

  assert.equal(activities.length, 2);
  assert.equal(activities[1].completionEvidence, "completed-required-book-sections");
  assert.equal(activities[1].itemId, "bookkeys:book:b:bookA");
  assert.equal(activities[1].passed, true);
  assert.equal(activities[1].quality, 1);
  stop();
});
