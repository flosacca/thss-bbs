import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import Index from '@/views/Index.vue'
import Login from '@/views/Login.vue'
import Detail from '@/views/Detail.vue'
import NotFound from '@/views/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/posts/:id',
    name: 'detail',
    component: Detail,
    props: true
  },
  {
    path: '/*',
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  if (!store.state.loggedIn) {
    await store.dispatch('login')
  }
  let route = {}
  if (!store.state.loggedIn) {
    if (to.name !== 'login') {
      route.name = 'login'
    }
  } else {
    if (to.name === 'login') {
      route.name = 'index'
    }
  }
  next(route)
})

export default router
