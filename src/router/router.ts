import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@/components/views/HelloAgain.vue'),
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/components/views/Test.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/components/views/Dashboard.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/components/views/Settings.vue'),
  },
 
 
  /* 404 catch-all:
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },*/
]
 
const router = createRouter({
  history: createWebHistory(),
  routes,
  // Add scroll behavior
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})
 
// Navigation guards
router.beforeEach((to, from, next) => {
  // Log navigation
  console.log(`[Router] Navigating to: ${to.fullPath}`)
  next()
})
 
router.afterEach((to) => {
  console.log(`[Router] Finished navigating to: ${to.fullPath}`)
})
 
export default router
 