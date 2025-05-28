import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/components/views/Dashboard.vue'
import Customers from '@/components/views/Customers.vue'
import CustomerDetails from '@/components/views/CustomerDetails.vue'
import Contacts from '@/components/views/Contacts.vue'
import NotificationDemo from '@/components/views/NotificationDemo.vue'
import ValidationDemo from '@/components/views/ValidationDemo.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
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
      path: '/demo',
      name: 'notification-demo',
      component: NotificationDemo
    },
    {
      path: '/validation-demo',
      name: 'validation-demo',
      component: ValidationDemo
    }
  ]
})

export default router 