import * as THREE from 'three'
import Sizes from './Sizes.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import Stage from './Stage.js'
import { readThemeColors, watchColorScheme } from './utils/colors.js'

// Owns the full Three.js scene lifecycle for the wave-grid background.
// Deliberately instance-scoped (no module-level singleton, unlike the
// reference project) so React can construct/destroy it cleanly across
// StrictMode's dev-mode double-mount without resurrecting stale state.
export default class Orchestrator {
  constructor(canvas) {
    this.canvas = canvas
    this.sizes = new Sizes()
    this.scene = new THREE.Scene()
    this.camera = new Camera(this.sizes)
    this.stage = new Stage(this.scene, canvas, this.camera, this.sizes, readThemeColors())
    this.renderer = new Renderer(canvas, this.sizes, this.scene, this.camera)

    this.clock = new THREE.Clock()

    this._unwatchColorScheme = watchColorScheme((colors) => this.stage.setColors(colors))

    this._animate = () => {
      const delta = this.clock.getDelta()
      this.camera.update()
      this.stage.update(delta)
      this.renderer.update()
    }
    this.renderer.instance.setAnimationLoop(this._animate)
  }

  destroy() {
    this.renderer.instance.setAnimationLoop(null)
    this._unwatchColorScheme()
    this.stage.destroy()
    this.camera.destroy()
    this.sizes.destroy()
    this.renderer.destroy()
  }
}
