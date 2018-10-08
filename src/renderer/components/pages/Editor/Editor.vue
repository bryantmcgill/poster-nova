<template>
  <div class="full">

    <div class="top-right">
      <Previewer v-if="renderer" :renderer="renderer" />
      <Previewer v-if="videoRenderer && videoRenderer.renderer" :renderer="videoRenderer.renderer" :flip="true" />
    </div>

    <RenderableUpdater
      v-if="renderer && specs && specs.items"
      :key="info.id"
      v-for="info in specs.items"
      @attach="renderer.add({ info })"
      @detach="renderer.remove({ info })"
      @refresh="renderer.refresh({ info })"
      :item="info"
    >
    </RenderableUpdater>

    <div>
      <Controls
      v-if="specs"
      :specs="specs"
      :timeline="timeline"
      :renderer="renderer"
      @render-video="renderVideo"
      :progress="progress"
      />
    </div>

    <!-- <FrameUpdater
      v-if="renderer && timeline && timeline.items"
      :key="info.id"
      v-for="info in specs.items"
      @attach="renderer.add({ info })"
      @detach="renderer.remove({ info })"
      @update="renderer.update({ info })"
      :item="info"
    >
    </FrameUpdater> -->

  </div>
</template>

<script>
import Previewer from '@/components/parts/Previewer/Previewer.vue'
import Controls from '@/components/parts/Controls/Controls.vue'
import { Specs, Renderer, Timeline, RenderableUpdater, VideoRenderer } from '@/components/parts/'

export default {
  components: {
    Previewer,
    Controls,
    RenderableUpdater
  },
  data () {
    return {
      videoRenderer: false,
      renderer: false,
      timeline: false,
      specs: false,
      progress: 0
    }
  },
  mounted () {
    this.setup()
    this.renderer.run()
  },
  methods: {
    setup () {
      this.specs = new Specs()
      this.renderer = new Renderer({ mode: Renderer.PREVIEW_MODE })
      this.timeline = new Timeline({ renderer: this.renderer, specs: this.specs })
    },
    renderVideo ({ output, music }) {
      if (!output) {
        console.log('no output target')
        return
      }
      this.videoRenderer = new VideoRenderer({ output, music, specs: this.specs })
      this.videoRenderer.on('progress', ({ progress }) => {
        this.progress = progress
      })
      this.$nextTick(() => {
        this.videoRenderer.emit('start')
      })
    }
  }
}
</script>

<style scoped>
.top-right{
  position: absolute;
  top: 0px;
  right: 0px;
}

</style>
