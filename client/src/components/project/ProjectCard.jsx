import { useState } from 'react'
import ProjectThumbnail from './ProjectThumbnail.jsx'

export default function ProjectCard({ project, isDimmed }) {
  const { title, tagline, description, tags, link, repo, snapshot } = project
  const isRepoOnly = link === repo
  const [isHovered, setIsHovered] = useState(false)

  const expandContent = (
    <div className="project-card__expand">
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

      {snapshot && (
        <div className="project-card__thumb">
          <ProjectThumbnail src={snapshot} isActive={isHovered} />
        </div>
      )}
      {expandContent}
    </a>
  )
}
