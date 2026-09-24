import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { VignetteRGBShiftShader } from './effects/VignetteRGBShiftShader.js'

export default class Renderer {
  constructor(canvas, sizes, scene, camera) {
    this.sizes = sizes
    this.scene = scene
    this.camera = camera

    this.instance = new THREE.WebGLRenderer({ canvas, antialias: true })
    this.instance.toneMapping = THREE.ACESFilmicToneMapping
    this.instance.toneMappingExposure = 1.95
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type = THREE.PCFShadowMap
    this.instance.setClearColor('#808080')
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)

    this.composer = new EffectComposer(this.instance)
    this.composer.addPass(new RenderPass(this.scene, this.camera.instance))

    this.vignetteRGBShiftPass = new ShaderPass(VignetteRGBShiftShader)
    this.composer.addPass(this.vignetteRGBShiftPass)
    this.composer.addPass(new OutputPass())

    this._onResize = () => this.resize()
    this.sizes.onResize(this._onResize)
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
    this.composer.setSize(this.sizes.width, this.sizes.height)
    this.composer.setPixelRatio(this.sizes.pixelRatio)
  }

  update() {
    this.composer.render()
  }

  destroy() {
    this.composer.dispose()
    this.instance.dispose()
  }
}
