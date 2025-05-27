<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-foreground">Dashboard</h1>
      <p class="text-muted-foreground">Welcome to your dashboard overview</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
          <CardDescription>Active users this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">1,234</div>
          <Badge variant="secondary" class="mt-2">+12% from last month</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Total revenue this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">$45,231</div>
          <Badge variant="default" class="mt-2">+8% from last month</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>New orders this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">89</div>
          <Badge variant="outline" class="mt-2">+3% from last week</Badge>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent class="space-x-2">
        <Button>Create New Project</Button>
        <Button variant="outline">View Reports</Button>
        <Button variant="secondary">Export Data</Button>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
/* Component-specific styles if needed */
</style> 