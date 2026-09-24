import * as THREE from 'three'

function readCssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

// Base/high colors for the wave shader, sourced from the portfolio's own
// theme variables (index.css) instead of hardcoding the reference's white/blue,
// so the effect stays on-brand and follows light/dark mode.
export function readThemeColors() {
  return {
    colorBase: new THREE.Color(readCssVar('--bg-soft') || '#171a21'),
    colorHigh: new THREE.Color(readCssVar('--accent') || '#6ee7b7'),
  }
}

// Re-reads the CSS vars whenever the OS/browser color scheme flips and
// reports the new colors back, so callers can mutate uniforms in place
// without rebuilding the material.
export function watchColorScheme(onChange) {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = () => onChange(readThemeColors())
  media.addEventListener('change', handler)
  return () => media.removeEventListener('change', handler)
}
