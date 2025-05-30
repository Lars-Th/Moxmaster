<script setup lang="ts">
interface Props {
  title: string
  breadcrumbs: string
  description?: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
    <div class="flex-1">
      <h1 class="text-3xl font-semibold text-foreground mb-1">{{ title }}</h1>
      <p class="text-xs text-muted-foreground">{{ breadcrumbs }}</p>
      <p v-if="description" class="text-sm text-muted-foreground mt-1">{{ description }}</p>
    </div>
  </div>
</template> 