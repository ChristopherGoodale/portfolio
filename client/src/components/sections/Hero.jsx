import { CATEGORIES } from '../../data/projects.js'

export default function Hero({
  activeCategory,
  pinnedCategory,
  onCategoryHover,
  onCategoryToggle,
}) {
  return (
    <section className="hero" id="top">
      <p className="hero__eyebrow">Hi, I'm</p>
      <h1 className="hero__name">Christopher Goodale</h1>
      <div
        className="hero__role"
        role="group"
        aria-label="Filter projects by role"
      >
        {CATEGORIES.map((category, index) => (
          <span key={category} className="hero__role-item">
            {index > 0 && (
              <span className="hero__role-sep" aria-hidden="true">
                |
              </span>
            )}
            <button
              type="button"
              className="hero__role-button"
              aria-pressed={pinnedCategory === category}
              data-active={activeCategory === category || undefined}
              onMouseEnter={() => onCategoryHover(category)}
              onMouseLeave={() => onCategoryHover(null)}
              onFocus={() => onCategoryHover(category)}
              onBlur={() => onCategoryHover(null)}
              onClick={() => onCategoryToggle(category)}
            >
              {category}
            </button>
          </span>
        ))}
      </div>
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
