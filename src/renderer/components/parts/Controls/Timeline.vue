<template>
<div v-if="specs">
  <div>
    <h1>Rainbow Timeline</h1>
     Magnify Scale<input type="number" v-model="scaler" min="1" max="3" step="0.1">
     Total Time (s)<input type="number" :value="totalTime" @input="(e) => { let v = e.target.value; $emit('totalTime', v) }" min="1" step="1">
     Sort <button @click="() => { timeline.sort(); }">Sort</button>
     Time: <span>{{ (time).toFixed(1) }}</span>
  </div>
  <div class="track-rows" ref="tracker" @mousemove="onHover">
    <div class="track-scroll" @scroll="onScroll">
      <Tracker :style="getWidthTrack({ irt })" class="tracker-block" :key="irt" v-for="(rt, irt) in renderer.renderables" :ref="'line'" :totalTime="totalTime">
        <div @click="$emit('onSelect', { renderable: rt })" class="track-title" :style="{ cursor: 'pointer', paddingLeft: '20px', transform: `translate3d(${varying.lefter}px,0,1px)`, 'white-space': 'pre' }">{{ rt.info.text.split('\n').shift().slice(0, 30) }}...</div>
        <FrameSet @onSelect="$emit('onSelect', { renderable: rt })" :specs="specs" :e="irt / renderer.renderables.length"  v-if="rt && timeline" :renderable="rt" :totalTime="totalTime" :maxWidth="maxWidth"></FrameSet>
      </Tracker>
    </div>
    <div ref="marker" class="time-cursor"></div>
  </div>
</div>
</template>

<script>
import Tracker from './Track.vue'
import FrameSet from './FrameSet'
export default {
  components: {
    Tracker,
    FrameSet
  },
  props: {
    time: {},
    totalTime: {},
    renderer: {},
    timeline: {},
    specs: {}
  },
  data () {
    return {
      realtime: {
        lefter: 0
      },
      varying: {
        lefter: 0
      },
      scaler: 1,
      markerPX: 0,
      maxWidth: 1
    }
  },
  watch: {
    time () {
      /*
      this.time / this.totalTime = (this.markerPX + this.realtime.lefter) / this.maxWidth
      (this.time / this.totalTime) * this.maxWidth = (this.markerPX + this.realtime.lefter)
      this.markerPX = (this.time / this.totalTime) * this.maxWidth - this.realtime.lefter
      */
      let markerPX = ((this.time / this.totalTime) * this.maxWidth) - this.realtime.lefter
      this.$refs.marker.style.left = markerPX + 'px'

      // let visibleTotalTime = this.realtime.lefter
      // let percentage = this.time / this.totalTime
    },
    markerPX () {
      this.$emit('onHover', {
        percentage: (this.markerPX + this.realtime.lefter) / this.maxWidth,
        at: this.markerPX,
        full: this.maxWidth
      })
    },
    totalTime () {
      this.refresh()
    },
    scaler () {
      this.refresh()
    }
  },
  mounted () {
    this.refresh()
    let rAF = () => {
      this.rAFID = window.requestAnimationFrame(rAF)
      this.varying.lefter += (this.realtime.lefter - this.varying.lefter) * 0.1
    }
    this.rAFID = window.requestAnimationFrame(rAF)
  },
  beforeDestroy () {
    window.cancelAnimationFrame(this.rAFID)
  },
  methods: {
    refresh () {
      this.prepTrackerInfo()
    },
    getScaler () {
      return this.scaler
    },
    getFullWidth () {
      return this.totalTime * 15 * this.scaler * 2
      // return this.$refs['time-track'].getBoundingClientRect().width
    },
    getWidthTrack ({ irt }) {
      let w = this.getFullWidth() * this.getScaler()
      let e = irt / this.renderer.renderables.length
      return {
        'backgroundColor': `hsla(${(e * 360).toFixed(0)}, 70%, 70%, 1.0)`,
        width: w + 'px'
      }
    },
    prepTrackerInfo () {
      this.maxWidth = this.getFullWidth() * this.getScaler()
      // window.addEventListener('resize', () => {
      //   let line = this.$refs['time-track']
      //   if (line) {
      //     this.maxWidth = line.getBoundingClientRect().width * this.getScaler()
      //   }
      // }, false)
    },
    onAdd (evt) {
      this.$emit('onAdd', evt)
      console.log(evt)
    },
    onSelect (evt) {
      this.$emit('onSelect', evt)
      console.log(evt)
    },
    onHover (evt) {
      // let left = this.$refs['tracker'].scrollLeft || 0
      this.markerPX = (evt.clientX)
      this.$refs['marker'].style.left = this.markerPX + 'px'
    },
    onScroll (evt) {
      this.realtime.lefter = evt.target.scrollLeft
      console.log(this.realtime.lefter)
      // this.$nextTick(() => {
      //   this.$refs['time-track'].scrollLeft = evt.target.scrollLeft
      // })
    }
  }
}
</script>

<style scoped>
.track-rows{
  position: relative;
  border-top: black solid 1px;

  border-right: black solid 1px;
  border-left: black solid 1px;

  box-sizing: border-box;

  width: 100%;

}
.track-scroll{
  width: 100%;
  max-height: 250px;
  overflow: auto;
  padding-bottom: 15px;
}
.time-cursor{
  cursor: pointer;
  height: 100%;
  width: 1px;
  background-color: red;
  position: absolute;
  top: 0px;
  left: 10px;
  transform: translate3d(0,0,0.1px);
}

.time-track{
  position: relative;
  top: 0px;
  overflow: hidden;
  width: 100%;
  height: 45px;
  border-bottom: grey solid 1px;
  box-sizing: border-box;
}
.time-interval{
  display: inline-block;
  width: 1px;
  height: 44px;
  background-color: grey;
  line-height: 44px;
  position: absolute;
  top: 0px;
  left: 0px;
}
.time-interval-2{
  display: inline-block;
  width: 1px;
  height: 20px;
  background-color: grey;
  line-height: 44px;
  position: absolute;
  bottom: 0px;
  left: 0px;
}

.track-title{
  position: absolute;
  top: 0px;
  left: 0px;
}
</style>
