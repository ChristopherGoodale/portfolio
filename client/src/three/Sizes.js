// Tracks viewport size/pixel ratio and notifies listeners on resize.
// A plain callback list instead of a full pub/sub library (mitt in the
// reference project) since only Camera and Renderer ever subscribe.
export default class Sizes {
  constructor() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)

    this._listeners = []
    this._onResize = () => {
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.pixelRatio = Math.min(window.devicePixelRatio, 2)
      for (const cb of this._listeners) cb()
    }
    window.addEventListener('resize', this._onResize)
  }

  onResize(cb) {
    this._listeners.push(cb)
  }

  destroy() {
    window.removeEventListener('resize', this._onResize)
    this._listeners = []
  }
}
