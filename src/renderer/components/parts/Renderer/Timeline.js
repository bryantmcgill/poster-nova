export default class Timeline {
  constructor ({ renderer, specs }) {
    this.renderer = renderer
    this.renderer.timeline = this
    this.specs = specs
    this.lastTime = 0
  }
  sort () {
    this.renderer.renderables.sort((a, b) => {
      return a.info.start - b.info.start
    })
    this.specs.items.sort((a, b) => {
      return a.start - b.start
    })
    this.specs.save()
  }
  updateTime ({ time }) {
    let delta = time - this.lastTime

    this.renderer.renderables
      .map((renderable) => {
        return renderable.frameset
      })
      .filter((fs) => {
        return fs.enabled
      })

      .map((fs) => {
        if (time < fs.start) {
          let progress = 0
          fs.starting({ delta, progress })
          fs.during({ delta, progress })
          fs.leaving({ delta, progress })
          fs.overall({ delta, progress })
        }
        return fs
      })

      .map((fs) => {
        if (time >= fs.start && time <= fs.end) {
          let progress = (time - fs.start) / (fs.end - fs.start)
          fs.overall({ progress, delta })
        }
        return fs
      })

      .map((fs) => {
        if (time >= fs.start && time <= fs.afterStart) {
          let progress = (time - fs.start) / (fs.afterStart - fs.start)
          fs.starting({ delta, progress })
          fs.during({ delta, progress: 0 })
        }
        return fs
      })

      .map((fs) => {
        if (time >= fs.afterStart && time <= fs.beforeEnd) {
          let progress = (time - fs.afterStart) / (fs.beforeEnd - fs.afterStart)
          fs.starting({ delta, progress: 1 })
          fs.during({ delta, progress })
          fs.leaving({ delta, progress: 0 })
        }
        return fs
      })

      .map((fs) => {
        if (time >= fs.beforeEnd && time <= fs.end) {
          let progress = 1.0 - (fs.end - time) / (fs.end - fs.beforeEnd)
          fs.during({ delta, progress: 1 })
          fs.leaving({ delta, progress })
        }
        return fs
      })

      .map((fs) => {
        if (time > fs.end) {
          let progress = 1
          fs.starting({ delta, progress })
          fs.during({ delta, progress })
          fs.leaving({ delta, progress })
          fs.overall({ delta, progress })
        }
        return fs
      })

    this.lastTime = time
  }
}
