import { useState } from 'react'
import Hero from './components/sections/Hero.jsx'
import About from './components/sections/About.jsx'
import Projects from './components/sections/Projects.jsx'
import Footer from './components/layout/Footer.jsx'

export default function App() {
  const [pinnedCategory, setPinnedCategory] = useState(null)
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const activeCategory = hoveredCategory ?? pinnedCategory

  function toggleCategory(category) {
    setPinnedCategory((current) => (current === category ? null : category))
  }

  return (
    <main>
      <Hero
        activeCategory={activeCategory}
        pinnedCategory={pinnedCategory}
        onCategoryHover={setHoveredCategory}
        onCategoryToggle={toggleCategory}
      />
      <About />
      <Projects
        activeCategory={activeCategory}
        pinnedCategory={pinnedCategory}
        onCategoryHover={setHoveredCategory}
        onCategoryToggle={toggleCategory}
      />
      <Footer />
    </main>
  )
}
