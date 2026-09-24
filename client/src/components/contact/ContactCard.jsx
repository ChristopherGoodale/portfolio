import { useEffect, useState } from 'react'
import profilePhoto from '../../assets/profile-photo.jpg'

// Phone digits kept out of the page source as a plain "630-397-9811"-shaped
// string (a static regex/text scraper's easiest target) by storing them
// reversed and reassembling only at render time.
const PHONE_REVERSED = '1189793036'
function formatPhone(digits) {
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

// Content only - the slide-up shell, scrim, and open/close mechanics
// live in SlideUpPanel. This component only ever mounts while its panel
// is actually open (SlideUpPanel returns null while closed), so a plain
// mount-time effect is enough to keep the digits freshly reassembled on
// every open rather than sitting pre-computed anywhere.
export default function ContactCard() {
  const [phoneDigits, setPhoneDigits] = useState(null)

  useEffect(() => {
    setPhoneDigits([...PHONE_REVERSED].reverse().join(''))
  }, [])

  return (
    <>
      <div className="contact-card__header">
        <img src={profilePhoto} alt="Christopher Goodale" className="contact-card__photo" />
        <h2 id="contact-card-name" className="contact-card__name">
          Christopher Goodale
        </h2>
      </div>

      <dl className="contact-card__rows">
        <div className="contact-card__row">
          <dt>Phone</dt>
          <dd>
            {phoneDigits && <a href={`tel:+1${phoneDigits}`}>{formatPhone(phoneDigits)}</a>}
          </dd>
        </div>
        <div className="contact-card__row">
          <dt>Email (job inquiries)</dt>
          <dd>
            <a href="mailto:christophergdale@gmail.com">christophergdale@gmail.com</a>
          </dd>
        </div>
        <div className="contact-card__row">
          <dt>Email (business inquiries)</dt>
          <dd>
            <a href="mailto:axiom.automation.llc@gmail.com">axiom.automation.llc@gmail.com</a>
          </dd>
        </div>
      </dl>
    </>
  )
}
