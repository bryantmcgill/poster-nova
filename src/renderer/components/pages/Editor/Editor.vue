<template>
  <div class="full">



    <div class="top-right">
      <Previewer v-if="renderer" :renderer="renderer" />
    </div>
    <RenderableUpdater
      v-if="renderer && specs && specs.items"
      :key="info.id"
      v-for="info in specs.items"
      @attach="renderer.add({ info })"
      @detach="renderer.remove({ info })"
      @update="renderer.update({ info })"
      :item="info"
    >
    </RenderableUpdater>

    <div>
      <Controls
      v-if="specs"
      :specs="specs"
      :timeline="timeline"
      :renderer="renderer"
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
import { Specs, Renderer, Timeline, RenderableUpdater } from '@/components/parts/'

export default {
  components: {
    Previewer,
    Controls,
    RenderableUpdater
  },
  data () {
    return {
      renderer: false,
      timeline: false,
      specs: false
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
