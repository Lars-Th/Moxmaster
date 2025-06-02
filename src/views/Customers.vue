<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useImprovedCustomerStorage } from '@/storages/improvedCustomerStorage'
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
const customerStore = useImprovedCustomerStorage()

// =============================================================================
// COMPUTED DATA USING IMPROVED STORE
// =============================================================================

// Enhanced customer data with relationship information
const customersWithMainContacts = computed(() => 
  customerStore.getAllCustomersWithMainContact
)

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
    key: 'mainContact',
    label: 'Huvudkontakt',
    sortable: false,
    type: 'custom' as const
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

// =============================================================================
// ENHANCED STATISTICS USING IMPROVED STORE
// =============================================================================

const stats = computed(() => [
  { 
    label: 'Totalt antal kunder', 
    value: customerStore.totalCustomers.toString() 
  },
  { 
    label: 'Aktiva kunder', 
    value: customerStore.activeCustomers.length.toString() 
  },
  { 
    label: 'Utan huvudkontakt', 
    value: customerStore.customersWithoutMainContact.length.toString() 
  },
  { 
    label: 'Kontaktpersoner totalt', 
    value: customerStore.totalContactPersons.toString() 
  }
])

// =============================================================================
// ACTION METHODS
// =============================================================================

function addNewCustomer() {
  // TODO: Navigate to new customer form or open modal
  console.log('Add new customer')
}

async function viewCustomerDetails(customer: any) {
  router.push(`/customers/${customer.id}`)
}

function sendEmail(customer: any) {
  window.location.href = `mailto:${customer.email}`
}

async function deleteCustomer(customer: any) {
  try {
    const result = await customerStore.removeCustomer(customer.id)
    
    if (result.success) {
      console.log('Customer deleted successfully')
    } else {
      console.error('Failed to delete customer:', result.error)
    }
  } catch (error) {
    console.error('Error deleting customer:', error)
  }
}

// =============================================================================
// DATA TRANSFORMATION FOR TABLE
// =============================================================================

// Transform the enhanced customer data for the table
const tableData = computed(() => {
  return customersWithMainContacts.value.map(customer => ({
    ...customer,
    // Override the mainContact object with just the name for table display
    mainContact: customer.mainContact?.name || 'Ingen',
    // Add additional fields for the custom template
    mainContactName: customer.mainContact?.name || 'Ingen',
    mainContactEmail: customer.mainContact?.email || '',
    // Add contact count
    contactCount: customerStore.getContactPersonsByCustomerId(customer.id).length
  }))
})
</script>

<template>
  <div class="w-full">
    <!-- Store Error Display -->
    <div v-if="customerStore.error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded">
      <div class="text-red-800">{{ customerStore.error }}</div>
      <button 
        @click="customerStore.clearError()" 
        class="mt-2 text-sm text-red-600 hover:text-red-800"
      >
        Stäng
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="customerStore.loading" class="text-center py-8">
      <div class="text-gray-600">Laddar kunddata...</div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Standard Header with Enhanced Statistics -->
      <StandardHeader
        title="Kunder"
        :breadcrumbs="breadcrumbs"
        description="Hantera och visa all kundinformation"
        :show-stats="true"
        :stats="stats"
      />

      <!-- Data Table with Search and Filter Bar -->
      <DataTable
        :data="tableData"
        :columns="columns"
        :search-fields="['name', 'city', 'companyName', 'mainContactName']"
        filter-field="status"
        :filter-options="filterOptions"
        :on-row-click="viewCustomerDetails"
        :on-send-email="sendEmail"
        :on-delete="deleteCustomer"
        delete-confirm-message="Är du säker på att du vill radera denna kund? Alla relaterade kontaktpersoner kommer också att tas bort."
      >
        <template #filters="{ searchQuery, statusFilter, filterOptions, updateSearchQuery, updateStatusFilter }">
          <ActionBar
            :action-buttons="actionButtons"
            :search-query="searchQuery"
            :status-filter="statusFilter"
            search-placeholder="Sök på namn, ort, företag eller huvudkontakt..."
            :filter-options="filterOptions"
            @update:search-query="updateSearchQuery"
            @update:status-filter="updateStatusFilter"
          />
        </template>

        <!-- Custom template for main contact column -->
        <template #mainContact="{ row }">
          <div class="text-sm">
            <div class="font-medium">{{ row.mainContactName }}</div>
            <div v-if="row.mainContactEmail" class="text-gray-500 text-xs">
              {{ row.mainContactEmail }}
            </div>
            <div class="text-gray-400 text-xs mt-1">
              {{ row.contactCount }} kontakt(er) totalt
            </div>
          </div>
        </template>
      </DataTable>

      <!-- Additional Statistics Panel -->
      <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 px-6">
        <div class="bg-white p-4 rounded-lg border">
          <h3 class="text-sm font-medium text-gray-500">Kunder per typ</h3>
          <div class="mt-2 space-y-1">
            <div class="text-xs">
              Kund: {{ customerStore.customersByType('Kund').length }}
            </div>
            <div class="text-xs">
              Prospect: {{ customerStore.customersByType('Prospect').length }}
            </div>
            <div class="text-xs">
              Leverantör: {{ customerStore.customersByType('Leverantör').length }}
            </div>
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg border">
          <h3 class="text-sm font-medium text-gray-500">Dataålder</h3>
          <div class="mt-2 text-xs text-gray-600">
            Senast uppdaterad:<br>
            {{ customerStore.lastUpdated ? new Date(customerStore.lastUpdated).toLocaleString('sv-SE') : 'Okänd' }}
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg border">
          <h3 class="text-sm font-medium text-gray-500">Kvalitetsmått</h3>
          <div class="mt-2 space-y-1">
            <div class="text-xs">
              Med huvudkontakt: {{ (customerStore.totalCustomers - customerStore.customersWithoutMainContact.length) }}
            </div>
            <div class="text-xs text-red-600">
              Utan huvudkontakt: {{ customerStore.customersWithoutMainContact.length }}
            </div>
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg border">
          <h3 class="text-sm font-medium text-gray-500">Snabbåtgärder</h3>
          <div class="mt-2 space-y-2">
            <button 
              @click="customerStore.fetchCustomers()"
              :disabled="customerStore.loading"
              class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 disabled:opacity-50"
            >
              Uppdatera data
            </button>
            <button 
              @click="customerStore.resetStore()"
              class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded hover:bg-gray-200 block"
            >
              Återställ filter
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 