<template>
<div>

<div class="video-taller">
  <h1>Controls <button v-if="currentItemID" @click="currentItemID = false">Close</button></h1>
  <div :key="iSpec" v-for="(spec, iSpec) in specs.items" v-if="spec.id === currentItemID">
    position xyz <input type="number" step="1" v-model="spec.position.x" /><input type="number" step="1" v-model="spec.position.y" /><input type="number" step="1" v-model="spec.position.z" />
    <br />
    rotation xyz <input type="number" :step="3.14159265 * 2 / 360 / 3" v-model="spec.rotation.x" /><input type="number" :step="3.14159265 * 2 / 360 / 3" v-model="spec.rotation.y" /><input type="number" :step="3.14159265 * 2 / 360 / 3" v-model="spec.rotation.z" />
    <br />
    scale xyz <input type="number" :step="0.01" v-model="spec.scale.x" /><input type="number" :step="0.01" v-model="spec.scale.y" /><input type="number" :step="0.01" v-model="spec.scale.z" />

    <br />
    <div class="ace-row">
      <div class="ace-box">
        <ACE
          @save="() => {}"
          :path="'happy.html'"
          v-model="spec.text"
          @input="(v) => { spec.text = v }"
          theme="chrome"
          :width="'100%'"
          :height="'300px'"
        >
        </ACE>
      </div>
      <div class="ace-box">
        <ACE
          @save="() => {}"
          :path="'happy.css'"
          v-model="spec.container"
          @input="(v) => { spec.container = v }"
          theme="chrome"
          :width="'100%'"
          :height="'300px'"
        >
        </ACE>
      </div>
      <div class="ace-box">
        <ACE
          @save="() => {}"
          :path="'happy.css'"
          v-model="spec.box"
          @input="(v) => { spec.box = v }"
          theme="chrome"
          :width="'100%'"
          :height="'300px'"
        >
        </ACE>
      </div>
    </div>


    <!-- <textarea v-model="spec.text" cols="30" rows="20"></textarea>
    <textarea v-model="spec.container" cols="30" rows="20"></textarea>
    <textarea v-model="spec.box" cols="30" rows="20"></textarea> -->

  </div>


</div>

<button @click="onPlay">Play</button>
<button @click="onStop">Stop</button>

<button @click="selDir">Select Save Folder</button>
<button @click="selMusic">Select Music</button>
<button @click="renderVideo" :disabled="!saveDir || (progress > 0 && progress < 100)">
  Render Video
  <span v-if="progress > 0">{{ (progress * 100).toFixed(2) }}%</span>
  <span v-if="!saveDir">(require save folder)</span>
</button>
<br />
Save Directory: {{ saveDir }}
<br />
Music File (optional): {{ musicFile }}


<Timeline
  v-if="specs && timeline && renderer"
  :specs="specs"
  :timeline="timeline"
  :renderer="renderer"
  :totalTime="totalTime"
  :time="time"
  @onHover="onHover"
  @onSelect="onSelect"
  @totalTime="(tt) => { totalTime = tt }"
/>



  <h3>Add Items</h3>
  <button @click="addSimpleText">Simple Text</button>
  <div class="list">
    <h3>Items</h3>
    <div class="list-item" :key="iSpec" v-for="(spec, iSpec) in specs.items" v-if="specs">
      {{ spec.ClassName }}: {{ spec.text.slice(0, 15) }}...
      <button @click="editThis({ spec })">edit</button>
      <button @click="specs.trash({ spec })">trash</button>
      <button @click="specs.clone({ spec })">clone</button>
    </div>
  </div>

  <div class="list">
    <h3>Trash</h3>
    <div class="list-item" :key="iSpec" v-for="(spec, iSpec) in specs.trashBin">
      {{ spec.ClassName }}: {{ spec.text.slice(0, 15) }}...
      <button @click="specs.restore({ spec })">Restroe</button>
      <button @click="specs.remove({ spec })">remove</button>
    </div>
  </div>

</div>
</template>

<script>
import ACE from '../ACE/ACE.vue'
import Timeline from './Timeline.vue'
const { ipcRenderer } = require('electron')

