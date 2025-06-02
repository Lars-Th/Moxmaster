<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNotifications } from '@/composables/useNotifications'
import { Building2, User, Mail, Phone } from 'lucide-vue-next'
import StandardHeader from '@/components/custom/StandardHeader.vue'
import StatusNotification from '@/components/custom/StatusNotification.vue'
import { useCustomerStorage, type Customer, type ContactPerson } from '@/storages/CustomerStorage'
import { Separator } from '@/components/ui/separator'

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
// REACTIVE DATA USING CUSTOMER STORE
// =============================================================================

// Get contact person data
const contact = computed(() => customerStore.getContactPersonById(Number(route.params.id)))

// Get the customer this contact belongs to
const customer = computed(() => {
  if (!contact.value) return null
  return customerStore.getCustomerById(contact.value.customerId)
})

// Get other contacts from the same customer
const relatedContacts = computed(() => {
  if (!contact.value) return []
  return customerStore.getContactPersonsByCustomerId(contact.value.customerId)
    .filter(c => c.id !== contact.value!.id)
})

// Get main contact for this customer
const customerMainContact = computed(() => {
  if (!contact.value) return null
  return customerStore.getMainContactByCustomerId(contact.value.customerId)
})

// Functional breadcrumbs
const breadcrumbs = computed((): BreadcrumbItem[] => [
  { label: 'Home', to: '/' },
  { label: 'Kontaktpersoner', to: '/contacts' },
  { label: contact.value?.name || 'Kontaktdetaljer', isCurrentPage: true }
])

// Action buttons
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
    label: 'Tillbaka till kontaktlista',
    onClick: goBack,
    variant: 'outline' as const,
    class: 'text-xs h-8'
  },
  {
    label: 'Visa kund',
    onClick: viewCustomer,
    variant: 'outline' as const,
    class: 'text-xs h-8'
  }
])

const editedContact = ref<ContactPerson | null>(contact.value ? { ...contact.value } : null)
const hasChanges = ref(false)
const showSaveConfirmation = ref(false)

// =============================================================================
// LIFECYCLE HOOKS
// =============================================================================

onMounted(() => {
  if (!contact.value) {
    router.push('/contacts')
  } else {
    editedContact.value = { ...contact.value }
  }
})

// =============================================================================
// NAVIGATION METHODS
// =============================================================================

const goBack = () => {
  router.push('/contacts')
}

const viewCustomer = () => {
  if (customer.value) {
    router.push(`/customers/${customer.value.id}`)
  }
}

// =============================================================================
// CONTACT DATA MANAGEMENT
// =============================================================================

const handleFieldChange = () => {
  hasChanges.value = true
}

const saveChanges = async () => {
  try {
    if (editedContact.value && contact.value) {
      // Basic validation
      if (!editedContact.value.name || editedContact.value.name.trim() === '') {
        notificationError('Valideringsfel', 'Namn är obligatoriskt.')
        return
      }

      if (editedContact.value.email && editedContact.value.email.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(editedContact.value.email)) {
          notificationError('Valideringsfel', 'E-postadress har felaktigt format.')
          return
        }
      }

      // Update contact using store
      const result = await customerStore.updateContactPerson(editedContact.value)
      
      if (result.success) {
        hasChanges.value = false
        showSaveConfirmation.value = true
        notificationSuccess('Ändringarna sparade', 'Kontaktuppgifterna har uppdaterats framgångsrikt.')
        
        setTimeout(() => {
          showSaveConfirmation.value = false
        }, 4000)
      } else {
        notificationError('Fel vid sparande', result.error || 'Kunde inte spara ändringarna.')
      }
    }
  } catch (err) {
    notificationError('Fel vid sparande', 'Ett oväntat fel inträffade. Försök igen.')
  }
}

const resetChanges = () => {
  if (contact.value) {
    editedContact.value = { ...contact.value }
    hasChanges.value = false
    showSaveConfirmation.value = true
    
    setTimeout(() => {
      showSaveConfirmation.value = false
    }, 3000)
  }
}

const handleFieldBlur = (fieldName: string) => {
  // Basic validation on blur
  if (fieldName === 'name' && editedContact.value) {
    if (!editedContact.value.name || editedContact.value.name.trim() === '') {
      // Field is empty, but we'll handle this in save validation
    }
  }
  
  if (fieldName === 'email' && editedContact.value?.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(editedContact.value.email)) {
      // Invalid email format, but we'll handle this in save validation
    }
  }
}

