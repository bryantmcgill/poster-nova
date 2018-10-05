<template>
  <div>
    <div ref="canvas-div" class="preview-div"></div>
  </div>
</template>

<script>
// import { Renderer, Compos } from '../index.js'
// import RenderItem from '../RenderItem/RenderItem.vue'
export default {
  components: {
    // ...Compos
  },
  props: {
    renderer: {}
  },
  data () {
    return {
    }
  },
  mounted () {
    this.setupPreviewer()
  },
  methods: {
    setupPreviewer () {
      this.$refs['canvas-div'].appendChild(this.renderer.canvas)
    }
  }
}
</script>

<style>
.preview-div{
  width: 470px;
  height: 470px;
  max-width: 100%;
  max-height: 100vmin;
}
</style>
