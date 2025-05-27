<script setup lang="ts">
import { RouterView, useRouter, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

const navigationItems = [
  { name: 'Home', path: '/', icon: 'home' },
  { name: 'Test', path: '/test', icon: 'test-tube' },
  { name: 'Dashboard', path: '/dashboard', icon: 'layout-dashboard' },
  { name: 'Settings', path: '/settings', icon: 'settings' }
]

const navigateTo = (path: string) => {
  router.push(path)
}

const isActiveRoute = (path: string) => {
  return route.path === path
}
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
