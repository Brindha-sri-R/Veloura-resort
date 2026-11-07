import Image from "next/image"

export function StaySection() {
  return (
    <section aria-labelledby="stay-title" className="stay-section section-wrap" id="stay">
      <div className="section-copy">
        <p className="eyebrow">A sense of place</p>
        <h2 className="section-title" id="stay-title">
          Made for the art of <em>doing less.</em>
        </h2>
        <p>
          Tucked between hillside and sea, Veloura is a small world of considered comforts. Wake with the light, linger over lunch, and let the day find its own pace.
        </p>
        <a className="text-link" href="#contact">
          Find your room <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="stay-image-wrap">
        <Image
          alt="A serene resort suite in natural linen and warm wood, opening onto a garden terrace"
          className="stay-image"
          fill
          sizes="(max-width: 760px) 86vw, 42vw"
          src="/veloura-suite.png"
        />
        <span className="image-note">Stay a little longer</span>
      </div>
    </section>
  )
}
