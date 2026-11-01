"use client";

type TopicLink = { id: string; title: string };

export default function BookmarksPanel({
  bookmarks,
  topics,
  resolveTopic,
  onOpen,
  onRemove,
  title = "Bookmarked questions",
}: {
  bookmarks: readonly string[];
  topics: readonly TopicLink[];
  resolveTopic: (questionId: string) => string | undefined;
  onOpen: (questionId: string, topicId: string) => void;
  onRemove: (questionId: string) => void;
  title?: string;
}) {
  const topicById = new Map(topics.map((topic) => [topic.id, topic]));
  const ordered = [...bookmarks];

  return (
    <section className="panel study-utility-panel" aria-label={title}>
      <div className="topbar study-utility-panel__header">
        <div className="study-utility-panel__heading">
          <h2 className="study-utility-panel__title">{title}</h2>
          <div className="sub study-utility-panel__description">
            {ordered.length} saved {ordered.length === 1 ? "question" : "questions"} · saved only in this course
          </div>
        </div>
      </div>

      <div className="study-utility-panel__content">
      {ordered.length === 0 ? (
        <div className="study-utility-empty">
          <p>Nothing saved yet. Open a question and select ☆ Bookmark to keep it here.</p>
        </div>
      ) : (
        <div className="study-utility-list">
          {ordered.map((questionId) => {
            const topicId = resolveTopic(questionId);
            const topic = topicId ? topicById.get(topicId) : undefined;
            const digits = /-q(\d+)$/.exec(questionId)?.[1] ?? /-(\d+)$/.exec(questionId)?.[1];
            const label = topic?.title
              ? `${topic.title} · ${digits ? `Question ${Number(digits)}` : questionId}`
              : questionId;
            return (
              <div className="study-utility-row study-utility-row--item" key={questionId}>
                <div className="study-utility-row__copy">
                  <div style={{ fontWeight: 600 }}>{label}</div>
                  <div className="study-utility-row__meta">{questionId}</div>
                  {!topic && (
                    <div className="study-utility-row__meta">
                      This saved ID is no longer present in the course index.
                    </div>
                  )}
                </div>
                <div className="study-utility-row__actions">
                  {topic && (
                    <button className="btn btn-gold" onClick={() => onOpen(questionId, topic.id)}>
                      Open question →
                    </button>
                  )}
                  <button className="btn" onClick={() => onRemove(questionId)}>
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </section>
  );
}
