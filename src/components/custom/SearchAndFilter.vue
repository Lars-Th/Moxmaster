<script setup lang="ts">
import { Button } from '@/components/ui/button'
import SearchFilterBar from './SearchFilterBar.vue'

interface FilterOption {
  value: string
  label: string
}

interface ActionButton {
  label: string
  icon?: any
  onClick: () => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  class?: string
}

interface Props {
  // Action buttons props
  actionButtons?: ActionButton[]
  
  // Search filter props
  searchQuery: string
  statusFilter: string
  searchPlaceholder?: string
  filterOptions?: FilterOption[]
  showActiveFilters?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  actionButtons: () => [],
  searchPlaceholder: 'Sök...',
  filterOptions: () => [],
  showActiveFilters: true
})

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:statusFilter': [value: string]
}>()

const updateSearchQuery = (value: string) => {
  emit('update:searchQuery', value)
}

const updateStatusFilter = (value: string) => {
  emit('update:statusFilter', value)
}
</script>

<template>
  <div class="p-2 flex justify-between">
    <!-- Action buttons on the left -->
    <div class="flex gap-2">
      <Button
        v-for="(button, index) in actionButtons"
        :key="index"
        @click="button.onClick"
        :variant="button.variant || 'default'"
        :size="button.size || 'default'"
        :class="[button.class, 'cursor-pointer']"
      >
        <component :is="button.icon" v-if="button.icon" class="h-3 w-3 mr-1" />
        {{ button.label }}
      </Button>
    </div>

    <!-- Search filter bar on the right -->
    <div class="flex-shrink-0">
      <SearchFilterBar
        :search-query="searchQuery"
        :status-filter="statusFilter"
        :search-placeholder="searchPlaceholder"
        :filter-options="filterOptions"
        :show-active-filters="showActiveFilters"
        @update:search-query="updateSearchQuery"
        @update:status-filter="updateStatusFilter"
      />
    </div>
  </div>
</template> 