import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import MoviePage from '@/views/MoviePage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/movie/:id',
    name: 'MoviePage',
    component: MoviePage,
    props: true
  },
  // ...
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // scrollBehavior(to, from, savedPosition) {
  //   // Always scroll to top
  //   return { top: 0 }
  // }
})

export default router