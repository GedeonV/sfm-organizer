import Vue from 'vue'
import VueRouter from 'vue-router'
import Panel from '../views/Panel.vue'
import Event from '../views/Event.vue'

Vue.use(VueRouter)

  const routes = [
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
