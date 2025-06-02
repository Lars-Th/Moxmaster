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
  // Hidden/utility routes (no navigation)
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    redirect: '/dashboard'
  },
  {
    path: '/customers/:id',
    name: 'customer-details',
    component: CustomerDetails
  },
  // Main navigation section
  {
    path: '/dashboard',
    name: 'dashboard-main',
    component: Dashboard,
    navigation: { name: 'Dashboard', icon: LayoutDashboard, section: 'main' }
  },
  {
    path: '/customers',
    name: 'customers',
    component: Customers,
    navigation: { name: 'Kunder', icon: Users, section: 'main' }
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: Contacts,
    navigation: { name: 'Kontaktpersoner', icon: UserCheck, section: 'main' }
  },
  {
    path: '/machines',
    name: 'machines',
    component: Machines,
    navigation: { name: 'Maskiner', icon: Wrench, section: 'main' }
  },
  {
    path: '/tools',
    name: 'tools',
    component: Tools,
    navigation: { name: 'Verktyg', icon: Hammer, section: 'main' }
  },
  {
    path: '/work-orders',
    name: 'work-orders',
    component: WorkOrders,
    navigation: { name: 'Arbetsorder', icon: FileText, section: 'main' }
  },
  // Bottom navigation section
  {
    path: '/test',
    name: 'test',
    component: Test,
    navigation: { name: 'Test', icon: TestTube, section: 'bottom' }
  },
  {
    path: '/prospector',
    name: 'prospector',
    component: Prospector,
    navigation: { name: 'Prospector', icon: Search, section: 'bottom' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    navigation: { name: 'Settings', icon: SettingsIcon, section: 'bottom' }
  }
]

// Derive navigation items by section
export const mainNavigationItems = routeDefinitions
  .filter(route => route.navigation?.section === 'main')
  .map(route => ({
    name: route.navigation!.name,
    path: route.path,
    icon: route.navigation!.icon
  }))

export const bottomNavigationItems = routeDefinitions
  .filter(route => route.navigation?.section === 'bottom')
  .map(route => ({
    name: route.navigation!.name,
    path: route.path,
    icon: route.navigation!.icon
  }))

// Keep legacy export for compatibility
export const navigationItems = [...mainNavigationItems, ...bottomNavigationItems]

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
 