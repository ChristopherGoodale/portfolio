export default function Hero() {
  return (
    <section className="hero" id="top">
      <p className="hero__eyebrow">Hi, I'm</p>
      <h1 className="hero__name">Christopher Goodale</h1>
      <p className="hero__role">Engineer &amp; Data Specialist</p>
      <p className="hero__blurb">
        I build tools that turn messy processes — job applications, market
        data, workflows — into repeatable, data-driven systems.
      </p>
      <div className="hero__links">
        <a className="button button--primary" href="#projects">
          See my work
        </a>
        <a
          className="button button--ghost"
          href="https://github.com/ChristopherGoodale"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </section>
  )
}
