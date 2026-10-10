import { projects } from '../../data/projects.js'
import ProjectCard from '../project/ProjectCard.jsx'

// Grid only: the role filter lives in Hero's banner, which owns
// activeCategory and passes it down.
export default function Projects({ activeCategory }) {
  return (
    <section className="projects" id="projects">
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
