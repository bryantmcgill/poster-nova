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

    // selection pipeline
    let iterable = this.renderer.renderables
      .map((renderable) => {
        return renderable.frameset
      })
      .filter((fs) => {
        return fs.enabled
      })

    // ---------------------------------
    // periods
    iterable
      //  starting
      .reduce((carry, fs) => {
        if (time >= fs.start && time <= fs.afterStart) {
          let progress = (time - fs.start) / (fs.afterStart - fs.start)
          fs.starting({ delta, progress, time })
        }
        return carry
      }, iterable)

      // periods
      // during
      .reduce((carry, fs) => {
        if (time >= fs.afterStart && time <= fs.beforeEnd) {
          let progress = (time - fs.afterStart) / (fs.beforeEnd - fs.afterStart)
          fs.during({ delta, progress, time })
        }
        return carry
      }, iterable)

      // periods
      //  leaving
      .reduce((carry, fs) => {
        if (time >= fs.beforeEnd && time <= fs.end) {
          let progress = 1.0 - (fs.end - time) / (fs.end - fs.beforeEnd)
          fs.leaving({ delta, progress, time })
        }
        return carry
      }, iterable)

      // ---------------------------------

      // overriders
      // before start
      .reduce((carry, fs) => {
        if (time < fs.start) {
          let progress = 0
          fs.starting({ delta, progress, time })
        }
        return carry
      }, iterable)
      // after end
      .reduce((carry, fs) => {
        if (time > fs.end) {
          let progress = 1
          fs.leaving({ delta, progress, time })
        }
        return carry
      }, iterable)

      // overall value
      // overall
      .reduce((carry, fs) => {
        if (time >= fs.start && time <= fs.end) {
          let progress = (time - fs.start) / (fs.end - fs.start)
          fs.overall({ progress, delta, time })
        }
        return carry
      }, iterable)

    this.lastTime = time
  }
}
