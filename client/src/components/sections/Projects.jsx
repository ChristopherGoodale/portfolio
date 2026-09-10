import { projects } from '../../data/projects.js'
import ProjectCard from '../project/ProjectCard.jsx'
import CategoryFilter from '../project/CategoryFilter.jsx'

export default function Projects({
  activeCategory,
  pinnedCategory,
  onCategoryHover,
  onCategoryToggle,
}) {
  return (
    <section className="projects" id="projects">
      <h2>Featured Projects</h2>
      <p className="projects__hint">Hover a card to expand it.</p>
      <CategoryFilter
        activeCategory={activeCategory}
        pinnedCategory={pinnedCategory}
        onCategoryHover={onCategoryHover}
        onCategoryToggle={onCategoryToggle}
        className="projects__filter"
      />
      <div className="projects__grid">
        {projects.map((project) => (
          <ProjectCard
            project={project}
            isDimmed={
              Boolean(activeCategory) &&
              !project.categories.includes(activeCategory)
            }
            key={project.title}
          />
        ))}
      </div>
    </section>
  )
}
