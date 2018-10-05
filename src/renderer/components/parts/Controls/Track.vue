<template>
<div class="track"
>
<slot></slot>
</div>
</template>

<script>
export default {
  props: {
    totalTime: {},
    specs: {}
  }
}
</script>

<style scoped>
.track{
  position: relative;
  height: 45px;
  box-sizing: border-box;
  border-bottom: black solid 1px;
  line-height: 45px;
  width: 100%;
}
</style>
