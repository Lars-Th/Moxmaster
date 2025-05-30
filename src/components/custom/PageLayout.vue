<script setup lang="ts">
import StandardHeader from './StandardHeader.vue'

interface Props {
  title: string
  breadcrumbs: string
  description?: string
  showStats?: boolean
  stats?: Array<{
    value: string | number
    label: string
    color?: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }>
}

defineProps<Props>()
</script>

<template>
  <div class="w-full">
    <!-- Header with title, breadcrumbs, and analytics -->
    <StandardHeader
      :title="title"
      :breadcrumbs="breadcrumbs"
      :description="description"
      :show-stats="showStats"
      :stats="stats"
    >
      <template #actions>
        <slot name="actions" />
      </template>
      <template #filters>
        <slot name="filters" />
      </template>
    </StandardHeader>

    <!-- Main content -->
    <div>
      <slot />
    </div>
  </div>
</template> 