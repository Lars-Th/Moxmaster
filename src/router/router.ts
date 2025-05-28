import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/components/views/Dashboard.vue'
import Settings from '@/components/views/Settings.vue'
import Test from '@/components/views/Test.vue'
import HelloAgain from '@/components/views/HelloAgain.vue'
import Customers from '@/components/views/Customers.vue'
import CustomerDetails from '@/components/views/CustomerDetails.vue'
import Contacts from '@/components/views/Contacts.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
      path: '/test',
      name: 'test',
      component: Test
    },
    {
      path: '/hello',
      name: 'hello',
      component: HelloAgain
    },
    {
      path: '/customers',
      name: 'customers',
      component: Customers
    },
    {
      path: '/customers/:id',
      name: 'customer-details',
      component: CustomerDetails
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: Contacts
    }
  ]
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
 