import { useEffect } from 'react'
import Hero from '../components/sections/Hero.jsx'

export default function Home() {
  useEffect(() => {
    document.title = 'Christopher Goodale'
  }, [])

  return <Hero />
}