// =============================================================================
// CONTACT ACTIONS
// =============================================================================

const setAsMainContact = async () => {
  if (!contact.value || !customer.value) return
  
  try {
    const result = await customerStore.setMainContact(customer.value.id, contact.value.id)
    
    if (result.success) {
      notificationSuccess('Huvudkontakt angiven', `${contact.value.name} har angetts som huvudkontakt för ${customer.value.companyName}.`)
    } else {
      notificationError('Fel vid ändring', result.error || 'Kunde inte ange som huvudkontakt.')
    }
  } catch (error) {
    notificationError('Fel vid ändring', 'Ett oväntat fel inträffade vid ändring av huvudkontakt.')
  }
}

const deleteContact = async () => {
  if (!contact.value) return
  
  const confirmed = await confirm(
    'Ta bort kontaktperson',
    `Är du säker på att du vill ta bort ${contact.value.name}? Detta kan inte ångras.`,
    {
      confirmText: 'Ta bort',
      cancelText: 'Avbryt',
      confirmVariant: 'destructive'
    }
  )

  if (confirmed) {
    try {
      const result = await customerStore.removeContactPerson(contact.value.id)
      
      if (result.success) {
        notificationSuccess('Kontaktperson borttagen', `${contact.value.name} har tagits bort.`)
        router.push('/contacts')
      } else {
        notificationError('Fel vid borttagning', result.error || 'Kunde inte ta bort kontaktperson.')
      }
    } catch (error) {
      notificationError('Fel vid borttagning', 'Ett oväntat fel inträffade vid borttagning av kontaktperson.')
    }
  }
}

const sendEmail = () => {
  if (contact.value?.email) {
    window.location.href = `mailto:${contact.value.email}`
  }
}

const callContact = () => {
  if (contact.value?.phone) {
    window.location.href = `tel:${contact.value.phone}`
  }
}

