export function SiteHeader() {
  return (
    <header className="site-header">
      <a aria-label="Veloura Resort home" className="wordmark" href="#top">
        <span>veloura</span>
        <span>resort</span>
      </a>
      <nav aria-label="Main navigation" className="site-nav">
        <a href="#stay">The stay</a>
        <a href="#rituals">Slow rituals</a>
        <a className="nav-cta" href="#contact">Plan your stay</a>
      </nav>
    </header>
  )
}
