<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNotifications } from '@/composables/useNotifications'
import { Building2, MapPin, Receipt } from 'lucide-vue-next'
import StandardHeader from '@/components/custom/StandardHeader.vue'
import StatusNotification from '@/components/custom/StatusNotification.vue'
import { useCustomerStorage, type Customer, type ContactPerson } from '@/storages/CustomerStorage'

// Import tab components
import TabAllmant from '../components/custom/TabAllmant.vue'
import TabBesok from '../components/custom/TabBesok.vue'
import TabFaktura from '../components/custom/TabFaktura.vue'
import ContactPersonsTable from '../components/custom/ContactPersonsTable.vue'
import AddContactDialog from '../components/custom/AddContactDialog.vue'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider } from '@/components/ui/tooltip'

interface BreadcrumbItem {
  label: string
  to?: string | { name: string; params?: Record<string, any> }
  isCurrentPage?: boolean
}

const route = useRoute()
const router = useRouter()
const { success: notificationSuccess, error: notificationError, confirm } = useNotifications()
const customerStore = useCustomerStorage()

// =============================================================================
// REACTIVE DATA USING IMPROVED STORE
// =============================================================================

// Get customer with all related data using the enhanced getter
const customerWithData = computed(() => {
  const customerId = Number(route.params.id)
  return customerStore.getCustomerWithContacts(customerId)
})

// Basic customer data
const customer = computed(() => customerStore.getCustomerById(Number(route.params.id)))

// Contact persons for this customer
const contactPersons = computed(() => 
  customerStore.getContactPersonsByCustomerId(Number(route.params.id))
)

// Main contact for this customer
const mainContact = computed(() => 
  customerStore.getMainContactByCustomerId(Number(route.params.id))
)

// Functional breadcrumbs with customer name
const breadcrumbs = computed((): BreadcrumbItem[] => [
  { label: 'Home', to: '/' },
  { label: 'Kunder', to: '/customers' },
  { label: customer.value?.companyName || 'Kunddetaljer', isCurrentPage: true }
])

// Action buttons for ActionBar
const actionButtons = computed(() => [
  {
    label: 'Spara nu',
    onClick: saveChanges,
    disabled: !hasChanges.value || customerStore.loading,
    class: 'text-xs h-8'
  },
  {
    label: 'Återställ',
    onClick: resetChanges,
    disabled: !hasChanges.value || customerStore.loading,
    variant: 'outline' as const,
    class: 'text-xs h-8'
  },
  {
    label: 'Tillbaka till kundlista',
    onClick: goBack,
    variant: 'outline' as const,
    class: 'text-xs h-8'
  }
])

const editedCustomer = ref<Customer | null>(customer.value ? { ...customer.value } : null)
const hasChanges = ref(false)
const showSaveConfirmation = ref(false)

// =============================================================================
// LIFECYCLE HOOKS
// =============================================================================

onMounted(() => {
  if (!customer.value) {
    router.push('/customers')
  } else {
    editedCustomer.value = { ...customer.value }
  }
})

// =============================================================================
// NAVIGATION METHODS
// =============================================================================

const goBack = () => {
  router.push('/customers')
}

// =============================================================================
// CUSTOMER DATA MANAGEMENT
// =============================================================================

// Markera att data har ändrats
const handleFieldChange = () => {
  hasChanges.value = true
}

const saveChanges = async () => {
  try {
    if (editedCustomer.value && customer.value) {
      // Basic validation - check required fields
      if (!editedCustomer.value.companyName || editedCustomer.value.companyName.trim() === '') {
        notificationError('Valideringsfel', 'Företagsnamn är obligatoriskt.')
        return
      }

      // Optional: Basic email validation if email is provided
      if (editedCustomer.value.companyEmail && editedCustomer.value.companyEmail.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(editedCustomer.value.companyEmail)) {
          notificationError('Valideringsfel', 'E-postadress har felaktigt format.')
          return
        }
      }

      // Update customer using improved store
      const result = await customerStore.updateCustomer(editedCustomer.value)
      
      if (result.success) {
        hasChanges.value = false
        showSaveConfirmation.value = true
        notificationSuccess('Ändringarna sparade', 'Kunduppgifterna har uppdaterats framgångsrikt.')
        
        // Dölj bekräftelsen efter 4 sekunder
        setTimeout(() => {
          showSaveConfirmation.value = false
        }, 4000)
      } else {
        notificationError('Fel vid sparande', result.error || 'Kunde inte spara ändringarna.')
      }
    }
  } catch (err) {
    notificationError(
      'Fel vid sparande',
      'Ett oväntat fel inträffade. Försök igen.'
    )
  }
}

