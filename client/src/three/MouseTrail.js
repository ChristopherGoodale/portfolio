import * as THREE from 'three'

// Maximum number of trail points kept alive at once.
// Must match the literal "128" used in the vertex shader texture lookup.
const MAX_TRAIL = 128

/**
 * MouseTrail
 *
 * Records a pointer trail in world space and uploads it every frame as a
 * MAX_TRAIL x 1 RGBA float DataTexture. Each texel encodes one trail point:
 *   .r = world X
 *   .g = world Z
 *   .b = age (seconds since the point was created)
 *   .a = distDelta (distance moved since the previous point, used to
 *        weaken waves seeded from closely-spaced points)
 *
 * Stage.js's shader reads this texture and, for every cube, sums the wave
 * contributions from each live trail point: an outward-expanding Gaussian
 * envelope centred on the wavefront, cosine oscillation relative to the
 * wavefront position, exponential time-fade and 1/(1+dist) distance
 * attenuation.
 *
 * Ported from the reference project's Effects/MouseTrail.js, adapted to
 * take its dependencies (canvas, camera, sizes) directly instead of
 * looking them up via a singleton Orchestrator.
 */
export default class MouseTrail {
  constructor(canvas, camera, sizes, bounds) {
    this.canvas = canvas
    this.camera = camera
    this.sizes = sizes
    this.bounds = bounds

    this.params = {
      fadeTime: 2.0, // seconds for amplitude to fall to ~37%
      trailSpacing: 0.1, // minimum world-unit distance between trail points
    }

    this.trail = [] // [{ x, z, age, distDelta }]
    this.lastPoint = null

    this.timeSinceLastMove = 0
    this.randomPointTimer = 0
    this.isPlacingRandomPoints = true
    this.randomPointStrength = 0.8

    this.mouseCoords = new THREE.Vector2()
    this.raycaster = new THREE.Raycaster()

    // Invisible horizontal plane for pointer -> world-space raycasting.
    this.rayPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(bounds, bounds),
      new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, visible: false }),
    )
    this.rayPlane.rotation.x = -Math.PI / 2
    this.rayPlane.updateMatrixWorld(true)

    this.trailData = new Float32Array(MAX_TRAIL * 4)
    this.trailTexture = new THREE.DataTexture(
      this.trailData,
      MAX_TRAIL,
      1,
      THREE.RGBAFormat,
      THREE.FloatType,
    )
    this.trailTexture.needsUpdate = true

    // Assigned by reference into the compiled shader's uniforms in
    // Stage.js, so mutations here are picked up automatically each frame.
    this._uniforms = {
      uTrailTexture: { value: this.trailTexture },
      uTrailCount: { value: 0 },
      uFadeTime: { value: this.params.fadeTime },
    }

    this.rect = this.canvas.getBoundingClientRect()
    this._onResize = () => {
      this.rect = this.canvas.getBoundingClientRect()
    }
    this.sizes.onResize(this._onResize)

    this._bindPointerEvents()
  }

  get uniforms() {
    return this._uniforms
  }

  update(delta) {
    const expiry = this.params.fadeTime * 4

    for (let i = this.trail.length - 1; i >= 0; i--) {
      this.trail[i].age += delta
      if (this.trail[i].age > expiry) this.trail.splice(i, 1)
    }

    this.timeSinceLastMove += delta

    if (this.timeSinceLastMove >= 3.0 && !this.isPlacingRandomPoints) {
      this.isPlacingRandomPoints = true
      this.randomPointTimer = 0
    }

    if (this.isPlacingRandomPoints) {
      this.randomPointTimer += delta
      if (this.randomPointTimer >= 1.5) {
        this._addRandomPoint()
        this.randomPointTimer = 0
      }
    }

    const count = Math.min(this.trail.length, MAX_TRAIL)

    if (count > 0 || this._uniforms.uTrailCount.value > 0) {
      for (let i = 0; i < count; i++) {
        const ti = i * 4
        this.trailData[ti] = this.trail[i].x
        this.trailData[ti + 1] = this.trail[i].z
        this.trailData[ti + 2] = this.trail[i].age
        this.trailData[ti + 3] = this.trail[i].distDelta
      }
      this.trailTexture.needsUpdate = true
      this._uniforms.uTrailCount.value = count
    }
  }

  destroy() {
    this.canvas.removeEventListener('pointermove', this._onPointerMove)
    this.trailTexture.dispose()
    this.rayPlane.geometry.dispose()
    this.rayPlane.material.dispose()
  }

  _bindPointerEvents() {
    this._onPointerMove = (e) => {
      this.mouseCoords.set(
        ((e.clientX - this.rect.left) / this.rect.width) * 2 - 1,
        -((e.clientY - this.rect.top) / this.rect.height) * 2 + 1,
      )

      this.raycaster.setFromCamera(this.mouseCoords, this.camera.instance)
      const hits = this.raycaster.intersectObject(this.rayPlane)
      if (hits.length === 0) return

      const { x, z } = hits[0].point

      let distDelta = 0
      if (this.lastPoint) {
        const dx = x - this.lastPoint.x
        const dz = z - this.lastPoint.z
        distDelta = Math.sqrt(dx * dx + dz * dz)
        if (distDelta < this.params.trailSpacing) return
      }

      if (this.trail.length >= MAX_TRAIL) this.trail.shift()

      this.trail.push({ x, z, age: 0, distDelta })
      this.lastPoint = { x, z }

      this.timeSinceLastMove = 0
      this.isPlacingRandomPoints = false
      this.randomPointTimer = 0
    }

    this.canvas.addEventListener('pointermove', this._onPointerMove)
  }

  _addRandomPoint() {
    const x = (Math.random() * 0.5 - 0.25) * this.bounds
    const z = (Math.random() * 0.5 - 0.25) * this.bounds
    const distDelta = this.randomPointStrength + Math.random() * 0.2

    if (this.trail.length >= MAX_TRAIL) this.trail.shift()

    this.trail.push({ x, z, age: 0, distDelta })
  }
}
