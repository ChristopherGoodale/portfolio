import { useEffect } from 'react'
import BackLink from '../components/layout/BackLink.jsx'
import Projects from '../components/sections/Projects.jsx'
import Footer from '../components/layout/Footer.jsx'

export default function ProjectsPage() {
  useEffect(() => {
    document.title = 'Projects — Christopher Goodale'
  }, [])

  return (
    <>
      <BackLink />
      <Projects />
      <Footer />
    </>
  )
}
