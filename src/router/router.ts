import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Settings from '@/views/Settings.vue'
import Test from '@/views/Test.vue'
import Customers from '@/views/Customers.vue'
import CustomerDetails from '@/views/CustomerDetails.vue'
import Contacts from '@/views/Contacts.vue'
import ProspectorView from '@/views/ProspectorView.vue'

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
    },
    {
      path: '/prospector',
      name: 'prospector',
      component: ProspectorView
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
 