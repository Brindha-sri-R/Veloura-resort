const rituals = [
  {
    number: "01",
    title: "A table by the water",
    description: "Long lunches, bright local ingredients, and the last light settling over the coast.",
  },
  {
    number: "02",
    title: "The unhurried morning",
    description: "Coffee on your terrace, a swim before breakfast, and nothing on the agenda.",
  },
  {
    number: "03",
    title: "Room to wander",
    description: "Follow the footpaths, find a quiet cove, or stay right where you are.",
  },
]

export function RitualsSection() {
  return (
    <section aria-labelledby="rituals-title" className="rituals-section section-wrap" id="rituals">
      <div className="rituals-intro">
        <div>
          <p className="eyebrow">The Veloura feeling</p>
          <h2 className="section-title" id="rituals-title">
            Little things, <em>beautifully done.</em>
          </h2>
        </div>
        <p>
          A stay here is made of small, thoughtful moments. Choose your own pace; we’ll take care of the rest.
        </p>
      </div>
      <div className="ritual-list">
        {rituals.map((ritual) => (
          <article className="ritual-card" key={ritual.number}>
            <span className="ritual-number">{ritual.number}</span>
            <h3>{ritual.title}</h3>
            <p>{ritual.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
