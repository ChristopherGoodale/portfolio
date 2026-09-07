export default function ProjectCard({ project }) {
  const { title, tagline, description, tags, link, repo } = project
  const isRepoOnly = link === repo

  return (
    <a
      className="project-card"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="project-card__head">
        <h3>{title}</h3>
        <span className="project-card__arrow" aria-hidden="true">
          ↗
        </span>
      </div>
      <p className="project-card__tagline">{tagline}</p>

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
    </a>
  )
}
