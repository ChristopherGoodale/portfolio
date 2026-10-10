import { useRef, useState } from 'react'
import WaveGridBackground from '../three/WaveGridBackground.jsx'
import SlideUpPanel from '../common/SlideUpPanel.jsx'
import CategoryFilter from '../project/CategoryFilter.jsx'
import Projects from './Projects.jsx'
import AboutCard from '../about/AboutCard.jsx'
import ContactCard from '../contact/ContactCard.jsx'
import Footer from '../layout/Footer.jsx'

export default function Hero() {
  // Which of the two slide-up cards is open, if any. Owned here (rather
  // than inside each card) so opening one closes the other - at their
  // larger size, two overlapping panels would look broken.
  const [openPanel, setOpenPanel] = useState(null) // 'about' | 'contact' | null
  const aboutTriggerRef = useRef(null)
  const contactTriggerRef = useRef(null)

  // 'home' = centered banner; 'projects' = banner docked top-left with the
  // card grid filling the space below. CSS keys every transition off the
  // section's data-view attribute.
  const [view, setView] = useState('home') // 'home' | 'projects'
  const isProjects = view === 'projects'

  // Role filter state. Lives here (not in Projects) because the filter UI
  // is in the banner while the cards it dims are in the grid below.
  const [pinnedCategory, setPinnedCategory] = useState(null)
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const activeCategory = hoveredCategory ?? pinnedCategory

  function toggleCategory(category) {
    setPinnedCategory((current) => (current === category ? null : category))
  }

  // Back resets the filter too, so the next visit to projects starts with
  // every card undimmed and no role pinned.
  function toggleView() {
    if (isProjects) {
      setPinnedCategory(null)
      setHoveredCategory(null)
    }
    setView(isProjects ? 'home' : 'projects')
  }

  return (
    <section className="hero" id="top" data-view={view}>
      <WaveGridBackground />
      <div className="hero__inner">
        <div className="hero__spacer" />
        <div className="hero__glass">
          <div className="hero__fold">
            <div>
              <p className="hero__eyebrow">Hi, I'm</p>
            </div>
          </div>
          <h1 className="hero__name">Christopher Goodale</h1>
          <CategoryFilter
            activeCategory={activeCategory}
            pinnedCategory={pinnedCategory}
            onCategoryHover={setHoveredCategory}
            onCategoryToggle={toggleCategory}
            className="hero__role"
            inert={!isProjects}
          />
          <div className="hero__fold">
            <div>
              <p className="hero__blurb">
                I build tools that turn messy processes (job applications,
                market data, workflows) into repeatable, data-driven solutions.
              </p>
            </div>
          </div>
          <div className="hero__links">
            <button
              type="button"
              className="button button--primary"
              aria-expanded={isProjects}
              onClick={toggleView}
            >
              {isProjects ? 'Back' : 'See my work'}
            </button>
            <button
              type="button"
              ref={aboutTriggerRef}
              className="button button--ghost"
              aria-expanded={openPanel === 'about'}
            onClick={() => setOpenPanel((p) => (p === 'about' ? null : 'about'))}
            >
              About
            </button>
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
            <button
              type="button"
              ref={contactTriggerRef}
              className="button button--ghost"
              aria-expanded={openPanel === 'contact'}
            onClick={() => setOpenPanel((p) => (p === 'contact' ? null : 'contact'))}
            >
              Contact
            </button>
          </div>
        </div>
        <div className="hero__projects">
          <Projects activeCategory={activeCategory} />
        </div>
        <div className="hero__spacer" />
      </div>

      <SlideUpPanel
        isOpen={openPanel === 'about'}
        onClose={() => setOpenPanel(null)}
        titleId="about-card-name"
        triggerRef={aboutTriggerRef}
      >
        <AboutCard />
      </SlideUpPanel>

      <SlideUpPanel
        isOpen={openPanel === 'contact'}
        onClose={() => setOpenPanel(null)}
        titleId="contact-card-name"
        triggerRef={contactTriggerRef}
      >
        <ContactCard />
      </SlideUpPanel>

      <Footer />
    </section>
  )
}
