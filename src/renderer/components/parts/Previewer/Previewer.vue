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
    flip: {},
    renderer: {}
  },
  data () {
    return {
    }
  },
  watch: {
    renderer () {
      this.setupPreviewer()
    }
  },
  mounted () {
    if (this.flip) {
      this.$refs['canvas-div'].style.transform = 'rotateY(180deg) rotateZ(180deg)'
    }
    this.setupPreviewer()
  },
  methods: {
    setupPreviewer () {
      this.$refs['canvas-div'].innerHTML = ''
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
