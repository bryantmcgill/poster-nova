<template>
<span>
</span>
</template>

<script>
export default {
  props: {
    item: {
      required: true
    }
  },
  watch: {
    itemJSON () {
      this.$emit('refresh', this.item)
    }
  },
  computed: {
    itemJSON () {
      return JSON.stringify(this.item)
    }
  },
  mounted () {
    this.$emit('attach', this.item)
  },
  beforeDestroy () {
    this.$emit('detach', this.item)
  }
}
</script>

<style>
</style>
