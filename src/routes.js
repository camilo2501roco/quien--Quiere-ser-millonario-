import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('./layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('./pages/IntroPage.vue') },
      { path: 'game', component: () => import('./pages/GamePage.vue') },
      { path: 'result', component: () => import('./pages/ResultPage.vue') }
    ]
  }
  // Se eliminó la ruta catchAll (404)
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})