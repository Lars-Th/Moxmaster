<script setup lang="ts">
import { RouterView, useRouter, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { computed, ref, onMounted } from 'vue'

const router = useRouter()
const route = useRoute()

const navigationItems = [
  { name: 'Home', path: '/', icon: 'home' },
  { name: 'Test', path: '/test', icon: 'test-tube' },
  { name: 'Dashboard', path: '/dashboard', icon: 'layout-dashboard' },
  { name: 'Settings', path: '/settings', icon: 'settings' }
]

const themes = [
  { name: 'Default', value: 'default', class: '' },
  { name: 'Dark', value: 'dark', class: 'dark' },
  { name: 'Fuchsia', value: 'fuchsia', class: 'theme_fuchsia' },
  { name: 'Purple', value: 'purple', class: 'theme_purple' },
  { name: 'Amber', value: 'amber', class: 'theme_amber' },
  { name: 'Sky', value: 'sky', class: 'theme_sky' },
  { name: 'Pink', value: 'pink', class: 'theme_pink' }
]

const currentTheme = ref('default')

const navigateTo = (path: string) => {
  router.push(path)
}

const isActiveRoute = (path: string) => {
  return route.path === path
}

const setTheme = (theme: typeof themes[0]) => {
  currentTheme.value = theme.value
  
  // Remove all theme classes
  document.documentElement.classList.remove('dark', 'theme_fuchsia', 'theme_purple', 'theme_amber', 'theme_sky', 'theme_pink')
  
  // Add the new theme class if it's not default
  if (theme.class) {
    document.documentElement.classList.add(theme.class)
  }
  
  // Store theme preference
  localStorage.setItem('theme', theme.value)
}

const getCurrentThemeName = computed(() => {
  return themes.find(theme => theme.value === currentTheme.value)?.name || 'Default'
})

// Load saved theme on mount
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'default'
  const theme = themes.find(t => t.value === savedTheme) || themes[0]
  setTheme(theme)
})
</script>

<template>
  <div class="flex h-screen bg-background">
    <!-- Fixed Sidebar -->
    <aside class="w-64 bg-card border-r border-border flex flex-col">
      <!-- Sidebar Header -->
      <div class="p-6 border-b border-border">
        <h1 class="text-xl font-semibold text-foreground">My Vue App</h1>
      </div>
      
      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-2">
        <Button
          v-for="item in navigationItems"
          :key="item.path"
          :variant="isActiveRoute(item.path) ? 'default' : 'ghost'"
          class="w-full justify-start"
          @click="navigateTo(item.path)"
        >
          {{ item.name }}
        </Button>
        
        <!-- Theme Switcher -->
        <div class="pt-2">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" class="w-full justify-start">
                🎨 Theme: {{ getCurrentThemeName }}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" class="w-48">
              <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                v-for="theme in themes"
                :key="theme.value"
                @click="setTheme(theme)"
                class="cursor-pointer"
              >
                <span class="flex items-center">
                  <span 
                    class="w-3 h-3 rounded-full mr-2 border"
                    :class="{
                      'bg-gray-100 border-gray-300': theme.value === 'default',
                      'bg-gray-800 border-gray-600': theme.value === 'dark',
                      'bg-fuchsia-500 border-fuchsia-600': theme.value === 'fuchsia',
                      'bg-purple-500 border-purple-600': theme.value === 'purple',
                      'bg-amber-500 border-amber-600': theme.value === 'amber',
                      'bg-sky-500 border-sky-600': theme.value === 'sky',
                      'bg-pink-500 border-pink-600': theme.value === 'pink'
                    }"
                  ></span>
                  {{ theme.name }}
                  <span v-if="currentTheme === theme.value" class="ml-auto">✓</span>
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      
      <Separator />
      
      <!-- Sidebar Footer -->
      <div class="p-4">
        <p class="text-sm text-muted-foreground">Vue 3 + TypeScript</p>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-auto">
      <div class="p-6">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
