import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Orchestrator from '../../three/Orchestrator.js'
import { isWebGLAvailable } from '../../three/utils/webgl.js'

function canMount() {
  return (
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches && isWebGLAvailable()
  )
}

// Portals a full-viewport canvas to document.body and drives the 3D
// wave-grid scene on it. Portaling (rather than relying on `position:
// fixed` from wherever this is mounted in the React tree) keeps the
// canvas immune to any ancestor that later gains a transform/filter,
// which would otherwise turn it into a containing block and break fixed
// positioning.
//
// Under prefers-reduced-motion or missing WebGL support, the canvas
// itself is never rendered (not just left un-animated) - Hero's own
// background is transparent, so with no canvas mounted the plain solid
// body background shows through unchanged, with nothing left behind.
export default function WaveGridBackground() {
  const canvasRef = useRef(null)
  const [shouldMount] = useState(canMount)

  useEffect(() => {
    if (!shouldMount) return

    const orchestrator = new Orchestrator(canvasRef.current)
    return () => orchestrator.destroy()
  }, [shouldMount])

  if (!shouldMount) return null

  return createPortal(
    <canvas ref={canvasRef} className="wave-grid-canvas" aria-hidden="true" />,
    document.body,
  )
}
