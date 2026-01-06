import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/home',
    name: 'UserHome',
    component: () => import('../views/UserHomeView.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/AdminHomeView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router