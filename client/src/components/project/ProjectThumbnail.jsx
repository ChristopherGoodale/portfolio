import { useEffect, useRef } from 'react'

// Discrete block sizes for the mosaic pass, small to large: deliberately a
// short list so the dissolve reads as steppy/8-bit rather than a smooth
// blur. 24px max block keeps it chunky without turning into unrecognizable
// noise before the underlying text is legible.
const STEPS = [1, 3, 6, 10, 16, 24]
const DURATION_MS = 520

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// object-fit: cover math for a manual canvas draw.
function coverRect(naturalW, naturalH, targetW, targetH) {
  const targetRatio = targetW / targetH
  const imageRatio = naturalW / naturalH
  if (imageRatio > targetRatio) {
    const sh = naturalH
    const sw = sh * targetRatio
    return { sx: (naturalW - sw) / 2, sy: 0, sw, sh }
  }
  const sw = naturalW
  const sh = sw / targetRatio
  return { sx: 0, sy: (naturalH - sh) / 2, sw, sh }
}

export default function ProjectThumbnail({ src, isActive }) {
  const canvasRef = useRef(null)
  const offscreenRef = useRef(null)
  const imageRef = useRef(null)
  const progressRef = useRef(0) // 0 = crisp/visible, 1 = dissolved/hidden
  const targetRef = useRef(0)
  const rafRef = useRef(null)
  const lastStepRef = useRef(-1)
  const reducedMotionRef = useRef(false)

  function sizeCanvasToContainer() {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = Math.max(1, Math.round(rect.width * dpr))
    canvas.height = Math.max(1, Math.round(rect.height * dpr))
  }

  function drawFrame(block) {
    const canvas = canvasRef.current
    const img = imageRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')
    const { width, height } = canvas
    if (!offscreenRef.current) offscreenRef.current = document.createElement('canvas')
    const off = offscreenRef.current
    const offW = Math.max(1, Math.round(width / block))
    const offH = Math.max(1, Math.round(height / block))
    off.width = offW
    off.height = offH
    const offCtx = off.getContext('2d')
    const { sx, sy, sw, sh } = coverRect(img.naturalWidth, img.naturalHeight, offW, offH)
    offCtx.drawImage(img, sx, sy, sw, sh, 0, 0, offW, offH)

    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(off, 0, 0, offW, offH, 0, 0, width, height)
  }

  function applyProgress() {
    const canvas = canvasRef.current
    const progress = progressRef.current
    if (canvas) canvas.style.opacity = String(1 - progress)
    const stepIndex = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length))
    if (stepIndex !== lastStepRef.current) {
      lastStepRef.current = stepIndex
      drawFrame(STEPS[stepIndex])
    }
  }

  function ensureLoopRunning() {
    if (rafRef.current) return
    let last = performance.now()
    const tick = (now) => {
      const dt = now - last
      last = now
      const delta = dt / DURATION_MS
      const target = targetRef.current
      const progress = progressRef.current
      if (progress < target) progressRef.current = Math.min(target, progress + delta)
      else if (progress > target) progressRef.current = Math.max(target, progress - delta)
      applyProgress()
      rafRef.current =
        progressRef.current !== targetRef.current ? requestAnimationFrame(tick) : null
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  // Loads the image once per src change and paints the initial crisp frame.
  useEffect(() => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      imageRef.current = img
      progressRef.current = 0
      lastStepRef.current = -1
      applyProgress()
    }
    img.src = src
    return () => {
      img.onload = null
    }
  }, [src])

  // Keeps the canvas backing store in sync with its rendered CSS size, so
  // the pixelation math runs on real device pixels rather than a stretched
  // bitmap.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    reducedMotionRef.current = prefersReducedMotion()
    sizeCanvasToContainer()
    const observer = new ResizeObserver(() => {
      sizeCanvasToContainer()
      lastStepRef.current = -1
      applyProgress()
    })
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    targetRef.current = isActive ? 1 : 0
    if (reducedMotionRef.current) {
      progressRef.current = targetRef.current
      lastStepRef.current = -1
      applyProgress()
      return
    }
    ensureLoopRunning()
  }, [isActive])

  useEffect(() => {
    return () => {
      // Reset (not just cancel) the ref: React StrictMode's dev-only
      // mount -> cleanup -> mount-again cycle runs this cleanup once
      // before the "real" mount, and a stale non-null id here would make
      // ensureLoopRunning's `if (rafRef.current) return` guard permanently
      // think a loop is already running, silently blocking every future
      // hover animation for this card's lifetime.
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="project-card__thumb-canvas" aria-hidden="true" />
}
