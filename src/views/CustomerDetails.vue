<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/composables/useToast'
import { useNotifications } from '@/composables/useNotifications'
import { useValidation } from '@/composables/useValidation'
import { Building2, MapPin, Receipt } from 'lucide-vue-next'
import PageLayout from '@/components/custom/PageLayout.vue'
import StatusNotification from '@/components/custom/StatusNotification.vue'
import { useCustomerStore, type Customer } from '@/stores/customerStore'

// Import tab components
import TabAllmant from '../components/custom/TabAllmant.vue'
import TabBesok from '../components/custom/TabBesok.vue'
import TabFaktura from '../components/custom/TabFaktura.vue'
import Kontaktpersoner from '../components/custom/KontaktPersoner.vue'

const route = useRoute()
const router = useRouter()
const { success, error } = useToast()
const { success: notificationSuccess, error: notificationError, confirm } = useNotifications()
const { validateAll, validateField, touchField, hasError, getError, isRequired, clearErrors, allErrors } = useValidation()
const customerStore = useCustomerStore()

// Get customer from store using computed to make it reactive
const customer = computed(() => customerStore.getCustomerById(Number(route.params.id)))
const contactPersons = computed(() => customerStore.getContactPersonsByCustomerId(Number(route.params.id)))

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
  <PageLayout
    title="Kunder"
    breadcrumbs="Home / Kunder / Kunddetaljer"
    :show-stats="false"
  >
    <template #actions>
      <div class="space-x-2">
        <Button variant="default" @click="saveChanges" :disabled="!hasChanges" class="text-xs h-8">
          Spara nu
        </Button>
        <Button variant="outline" @click="resetChanges" :disabled="!hasChanges" class="text-xs h-8">
          Återställ
        </Button>
        <Button variant="outline" @click="goBack" class="text-xs h-8">
          Tillbaka till kundlista
        </Button>
      </div>
    </template>

    <template #filters>
      <!-- Inga filter för kunddetaljer -->
    </template>

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
      <Kontaktpersoner 
        :contact-persons="contactPersons"
        @add-contact="handleAddContact"
        @delete-contact="handleDeleteContact"
        @send-email="handleSendEmail"
        @edit-contact="handleEditContact"
      />
    </div>
  </PageLayout>
</template> 