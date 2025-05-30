<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore'
import { Button } from '@/components/ui/button'
import StandardHeader from '@/components/custom/StandardHeader.vue'
import DashboardCard from '@/components/custom/DashboardCard.vue'

const dashboardStore = useDashboardStore()

// Statistik för dashboard
const stats = computed(() => dashboardStore.stats)
</script>

<template>
  <div class="w-full">
    <!-- Using StandardHeader directly -->
    <StandardHeader
      title="Dashboard"
      breadcrumbs="Home / Dashboard"
      :show-stats="true"
      :stats="stats"
    />

    <!-- Main content -->
    <div class="p-4 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Total Users"
          description="Active users this month"
          :value="dashboardStore.totalUsers"
          :badge="{ text: '+12% from last month', variant: 'secondary' }"
        />

        <DashboardCard
          title="Revenue"
          description="Total revenue this month"
          :value="dashboardStore.monthlyRevenue"
          :badge="{ text: '+8% from last month', variant: 'default' }"
        />

        <DashboardCard
          title="Orders"
          description="New orders this week"
          :value="dashboardStore.newOrders"
          :badge="{ text: '+3% from last week', variant: 'outline' }"
        />
      </div>

      <DashboardCard
        title="Quick Actions"
        description="Common tasks and shortcuts"
        full-width
      >
        <div class="space-x-2">
          <Button 
            v-for="action in dashboardStore.quickActions" 
            :key="action.id"
            class="text-xs"
            @click="console.log('Action:', action.action)"
          >
            {{ action.label }}
          </Button>
        </div>
      </DashboardCard>

      <DashboardCard title="Navigation" full-width>
        <div class="grid gap-3">
          <div class="flex flex-col space-y-2">
            <Button 
              v-for="item in dashboardStore.navigationItems" 
              :key="item.id"
              variant="outline" 
              class="text-xs" 
              @click="$router.push(item.route)"
            >
              {{ item.label }}
            </Button>
          </div>
        </div>
      </DashboardCard>
    </div>
  </div>
</template>

<style scoped>
/* Component-specific styles if needed */
</style> 