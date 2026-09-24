import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// Must match .slide-panel's transition duration in index.css.
const CLOSE_DURATION_MS = 320

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Controlled slide-up glass panel: the parent owns `isOpen` (so sibling
// panels can be made mutually exclusive), this component owns only the
// portal/shell mechanics - mount timing, the entrance transition, focus
// management, and Escape/outside-click dismissal.
export default function SlideUpPanel({ isOpen, onClose, titleId, triggerRef, children }) {
  // isMounted: whether the panel exists in the DOM at all.
  // isEntered: whether it's been nudged to its open (slid-up) position.
  // Kept distinct from the `isOpen` prop itself because, unlike a
  // self-contained version, `isMounted` can no longer flip synchronously
  // inside a click handler - it now reacts to `isOpen` via an effect, so
  // "mounted" and "entered" can land in different commits.
  const [isMounted, setIsMounted] = useState(false)
  const [isEntered, setIsEntered] = useState(false)
  const panelRef = useRef(null)
  const closeButtonRef = useRef(null)

  function handleClose() {
    onClose()
    // Only the explicit close path (button/outside-click/Escape) returns
    // focus. A panel closed indirectly - e.g. by a sibling panel opening
    // and taking over `openPanel` - would race this against the new
    // panel's own focus-on-open effect; that effect always runs later
    // (after the click that opened it finishes), so it wins regardless.
    triggerRef?.current?.focus()
  }

  // Always-latest ref so the effect below doesn't need `handleClose` in
  // its dependency array (it's a new closure every render) and doesn't
  // re-subscribe its listeners on every parent render.
  const handleCloseRef = useRef(handleClose)
  handleCloseRef.current = handleClose

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true)
      return
    }

    setIsEntered(false)
    if (prefersReducedMotion()) {
      setIsMounted(false)
      return
    }
    // A fixed timer (matched to the CSS transition duration) rather than
    // an onTransitionEnd listener - more robust than depending on a
    // transitionend event reliably bubbling up through a portaled,
    // multi-instance tree sitting on top of a continuously-animating
    // WebGL canvas + backdrop-filter blur, which proved flaky in testing.
    const timer = setTimeout(() => setIsMounted(false), CLOSE_DURATION_MS)
    return () => clearTimeout(timer)
  }, [isOpen])

  useEffect(() => {
    if (!isMounted || !isOpen) return
    // Let the closed (off-screen) position paint first, then flip to
    // open so the transform transition has something to animate from.
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setIsEntered(true)),
    )
    return () => cancelAnimationFrame(raf)
  }, [isMounted, isOpen])

  useEffect(() => {
    if (!isMounted || !isOpen) return
    closeButtonRef.current?.focus()

    function onKeyDown(e) {
      if (e.key === 'Escape') handleCloseRef.current()
    }
    // mousedown (not click) so this settles before any trigger button's
    // own click handler runs - clicking a *different* panel's trigger
    // while this one is open both closes this panel and lets that click
    // continue on to open the other one, instead of a full-screen
    // click-catching div silently swallowing the click before it ever
    // reaches the button underneath.
    function onPointerDown(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        handleCloseRef.current()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [isMounted, isOpen])

  if (!isMounted) return null

  return createPortal(
    <div
      ref={panelRef}
      className={`slide-panel${isEntered ? ' slide-panel--open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        ref={closeButtonRef}
        className="slide-panel__close"
        onClick={handleClose}
        aria-label="Close"
      >
        &times;
      </button>
      {children}
    </div>,
    document.body,
  )
}
