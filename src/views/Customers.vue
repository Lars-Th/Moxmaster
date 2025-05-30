<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerStore } from '@/stores/customerStore'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
import TitleBreadcrumbs from '@/components/custom/TitleBreadcrumbs.vue'
import TitleAnalytics from '@/components/custom/TitleAnalytics.vue'
import DataTable from '@/components/custom/DataTable.vue'
import SearchAndFilter from '@/components/custom/SearchAndFilter.vue'

interface BreadcrumbItem {
  label: string
  to?: string | { name: string; params?: Record<string, any> }
  isCurrentPage?: boolean
}

const router = useRouter()
const customerStore = useCustomerStore()

// Functional breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Kunder', isCurrentPage: true }
]

// Column configuration for the data table
const columns = [
  {
    key: 'companyName',
    label: 'Företag',
    sortable: true
  },
  {
    key: 'city',
    label: 'Ort',
    sortable: true
  },
  {
    key: 'name',
    label: 'Namn',
    sortable: true
  },
  {
    key: 'phone',
    label: 'Telefon',
    sortable: false
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    type: 'badge' as const,
    badgeVariant: (status: string) => status === 'Aktiv' ? 'default' : 'secondary'
  },
  {
    key: 'actions',
    label: 'Åtgärder',
    sortable: false,
    type: 'actions' as const,
    align: 'right' as const
  }
]

// Filter options for the search bar
const filterOptions = [
  { value: 'Aktiv', label: 'Aktiv' },
  { value: 'Inaktiv', label: 'Inaktiv' }
]

// Statistik för PageLayout
const stats = computed(() => [
  {
    title: 'Totalt kunder',
    value: customerStore.totalCustomers.toString(),
    change: '+12%',
    trend: 'up' as const
  },
  {
    title: 'Aktiva kunder',
    value: customerStore.activeCustomers.length.toString(),
    change: '+5%',
    trend: 'up' as const
  },
  {
    title: 'Inaktiva kunder',
    value: customerStore.inactiveCustomers.length.toString(),
    change: '-2%',
    trend: 'down' as const
  },
  {
    title: 'Nya denna månad',
    value: '8',
    change: '+15%',
    trend: 'up' as const
  }
])

const viewCustomerDetails = (customer: any) => {
  router.push(`/customers/${customer.id}`)
}

function addNewCustomer() {
  // Här skulle vi navigera till en "lägg till kund" sida
  console.log('Lägg till ny kund')
}

const sendEmail = (customer: any, event: Event) => {
  window.location.href = `mailto:${customer.email}`
}

const deleteCustomer = (customer: any, event: Event) => {
  customerStore.removeCustomer(customer.id)
}
</script>

<template>
  <div class="w-full">
    <!-- Header using individual components -->
    <div class="bg-background px-6 py-4">
      <div class="flex flex-col gap-4">
        <!-- Title and breadcrumbs -->
        <TitleBreadcrumbs 
          title="Kunder" 
          :breadcrumbs="breadcrumbs"
          description="Manage and view all customer information"
        />
        
        <!-- Analytics -->
        <TitleAnalytics 
          :show-stats="true" 
          :stats="stats" 
        />
        
        <!-- Actions and filters row -->
        <div class="flex items-center justify-between h-10">
          <!-- Action buttons on the left -->
          <div class="flex items-center gap-2">
            <!-- Could add action buttons here -->
          </div>
          
          <!-- Search and filters on the right -->
          <div class="flex items-center gap-2">
            <!-- Filters will be handled by DataTable -->
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div>
      <DataTable
        :data="customerStore.customers"
        :columns="columns"
        :search-fields="['name', 'city', 'companyName']"
        filter-field="status"
        :filter-options="filterOptions"
        :on-row-click="viewCustomerDetails"
        :on-send-email="sendEmail"
        :on-delete="deleteCustomer"
        delete-confirm-message="Är du säker på att du vill radera denna kund?"
      >
        <template #filters="{ searchQuery, statusFilter, filterOptions, updateSearchQuery, updateStatusFilter }">
          <SearchAndFilter
            :action-buttons="actionButtons"
            :search-query="searchQuery"
            :status-filter="statusFilter"
            search-placeholder="Sök på namn, ort eller företag..."
            :filter-options="filterOptions"
            @update:search-query="updateSearchQuery"
            @update:status-filter="updateStatusFilter"
          />
        </template>
      </DataTable>
    </div>
  </div>
</template> 