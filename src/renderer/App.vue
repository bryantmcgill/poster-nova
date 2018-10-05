<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'poster-nova-app'
  }
</script>

<style>
html, body, #app, .full{
  width: 100%;
  height: 100%;
  padding: 0px;
  margin: 0px;
}

#app{
  background-color: white;
}
  /* CSS */
</style>
