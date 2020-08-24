import Vue from 'vue'
import VueRouter from 'vue-router'
import Panel from '../views/Panel.vue'
import Event from '../views/Event.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },

  {
  	path: '/admin',
  	name: 'Panel',
  	component: Panel
  },
  {
    path: '/admin/event/:id',
    name: 'event', 
    component: Event,
  },
]


const router = new VueRouter({
  routes
})

export default router
