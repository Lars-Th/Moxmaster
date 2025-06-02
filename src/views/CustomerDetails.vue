<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/composables/useToast'
import { useNotifications } from '@/composables/useNotifications'
import { useValidation } from '@/composables/useValidation'
import { Building2, MapPin, Receipt } from 'lucide-vue-next'
import StandardHeader from '@/components/custom/StandardHeader.vue'
import ActionBar from '@/components/custom/ActionBar.vue'
import StatusNotification from '@/components/custom/StatusNotification.vue'
import { useCustomerStorage, type Customer } from '@/storages/customerStorage'

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
const { success, error } = useToast()
const { success: notificationSuccess, error: notificationError, confirm } = useNotifications()
const { validateAll, validateField, touchField, hasError, getError, isRequired, clearErrors, allErrors } = useValidation()
const customerStore = useCustomerStorage()

// Get customer from store using computed to make it reactive
const customer = computed(() => customerStore.getCustomerById(Number(route.params.id)))
const contactPersons = computed(() => customerStore.getContactPersonsByCustomerId(Number(route.params.id)))

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
    disabled: !hasChanges.value,
    class: 'text-xs h-8'
  },
  {
    label: 'Återställ',
    onClick: resetChanges,
    disabled: !hasChanges.value,
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

// Dialog för ny kontaktperson
const showAddContactDialog = ref(false)
const newContact = ref({
  name: '',
  title: '',
  email: '',
  phone: '',
  department: '',
  isMainContact: false
})

// Validation schema for customer data
const validationSchema = {
  companyName: {
    rules: ['required'],
    displayName: 'Företagsnamn'
  },
  organizationNumber: {
    rules: ['organizationNumber'],
    displayName: 'Organisationsnummer'
  },
  companyEmail: {
    rules: ['email'],
    displayName: 'E-postadress'
  },
  website: {
    rules: ['website'],
    displayName: 'Webbplats'
  },
  switchboardNumber: {
    rules: ['phone'],
    displayName: 'Växelnummer'
  }
}

onMounted(() => {
  if (!customer.value) {
    router.push('/customers')
  } else {
    editedCustomer.value = { ...customer.value }
  }
})

const goBack = () => {
  router.push('/customers')
}

// Markera att data har ändrats
const handleFieldChange = () => {
  hasChanges.value = true
}

const saveChanges = () => {
  try {
    if (editedCustomer.value && customer.value) {
      // Validate customer data
      const isValid = validateAll(editedCustomer.value, validationSchema)
      
      if (!isValid) {
        Object.keys(validationSchema).forEach(touchField)
        notificationError('Valideringsfel', 'Kontrollera att alla fält är korrekt ifyllda innan du sparar.')
        return
      }

      // Update customer in store
      customerStore.updateCustomer(editedCustomer.value)
      hasChanges.value = false
      showSaveConfirmation.value = true
      clearErrors()
      
      // Dölj bekräftelsen efter 4 sekunder
      setTimeout(() => {
        showSaveConfirmation.value = false
      }, 4000)
    }
  } catch (err) {
    notificationError(
      'Fel vid sparande',
      'Kunde inte spara ändringarna. Försök igen.'
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
  if (editedCustomer.value && validationSchema[fieldName as keyof typeof validationSchema]) {
    touchField(fieldName)
    const config = validationSchema[fieldName as keyof typeof validationSchema]
    validateField(
      fieldName,
      editedCustomer.value[fieldName as keyof typeof editedCustomer.value],
      config.rules,
      config.displayName
    )
  }
}

// Kontaktperson funktioner
const addContactPerson = () => {
  showAddContactDialog.value = true
}

const saveNewContact = () => {
  if (newContact.value.name && newContact.value.email && customer.value) {
    // Add contact person to store
    customerStore.addContactPerson({
      ...newContact.value,
      customerId: customer.value.id
    })
    
    // Om den nya kontakten ska vara huvudkontakt, sätt den som huvudkontakt
    if (newContact.value.isMainContact) {
      // Get the newly added contact (it will have the highest ID)
      const allContacts = customerStore.getContactPersonsByCustomerId(customer.value.id)
      const newContactId = Math.max(...allContacts.map(p => p.id))
      customerStore.setMainContact(customer.value.id, newContactId)
    }
    
    // Återställ formuläret
    newContact.value = {
      name: '',
      title: '',
      email: '',
      phone: '',
      department: '',
      isMainContact: false
    }
    
    showAddContactDialog.value = false
    notificationSuccess('Kontaktperson tillagd', 'Den nya kontaktpersonen har lagts till framgångsrikt.')
  }
}

const handleAddContact = (contact: any) => {
  if (customer.value) {
    // Add contact person to store
    customerStore.addContactPerson({
      ...contact,
      customerId: customer.value.id
    })
    
    // Om den nya kontakten ska vara huvudkontakt, sätt den som huvudkontakt
    if (contact.isMainContact) {
      // Get the newly added contact (it will have the highest ID)
      const allContacts = customerStore.getContactPersonsByCustomerId(customer.value.id)
      const newContactId = Math.max(...allContacts.map(p => p.id))
      customerStore.setMainContact(customer.value.id, newContactId)
    }
    
    notificationSuccess('Kontaktperson tillagd', 'Den nya kontaktpersonen har lagts till framgångsrikt.')
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
    customerStore.removeContactPerson(id)
    notificationSuccess('Kontaktperson borttagen', `${name} har tagits bort från kontaktlistan.`)
  }
}

const handleEditContact = (person: any) => {
  // Navigera till en redigeringssida eller öppna en modal för redigering
  // För nu loggar vi bara kontaktpersonen
  console.log('Edit contact:', person)
  notificationSuccess('Redigera kontaktperson', `Redigeringsfunktion för ${person.name} kommer snart.`)
}
</script>

<template>
  <div class="w-full">
    <!-- Standard Header -->
    <StandardHeader
      title="Kunder"
      :breadcrumbs="breadcrumbs"
    />

    <!-- Action Bar with customer-specific actions -->
    <ActionBar :action-buttons="actionButtons" />

    <!-- Varningsbox för osparade ändringar -->
    <StatusNotification
      v-if="hasChanges"
      type="warning"
      message="Osparade ändringar - Spara för att behålla ändringarna"
    />
    
    <!-- Bekräftelsebox för sparade ändringar -->
    <StatusNotification
      v-if="showSaveConfirmation"
      type="success"
      message="Ändringar sparade! Företagsinformationen har uppdaterats framgångsrikt."
    />
    
    <!-- Flikar för kunddetaljer -->
    <div v-if="customer && editedCustomer" class="px-6 mt-6">
      <Tabs default-value="general" class="w-full">
        <TabsList class="grid w-full grid-cols-3 h-8">
          <TabsTrigger value="general" class="flex items-center gap-1 text-xs h-7">
            <Building2 class="h-3 w-3" />
            Allmänt
          </TabsTrigger>
          <TabsTrigger value="visit-address" class="flex items-center gap-1 text-xs h-7">
            <MapPin class="h-3 w-3" />
            Besök
          </TabsTrigger>
          <TabsTrigger value="billing-address" class="flex items-center gap-1 text-xs h-7">
            <Receipt class="h-3 w-3" />
            Faktura
          </TabsTrigger>
        </TabsList>

        <!-- Allmän information flik -->
        <TabsContent value="general" class="mt-6">
          <TabAllmant 
            :edited-customer="editedCustomer" 
            :errors="allErrors"
            @field-change="handleFieldChange"
            @field-blur="handleFieldBlur"
          />
        </TabsContent>

        <!-- Besöksadress flik -->
        <TabsContent value="visit-address" class="mt-6">
          <TabBesok 
            :edited-customer="editedCustomer" 
            @field-change="handleFieldChange"
            @field-blur="handleFieldBlur"
          />
        </TabsContent>

        <!-- Faktureringsadress flik -->
        <TabsContent value="billing-address" class="mt-6">
          <TabFaktura 
            :edited-customer="editedCustomer" 
            @field-change="handleFieldChange"
            @field-blur="handleFieldBlur"
          />
        </TabsContent>
      </Tabs>

      <!-- Kontaktpersoner sektion -->
      <div class="mt-12">
        <Separator class="mb-6" />
        <div class="flex items-center justify-between mb-6 px-6">
          <h2 class="text-lg font-semibold">Kontaktpersoner</h2>
          <AddContactDialog @add-contact="handleAddContact" />
        </div>
        
        <TooltipProvider>
          <ContactPersonsTable 
            :contact-persons="contactPersons"
            @delete-contact="handleDeleteContact"
            @send-email="handleSendEmail"
            @edit-contact="handleEditContact"
          />
        </TooltipProvider>
      </div>
    </div>
  </div>
</template> 