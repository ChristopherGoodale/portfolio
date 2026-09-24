import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../data/projects.js'
import WaveGridBackground from '../three/WaveGridBackground.jsx'
import SlideUpPanel from '../common/SlideUpPanel.jsx'
import AboutCard from '../about/AboutCard.jsx'
import ContactCard from '../contact/ContactCard.jsx'

export default function Hero() {
  // Which of the two slide-up cards is open, if any. Owned here (rather
  // than inside each card) so opening one closes the other - at their
  // larger size, two overlapping panels would look broken.
  const [openPanel, setOpenPanel] = useState(null) // 'about' | 'contact' | null
  const aboutTriggerRef = useRef(null)
  const contactTriggerRef = useRef(null)

  return (
    <section className="hero" id="top">
      <WaveGridBackground />
      <div className="hero__inner">
        <p className="hero__eyebrow">Hi, I'm</p>
        <h1 className="hero__name">Christopher Goodale</h1>
        <p className="hero__role">{CATEGORIES.join(' | ')}</p>
        <p className="hero__blurb">
          I build tools that turn messy processes — job applications, market
          data, workflows — into repeatable, data-driven solutions.
        </p>
        <div className="hero__links">
          <Link className="button button--primary" to="/projects">
            See my work
          </Link>
          <button
            type="button"
            ref={aboutTriggerRef}
            className="button button--ghost"
            onClick={() => setOpenPanel('about')}
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
            onClick={() => setOpenPanel('contact')}
          >
            Contact
          </button>
        </div>
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
    </section>
  )
}
