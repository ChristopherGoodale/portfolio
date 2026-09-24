import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import profilePhoto from '../../assets/profile-photo.jpg'

// Phone digits kept out of the page source as a plain "630-397-9811"-shaped
// string (a static regex/text scraper's easiest target) by storing them
// reversed and reassembling only at render time.
const PHONE_REVERSED = '1189793036'
function formatPhone(digits) {
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function ContactCard() {
  // isOpen: the logical/desired state (drives the slide transform).
  // isMounted: whether the panel is in the DOM at all - stays true a
  // moment longer than isOpen so the slide-down transition can play
  // before the panel (and its focusable contents) disappear.
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const triggerRef = useRef(null)
  const closeButtonRef = useRef(null)
  const [phoneDigits, setPhoneDigits] = useState(null)

  function open() {
    setIsMounted(true)
    // Let the closed (off-screen) position paint first, then flip to
    // open so the transform transition actually has something to
    // animate from instead of snapping straight to the open position.
    requestAnimationFrame(() => requestAnimationFrame(() => setIsOpen(true)))
  }

  function close() {
    setIsOpen(false)
    triggerRef.current?.focus()
    if (prefersReducedMotion()) setIsMounted(false)
    // otherwise unmounted by handleTransitionEnd once the slide-down finishes
  }

  function handleTransitionEnd(e) {
    if (e.propertyName === 'transform' && !isOpen) setIsMounted(false)
  }

  useEffect(() => {
    if (!isOpen) return

    // Reassembled on open rather than at module load, so it never sits
    // pre-computed in an idle part of the bundle either.
    setPhoneDigits([...PHONE_REVERSED].reverse().join(''))

    closeButtonRef.current?.focus()

    function onKeyDown(e) {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  return (
    <>
      <button type="button" ref={triggerRef} className="button button--ghost" onClick={open}>
        Contact
      </button>

      {isMounted &&
        createPortal(
          <>
            {/* Invisible click-outside-to-close catcher - deliberately not a
                dimming backdrop, so the rest of the page stays fully visible
                while the card is open. */}
            <div className="contact-scrim" onClick={close} />
            <div
              className={`contact-card${isOpen ? ' contact-card--open' : ''}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-card-name"
              onTransitionEnd={handleTransitionEnd}
            >
              <button
                type="button"
                ref={closeButtonRef}
                className="contact-card__close"
                onClick={close}
                aria-label="Close contact card"
              >
                &times;
              </button>

              <div className="contact-card__header">
                <img
                  src={profilePhoto}
                  alt="Christopher Goodale"
                  className="contact-card__photo"
                />
                <h2 id="contact-card-name" className="contact-card__name">
                  Christopher Goodale
                </h2>
              </div>

              <dl className="contact-card__rows">
                <div className="contact-card__row">
                  <dt>Phone</dt>
                  <dd>
                    {phoneDigits && (
                      <a href={`tel:+1${phoneDigits}`}>{formatPhone(phoneDigits)}</a>
                    )}
                  </dd>
                </div>
                <div className="contact-card__row">
                  <dt>Email (job inquiries)</dt>
                  <dd>
                    <a href="mailto:christophergdale@gmail.com">
                      christophergdale@gmail.com
                    </a>
                  </dd>
                </div>
                <div className="contact-card__row">
                  <dt>Email (business inquiries)</dt>
                  <dd>
                    <a href="mailto:axiom.automation.llc@gmail.com">
                      axiom.automation.llc@gmail.com
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </>,
          document.body,
        )}
    </>
  )
}
