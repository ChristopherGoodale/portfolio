import * as THREE from 'three'

// Fixed-radius orbit camera with a tilted up-vector, so it always looks
// down at the grid from an angle. Mouse/pointer position nudges the orbit
// slightly, giving the scene subtle parallax. Ported from the reference's
// Camera.js, adapted to be instance-scoped (constructed with its deps
// passed in, not pulled from a singleton) and torn down via destroy().
export default class Camera {
  constructor(sizes) {
    this.sizes = sizes

    this.radius = 12
    this.alphaRange = Math.PI * 0.03 // mouse Y -> tilt around X, ~14 deg
    this.betaRange = Math.PI * 0.05 // mouse X -> orbit around Z, ~22 deg

    this.mouse = new THREE.Vector2(0, 0)
    this.lerpedMouse = new THREE.Vector2(0, 0)

    this.instance = new THREE.PerspectiveCamera(
      40,
      this.sizes.width / this.sizes.height,
      0.1,
      200,
    )
    this._updatePosition(0, 0)

    this._onPointerMove = (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('pointermove', this._onPointerMove)

    this._onResize = () => this.resize()
    this.sizes.onResize(this._onResize)
  }

  _updatePosition(mx, my) {
    const alpha = my * this.alphaRange
    const beta = mx * this.betaRange

    this.instance.position.set(
      -this.radius * Math.cos(alpha) * Math.sin(beta),
      this.radius * Math.cos(alpha) * Math.cos(beta),
      this.radius * Math.sin(alpha),
    )
    this.instance.up.set(0, 0, -1)
    this.instance.lookAt(0, 0, 0)
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  update() {
    this.lerpedMouse.x += (this.mouse.x - this.lerpedMouse.x) * 0.04
    this.lerpedMouse.y += (this.mouse.y - this.lerpedMouse.y) * 0.04
    this._updatePosition(this.lerpedMouse.x, this.lerpedMouse.y)
  }

  destroy() {
    window.removeEventListener('pointermove', this._onPointerMove)
  }
}