const resetChanges = () => {
  if (customer.value) {
    editedCustomer.value = { ...customer.value }
    hasChanges.value = false
    showSaveConfirmation.value = true
    
    // Dölj bekräftelsen efter 3 sekunder
    setTimeout(() => {
      showSaveConfirmation.value = false
    }, 3000)
  }
}

// Handle field blur for validation
const handleFieldBlur = (fieldName: string) => {
  // Basic validation on blur for company name
  if (fieldName === 'companyName' && editedCustomer.value) {
    if (!editedCustomer.value.companyName || editedCustomer.value.companyName.trim() === '') {
      // Field is empty, but we'll handle this in save validation
    }
  }
  
  // Basic email validation on blur
  if (fieldName === 'companyEmail' && editedCustomer.value?.companyEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(editedCustomer.value.companyEmail)) {
      // Invalid email format, but we'll handle this in save validation
    }
  }
}

// =============================================================================
// CONTACT PERSON MANAGEMENT
// =============================================================================

const handleAddContact = async (contactData: Omit<ContactPerson, 'id' | 'customerId'>) => {
  if (!customer.value) return
  
  try {
    // Add contact person using improved store
    const result = await customerStore.addContactPerson({
      ...contactData,
      customerId: customer.value.id
    })
    
    if (result.success) {
      // If this should be the main contact, set it as such
      if (contactData.isMainContact && result.data) {
        const mainContactResult = await customerStore.setMainContact(
          customer.value.id, 
          result.data.id
        )
        
        if (mainContactResult.success) {
          notificationSuccess('Kontaktperson tillagd', 'Den nya kontaktpersonen har lagts till och angetts som huvudkontakt.')
        } else {
          notificationSuccess('Kontaktperson tillagd', 'Den nya kontaktpersonen har lagts till, men kunde inte anges som huvudkontakt.')
        }
      } else {
        notificationSuccess('Kontaktperson tillagd', 'Den nya kontaktpersonen har lagts till framgångsrikt.')
      }
    } else {
      notificationError('Fel vid tillägg', result.error || 'Kunde inte lägga till kontaktperson.')
    }
  } catch (error) {
    notificationError('Fel vid tillägg', 'Ett oväntat fel inträffade vid tillägg av kontaktperson.')
  }
}

const handleSendEmail = (email: string) => {
  window.location.href = `mailto:${email}`
}

const handleDeleteContact = async (id: number, name: string) => {
  const confirmed = await confirm(
    'Ta bort kontaktperson',
    `Är du säker på att du vill ta bort ${name} från kontaktlistan?`,
    {
      confirmText: 'Ta bort',
      cancelText: 'Avbryt',
      confirmVariant: 'destructive'
    }
  )

  if (confirmed) {
    try {
      const result = await customerStore.removeContactPerson(id)
      
      if (result.success) {
        notificationSuccess('Kontaktperson borttagen', `${name} har tagits bort från kontaktlistan.`)
      } else {
        notificationError('Fel vid borttagning', result.error || 'Kunde inte ta bort kontaktperson.')
      }
    } catch (error) {
      notificationError('Fel vid borttagning', 'Ett oväntat fel inträffade vid borttagning av kontaktperson.')
    }
  }
}

const handleEditContact = (person: ContactPerson) => {
  // TODO: Implement contact editing functionality
  console.log('Edit contact:', person)
  notificationSuccess('Redigera kontaktperson', `Redigeringsfunktion för ${person.name} kommer snart.`)
}

const handleSetMainContact = async (contactId: number, contactName: string) => {
  if (!customer.value) return
  
  try {
    const result = await customerStore.setMainContact(customer.value.id, contactId)
    
    if (result.success) {
      notificationSuccess('Huvudkontakt angiven', `${contactName} har angetts som huvudkontakt.`)
    } else {
      notificationError('Fel vid ändring', result.error || 'Kunde inte ange som huvudkontakt.')
    }
  } catch (error) {
    notificationError('Fel vid ändring', 'Ett oväntat fel inträffade vid ändring av huvudkontakt.')
  }
}

// =============================================================================
// ERROR HANDLING
// =============================================================================

// Clear any store errors when component unmounts
const clearStoreError = () => {
  customerStore.clearError()
}
</script>

