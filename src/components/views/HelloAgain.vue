<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
</script>

<template>
  <div class="space-y-6">
    <div class="text-center space-y-4">
      <h1 class="text-4xl font-bold text-foreground">Welcome to My Vue App</h1>
      <p class="text-xl text-muted-foreground">A modern Vue 3 application with TypeScript and beautiful UI components</p>
      <div class="flex justify-center space-x-2">
        <Badge variant="secondary">Vue 3</Badge>
        <Badge variant="secondary">TypeScript</Badge>
        <Badge variant="secondary">Tailwind CSS</Badge>
        <Badge variant="secondary">Reka UI</Badge>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Quick start guide for your new application</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <p class="text-sm text-muted-foreground">
            This application features a fixed sidebar navigation that allows you to navigate between different views. 
            The main content area updates based on your navigation choices while keeping the sidebar persistent.
          </p>
          <Button class="w-full">View Documentation</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>What's included in this application</CardDescription>
        </CardHeader>
        <CardContent>
          <ul class="space-y-2 text-sm">
            <li class="flex items-center">
              <span class="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Fixed sidebar navigation
            </li>
            <li class="flex items-center">
              <span class="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Vue Router integration
            </li>
            <li class="flex items-center">
              <span class="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Beautiful UI components
            </li>
            <li class="flex items-center">
              <span class="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Responsive design
            </li>
            <li class="flex items-center">
              <span class="w-2 h-2 bg-primary rounded-full mr-2"></span>
              TypeScript support
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Navigation</CardTitle>
        <CardDescription>Explore the different sections of the application</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-muted-foreground mb-4">
          Use the sidebar navigation to explore different sections:
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="text-center p-4 border rounded-lg">
            <h3 class="font-semibold">Dashboard</h3>
            <p class="text-sm text-muted-foreground">View analytics and metrics</p>
          </div>
          <div class="text-center p-4 border rounded-lg">
            <h3 class="font-semibold">Test</h3>
            <p class="text-sm text-muted-foreground">Test functionality</p>
          </div>
          <div class="text-center p-4 border rounded-lg">
            <h3 class="font-semibold">Settings</h3>
            <p class="text-sm text-muted-foreground">Configure preferences</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
/* Component-specific styles if needed */
</style>
