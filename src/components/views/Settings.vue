<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ref } from 'vue'
import PageLayout from '@/components/ui/PageLayout.vue'

const notifications = ref(true)
const darkMode = ref(false)
const autoSave = ref(true)
</script>

<template>
  <PageLayout
    title="Inställningar"
    breadcrumbs="Home / Inställningar"
  >
    <template #actions>
      <!-- Inga åtgärder för inställningar -->
    </template>

    <template #filters>
      <!-- Inga filter för inställningar -->
    </template>
    <div class="p-4 space-y-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Profile Settings -->
        <Card>
          <CardHeader class="pb-3">
            <CardTitle class="text-base">Profilinställningar</CardTitle>
            <CardDescription class="text-xs">Uppdatera din personliga information</CardDescription>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="space-y-1">
              <Label for="name" class="text-xs">Fullständigt namn</Label>
              <Input id="name" placeholder="Ange ditt fullständiga namn" class="text-xs" />
            </div>
            <div class="space-y-1">
              <Label for="email" class="text-xs">E-post</Label>
              <Input id="email" type="email" placeholder="Ange din e-post" class="text-xs" />
            </div>
            <div class="space-y-1">
              <Label for="company" class="text-xs">Företag</Label>
              <Input id="company" placeholder="Ange ditt företag" class="text-xs" />
            </div>
            <Button class="w-full text-xs">Spara profil</Button>
          </CardContent>
        </Card>

        <!-- Preferences -->
        <Card>
          <CardHeader class="pb-3">
            <CardTitle class="text-base">Preferenser</CardTitle>
            <CardDescription class="text-xs">Anpassa din appupplevelse</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label class="text-xs">Notifikationer</Label>
                <p class="text-xs text-muted-foreground">Ta emot e-postnotifikationer</p>
              </div>
              <Switch v-model:checked="notifications" />
            </div>
            
            <Separator />
            
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label class="text-xs">Mörkt läge</Label>
                <p class="text-xs text-muted-foreground">Aktivera mörkt tema</p>
              </div>
              <Switch v-model:checked="darkMode" />
            </div>
            
            <Separator />
            
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label class="text-xs">Automatisk sparning</Label>
                <p class="text-xs text-muted-foreground">Spara ändringar automatiskt</p>
              </div>
              <Switch v-model:checked="autoSave" />
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Security Settings -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Säkerhet</CardTitle>
          <CardDescription class="text-xs">Hantera din kontosäkerhet</CardDescription>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button variant="outline" class="text-xs">Ändra lösenord</Button>
            <Button variant="outline" class="text-xs">Tvåfaktorsautentisering</Button>
            <Button variant="outline" class="text-xs">Ladda ner data</Button>
            <Button variant="destructive" class="text-xs">Ta bort konto</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </PageLayout>
</template>

<style scoped>
/* Component-specific styles if needed */
</style> 