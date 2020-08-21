import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './../node_modules/bulma/css/bulma.css'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()

window.axios = axios.create({
      baseURL: 'https://tools.sopress.net/iut/coop/api/',
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
