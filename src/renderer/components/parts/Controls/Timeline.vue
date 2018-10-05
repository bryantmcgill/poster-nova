<template>
<div v-if="specs">
  <div>
    <h1>Rainbow Timeline</h1>
     Magnify Scale<input type="number" v-model="scaler" min="1" step="0.1">
     Total Time (s)<input type="number" :value="totalTime" @input="(e) => { let v = e.target.value; $emit('totalTime', v) }" min="1" step="1">
     Sort <button @click="() => { timeline.sort(); }">Sort</button>
  </div>
  <div class="track-rows" ref="tracker" @mousemove="onHover">
    <div ref="time-track" class="time-track">
      <div class="time-interval" :key="iT + 't1'" v-for="(t, iT) in intervalMarkers" :style="{ left: t.px1 + 'px' }"></div>
      <div class="time-interval-2" :key="iT + 't2'" v-for="(t, iT) in intervalMarkers" :style="{ left: t.px2 + 'px' }"></div>
    </div>
    <div class="track-scroll" @scroll="onScroll">
      <Tracker :style="getWidthTrack()" class="tracker-block" @click="$emit('onSelect', { renderable: rt })" :key="irt" v-for="(rt, irt) in renderer.renderables" :ref="'line'" :totalTime="totalTime">

        <div class="track-title" :style="{ transform: `translate3d(${30  + lefter}px,0,1px)` }">{{ rt.info.text }}</div>

        <FrameSet :specs="specs" :e="irt / renderer.renderables.length"  v-if="rt && timeline" :renderable="rt" :totalTime="totalTime" :maxWidth="maxWidth"></FrameSet>

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
      lefter: 0,
      scaler: 1,
      intervalMarkers: [],
      markerPX: 0,
      maxWidth: 1
    }
  },
  watch: {
    time () {
      if (this.$refs['marker']) {
        this.$refs['marker'].style.left = this.maxWidth * (this.time / this.totalTime) + 'px'
      }
    },
    markerPX () {
      this.$emit('onHover', {
        percentage: this.markerPX / this.maxWidth,
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
  },
  methods: {
    refresh () {
      this.prepTrackerInfo()
      this.makeIntervalMarkers()
    },
    getScaler () {
      return this.scaler
    },
    getFullWidth () {
      return this.totalTime * 20 * this.scaler * 2
      // return this.$refs['time-track'].getBoundingClientRect().width
    },
    getWidthTrack () {
      let w = this.getFullWidth() * this.getScaler()
      return {
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
    makeIntervalMarkers () {
      this.intervalMarkers = []
      let n = this.maxWidth
      for (var i = 0; i < n; i++) {
        // let e = i / rect.width
        this.intervalMarkers.push({
          px1: i * 50 * this.getScaler(),
          px2: i * 10 * this.getScaler()
        })
      }
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
      let left = this.$refs['tracker'].scrollLeft || 0
      this.markerPX = (left + evt.clientX)
      this.$refs['marker'].style.left = this.markerPX + 'px'
    },
    onScroll (evt) {
      this.lefter = evt.target.scrollLeft
      this.$nextTick(() => {
        this.$refs['time-track'].scrollLeft = evt.target.scrollLeft
      })
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
  height: 100%;
  width: 1px;
  background-color: red;
  position: absolute;
  top: 0px;
  left: 10px;
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