<template>
  <div class="w-full">
    <!-- Store Error Display -->
    <div v-if="customerStore.error" class="mb-4">
      <StatusNotification
        type="error"
        :title="customerStore.error"
        message="Ett fel inträffade vid hantering av kunddata."
        :show="true"
        @close="clearStoreError"
      />
    </div>

    <!-- Loading State -->
    <div v-if="customerStore.loading" class="text-center py-8">
      <div class="text-gray-600">Laddar kunduppgifter...</div>
    </div>

    <!-- Main Content -->
    <div v-else-if="customer">
      <!-- Standard Header with enhanced data -->
      <StandardHeader
        :title="customer.companyName"
        :breadcrumbs="breadcrumbs"
        :show-stats="true"
        :stats="[
          { label: 'Kontaktpersoner', value: contactPersons.length.toString() },
          { label: 'Status', value: customer.status },
          { label: 'Typ', value: customer.companyType }
        ]"
      />

      <!-- Save confirmation -->
      <StatusNotification
        v-if="showSaveConfirmation"
        type="success"
        title="Ändringar sparade"
        message="Kunduppgifterna har uppdaterats framgångsrikt."
        :show="showSaveConfirmation"
        @close="showSaveConfirmation = false"
      />

      <!-- Action Bar (Simple version for customer details) -->
      <div class="flex justify-end gap-2 px-6 py-4">
        <button
          v-for="button in actionButtons"
          :key="button.label"
          :class="[
            'px-4 py-2 rounded text-sm font-medium transition-colors',
            button.variant === 'outline' 
              ? 'border border-gray-300 text-gray-700 hover:bg-gray-50' 
              : 'bg-blue-600 text-white hover:bg-blue-700',
            button.disabled ? 'opacity-50 cursor-not-allowed' : '',
            button.class || ''
          ]"
          :disabled="button.disabled"
          @click="button.onClick"
        >
          {{ button.label }}
        </button>
      </div>

      <!-- Customer Information Tabs -->
      <Tabs default-value="general" class="w-full mt-6 p-6">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="general" class="flex items-center gap-2">
            <Building2 class="h-4 w-4" />
            Allmänt
          </TabsTrigger>
          <TabsTrigger value="visit-address" class="flex items-center gap-2">
            <MapPin class="h-4 w-4" />
            Besöksadress
          </TabsTrigger>
          <TabsTrigger value="billing-address" class="flex items-center gap-2">
            <Receipt class="h-4 w-4" />
            Faktureringsadress
          </TabsTrigger>
        </TabsList>

        <!-- Allmänt flik -->
        <TabsContent value="general" class="mt-6">
          <TabAllmant 
            v-if="editedCustomer"
            :edited-customer="editedCustomer" 
            @field-change="handleFieldChange"
            @field-blur="handleFieldBlur"
          />
        </TabsContent>

        <!-- Besöksadress flik -->
        <TabsContent value="visit-address" class="mt-6">
          <TabBesok 
            v-if="editedCustomer"
            :edited-customer="editedCustomer" 
            @field-change="handleFieldChange"
            @field-blur="handleFieldBlur"
          />
        </TabsContent>

        <!-- Faktureringsadress flik -->
        <TabsContent value="billing-address" class="mt-6">
          <TabFaktura 
            v-if="editedCustomer"
            :edited-customer="editedCustomer" 
            @field-change="handleFieldChange"
            @field-blur="handleFieldBlur"
          />
        </TabsContent>
      </Tabs>

      <!-- Contact Persons Section -->
      <div class="mt-12">
        <Separator class="mb-6" />
        <div class="flex items-center justify-between mb-6 px-6">
          <div>
            <h2 class="text-lg font-semibold">Kontaktpersoner</h2>
            <p class="text-sm text-gray-600 mt-1">
              {{ contactPersons.length }} kontaktperson(er)
              <span v-if="mainContact" class="ml-2">
                • Huvudkontakt: {{ mainContact.name }}
              </span>
            </p>
          </div>
          <AddContactDialog @add-contact="handleAddContact" />
        </div>
        
        <TooltipProvider>
          <ContactPersonsTable 
            :contact-persons="contactPersons"
            @delete-contact="handleDeleteContact"
            @send-email="handleSendEmail"
            @edit-contact="handleEditContact"
            @set-main-contact="handleSetMainContact"
          />
        </TooltipProvider>
      </div>

      <!-- Customer Statistics (Enhanced) -->
      <div v-if="customerWithData" class="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 class="font-semibold mb-2">Kundstatistik</h3>
        <div class="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span class="text-gray-600">Totalt antal kontakter:</span>
            <span class="ml-2 font-medium">{{ customerWithData.contactCount }}</span>
          </div>
          <div>
            <span class="text-gray-600">Har huvudkontakt:</span>
            <span class="ml-2 font-medium">{{ customerWithData.mainContact ? 'Ja' : 'Nej' }}</span>
          </div>
          <div>
            <span class="text-gray-600">Senast uppdaterad:</span>
            <span class="ml-2 font-medium">
              {{ customerStore.lastUpdated ? new Date(customerStore.lastUpdated).toLocaleDateString('sv-SE') : 'Okänd' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Not Found -->
    <div v-else class="text-center py-8">
      <div class="text-gray-600">Kunden kunde inte hittas.</div>
      <button 
        @click="goBack" 
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Tillbaka till kundlista
      </button>
    </div>
  </div>
</template> 