export default function HomePage() {
  return (
    <main className="page">
      <section className="panel" aria-labelledby="title">
        <p className="eyebrow">LIMITLESS / BOOKKEYS</p>
        <h1 id="title">Migration workspace</h1>
        <p className="intro">This is an isolated TypeScript application. Production Bookkeys remains unchanged while each subsystem is migrated with explicit parity checks.</p>
        <ul className="status">
          <li><span>Production reader</span><strong>Unchanged</strong></li>
          <li><span>Storage contracts</span><strong>Preserved</strong></li>
          <li><span>Feature extraction</span><strong>In progress</strong></li>
        </ul>
      </section>
    </main>
  );
}
