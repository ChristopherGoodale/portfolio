import * as THREE from 'three'
import MouseTrail from './MouseTrail.js'

// The instanced cube grid: geometry/material/lighting setup, plus the
// onBeforeCompile shader injection that turns MouseTrail's trail texture
// into per-vertex wave displacement and a height-based color gradient.
// Ported from the reference project's ThreeJS/Stage.js, adapted to take
// its dependencies (scene/canvas/camera/sizes/initial colors) directly
// instead of looking them up via a singleton Orchestrator, and to expose
// destroy()/setColors() for React-driven lifecycle and theme updates.
export default class Stage {
  constructor(scene, canvas, camera, sizes, colors) {
    this.scene = scene

    this.gridSize = 40
    this.cubeWidth = 0.8
    this.cubeHeight = 3
    this.params = {
      gap: 0.01,
      waveAmplitude: 0.4,
      waveSpeed: 6.0,
      waveFrequency: 1.2,
      waveWidth: 3.0,
      waveJitter: 0.2,
      waveMaxHeight: 0.4,
    }

    this.colors = colors
    this.scene.background = this.colors.colorBase.clone().multiplyScalar(0.5)

    this.lightingParams = {
      ambientColor: '#ffffff',
      ambientIntensity: 0.5,
      directionalColor: '#ffffff',
      directionalIntensity: 4.0,
      directional2Color: '#ffffff',
      directional2Intensity: 1.0,
    }

    // Physical world-unit footprint of the grid (centre-to-centre span).
    this.bounds = this.gridSize * (this.cubeWidth + this.params.gap)

    this.shaderRef = null

    this._setLighting()
    this._setGrid()
    this.mouseTrail = new MouseTrail(canvas, camera, sizes, this.bounds)
  }

