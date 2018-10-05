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
      innerWidth: 470, // physical pixel of fb
      innerHeight: 470
    }
    this.renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
      antialias: true
    })
    this.renderer.setSize(this.rect.innerWidth, this.rect.innerHeight)
    this.renderer.setPixelRatio(1080 / this.rect.innerWidth)

    this.canvas = this.renderer.domElement
    this.renderer.domElement.style['max-width'] = '100%'
    this.renderer.domElement.style['max-height'] = '100vmin'

    this.renderables = []

    this.setupScene()

    this.totalTime = 0
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
  update ({ info }) {
    let index = this.renderables.findIndex((rr) => { return rr.info.id === info.id })
    let item = this.renderables[index]
    item.update({ info })
  }
  prep () {
    let res = this.renderList.map((i) => {
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
    this.renderer.render(this.scene, this.camera)
    this.updateTick()
  }

  updateTick () {
    var delta = 0
    if (this.mode === Renderer.PREVIEW_MODE) {
      delta = this.clock.getDelta()
    } else {
      delta = 1 / 60
    }
    this.totalTime += delta
    this.renderables.map((i) => {
      i.tick({
        delta,
        totalTime: this.totalTime
      })
    })
  }

  runPreview () {
    this.runShared()
  }

  runRender () {

  }

  exec () {
    if (this.mode === Renderer.PREVIEW_MODE) {
      this.runPreview()
    } else if (this.mode === Renderer.RENDER_MODE) {
      this.runRender()
    }
  }
}

Renderer.PREVIEW_MODE = 'preview'
Renderer.RENDER_MODE = 'render'
