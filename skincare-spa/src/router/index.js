import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/diagnostic',
    name: 'diagnostic',
    component: () => import('@/views/DiagnosticView.vue')
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/views/BlogView.vue')
  },
  {
    path: '/blog/:slug',
    name: 'article',
    component: () => import('@/views/ArticleView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    if (to.hash) {
      // Si on vient d'une autre route, on laisse le temps au composant de se monter
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ el: to.hash, behavior: 'smooth', top: 80 })
        }, 100)
      })
    }

    return { top: 0, behavior: 'smooth' }
  }
})

export default router
