import TextTexture from '../TextTexture/TextTexture.js'
import Renderable from './Renderable.js'
var THREE = require('three')

export default class SimpleText extends Renderable {
  constructor ({ info }) {
    super(arguments[0])
    this.setupShaders()
    this.setupMaterial()
    this.setupMesh()
    this.tt = new TextTexture()
    this.info = info
    this.promise = this.setup({ info })
  }
  renderText ({ info }) {
    return this.tt.render({ text: info.text, container: info.container, box: info.box })
  }
  wait () {
    return new Promise((resolve, reject) => {
      var loop = () => {
        let hasIt = this.mesh !== null
        if (hasIt) {
          resolve()
        } else {
          setTimeout(() => {
            loop()
          }, 33.3333)
        }
      }
      loop()
    })
  }
  onStarting ({ progress, delta }) {
    // this.group.rotation.x = progress * Math.PI * 2
    this.uniforms.opacity.value = progress
    this.mesh.rotation.x = progress * Math.PI * 2
  }
  onDuring ({ progress, delta }) {
    this.mesh.rotation.y = progress * Math.PI * 2
  // this.group.rotation.y = progress * Math.PI * 2
  }
  onLeaving ({ progress, delta }) {
    // this.group.rotation.z = progress * Math.PI * 2
    this.mesh.rotation.y = (1.0 - progress) * Math.PI * 2
    this.uniforms.opacity.value = 1.0 - progress
  }
  onOverall ({ progress, delta }) {
    // this.mesh.scale.x = progress || 0.0000000001
    // this.mesh.scale.y = progress || 0.0000000001
    // this.mesh.scale.z = progress || 0.0000000001
  }
  prep () {
    return this.wait()
  }
  tick ({ totalTIme }) {
    this.uniforms.time.value = totalTIme
  }
  update ({ info }) {
    // latest info
    this.setup({ info })
  }
  setup ({ info }) {
    return this.renderText({ info: this.info })
      .then(({ texture, canvas }) => {
        this.canvas = canvas
        this.uniforms.text.value = texture
        texture.needsUpdate = true

        this.group.position.x = info.position.x
        this.group.position.y = info.position.y
        this.group.position.z = info.position.z

        this.group.rotation.x = info.rotation.x
        this.group.rotation.y = info.rotation.y
        this.group.rotation.z = info.rotation.z

        this.group.scale.x = info.scale.x
        this.group.scale.y = info.scale.y
        this.group.scale.z = info.scale.z
      })
  }
  setupMesh () {
    this.geometry = new THREE.PlaneBufferGeometry(100, 100, 64, 64)
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.group.add(this.mesh)
  }
  setupMaterial () {
    this.uniforms = {
      opacity: { value: 1 },
      time: { value: 0 },
      text: { value: null }
    }
    this.material = new THREE.ShaderMaterial({
      depthTest: false,
      side: THREE.DoubleSide,
      uniforms: this.uniforms,
      vertexShader: this.vs,
      fragmentShader: this.fs,
      transparent: true
    })
  }
  setupShaders () {
    this.vs = `
    // varying vec3 vPos;
    uniform float time;
    varying vec2 vUv;

    void main (void) {
      vec3 nPos = position;

      // nPos.z += sin(time * 4.0 + 0.05 * nPos.x) * 3.0;
      // nPos.z += sin(time * 4.0 + 0.05 * nPos.y) * 3.0;

      vUv = uv;

      vec4 mvPosition = modelViewMatrix * vec4(nPos, 1.0);
      vec4 outputPos = projectionMatrix * mvPosition;
      gl_Position = outputPos;
      gl_PointSize = 1.0;
    }
    `

    this.fs = `
    // varying vec3 vPos;
    varying vec2 vUv;

    uniform float time;
    uniform sampler2D text;
    uniform float opacity;
    // uniform sampler2D pattern;

    // void patternText (vec4 textColor) {
    //   vec2 swifting = vUv;
    //   swifting.x = swifting.x + time * 0.3;
    //   swifting.x = fract(swifting.x);
    //   swifting.y = swifting.y + time * 0.3;
    //   swifting.y = fract(swifting.y);
    //   vec4 pattern = texture2D(pattern, swifting);

    //   vec3 final = vec3((1.0 - textColor) * (pattern.xxxw));
    //   gl_FragColor = vec4(vec3(final), textColor.a);
    // }

    void simpleText (vec4 textColor) {
      gl_FragColor = vec4(textColor.rgb, textColor.a * opacity);
    }

    void emoji (vec4 textColor) {
      gl_FragColor = textColor;
    }

    void main () {
      vec2 uv = vUv;
      // uv.y = 1.0 - uv.y;

      vec4 textColor = texture2D(text, uv);

      simpleText(textColor);
      // if (textColor.a > 0.1 && textColor.r < 0.01) {
      //   simpleText(textColor);
      // } else if (textColor.a > 0.1) {
      //   emoji(textColor);
      // } else {
      //   discard;
      // }
    }
        `
  }
}
