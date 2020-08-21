import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()

window.axios = axios.create({
      baseURL: 'https://sfm-project.herokuapp.com/',
      params : {
        token : false
      },
      headers: {
        Authorization: ""
      }
    });

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
