import { useEffect, useRef, useState } from 'react'
import ProjectThumbnail from './ProjectThumbnail.jsx'

export default function ProjectCard({ project, isDimmed }) {
  const { title, tagline, description, tags, link, repo, snapshot } = project
  const isRepoOnly = link === repo
  // Private repos have no link: render a plain, focusable card instead of an
  // anchor so it does not lead visitors to a GitHub 404.
  const Tag = link ? 'a' : 'div'
  const linkProps = link
    ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
    : { tabIndex: 0 }
  const cta = !link
    ? 'Repo available on request'
    : isRepoOnly
      ? 'View on GitHub →'
      : 'View live demo →'
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
      <span className="project-card__cta">{cta}</span>
    </div>
  )

  return (
    <Tag
      ref={cardRef}
      className="project-card"
      data-dimmed={isDimmed || undefined}
      {...linkProps}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <div className="project-card__head">
        <h3>{title}</h3>
        {link && (
          <span className="project-card__arrow" aria-hidden="true">
            ↗
          </span>
        )}
      </div>
      <p className="project-card__tagline">{tagline}</p>
      <div className="project-card__tags">
        {tags.map((tag) => (
          <span className="project-card__tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>

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
    </Tag>
  )
}
