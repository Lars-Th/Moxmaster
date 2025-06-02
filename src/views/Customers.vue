<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerStorage } from '@/storages/customerStorage'
import { Plus } from 'lucide-vue-next'
import StandardHeader from '@/components/custom/StandardHeader.vue'
import ActionBar from '@/components/custom/ActionBar.vue'
import DataTable from '@/components/custom/DataTable.vue'

interface BreadcrumbItem {
  label: string
  to?: string | { name: string; params?: Record<string, any> }
  isCurrentPage?: boolean
}

const router = useRouter()
const customerStorage = useCustomerStorage()

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

// Action buttons configuration
const actionButtons = [
  {
    label: 'Lägg till ny kund',
    icon: Plus,
    onClick: addNewCustomer,
    class: 'text-xs h-8'
  }
]

// Stats for StandardHeader
const stats = computed(() => [
  {
    label: 'Totalt kunder',
    value: customerStorage.totalCustomers.toString(),
    change: '+12%',
    trend: 'up' as const
  },
  {
    label: 'Aktiva kunder',
    value: customerStorage.activeCustomers.length.toString(),
    change: '+5%',
    trend: 'up' as const,
    color: 'text-green-600'
  },
  {
    label: 'Inaktiva kunder',
    value: customerStorage.inactiveCustomers.length.toString(),
    change: '-2%',
    trend: 'down' as const,
    color: 'text-orange-600'
  },
  {
    label: 'Nya denna månad',
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
  customerStorage.removeCustomer(customer.id)
}
</script>

<template>
  <div class="w-full">
    <!-- Standard Header -->
    <StandardHeader
      title="Kunder"
      :breadcrumbs="breadcrumbs"
      description="Manage and view all customer information"
      :show-stats="true"
      :stats="stats"
    />

    <!-- Data Table with Search and Filter Bar -->
    <DataTable
      :data="customerStorage.customers"
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
        <ActionBar
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
</template> 