// =============================================================================
// ERROR HANDLING
// =============================================================================

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
        message="Ett fel inträffade vid hantering av kontaktdata."
        :show="true"
        @close="clearStoreError"
      />
    </div>

    <!-- Loading State -->
    <div v-if="customerStore.loading" class="text-center py-8">
      <div class="text-gray-600">Laddar kontaktuppgifter...</div>
    </div>

    <!-- Main Content -->
    <div v-else-if="contact">
      <!-- Standard Header -->
      <StandardHeader
        :title="contact.name"
        :breadcrumbs="breadcrumbs"
        :show-stats="true"
        :stats="[
          { label: 'Titel', value: contact.title },
          { label: 'Avdelning', value: contact.department },
          { label: 'Status', value: contact.isMainContact ? 'Huvudkontakt' : 'Kontakt' }
        ]"
      />

      <!-- Save confirmation -->
      <StatusNotification
        v-if="showSaveConfirmation"
        type="success"
        title="Ändningar sparade"
        message="Kontaktuppgifterna har uppdaterats framgångsrikt."
        :show="showSaveConfirmation"
        @close="showSaveConfirmation = false"
      />

      <!-- Action Bar -->
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

      <!-- Contact Information Tabs -->
      <Tabs default-value="general" class="w-full mt-6 p-6">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="general" class="flex items-center gap-2">
            <User class="h-4 w-4" />
            Allmänt
          </TabsTrigger>
          <TabsTrigger value="communication" class="flex items-center gap-2">
            <Mail class="h-4 w-4" />
            Kommunikation
          </TabsTrigger>
          <TabsTrigger value="company" class="flex items-center gap-2">
            <Building2 class="h-4 w-4" />
            Företagsinformation
          </TabsTrigger>
        </TabsList>

        <!-- General Information Tab -->
        <TabsContent value="general" class="mt-6">
          <div v-if="editedContact" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Fullständigt namn *
                </label>
                <input
                  v-model="editedContact.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @input="handleFieldChange"
                  @blur="handleFieldBlur('name')"
                />
              </div>

              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Titel
                </label>
                <input
                  v-model="editedContact.title"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @input="handleFieldChange"
                />
              </div>

              <!-- Department -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Avdelning
                </label>
                <input
                  v-model="editedContact.department"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @input="handleFieldChange"
                />
              </div>

              <!-- Main Contact Status -->
              <div>
                <label class="flex items-center">
                  <input
                    v-model="editedContact.isMainContact"
                    type="checkbox"
                    class="mr-2"
                    @change="handleFieldChange"
                  />
                  <span class="text-sm font-medium text-gray-700">Huvudkontakt</span>
                </label>
              </div>
            </div>
          </div>
        </TabsContent>

        <!-- Communication Tab -->
        <TabsContent value="communication" class="mt-6">
          <div v-if="editedContact" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  E-postadress
                </label>
                <div class="flex">
                  <input
                    v-model="editedContact.email"
                    type="email"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @input="handleFieldChange"
                    @blur="handleFieldBlur('email')"
                  />
                  <button
                    @click="sendEmail"
                    :disabled="!editedContact.email"
                    class="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 disabled:opacity-50"
                  >
                    <Mail class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Telefonnummer
                </label>
                <div class="flex">
                  <input
                    v-model="editedContact.phone"
                    type="tel"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @input="handleFieldChange"
                  />
                  <button
                    @click="callContact"
                    :disabled="!editedContact.phone"
                    class="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 disabled:opacity-50"
                  >
                    <Phone class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="flex gap-4 pt-4">
              <button
                @click="sendEmail"
                :disabled="!editedContact.email"
                class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                <Mail class="h-4 w-4" />
                Skicka e-post
              </button>
              <button
                @click="callContact"
                :disabled="!editedContact.phone"
                class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                <Phone class="h-4 w-4" />
                Ring
              </button>
            </div>
          </div>
        </TabsContent>

        <!-- Company Information Tab -->
        <TabsContent value="company" class="mt-6">
          <div v-if="customer" class="space-y-6">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold mb-4">Företagsinformation</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span class="text-sm font-medium text-gray-500">Företag:</span>
                  <p class="text-sm font-medium">{{ customer.companyName }}</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-500">Ort:</span>
                  <p class="text-sm">{{ customer.city }}</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-500">Status:</span>
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-medium rounded',
                    customer.status === 'Aktiv' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  ]">
                    {{ customer.status }}
                  </span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-500">Typ:</span>
                  <p class="text-sm">{{ customer.companyType }}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <!-- Contact Actions Section -->
      <div class="mt-12">
        <Separator class="mb-6" />
        <div class="px-6">
          <h2 class="text-lg font-semibold mb-4">Åtgärder</h2>
          <div class="flex gap-4">
            <button
              v-if="!contact.isMainContact"
              @click="setAsMainContact"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Ange som huvudkontakt
            </button>
            <button
              @click="deleteContact"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Ta bort kontakt
            </button>
          </div>
        </div>
      </div>

      <!-- Related Contacts Section -->
      <div v-if="relatedContacts.length > 0" class="mt-8">
        <Separator class="mb-6" />
        <div class="px-6">
          <h2 class="text-lg font-semibold mb-4">Andra kontakter från samma företag</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="relatedContact in relatedContacts"
              :key="relatedContact.id"
              class="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              @click="router.push(`/contacts/${relatedContact.id}`)"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-medium">{{ relatedContact.name }}</h3>
                  <p class="text-sm text-gray-600">{{ relatedContact.title }}</p>
                  <p class="text-sm text-gray-500">{{ relatedContact.department }}</p>
                </div>
                <span
                  v-if="relatedContact.isMainContact"
                  class="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                >
                  Huvudkontakt
                </span>
              </div>
              <div class="mt-2 space-y-1">
                <p class="text-xs text-gray-500">{{ relatedContact.email }}</p>
                <p class="text-xs text-gray-500">{{ relatedContact.phone }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Statistics -->
      <div class="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 class="font-semibold mb-2">Kontaktstatistik</h3>
        <div class="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span class="text-gray-600">Kontakter från samma företag:</span>
            <span class="ml-2 font-medium">{{ relatedContacts.length + 1 }}</span>
          </div>
          <div>
            <span class="text-gray-600">Är huvudkontakt:</span>
            <span class="ml-2 font-medium">{{ contact.isMainContact ? 'Ja' : 'Nej' }}</span>
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

    <!-- Contact Not Found -->
    <div v-else class="text-center py-8">
      <div class="text-gray-600">Kontaktpersonen kunde inte hittas.</div>
      <button 
        @click="goBack" 
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Tillbaka till kontaktlista
      </button>
    </div>
  </div>
</template> 