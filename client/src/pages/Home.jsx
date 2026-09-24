import { useEffect } from 'react'
import Hero from '../components/sections/Hero.jsx'
import Footer from '../components/layout/Footer.jsx'

export default function Home() {
  useEffect(() => {
    document.title = 'Christopher Goodale'
  }, [])

  return (
    <>
      <Hero />
      <div className="page-content">
        <Footer />
      </div>
    </>
  )
}
