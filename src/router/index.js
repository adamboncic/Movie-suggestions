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
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (to.name === 'MoviePage') {
          resolve({ top: 0, behavior: 'smooth' })
        } else if (savedPosition) {
          resolve({ ...savedPosition, behavior: 'smooth' })
        } else {
          resolve({ left: 0, top: 0, behavior: 'smooth' })
        }
      }, 100)
    })
  }
})

export default router