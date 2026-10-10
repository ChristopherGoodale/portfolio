import { useEffect, useRef, useState } from 'react'
import ProjectThumbnail from './ProjectThumbnail.jsx'

export default function ProjectCard({ project, isDimmed }) {
  const { title, tagline, description, tags, link, repo, snapshot } = project
  const isRepoOnly = link === repo
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)
  const textRef = useRef(null)

  // The text layer is absolutely positioned under the thumbnail, so it adds
  // no height of its own. Measure it and publish the height as --expand-h so
  // CSS can grow the media box to fit it on hover. Measured (not hardcoded)
  // because the wrapped height depends on the card's current width.
  useEffect(() => {
    const card = cardRef.current
    const text = textRef.current
    if (!snapshot || !card || !text) return
    const observer = new ResizeObserver(() => {
      card.style.setProperty('--expand-h', `${text.offsetHeight}px`)
    })
    observer.observe(text)
    return () => observer.disconnect()
  }, [snapshot])

  const expandContent = (
    <div
      ref={textRef}
      className={`project-card__expand${snapshot ? ' project-card__expand--overlay' : ''}`}
    >
      <p className="project-card__description">{description}</p>
      <div className="project-card__tags">
        {tags.map((tag) => (
          <span className="project-card__tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <span className="project-card__cta">
        {isRepoOnly ? 'View on GitHub →' : 'View live demo →'}
      </span>
    </div>
  )

  return (
    <a
      ref={cardRef}
      className="project-card"
      data-dimmed={isDimmed || undefined}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <div className="project-card__head">
        <h3>{title}</h3>
        <span className="project-card__arrow" aria-hidden="true">
          ↗
        </span>
      </div>
      <p className="project-card__tagline">{tagline}</p>

      {snapshot ? (
        <div className="project-card__media">
          {expandContent}
          <div className="project-card__thumb">
            <ProjectThumbnail src={snapshot} isActive={isHovered} />
          </div>
        </div>
      ) : (
        expandContent
      )}
    </a>
  )
}
