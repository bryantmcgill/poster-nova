import EventEmitter from 'events'
export default class FrameSet extends EventEmitter {
  constructor ({ info }) {
    super()
    this.id = '_block_' + (Math.random() * 100000).toFixed(0)

    this.info = info

    this.start = info.start
    this.afterStart = info.afterStart

    this.beforeEnd = info.beforeEnd
    this.end = info.end

    this.trackID = info.trackID

    this.enabled = true
  }
  starting ({ progress, delta }) {
    this.emit('starting', { frameset: this, progress, delta })
  }
  during ({ progress, delta }) {
    this.emit('during', { frameset: this, progress, delta })
  }
  leaving ({ progress, delta }) {
    this.emit('leaving', { frameset: this, progress, delta })
  }
  overall ({ progress, delta }) {
    this.emit('overall', { frameset: this, progress, delta })
  }
}
