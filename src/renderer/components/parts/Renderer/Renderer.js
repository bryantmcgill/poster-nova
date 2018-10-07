import * as THREE from 'three'
import EventEmitter from 'events'
var ClassList = {
  SimpleText: require('./SimpleText.js').default
}

export default class Renderer extends EventEmitter {
  constructor ({ mode }) {
    super()
    this.mode = mode

    this.rect = {
      width: 1080,
      height: 1080,
      innerWidth: 470, // physical pixel of fb
      innerHeight: 470
    }

    this.renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
      antialias: true
    })

    this.gl = this.renderer.getContext()

    this.renderTarget = new THREE.WebGLRenderTarget(1080, 1080, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat
    })

    this.renderer.setSize(this.rect.innerWidth, this.rect.innerHeight)
    this.renderer.setPixelRatio(this.rect.width / this.rect.innerWidth)

    this.canvas = this.renderer.domElement
    this.renderer.domElement.style['max-width'] = '100%'
    this.renderer.domElement.style['max-height'] = '100vmin'

    this.renderables = []

    this.setupScene()

    this.currentTime = 0
    this.clock = new THREE.Clock()
  }

  add ({ info }) {
    let renderable = this.makeRenderable({ info, parent: this })
    this.renderables.push(renderable)
    this.scene.add(renderable.group)
  }
  remove ({ info }) {
    let index = this.renderables.findIndex((rr) => { return rr.info.id === info.id })
    let item = this.renderables[index]
    item.onClean()
    this.scene.remove(item.group)
    this.renderables.splice(index, 1)
  }
  refresh ({ info }) {
    let index = this.renderables.findIndex((rr) => { return rr.info.id === info.id })
    let item = this.renderables[index]
    item.refresh({ info })
  }

  prep () {
    let res = this.renderables.map((i) => {
      if (i.prep) {
        return i.prep().catch(() => {
          return Promise.resolve()
        })
      } else {
        return Promise.resolve()
      }
    })
    return Promise.all(res)
  }
  makeRenderable ({ info }) {
    let renderable = new ClassList[info.ClassName]({ info })
    return renderable
  }
  setupScene () {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('#eaeaea')
    this.camera = new THREE.PerspectiveCamera(75, this.rect.innerWidth / this.rect.innerHeight, 0.1, 1000)
    this.camera.position.z = 75
  }
  downloadPoster () {
    let url = this.renderer.domElement.toDataURL('png', 1.0)
    var link = document.createElement('a')
    link.download = 'poster.png'
    link.href = url
    link.click()
  }
  run () {
    var animate = () => {
      this.rAFID = requestAnimationFrame(animate)
      this.exec()
    }
    this.rAFID = requestAnimationFrame(animate)
  }
  stop () {
    cancelAnimationFrame(this.rAFID)
  }

  runShared () {
    this.updateTick()
    this.renderer.render(this.scene, this.camera)
  }

  updateTick () {
    var delta = 0
    if (this.mode === Renderer.PREVIEW_MODE) {
      delta = this.clock.getDelta()
    } else {
      delta = 1 / 60
    }
    this.currentTime += delta
    this.renderables.map((i) => {
      i.tick({
        delta,
        currentTime: this.currentTime
      })
    })
    return {
      delta,
      currentTime: this.currentTime
    }
  }

  runPreview () {
    this.runShared()
  }

  runRender () {
    this.scene.rotation.z = Math.PI
    this.scene.rotation.y = Math.PI
    this.renderer.render(this.scene, this.camera, this.rttTexture, true)

    // const png = new PNG({
    //   width: WIDTH,
    //   height: HEIGHT
    // });

    let gl = this.gl
    var pixels = new Uint8Array(4 * this.rect.width * this.rect.height)
    gl.readPixels(0, 0, this.rect.width, this.rect.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

    return {
      pixels
    }
  }

  exec () {
    if (this.mode === Renderer.PREVIEW_MODE) {
      return this.runPreview()
    } else if (this.mode === Renderer.RENDER_MODE) {
      return this.runRender()
    }
  }
}

Renderer.PREVIEW_MODE = 'preview'
Renderer.RENDER_MODE = 'render'
