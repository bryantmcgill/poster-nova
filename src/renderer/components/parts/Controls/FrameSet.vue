<template>
<div class="full" :style="{ 'backgroundColor': `hsla(${(e * 360).toFixed(0)}, 70%, 70%, 1.0)` }" @mousedown="(e) => { onMD(e, selection) }"  @mousemove="(e) => { onMM(e, selection) }"  @mouseup="(e) => { onMU(e, selection) }" >
  <div class="frameset" :style="getFrameSetStyle({ renderable, maxWidth, totalTime })" >

    <div class="starting" :style="getStartingStyle({ renderable, maxWidth, totalTime })">
      <div class="diamond afterStart-diamond"  @mousedown="() => { selection = 'afterStart'; }" ></div>
    </div>
    <div class="ending" :style="getLeavingStyle({ renderable, maxWidth, totalTime })" >
      <div class="diamond beforeEnd-diamond" @mousedown="() => { selection = 'beforeEnd'; }"  ></div>
    </div>

    <div class="during" :style="getDuringStyle({ renderable, maxWidth, totalTime, e })" @mousedown="() => { selection = 'all'; }"></div>
    <div class="diamond start-diamond" @mousedown="() => { selection = 'start'; }" ></div>
    <div class="diamond end-diamond"  @mousedown="() => { selection = 'end'; }" ></div>

  </div>
</div>
</template>

<script>
export default {
  props: {
    e: {},
    specs: {},
    totalTime: {},
    renderable: {},
    maxWidth: {}
  },
  data () {
    return {
      selection: '',
      fs: {
        isDown: false,
        accu: 0,
        ts: 0
      }
    }
  },

  methods: {
    onMD (evt) {
      this.fs.isDown = true
      this.fs.ts = evt.pageX
    },
    onMM (evt, sel) {
      if (this.fs.isDown) {
        let px = evt.pageX
        let delta = this.fs.ts - px
        let deltaTime = delta / this.maxWidth * this.totalTime

        if (sel === 'all') {
          this.renderable.frameset.start -= deltaTime
          this.renderable.frameset.afterStart -= deltaTime
          this.renderable.frameset.beforeEnd -= deltaTime
          this.renderable.frameset.end -= deltaTime
        } else if (sel === 'start') {
          this.renderable.frameset.start -= deltaTime
          this.renderable.frameset.afterStart -= deltaTime
        } else if (sel === 'afterStart') {
          this.renderable.frameset.afterStart -= deltaTime
        } else if (sel === 'beforeEnd') {
          this.renderable.frameset.beforeEnd -= deltaTime
        } else if (sel === 'end') {
          this.renderable.frameset.end -= deltaTime
          this.renderable.frameset.beforeEnd -= deltaTime
        }

        this.fs.accu -= deltaTime
        this.fs.ts = px
      }
    },
    onMU (e, sel) {
      this.fs.isDown = false

      if (sel === 'all') {
        this.renderable.info.start += this.fs.accu
        this.renderable.info.afterStart += this.fs.accu
        this.renderable.info.beforeEnd += this.fs.accu
        this.renderable.info.end += this.fs.accu
      } else if (sel === 'start') {
        this.renderable.info.start += this.fs.accu
        this.renderable.info.afterStart += this.fs.accu
      } else if (sel === 'afterStart') {
        this.renderable.info.afterStart += this.fs.accu
      } else if (sel === 'beforeEnd') {
        this.renderable.info.beforeEnd += this.fs.accu
      } else if (sel === 'end') {
        this.renderable.info.end += this.fs.accu
        this.renderable.info.beforeEnd += this.fs.accu
      }

      this.fs.accu = 0
      this.specs.save()
    },
    getDuringStyle ({ renderable, maxWidth, totalTime, e }) {
      let fs = renderable.frameset
      let left = (fs.afterStart - fs.start) / (fs.end - fs.start) * 100
      let width = (fs.beforeEnd - fs.afterStart) / (fs.end - fs.start) * 100

      let style = {
        'left': left + '%',
        'width': width + '%'
      }
      return style
    },
    getStartingStyle ({ renderable, maxWidth, totalTime }) {
      let fs = renderable.frameset
      // let tt = totalTime
      // let itemWidth = (((fs.end - fs.start) / tt) * maxWidth)
      let left = (0)
      let width = (fs.afterStart - fs.start) / (fs.end - fs.start) * 100

      let style = {
        // 'color': 'red',
        'left': left + '%',
        'width': width + '%'
      }
      return style
    },
    getLeavingStyle ({ renderable, maxWidth, totalTime }) {
      let fs = renderable.frameset
      // let tt = totalTime
      // let itemWidth = (((fs.end - fs.start) / tt) * maxWidth)
      let right = 0
      let width = (fs.end - fs.beforeEnd) / (fs.end - fs.start) * 100

      let style = {
        // 'color': 'red',
        'right': right + '%',
        'width': width + '%'
      }
      return style
    },
    getFrameSetStyle ({ renderable, maxWidth, totalTime }) {
      let fs = renderable.frameset
      let tt = totalTime
      let style = {
        // 'color': 'red',
        'left': ((fs.start / tt) * maxWidth) + 'px',
        'width': (((fs.end - fs.start) / tt) * maxWidth) + 'px'
      }
      return style
    }
  }
}
</script>

<style scoped>
.frameset {
  cursor: pointer;
  position: absolute;
  top: 0px;
  height: 100%;
  background-color: rgba(117, 117, 117, 0.2);
}
.starting {
  position: absolute;
  top: 0px;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
}
.ending {
  position: absolute;
  top: 0px;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
}
.during {
  position: absolute;
  top: 0px;
  height: 100%;
  background: rgba(165, 165, 165, 0.5);
}
.overall{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}
.label{
  margin-left: 50px;
  width: 60px;
  overflow: hidden;
}

.diamond{
  z-index: 100;
  position: absolute;
  height: 15px;
  top: calc(50% - (15px / 2));
  width: 15px;
  background-color: rgba(255,255,255,0.5);
  border: grey solid 1px;
}

.center-diamond{
  left: 50%;
  transform:  scale(0.5) translateX(calc(15px / -2)) rotate(45deg) translateZ(10px);
}

.start-diamond{
  transform:  translateX(calc(15px / -2)) rotate(45deg) translateZ(10px);
}
.end-diamond{
  transform:  translateX(calc(15px / 2)) rotate(45deg) translateZ(10px);
  right: 0px;
}
.afterStart-diamond{
  transform: translateX(calc(15px / 2)) rotate(45deg) translateZ(10px) scale(0.75);
  right: 0px;
}
.beforeEnd-diamond{
  transform: translateX(calc(15px / -2)) rotate(45deg) translateZ(10px) scale(0.75);
  left: 0px;
}
</style>
