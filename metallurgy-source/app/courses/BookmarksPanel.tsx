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
    <section className="panel" aria-label={title}>
      <div className="topbar">
        <div>
          <h2>{title}</h2>
          <div className="sub">
            {ordered.length} saved {ordered.length === 1 ? "question" : "questions"} · saved only in this course
          </div>
        </div>
      </div>

      {ordered.length === 0 ? (
        <div className="prose">
          <p>Nothing saved yet. Open a question and select ☆ Bookmark to keep it here.</p>
        </div>
      ) : (
        <div className="qwrap">
          {ordered.map((questionId) => {
            const topicId = resolveTopic(questionId);
            const topic = topicId ? topicById.get(topicId) : undefined;
            const digits = /-q(\d+)$/.exec(questionId)?.[1] ?? /-(\d+)$/.exec(questionId)?.[1];
            const label = topic?.title
              ? `${topic.title} · ${digits ? `Question ${Number(digits)}` : questionId}`
              : questionId;
            return (
              <div
                key={questionId}
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  padding: "0.8rem 0",
                  borderBottom: "1px solid var(--panel-line)",
                }}
              >
                <div style={{ minWidth: 0, flex: "1 1 16rem" }}>
                  <div style={{ fontWeight: 600 }}>{label}</div>
                  <div style={{ color: "var(--dim)", fontSize: "0.78rem" }}>{questionId}</div>
                  {!topic && (
                    <div style={{ color: "var(--dim)", fontSize: "0.78rem" }}>
                      This saved ID is no longer present in the course index.
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
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
    </section>
  );
}
