<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useContactStore } from '@/stores/contactStore'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
import StandardHeader from '@/components/custom/StandardHeader.vue'
import ActionBar from '@/components/custom/ActionBar.vue'
import DataTable from '@/components/custom/DataTable.vue'

const router = useRouter()
const contactStore = useContactStore()

// Functional breadcrumbs
const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: `Kontaktpersoner (${contactStore.totalContacts})`, isCurrentPage: true }
]

// Column configuration for the data table
const columns = [
  {
    key: 'name',
    label: 'Fullständigt namn',
    sortable: true
  },
  {
    key: 'company',
    label: 'Företag',
    sortable: true
  },
  {
    key: 'phone',
    label: 'Telefon',
    sortable: false
  },
  {
    key: 'isMainContact',
    label: 'Status',
    sortable: true,
    type: 'badge' as const,
    badgeVariant: (status: string) => status === 'Huvudkontakt' ? 'default' : 'secondary'
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
  { value: 'true', label: 'Huvudkontakter' },
  { value: 'false', label: 'Kontakter' }
]

// Action buttons configuration
const actionButtons = [
  {
    label: 'Lägg till ny kontakt',
    icon: Plus,
    onClick: addNewContact,
    class: 'text-xs h-8'
  }
]

// Transform contacts data to match filter expectations
const transformedContacts = computed(() => {
  return contactStore.contacts.map(contact => ({
    ...contact,
    // Transform isMainContact boolean to string for filtering
    isMainContactFilter: contact.isMainContact.toString(),
    // Transform for display
    isMainContact: contact.isMainContact ? 'Huvudkontakt' : 'Kontakt'
  }))
})

// Stats for StandardHeader
const stats = computed(() => [
  {
    label: 'Totalt kontakter',
    value: contactStore.totalContacts.toString(),
    change: '+8%',
    trend: 'up' as const
  },
  {
    label: 'Huvudkontakter',
    value: contactStore.mainContacts.length.toString(),
    change: '+3%',
    trend: 'up' as const,
    color: 'text-green-600'
  },
  {
    label: 'Nya denna månad',
    value: '12',
    change: '+20%',
    trend: 'up' as const
  },
  {
    label: 'Aktiva företag',
    value: '45',
    change: '+5%',
    trend: 'up' as const,
    color: 'text-blue-600'
  }
])

const viewContactDetails = (contact: any) => {
  router.push(`/contacts/${contact.id}`)
}

function addNewContact() {
  // Här skulle vi navigera till en "lägg till kontakt" sida
  console.log('Lägg till ny kontakt')
}

const sendEmail = (contact: any, event: Event) => {
  window.location.href = `mailto:${contact.email}`
}

const deleteContact = (contact: any, event: Event) => {
  contactStore.removeContact(contact.id)
}
</script>

<template>
  <div class="w-full">
    <!-- Standard Header -->
    <StandardHeader
      title="Kontaktpersoner"
      :breadcrumbs="breadcrumbs"
      :show-stats="true"
      :stats="stats"
    />

    <!-- Search and Filter Bar -->
    <DataTable
      :data="transformedContacts"
      :columns="columns"
      :search-fields="['name', 'company', 'phone']"
      filter-field="isMainContactFilter"
      :filter-options="filterOptions"
      :on-row-click="viewContactDetails"
      :on-send-email="sendEmail"
      :on-delete="deleteContact"
      delete-confirm-message="Är du säker på att du vill radera denna kontakt?"
    >
      <template #filters="{ searchQuery, statusFilter, filterOptions, updateSearchQuery, updateStatusFilter }">
        <ActionBar
          :action-buttons="actionButtons"
          :search-query="searchQuery"
          :status-filter="statusFilter"
          search-placeholder="Sök på namn, företag eller telefon..."
          :filter-options="filterOptions"
          @update:search-query="updateSearchQuery"
          @update:status-filter="updateStatusFilter"
        />
      </template>
    </DataTable>
  </div>
</template> 