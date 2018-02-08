import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vueConfig from './lib/mixins/config'

const configs = {
  gaCode: ''
}

Vue.use(vueConfig, configs)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  mounted: function () {
    console.log('Vue Mounted!')
  }
})
