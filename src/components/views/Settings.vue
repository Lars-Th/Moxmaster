<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ref } from 'vue'

const notifications = ref(true)
const darkMode = ref(false)
const autoSave = ref(true)
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-foreground">Settings</h1>
      <p class="text-muted-foreground">Manage your application preferences</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Profile Settings -->
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="name">Full Name</Label>
            <Input id="name" placeholder="Enter your full name" />
          </div>
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
          <div class="space-y-2">
            <Label for="company">Company</Label>
            <Input id="company" placeholder="Enter your company" />
          </div>
          <Button class="w-full">Save Profile</Button>
        </CardContent>
      </Card>

      <!-- Preferences -->
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your app experience</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Notifications</Label>
              <p class="text-sm text-muted-foreground">Receive email notifications</p>
            </div>
            <Switch v-model:checked="notifications" />
          </div>
          
          <Separator />
          
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Dark Mode</Label>
              <p class="text-sm text-muted-foreground">Enable dark theme</p>
            </div>
            <Switch v-model:checked="darkMode" />
          </div>
          
          <Separator />
          
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Auto Save</Label>
              <p class="text-sm text-muted-foreground">Automatically save changes</p>
            </div>
            <Switch v-model:checked="autoSave" />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Security Settings -->
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Manage your account security</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline">Change Password</Button>
          <Button variant="outline">Two-Factor Authentication</Button>
          <Button variant="outline">Download Data</Button>
          <Button variant="destructive">Delete Account</Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
/* Component-specific styles if needed */
</style> 