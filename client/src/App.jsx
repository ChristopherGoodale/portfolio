import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'

export default function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Projects now live inside Hero; old /projects links land home. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  )
}
