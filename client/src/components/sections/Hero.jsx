import CategoryFilter from '../project/CategoryFilter.jsx'
import WaveGridBackground from '../three/WaveGridBackground.jsx'
import ContactCard from '../contact/ContactCard.jsx'

export default function Hero({
  activeCategory,
  pinnedCategory,
  onCategoryHover,
  onCategoryToggle,
}) {
  return (
    <section className="hero" id="top">
      <WaveGridBackground />
      <div className="hero__inner">
        <p className="hero__eyebrow">Hi, I'm</p>
        <h1 className="hero__name">Christopher Goodale</h1>
        <CategoryFilter
          activeCategory={activeCategory}
          pinnedCategory={pinnedCategory}
          onCategoryHover={onCategoryHover}
          onCategoryToggle={onCategoryToggle}
          className="hero__role"
        />
        <p className="hero__blurb">
          I build tools that turn messy processes — job applications, market
          data, workflows — into repeatable, data-driven solutions.
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
          <a
            className="button button--ghost"
            href="https://www.linkedin.com/in/christopher-goodale-34698213a/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <ContactCard />
        </div>
      </div>
    </section>
  )
}
