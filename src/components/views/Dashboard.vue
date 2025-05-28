<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import PageLayout from '@/components/ui/PageLayout.vue'

// Statistik för dashboard
const stats = computed(() => [
  {
    value: '1,234',
    label: 'Aktiva användare'
  },
  {
    value: '$45,231',
    label: 'Månadens intäkter',
    color: 'text-green-600'
  },
  {
    value: '89',
    label: 'Nya beställningar'
  },
  {
    value: '98%',
    label: 'Systemstatus',
    color: 'text-blue-600'
  }
])
</script>

<template>
  <PageLayout
    title="Dashboard"
    breadcrumbs="Home / Dashboard"
    :show-stats="true"
    :stats="stats"
  >
    <template #actions>
      <!-- Inga åtgärder för dashboard -->
    </template>

    <template #filters>
      <!-- Inga filter för dashboard -->
    </template>
    <div class="p-4 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader class="pb-3">
            <CardTitle class="text-base">Total Users</CardTitle>
            <CardDescription class="text-xs">Active users this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="text-lg font-bold">1,234</div>
            <Badge variant="secondary" class="mt-2 text-xs">+12% from last month</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-3">
            <CardTitle class="text-base">Revenue</CardTitle>
            <CardDescription class="text-xs">Total revenue this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="text-lg font-bold">$45,231</div>
            <Badge variant="default" class="mt-2 text-xs">+8% from last month</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-3">
            <CardTitle class="text-base">Orders</CardTitle>
            <CardDescription class="text-xs">New orders this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="text-lg font-bold">89</div>
            <Badge variant="outline" class="mt-2 text-xs">+3% from last week</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Quick Actions</CardTitle>
          <CardDescription class="text-xs">Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent class="space-x-2">
          <Button class="text-xs">Create New Project</Button>
          <Button variant="outline" class="text-xs">View Reports</Button>
          <Button variant="secondary" class="text-xs">Export Data</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid gap-3">
            <div class="flex flex-col space-y-2">
              <Button variant="outline" class="text-xs" @click="$router.push('/hello')">Hello Again</Button>
              <Button variant="outline" class="text-xs" @click="$router.push('/test')">Test</Button>
              <Button variant="outline" class="text-xs" @click="$router.push('/settings')">Settings</Button>
              <Button variant="outline" class="text-xs" @click="$router.push('/customers')">Kundlista</Button>
              <Button variant="outline" class="text-xs" @click="$router.push('/contacts')">Kontaktpersoner</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </PageLayout>
</template>

<style scoped>
/* Component-specific styles if needed */
</style> 