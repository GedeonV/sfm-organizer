import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

const vp = new VuexPersist({
	key: 'store',
	storage: window.localStorage
})

Vue.use(Vuex)

export default new Vuex.Store({
  plugins : [vp.plugin],
  
  state: {
    user: null
    //members: false
  },

  mutations: {
    user(state, data){
      state.user = data;
    },

    logout(state){
      state.user = null;
    }
  }
})
