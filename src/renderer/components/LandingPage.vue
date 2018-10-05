<template>
  <div id="wrapper">



    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue">
    <main>
      <div class="left-side">
        <span class="title">
          Welcome to your new project!
        </span>
        <system-information></system-information>
      </div>

      <div class="right-side">
        <div class="doc">
          <div class="title">Getting Started</div>
          <p>
            electron-vue comes packed with detailed documentation that covers everything from
            internal configurations, using the project structure, building your application,
            and so much more.
          </p>
          <button @click="open('https://simulatedgreg.gitbooks.io/electron-vue/content/')">Read the Docs</button><br><br>
        </div>
        <div class="doc">
          <div class="title alt">Other Documentation</div>
          <button class="alt" @click="open('https://electron.atom.io/docs/')">Electron</button>
          <button class="alt" @click="open('https://vuejs.org/v2/guide/')">Vue.js</button>
        </div>
      </div>
    </main> -->
    <div ref="canvas-div"></div>
  </div>
</template>

<script>
export default {
  name: 'landing-page',
  components: {
    RenderItem
  },
  mounted () {


    // {
    //     text: 'hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello \nhello',
    //     container: `
    //       height: 2048px;
    //       width: 2048px;
    //       display: flex;
    //       justify-content: center;
    //       align-items: center;
    //     `,
    //     box: `
    //       width: 300px;
    //       font-family: 'Bodoni 72',
    //       text-align: left;
    //       font-size: 50px;
    //       letter-spacing: 0px;
    //       line-height: 1.0;
    //     `
    //   }

    // this.$refs['canvas-div'].appendChild()
  },
  methods: {

    open (link) {
      this.$electron.shell.openExternal(link)
    }
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

</style>
