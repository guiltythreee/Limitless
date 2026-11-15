export default function HomePage() {
  return (
    <main className="page">
      <section className="panel" aria-labelledby="title">
        <p className="eyebrow">LIMITLESS / BOOKKEYS</p>
        <h1 id="title">Migration workspace</h1>
        <p className="intro">
          This is an isolated TypeScript scaffold. The production Bookkeys
          application remains unchanged while each subsystem is audited and
          migrated with parity tests.
        </p>
        <ul className="status">
          <li><span>Production reader</span><strong>Unchanged</strong></li>
          <li><span>Storage contracts</span><strong>Preserved</strong></li>
          <li><span>Feature extraction</span><strong>Not started</strong></li>
        </ul>
      </section>
    </main>
  );
}
