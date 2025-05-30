<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerStore } from '@/stores/customerStore'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
import PageLayout from '@/components/custom/PageLayout.vue'
import DataTable from '@/components/custom/DataTable.vue'

const router = useRouter()
const customerStore = useCustomerStore()

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
  <PageLayout
    title="Kunder"
    breadcrumbs="Home / Kunder"
    :stats="stats"
  >
    <template #actions>
      <div class="space-x-2">
        <Button @click="addNewCustomer" class="text-xs h-8">
          <Plus class="h-3 w-3 mr-1" />
          Lägg till ny kund
        </Button>
      </div>
    </template>

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
    />
  </PageLayout>
</template> 