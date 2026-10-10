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
// management, and Escape/X dismissal (the trigger-button toggle lives in
// the parent).
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
    // Only the explicit close path (X button/Escape) returns
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

    // No outside-click dismissal on purpose: the panel stays until the user
    // clicks the X, clicks its own trigger button again (a toggle, handled
    // by the parent), or presses Escape. An outside-mousedown close used to
    // fire before the trigger's click, so clicking the trigger to close it
    // closed and then immediately reopened it.
    function onKeyDown(e) {
      if (e.key === 'Escape') handleCloseRef.current()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isMounted, isOpen])

  if (!isMounted) return null

  return createPortal(
    <div
      ref={panelRef}
      className={`slide-panel${isEntered ? ' slide-panel--open' : ''}`}
      role="dialog"
      aria-modal="false"
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
