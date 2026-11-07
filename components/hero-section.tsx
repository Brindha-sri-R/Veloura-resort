import Image from "next/image"

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="hero" id="top">
      <Image
        alt="A quiet Mediterranean shoreline beside a sunlit coastal retreat"
        className="hero-image"
        fill
        priority
        sizes="100vw"
        src="/veloura-coast.png"
      />
      <div aria-hidden="true" className="hero-shade" />
      <div className="hero-content">
        <p className="eyebrow">A private coastal hideaway</p>
        <h1 id="hero-title">
          Where the sea
          <br />
          <em>slows time.</em>
        </h1>
        <div className="hero-bottom">
          <p className="hero-description">
            A softer rhythm, shaped by salt air, open horizons, and the simple luxury of having nowhere else to be.
          </p>
          <a className="text-link" href="#stay">
            Discover Veloura <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <span className="hero-aside">A slower side of the Mediterranean</span>
    </section>
  )
}
