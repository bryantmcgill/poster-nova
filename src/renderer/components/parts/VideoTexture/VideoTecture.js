import * as THREE from 'three'
import EventEmitter from 'events'

export default class VideoTexture extends EventEmitter {
  constructor () {
    super()

    this.video = document.createElement('video')
    this._seeked = true
    this.video.addEventListener('seeked', () => {
      this.seeked = true
    })
    this.vt = new THREE.VideoTexture(this.video)
    this.vt.minFilter = THREE.LinearFilter
    this.vt.magFilter = THREE.LinearFilter
    this.vt.format = THREE.RGBFormat
  }
  get seeked () {
    return this._seeked
  }
  set seeked (v) {
    this._seeked = v
  }
  attach ({ target }) {
    target.appendChild(this.video)
  }
  detach ({ target }) {
    target.removeChild(this.video)
  }
  wait () {
    if (this.seeked) {
      return Promise.resolve()
    } else {
      var tried = 0
      return new Promise((resolve, reject) => {
        let loop = () => {
          tried++
          if (tried > 1000) {
            let error = new Error('frame seeking timeout')
            console.log(error)
            reject(error)
            return
          }
          if (this.seeked) {
            resolve({ texture: this.vt })
          } else {
            setTimeout(loop, 100)
          }
        }
        loop()
      }).catch(() => {
        return Promise.resolve({ texture: this.vt })
      })
    }
  }
  async getFrame ({ delta }) {
    this.seeked = false

    let result = await this.wait()
    this.video.currentTime += delta

    return result
  }
}
