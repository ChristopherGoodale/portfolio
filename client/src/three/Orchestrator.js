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

    // Timer over the deprecated Clock: also guards against a huge delta
    // spike when the tab is backgrounded and resumed (Page Visibility
    // API), which matters here since navigating away from Home and back
    // is now a normal part of routing, not just a one-off tab switch.
    this.clock = new THREE.Timer()
    this.clock.connect(document)

    this._unwatchColorScheme = watchColorScheme((colors) => this.stage.setColors(colors))

    this._animate = () => {
      this.clock.update()
      const delta = this.clock.getDelta()
      this.camera.update()
      this.stage.update(delta)
      this.renderer.update()
    }
    this.renderer.instance.setAnimationLoop(this._animate)
  }

  destroy() {
    this.renderer.instance.setAnimationLoop(null)
    this.clock.disconnect()
    this.clock.dispose()
    this._unwatchColorScheme()
    this.stage.destroy()
    this.camera.destroy()
    this.sizes.destroy()
    this.renderer.destroy()
  }
}
