// import * as THREE from 'three'
import EventEmitter from 'events'
import Renderer from './Renderer'
import Timeline from './Timeline'
import Encoder from '../FFmpeg/Encoder'

export default class VidoeRenderer extends EventEmitter {
  constructor ({ specs, music, output }) {
    super()
    this.specs = specs
    this.maxTime = specs.maxTime
    this.currentTime = 0
    this.renderer = new Renderer({ mode: Renderer.RENDER_MODE })

    this.specs.items.forEach((info) => {
      this.renderer.add({ info })
    })

    this.timeline = new Timeline({ renderer: this.renderer, specs: this.specs })
    this.encoder = new Encoder({ output, music })
    this.breakLoop = false

    this.handlers = {
      onProgress: this.onProgress.bind(this),
      onAbort: this.onAbort.bind(this),
      onStart: this.onStart.bind(this),
      onEnd: this.onEnd.bind(this)
    }
    this.on('progress', this.handlers.onProgress)
    this.on('abort', this.handlers.onAbort)
    this.on('start', this.handlers.onStart)
    this.on('end', this.handlers.onEnd)
  }
  onProgress ({ progress }) {
    console.log(progress)
  }
  clean () {
    console.log('cleaning')
    this.removeAllListeners()
  }
  onStart () {
    console.log('onStart')

    this.encoder.promise.then(({ output }) => {
      console.log('file is at:', output)
    })
    this.encoder.on('console', (evt) => {
      console.log('done', evt)
    })
    this.encoder.on('done', (evt) => {
      console.log('done', evt)
      // bus.emit('done', {
      //   ...evt,
      //   web: '/temp/' + filename
      // })
      // isMakingMovie = false
    })

    this.makeFrame()
  }
  onEnd () {
    console.log('onEnd')
    this.clean()
  }
  onAbort () {
    console.log('onAbort')
    this.breakLoop = true
  }
  makeFrame () {
    return this.renderer.prep().then(() => {
      let { currentTime } = this.renderer.updateTick()
      this.currentTime = currentTime
      this.timeline.updateTime({ time: this.currentTime })

      let { pixels } = this.renderer.runRender()
      let combined = Buffer.from(pixels)

      this.encoder.passThrough.write(combined, () => {
        this.emit('progress', { progress: currentTime / this.specs.maxTime })
        if (currentTime > this.specs.maxTime || this.breakLoop) {
          this.encoder.passThrough.end()
          this.emit('end')
        } else {
          process.nextTick(() => {
            this.makeFrame()
          })
        }
      })
    })
  }
}
