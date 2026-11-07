export function SiteFooter() {
  return (
    <footer aria-labelledby="contact-title" className="footer-section" id="contact">
      <div className="footer-top">
        <div>
          <p className="eyebrow">Your time, your tide</p>
          <h2 className="section-title" id="contact-title">
            There’s a little more <em>room to breathe.</em>
          </h2>
        </div>
        <a className="text-link" href="#top">
          Back to the beginning <span aria-hidden="true">↑</span>
        </a>
      </div>
      <div className="footer-bottom">
        <a className="wordmark" href="#top" aria-label="Veloura Resort home">
          <span>veloura</span>
          <span>resort</span>
        </a>
        <p>© {new Date().getFullYear()} Veloura Resort</p>
        <p>A slower side of the Mediterranean</p>
      </div>
    </footer>
  )
}
