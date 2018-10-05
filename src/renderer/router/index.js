import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/framejs',
      component: require('@/components/pages/FrameJS/FrameJS.vue').default
    },
    {
      path: '/',
      component: require('@/components/pages/Editor/Editor.vue').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