  // Shared between the main shader and the depth shader so cast shadows
  // track the same wave deformation as the visible surface.
  _overrideVertexShader(vertexShader) {
    return vertexShader
      .replace(
        '#include <common>',
        `#include <common>
                varying float vHeight;
                attribute vec2 aOffset;
                uniform sampler2D uTrailTexture;
                uniform int       uTrailCount;
                uniform float     uWaveSpeed;
                uniform float     uWaveFreq;
                uniform float     uWaveWidth;
                uniform float     uFadeTime;
                uniform float     uAmplitude;
                uniform float     uJitter;
                uniform float     uMaxHeight;

                vec2 hash2( vec2 p ) {
                    p = vec2(
                        dot( p, vec2( 127.1, 311.7 ) ),
                        dot( p, vec2( 269.5, 183.3 ) )
                    );
                    return fract( sin( p ) * 43758.5453123 ) - 0.5;
                }`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>

                vHeight = 0.0;

                if ( position.y > 0.0 ) {
                    vec2 jitter  = hash2( aOffset ) * uJitter;
                    vec2 worldXZ = aOffset + jitter;
                    float waveHeight  = 0.0;
                    float totalWeight = 0.0;

                    for ( int i = 0; i < uTrailCount; i++ ) {
                        vec4 td = texture2D(
                            uTrailTexture,
                            vec2( ( float(i) + 0.5 ) / 128.0, 0.5 )
                        );
                        float dist      = length( worldXZ - td.rg );
                        float wavefront = uWaveSpeed * td.b;
                        float relDist   = dist - wavefront;

                        float window = exp( -( relDist * relDist ) / ( uWaveWidth * uWaveWidth ) );
                        float fade   = exp( -td.b / uFadeTime );
                        float atten  = 1.0 / ( 1.0 + dist * 0.1 );
                        float weight = fade * window * atten * td.a;

                        waveHeight  += weight * cos( uWaveFreq * relDist );
                        totalWeight += weight;
                    }

                    waveHeight /= max( totalWeight, 1.0 );

                    float displacement = clamp( waveHeight * uAmplitude, -uMaxHeight, uMaxHeight );
                    transformed.y += displacement;
                    vHeight = displacement;
                }`,
      )
  }

  _setLighting() {
    const lp = this.lightingParams

    this.ambientLight = new THREE.AmbientLight(lp.ambientColor, lp.ambientIntensity)
    this.scene.add(this.ambientLight)

    this.directionalLight = new THREE.DirectionalLight(
      lp.directionalColor,
      lp.directionalIntensity,
    )
    this.directionalLight.position.set(-20, 10, 6)
    this.directionalLight.castShadow = true
    this.directionalLight.shadow.mapSize.set(1024, 1024)
    this.directionalLight.shadow.radius = 6
    this.directionalLight.shadow.camera.near = 0.1
    this.directionalLight.shadow.camera.far = 60
    this.directionalLight.shadow.camera.left = -22
    this.directionalLight.shadow.camera.right = 22
    this.directionalLight.shadow.camera.top = 22
    this.directionalLight.shadow.camera.bottom = -22
    this.directionalLight.shadow.bias = 0.0001
    this.scene.add(this.directionalLight)

    this.directionalLight2 = new THREE.DirectionalLight(
      lp.directional2Color,
      lp.directional2Intensity,
    )
    this.directionalLight2.position.set(10, 5, -3)
    this.directionalLight2.castShadow = false
    this.scene.add(this.directionalLight2)
  }

  _setGrid() {
    const count = this.gridSize * this.gridSize
    const geometry = new THREE.BoxGeometry(this.cubeWidth, this.cubeHeight, this.cubeWidth)

    this.offsetAttribute = new THREE.InstancedBufferAttribute(new Float32Array(count * 2), 2)
    geometry.setAttribute('aOffset', this.offsetAttribute)

    const material = new THREE.MeshPhongMaterial({ color: 0xffffff })

    material.onBeforeCompile = (shader) => {
      const mu = this.mouseTrail.uniforms
      shader.uniforms.uTrailTexture = mu.uTrailTexture
      shader.uniforms.uTrailCount = mu.uTrailCount
      shader.uniforms.uFadeTime = mu.uFadeTime
      shader.uniforms.uWaveSpeed = { value: this.params.waveSpeed }
      shader.uniforms.uWaveFreq = { value: this.params.waveFrequency }
      shader.uniforms.uWaveWidth = { value: this.params.waveWidth }
      shader.uniforms.uAmplitude = { value: this.params.waveAmplitude }
      shader.uniforms.uJitter = { value: this.params.waveJitter }
      shader.uniforms.uMaxHeight = { value: this.params.waveMaxHeight }
      shader.uniforms.uColorBase = { value: this.colors.colorBase }
      shader.uniforms.uColorHigh = { value: this.colors.colorHigh }

      shader.vertexShader = this._overrideVertexShader(shader.vertexShader)

      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
                    varying float vHeight;
                    uniform vec3  uColorBase;
                    uniform vec3  uColorHigh;
                    uniform float uMaxHeight;`,
        )
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
                    float t = clamp( vHeight / uMaxHeight, 0.0, 1.0 );
                    diffuseColor.rgb = mix( uColorBase, uColorHigh, t );`,
        )

      this.shaderRef = shader
    }

    const depthMaterial = new THREE.MeshDepthMaterial()

    depthMaterial.onBeforeCompile = (shader) => {
      const mu = this.mouseTrail.uniforms
      shader.uniforms.uTrailTexture = mu.uTrailTexture
      shader.uniforms.uTrailCount = mu.uTrailCount
      shader.uniforms.uFadeTime = mu.uFadeTime
      shader.uniforms.uWaveSpeed = { value: this.params.waveSpeed }
      shader.uniforms.uWaveFreq = { value: this.params.waveFrequency }
      shader.uniforms.uWaveWidth = { value: this.params.waveWidth }
      shader.uniforms.uAmplitude = { value: this.params.waveAmplitude }
      shader.uniforms.uJitter = { value: this.params.waveJitter }
      shader.uniforms.uMaxHeight = { value: this.params.waveMaxHeight }

      shader.vertexShader = this._overrideVertexShader(shader.vertexShader)
    }

    this.geometry = geometry
    this.material = material
    this.depthMaterial = depthMaterial

    this.instancedMesh = new THREE.InstancedMesh(geometry, material, count)
    this.instancedMesh.customDepthMaterial = depthMaterial
    this.instancedMesh.castShadow = true
    this.instancedMesh.receiveShadow = true
    this.scene.add(this.instancedMesh)
    this._updateGrid()
  }

  _updateGrid() {
    const dummy = new THREE.Object3D()
    const spacing = this.cubeWidth + this.params.gap
    const offset = ((this.gridSize - 1) * spacing) / 2

    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const index = i * this.gridSize + j
        const x = i * spacing - offset
        const z = j * spacing - offset
        dummy.position.set(x, 0, z)
        dummy.updateMatrix()
        this.instancedMesh.setMatrixAt(index, dummy.matrix)
        this.offsetAttribute.setXY(index, x, z)
      }
    }
    this.instancedMesh.instanceMatrix.needsUpdate = true
    this.offsetAttribute.needsUpdate = true
  }

  // Mutates the wave-color uniforms and scene background in place so a
  // light/dark scheme change is reflected live, with no material rebuild.
  setColors(colors) {
    this.colors = colors
    if (this.shaderRef) {
      this.shaderRef.uniforms.uColorBase.value.copy(colors.colorBase)
      this.shaderRef.uniforms.uColorHigh.value.copy(colors.colorHigh)
    }
    this.scene.background = colors.colorBase.clone().multiplyScalar(0.5)
  }

  update(delta) {
    this.mouseTrail.update(delta)
  }

  destroy() {
    this.mouseTrail.destroy()
    this.scene.remove(this.instancedMesh, this.ambientLight, this.directionalLight, this.directionalLight2)
    this.geometry.dispose()
    this.material.dispose()
    this.depthMaterial.dispose()
  }
}