export default {
  components: {
    ACE,
    Timeline
  },
  props: {
    progress: {},
    specs: {},
    renderer: {},
    timeline: {}
  },
  data () {
    var self = this
    return {
      playing: false,
      rafID: 0,
      time: 0,
      varTime: 0,
      get totalTime () {
        return self.specs.maxTime
      },
      set totalTime (v) {
        self.specs.maxTime = v
      },
      currentItemID: false,
      saveDir: false,
      musicFile: undefined
    }
  },
  mounted () {
    ipcRenderer.on('selected-save-directory', (event, path) => {
      console.log(path)
      this.saveDir = path
      // this.$emit('render-video', { output: path + `/poster-${new Date()}.mp4` })
    })
    ipcRenderer.on('selected-music-file', (event, path) => {
      console.log(path)
      this.musicFile = path
      // this.$emit('render-video', { output: path + `/poster-${new Date()}.mp4` })
    })

    this.onLoop()
    window.addEventListener('keydown', (evt) => {
      if (evt.keyCode === 32 && !this.currentItemID) {
        evt.preventDefault()
        if (this.playing) {
          this.onStop()
        } else {
          this.onPlay()
        }
        this.playing = !this.playing
      }
    })
  },
  beforeDestroy () {
    window.cancelAnimationFrame(this.rafID)
  },
  methods: {
    selDir () {
      ipcRenderer.send('open-save-folder-dialog')
    },
    selMusic () {
      ipcRenderer.send('open-select-music-dialog')
    },
    renderVideo () {
      if (this.saveDir) {
        this.$emit('render-video', { music: this.musicFile, output: this.saveDir + `/poster-${new Date()}.mp4` })
      }
    },
    onStop () {
      window.cancelAnimationFrame(this.rafID)
    },
    onPlay () {
      var rAF = () => {
        this.rafID = window.requestAnimationFrame(rAF)
        this.timeline.updateTime({ time: this.time })
        this.time += 1 / 60
        if (this.time > this.totalTime) {
          this.time = 0
        }
      }
      this.onStop()
      this.rafID = window.requestAnimationFrame(rAF)
    },
    onLoop () {
      var rAF = () => {
        this.rafID = window.requestAnimationFrame(rAF)
        this.varTime += (this.time - this.varTime) * 0.1
        this.timeline.updateTime({ time: this.varTime })
      }
      this.rafID = window.requestAnimationFrame(rAF)
    },
    onHover ({ percentage, at, full }) {
      this.onStop()
      this.onLoop()
      this.time = percentage * this.totalTime
    },
    onAdd (evt) {
      console.log(evt)
    },
    onSelect (evt) {
      this.editThis({ spec: evt.renderable.info })
    },
    addSimpleText () {
      let st = this.specs.makeSimpleText()
      this.specs.addTop(st)
    },
    editThis ({ spec }) {
      this.currentItemID = spec.id
    }
  },
  watch: {
    dbJSON () {
      this.specs.saveToLS()
    }
  },
  computed: {
    dbJSON () {
      let itemsJSON = this.specs.items.reduce((c, i) => {
        c += JSON.stringify(i.position)
        c += JSON.stringify(i.rotation)
        c += JSON.stringify(i.scale)

        c += JSON.stringify(i.start)
        c += JSON.stringify(i.afterStart)
        c += JSON.stringify(i.beforeEnd)
        c += JSON.stringify(i.end)

        if (i.ClassName.indexOf('Text') !== -1) {
          c += JSON.stringify(i.text)
          c += JSON.stringify(i.container)
          c += JSON.stringify(i.box)
        }
        return c
      }, '')

      let trashJSON = JSON.stringify(this.specs.trash)
      return itemsJSON + trashJSON
    }
  }
}
</script>

<style scpoed>
textarea{
  /* font-size: 17px; */
}
.ace-box{
  width: calc(100% / 3);
  min-width: 100px;
  display: block;
}
.ace-row{
  display: flex;
}
.video-taller{
  width: calc(100% - 500px);
  height: 500px;
}
</style>
