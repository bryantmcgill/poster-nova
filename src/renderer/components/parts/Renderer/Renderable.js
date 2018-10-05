import * as THREE from 'three'
import FrameSet from './FrameSet'

export default class Renderable {
  constructor ({ info, parent }) {
    this.parent = parent
    this.info = info
    this.group = new THREE.Object3D()
    console.log(info)

    var binded = {
      onStarting: this.onStarting.bind(this),
      onDuring: this.onDuring.bind(this),
      onLeaving: this.onLeaving.bind(this),
      onOverall: this.onOverall.bind(this)
    }

    this.frameset = new FrameSet({ info })
    this.frameset.on('starting', binded.onStarting)
    this.frameset.on('during', binded.onDuring)
    this.frameset.on('leaving', binded.onLeaving)
    this.frameset.on('overall', binded.onOverall)
    this.clean = () => {
      this.frameset.removeListener('starting', binded.onStarting)
      this.frameset.removeListener('during', binded.onDuring)
      this.frameset.removeListener('leaving', binded.onLeaving)
      this.frameset.removeListener('overall', binded.onOverall)
    }
  }
  onStarting ({ progress, delta }) {
    console.log('starting', { progress, delta })
  }
  onDuring ({ progress, delta }) {
    console.log('during', { progress, delta })
  }
  onLeaving ({ progress, delta }) {
    console.log('leaving', { progress, delta })
  }
  onOverall ({ progress, delta }) {
    console.log('overall', { progress, delta })
  }

  onClean () {
    this.clean()
  }
  tick () {
  }
}
