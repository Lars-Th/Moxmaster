import { createRouter, createWebHistory } from 'vue-router'
import { 
  Home, 
  TestTube, 
  LayoutDashboard, 
  Users, 
  Settings as SettingsIcon,
  UserCheck,
  Search,
  Palette,
  Wrench,
  Hammer,
  FileText
} from 'lucide-vue-next'
import Dashboard from '@/views/Dashboard.vue'
import Settings from '@/views/Settings.vue'
import Test from '@/views/Test.vue'
import Customers from '@/views/Customers.vue'
import CustomerDetails from '@/views/CustomerDetails.vue'
import Contacts from '@/views/Contacts.vue'
import Prospector from '@/views/Prospector.vue'
import CustomComponents from '@/views/CustomComponents.vue'
import Machines from '@/views/Machines.vue'
import Tools from '@/views/Tools.vue'
import WorkOrders from '@/views/WorkOrders.vue'

// Single source of truth for routes and navigation
const routeDefinitions = [
  {
    path: '/',
    name: 'custom-components',
    component: CustomComponents,
    navigation: { name: 'Egna Komponenter', icon: Palette }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    navigation: { name: 'Dashboard', icon: LayoutDashboard }
  },
  {
    path: '/test',
    name: 'test',
    component: Test,
    navigation: { name: 'Test', icon: TestTube }
  },
  {
    path: '/customers',
    name: 'customers',
    component: Customers,
    navigation: { name: 'Kunder', icon: Users }
  },
  {
    path: '/customers/:id',
    name: 'customer-details',
    component: CustomerDetails
    // No navigation property means it won't appear in nav
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: Contacts,
    navigation: { name: 'Kontaktpersoner', icon: UserCheck }
  },
  {
    path: '/machines',
    name: 'machines',
    component: Machines,
    navigation: { name: 'Maskiner', icon: Wrench }
  },
  {
    path: '/tools',
    name: 'tools',
    component: Tools,
    navigation: { name: 'Verktyg', icon: Hammer }
  },
  {
    path: '/work-orders',
    name: 'work-orders',
    component: WorkOrders,
    navigation: { name: 'Arbetsorder', icon: FileText }
  },
  {
    path: '/prospector',
    name: 'prospector',
    component: Prospector,
    navigation: { name: 'Prospector', icon: Search }
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    navigation: { name: 'Settings', icon: SettingsIcon }
  }
]

// Derive navigationItems from routeDefinitions
export const navigationItems = routeDefinitions
  .filter(route => route.navigation)
  .map(route => ({
    name: route.navigation!.name,
    path: route.path,
    icon: route.navigation!.icon
  }))

// Derive routes from routeDefinitions
const routes = routeDefinitions.map(({ navigation, ...route }) => route)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
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
 