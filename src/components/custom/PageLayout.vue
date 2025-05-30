<script setup lang="ts">
import { computed } from 'vue'
import StandardHeader from './StandardHeader.vue'

interface BreadcrumbItem {
  label: string
  to?: string | { name: string; params?: Record<string, any> }
  isCurrentPage?: boolean
}

interface Props {
  title: string
  breadcrumbs: string | BreadcrumbItem[]
  description?: string
  showStats?: boolean
  stats?: Array<{
    value: string | number
    label: string
    color?: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }>
}

const props = defineProps<Props>()

// Convert string breadcrumbs to BreadcrumbItem array for backward compatibility
const normalizedBreadcrumbs = computed(() => {
  if (typeof props.breadcrumbs === 'string') {
    // Convert string breadcrumbs to BreadcrumbItem array
    const parts = props.breadcrumbs.split(' / ')
    return parts.map((part, index) => ({
      label: part.trim(),
      to: index === 0 ? '/' : undefined, // Only make "Home" clickable by default
      isCurrentPage: index === parts.length - 1
    }))
  }
  return props.breadcrumbs
})
</script>

<template>
  <div class="w-full">
    <!-- Header with title, breadcrumbs, and analytics -->
    <StandardHeader
      :title="title"
      :breadcrumbs="normalizedBreadcrumbs"
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