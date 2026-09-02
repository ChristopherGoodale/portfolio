import { projects } from '../../data/projects.js'
import ProjectCard from '../project/ProjectCard.jsx'

export default function Projects() {
  return (
    <section className="projects" id="projects">
      <h2>Featured Projects</h2>
      <p className="projects__hint">Hover a card to expand it.</p>
      <div className="projects__grid">
        {projects.map((project) => (
          <ProjectCard project={project} key={project.title} />
        ))}
      </div>
    </section>
  )
}
