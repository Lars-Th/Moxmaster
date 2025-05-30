<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { Separator } from '@/components/ui/separator'
import { useToast } from '@/composables/useToast'
import { useNotifications } from '@/composables/useNotifications'
import { useValidation } from '@/composables/useValidation'
import FormField from '@/components/ui/FormField.vue'
import { AlertTriangle, CheckCircle, Plus, Mail, Trash2, Phone, Star, Building2, Users, MapPin, Receipt } from 'lucide-vue-next'
import PageLayout from '@/components/ui/PageLayout.vue'

const route = useRoute()
const router = useRouter()
const { success, error } = useToast()
const { 
  warning, 
  success: notifySuccess, 
  clearLocalNotificationsOfType, 
  confirm,
  globalSuccess,
  error: notifyError
} = useNotifications()

// Valideringssystem
const {
  validateAll,
  validateField,
  touchField,
  hasError,
  getError,
  isRequired,
  clearErrors,
  hasAnyErrors
} = useValidation()

// Valideringsschema för kundformulär
const customerValidationSchema = {
  companyName: {
    rules: ['required'],
    displayName: 'Företagsnamn'
  },
  customerNumber: {
    rules: ['required'],
    displayName: 'Kundnummer'
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
  },
  streetAddress: {
    rules: ['required'],
    displayName: 'Gatuadress'
  },
  postalCode: {
    rules: ['required', 'postalCode'],
    displayName: 'Postnummer'
  },
  city: {
    rules: ['required'],
    displayName: 'Ort'
  },
  billingStreetAddress: {
    rules: ['required'],
    displayName: 'Faktureringsadress'
  },
  billingPostalCode: {
    rules: ['required', 'postalCode'],
    displayName: 'Faktureringspostnummer'
  },
  billingCity: {
    rules: ['required'],
    displayName: 'Faktureringsort'
  },
  companyType: {
    rules: ['required'],
    displayName: 'Typ av företag'
  },
  status: {
    rules: ['required'],
    displayName: 'Status'
  }
}

// Valideringsschema för kontaktperson
const contactValidationSchema = {
  name: {
    rules: ['required'],
    displayName: 'Namn'
  },
  email: {
    rules: ['required', 'email'],
    displayName: 'E-postadress'
  },
  phone: {
    rules: ['phone'],
    displayName: 'Telefonnummer'
  }
}

// Separat validering för kontaktperson
const {
  validateAll: validateContactAll,
  validateField: validateContactField,
  touchField: touchContactField,
  hasError: hasContactError,
  getError: getContactError,
  isRequired: isContactRequired,
  clearErrors: clearContactErrors
} = useValidation()

// Utökad kunddata med alla nya fält
const customers = [
  { 
    id: 1, 
    customerNumber: 'KU-001',
    companyName: 'Tech Solutions AB',
    organizationNumber: '556123-4567',
    referenceNumber: 'REF-001',
    streetAddress: 'Teknikgatan 1',
    postalCode: '11122',
    city: 'Stockholm',
    country: 'Sverige',
    billingStreetAddress: 'Teknikgatan 1',
    billingPostalCode: '11122',
    billingCity: 'Stockholm',
    billingCountry: 'Sverige',
    switchboardNumber: '08-123 45 67',
    companyEmail: 'info@techsolutions.se',
    website: 'www.techsolutions.se',
    companyNotes: 'VIP-kund sedan 2020. Stort företag med många avdelningar.',
    companyType: 'Kund',
    status: 'Aktiv'
  },
  { 
    id: 2, 
    customerNumber: 'KU-002',
    companyName: 'Digital Innovations',
    organizationNumber: '556234-5678',
    referenceNumber: 'REF-002',
    streetAddress: 'Digitalvägen 5',
    postalCode: '41234',
    city: 'Göteborg',
    country: 'Sverige',
    billingStreetAddress: 'Box 123',
    billingPostalCode: '41200',
    billingCity: 'Göteborg',
    billingCountry: 'Sverige',
    switchboardNumber: '031-234 56 78',
    companyEmail: 'info@digitalinnovations.se',
    website: 'www.digitalinnovations.se',
    companyNotes: 'Intresserad av nya produkter. Snabb betalare.',
    companyType: 'Kund',
    status: 'Aktiv'
  },
  { 
    id: 3, 
    customerNumber: 'KU-003',
    companyName: 'Future Systems',
    organizationNumber: '556345-6789',
    referenceNumber: '',
    streetAddress: 'Framtidsgatan 10',
    postalCode: '21234',
    city: 'Malmö',
    country: 'Sverige',
    billingStreetAddress: 'Framtidsgatan 10',
    billingPostalCode: '21234',
    billingCity: 'Malmö',
    billingCountry: 'Sverige',
    switchboardNumber: '040-345 67 89',
    companyEmail: 'info@futuresystems.se',
    website: 'www.futuresystems.se',
    companyNotes: 'Kontakta om 3 månader. Potentiell stor order.',
    companyType: 'Prospect',
    status: 'Inaktiv'
  },
  { 
    id: 4, 
    customerNumber: 'KU-004',
    companyName: 'Smart Tech',
    organizationNumber: '556456-7890',
    referenceNumber: 'REF-004',
    streetAddress: 'Smartgatan 15',
    postalCode: '75234',
    city: 'Uppsala',
    country: 'Sverige',
    billingStreetAddress: 'Smartgatan 15',
    billingPostalCode: '75234',
    billingCity: 'Uppsala',
    billingCountry: 'Sverige',
    switchboardNumber: '018-456 78 90',
    companyEmail: 'info@smarttech.se',
    website: 'www.smarttech.se',
    companyNotes: 'Ny kund 2024. Mycket professionella.',
    companyType: 'Kund',
    status: 'Aktiv'
  },
  { 
    id: 5, 
    customerNumber: 'KU-005',
    companyName: 'Nordic Solutions',
    organizationNumber: '556567-8901',
    referenceNumber: 'REF-005',
    streetAddress: 'Nordgatan 20',
    postalCode: '25234',
    city: 'Helsingborg',
    country: 'Sverige',
    billingStreetAddress: 'Box 456',
    billingPostalCode: '25200',
    billingCity: 'Helsingborg',
    billingCountry: 'Sverige',
    switchboardNumber: '042-567 89 01',
    companyEmail: 'info@nordicsolutions.se',
    website: 'www.nordicsolutions.se',
    companyNotes: 'Föredrar e-postkontakt. Bra långsiktig relation.',
    companyType: 'Kund',
    status: 'Aktiv'
  }
]

// Kontaktpersoner för företaget
const contactPersons = ref([
  { id: 1, name: 'Anna Andersson', title: 'VD', email: 'anna.andersson@techsolutions.se', phone: '070-123 45 67', department: 'Ledning', isMainContact: true },
  { id: 2, name: 'Erik Svensson', title: 'IT-chef', email: 'erik.svensson@techsolutions.se', phone: '070-234 56 78', department: 'IT', isMainContact: false },
  { id: 3, name: 'Maria Lindberg', title: 'Inköpschef', email: 'maria.lindberg@techsolutions.se', phone: '070-345 67 89', department: 'Inköp', isMainContact: false },
  { id: 4, name: 'Johan Nilsson', title: 'Projektledare', email: 'johan.nilsson@techsolutions.se', phone: '070-456 78 90', department: 'Projekt', isMainContact: false }
])

const customer = ref(customers.find(c => c.id === Number(route.params.id)))
const editedCustomer = ref({ ...customer.value })
const hasChanges = ref(false)
let warningNotificationId = null

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

onMounted(() => {
  if (!customer.value) {
    router.push('/customers')
  }
})

const goBack = () => {
  router.push('/customers')
}

// Markera att data har ändrats
const handleFieldChange = (fieldName = null) => {
  if (!hasChanges.value) {
    hasChanges.value = true
    // Visa LOKAL varning för osparade ändringar (försvinner vid navigering)
    warningNotificationId = warning(
      'Osparade ändringar',
      'Spara för att behålla ändringarna'
    )
  }
  
  // Validera fältet om det är specificerat
  if (fieldName && customerValidationSchema[fieldName]) {
    validateField(
      fieldName,
      editedCustomer.value[fieldName],
      customerValidationSchema[fieldName].rules,
      customerValidationSchema[fieldName].displayName
    )
  }
}

// Hantera när användaren lämnar ett fält (blur)
const handleFieldBlur = (fieldName) => {
  touchField(fieldName)
  if (customerValidationSchema[fieldName]) {
    validateField(
      fieldName,
      editedCustomer.value[fieldName],
      customerValidationSchema[fieldName].rules,
      customerValidationSchema[fieldName].displayName
    )
  }
}

const saveChanges = () => {
  // Validera alla fält innan sparande
  const isValid = validateAll(editedCustomer.value, customerValidationSchema)
  
  if (!isValid) {
    // Markera alla fält som "touched" för att visa fel
    Object.keys(customerValidationSchema).forEach(fieldName => {
      touchField(fieldName)
    })
    
    notifyError(
      'Valideringsfel',
      'Kontrollera att alla obligatoriska fält är korrekt ifyllda.'
    )
    return
  }

  try {
    // Här skulle vi normalt göra en API-anrop för att spara ändringarna
    Object.assign(customer.value, editedCustomer.value)
    hasChanges.value = false
    
    // Ta bort lokala varningsnotifikationer och rensa valideringsfel
    clearLocalNotificationsOfType('warning')
    clearErrors()
    warningNotificationId = null
    
    // Visa GLOBAL framgång (syns även om användaren navigerar)
    globalSuccess(
      'Ändringar sparade!',
      'Företagsinformationen har uppdaterats framgångsrikt.'
    )
  } catch (err) {
    notifyError(
      'Fel vid sparande',
      'Kunde inte spara ändringarna. Försök igen.'
    )
  }
}

const resetChanges = () => {
  editedCustomer.value = { ...customer.value }
  hasChanges.value = false
  
  // Ta bort lokala varningsnotifikationer och rensa valideringsfel
  clearLocalNotificationsOfType('warning')
  clearErrors()
  warningNotificationId = null
  
  // Visa lokal bekräftelse (försvinner vid navigering)
  notifySuccess(
    'Ändringar återställda',
    'Alla ändringar har återställts till ursprungliga värden.'
  )
}

// Kontaktperson funktioner
const addContactPerson = () => {
  showAddContactDialog.value = true
}

const saveNewContact = () => {
  // Validera kontaktpersonens data
  const isValid = validateContactAll(newContact.value, contactValidationSchema)
  
  if (!isValid) {
    // Markera alla fält som "touched" för att visa fel
    Object.keys(contactValidationSchema).forEach(fieldName => {
      touchContactField(fieldName)
    })
    
    notifyError(
      'Valideringsfel',
      'Kontrollera att alla obligatoriska fält är korrekt ifyllda.'
    )
    return
  }

  const newId = Math.max(...contactPersons.value.map(p => p.id)) + 1
  
  contactPersons.value.push({
    id: newId,
    ...newContact.value
  })
  
  // Om den nya kontakten ska vara huvudkontakt, sätt den som huvudkontakt
  if (newContact.value.isMainContact) {
    setMainContact(newId)
  }
  
  // Återställ formuläret och rensa valideringsfel
  newContact.value = {
    name: '',
    title: '',
    email: '',
    phone: '',
    department: '',
    isMainContact: false
  }
  
  clearContactErrors()
  showAddContactDialog.value = false
  success('Kontaktperson tillagd', 'Den nya kontaktpersonen har lagts till framgångsrikt.')
}

// Hantera fältändringar för kontaktperson
const handleContactFieldChange = (fieldName) => {
  if (contactValidationSchema[fieldName]) {
    validateContactField(
      fieldName,
      newContact.value[fieldName],
      contactValidationSchema[fieldName].rules,
      contactValidationSchema[fieldName].displayName
    )
  }
}

// Hantera när användaren lämnar ett kontaktfält (blur)
const handleContactFieldBlur = (fieldName) => {
  touchContactField(fieldName)
  if (contactValidationSchema[fieldName]) {
    validateContactField(
      fieldName,
      newContact.value[fieldName],
      contactValidationSchema[fieldName].rules,
      contactValidationSchema[fieldName].displayName
    )
  }
}

const sendEmail = (email: string) => {
  window.location.href = `mailto:${email}`
}

const deleteContactPerson = async (id: number, name: string) => {
  const confirmed = await confirm(
    'Ta bort kontaktperson',
    `Är du säker på att du vill ta bort ${name} från kontaktlistan? Denna åtgärd kan inte ångras.`,
    {
      confirmText: 'Ta bort',
      cancelText: 'Avbryt',
      confirmVariant: 'destructive'
    }
  )
  
  if (confirmed) {
    contactPersons.value = contactPersons.value.filter(person => person.id !== id)
    success('Kontaktperson borttagen', `${name} har tagits bort från kontaktlistan.`)
  }
}

const setMainContact = (personId: number) => {
  // Sätt alla till false först
  contactPersons.value.forEach(person => {
    person.isMainContact = false
  })
  // Sätt den valda personen som huvudkontakt
  const person = contactPersons.value.find(p => p.id === personId)
  if (person) {
    person.isMainContact = true
  }
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
    
    <!-- Flikar för kunddetaljer -->
    <div v-if="customer" class="px-6 mt-6">
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
          <div class="space-y-8">
            <!-- Grundläggande företagsinformation -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Kolumn 1: Företagsinfo -->
              <div class="space-y-4">
                <h3 class="font-semibold text-sm text-gray-900 mb-4">Företagsinformation</h3>
                
                <div class="space-y-3">
                  <FormField
                    label="Kundnummer"
                    field-name="customerNumber"
                    :required="isRequired('customerNumber', customerValidationSchema)"
                    :error="getError('customerNumber')"
                    tooltip="Unikt nummer för att identifiera kunden i systemet"
                  >
                    <Input
                      id="customerNumber"
                      v-model="editedCustomer.customerNumber"
                      @input="() => handleFieldChange('customerNumber')"
                      @blur="() => handleFieldBlur('customerNumber')"
                      placeholder="KU-001"
                      :class="[
                        'text-xs h-8 mt-1',
                        hasError('customerNumber') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      ]"
                      style="font-size: 12px;"
                    />
                  </FormField>
                  
                  <FormField
                    label="Företagsnamn"
                    field-name="companyName"
                    :required="isRequired('companyName', customerValidationSchema)"
                    :error="getError('companyName')"
                    tooltip="Det officiella namnet på företaget"
                  >
                    <Input
                      id="companyName"
                      v-model="editedCustomer.companyName"
                      @input="() => handleFieldChange('companyName')"
                      @blur="() => handleFieldBlur('companyName')"
                      placeholder="Ange företagsnamn"
                      :class="[
                        'text-xs h-8 mt-1 font-medium',
                        hasError('companyName') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      ]"
                      style="font-size: 12px;"
                    />
                  </FormField>
                  
                  <FormField
                    label="Organisationsnummer"
                    field-name="organizationNumber"
                    :required="isRequired('organizationNumber', customerValidationSchema)"
                    :error="getError('organizationNumber')"
                    tooltip="Företagets officiella organisationsnummer (format: 556123-4567)"
                  >
                    <Input
                      id="organizationNumber"
                      v-model="editedCustomer.organizationNumber"
                      @input="() => handleFieldChange('organizationNumber')"
                      @blur="() => handleFieldBlur('organizationNumber')"
                      placeholder="556123-4567"
                      :class="[
                        'text-xs h-8 mt-1',
                        hasError('organizationNumber') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      ]"
                      style="font-size: 12px;"
                    />
                  </FormField>
                  
                  <FormField
                    label="Referensnummer"
                    field-name="referenceNumber"
                    :required="isRequired('referenceNumber', customerValidationSchema)"
                    :error="getError('referenceNumber')"
                    tooltip="Internt referensnummer för enklare hantering"
                  >
                    <Input
                      id="referenceNumber"
                      v-model="editedCustomer.referenceNumber"
                      @input="() => handleFieldChange('referenceNumber')"
                      @blur="() => handleFieldBlur('referenceNumber')"
                      placeholder="Internt referensnummer"
                      :class="[
                        'text-xs h-8 mt-1',
                        hasError('referenceNumber') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      ]"
                      style="font-size: 12px;"
                    />
                  </FormField>
                </div>
              </div>

              <!-- Kolumn 2: Kontaktinfo -->
              <div class="space-y-4">
                <h3 class="font-semibold text-sm text-gray-900 mb-4">Kontaktinformation</h3>
                
                <div class="space-y-3">
                  <FormField
                    label="Växelnummer"
                    field-name="switchboardNumber"
                    :required="isRequired('switchboardNumber', customerValidationSchema)"
                    :error="getError('switchboardNumber')"
                    tooltip="Företagets huvudtelefonnummer"
                  >
                    <Input
                      id="switchboardNumber"
                      v-model="editedCustomer.switchboardNumber"
                      @input="() => handleFieldChange('switchboardNumber')"
                      @blur="() => handleFieldBlur('switchboardNumber')"
                      placeholder="08-123 45 67"
                      :class="[
                        'text-xs h-8 mt-1',
                        hasError('switchboardNumber') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      ]"
                      style="font-size: 12px;"
                    />
                  </FormField>
                  
                  <FormField
                    label="E-postadress"
                    field-name="companyEmail"
                    :required="isRequired('companyEmail', customerValidationSchema)"
                    :error="getError('companyEmail')"
                    tooltip="Företagets officiella e-postadress"
                  >
                    <Input
                      id="companyEmail"
                      v-model="editedCustomer.companyEmail"
                      @input="() => handleFieldChange('companyEmail')"
                      @blur="() => handleFieldBlur('companyEmail')"
                      type="email"
                      placeholder="info@företag.se"
                      :class="[
                        'text-xs h-8 mt-1',
                        hasError('companyEmail') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      ]"
                      style="font-size: 12px;"
                    />
                  </FormField>
                  
                  <FormField
                    label="Webbplats"
                    field-name="website"
                    :required="isRequired('website', customerValidationSchema)"
                    :error="getError('website')"
                    tooltip="Företagets webbplats (med eller utan http://)"
                  >
                    <Input
                      id="website"
                      v-model="editedCustomer.website"
                      @input="() => handleFieldChange('website')"
                      @blur="() => handleFieldBlur('website')"
                      placeholder="www.företag.se"
                      :class="[
                        'text-xs h-8 mt-1',
                        hasError('website') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      ]"
                      style="font-size: 12px;"
                    />
                  </FormField>
                </div>
              </div>

              <!-- Kolumn 3: Status -->
              <div class="space-y-4">
                <h3 class="font-semibold text-sm text-gray-900 mb-4">Status & Klassificering</h3>
                
                <div class="space-y-3">
                  <FormField
                    label="Typ av företag"
                    field-name="companyType"
                    :required="isRequired('companyType', customerValidationSchema)"
                    :error="getError('companyType')"
                    tooltip="Klassificering av företagets relation till er"
                  >
                    <Select
                      v-model="editedCustomer.companyType"
                      @update:model-value="() => handleFieldChange('companyType')"
                    >
                      <SelectTrigger 
                        :class="[
                          'text-xs h-8 mt-1 flex items-center justify-between',
                          hasError('companyType') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                        ]" 
                        style="font-size: 12px;"
                        @blur="() => handleFieldBlur('companyType')"
                      >
                        <SelectValue placeholder="Välj typ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kund">Kund</SelectItem>
                        <SelectItem value="Leverantör">Leverantör</SelectItem>
                        <SelectItem value="ÅF">ÅF (Återförsäljare)</SelectItem>
                        <SelectItem value="Prospect">Prospect</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  
                  <FormField
                    label="Status"
                    field-name="status"
                    :required="isRequired('status', customerValidationSchema)"
                    :error="getError('status')"
                    tooltip="Aktuell status för företagsrelationen"
                  >
                    <Select
                      v-model="editedCustomer.status"
                      @update:model-value="() => handleFieldChange('status')"
                    >
                      <SelectTrigger 
                        :class="[
                          'text-xs h-8 mt-1 flex items-center justify-between',
                          hasError('status') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                        ]" 
                        style="font-size: 12px;"
                        @blur="() => handleFieldBlur('status')"
                      >
                        <SelectValue placeholder="Välj status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aktiv">Aktiv</SelectItem>
                        <SelectItem value="Inaktiv">Inaktiv</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>
              </div>
            </div>

            <!-- Anteckningar -->
            <div class="space-y-4">
              <h3 class="font-semibold text-sm text-gray-900 mb-4">Anteckningar om bolaget</h3>
              
              <FormField
                label="Anteckningar"
                field-name="companyNotes"
                :required="isRequired('companyNotes', customerValidationSchema)"
                :error="getError('companyNotes')"
                description="Lägg till anteckningar om företaget, viktiga kontakter, avtal, etc."
              >
                <Textarea
                  id="companyNotes"
                  v-model="editedCustomer.companyNotes"
                  @input="() => handleFieldChange('companyNotes')"
                  @blur="() => handleFieldBlur('companyNotes')"
                  rows="4"
                  placeholder="Lägg till anteckningar om företaget, viktiga kontakter, avtal, etc..."
                  :class="[
                    'resize-none text-xs mt-1',
                    hasError('companyNotes') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  ]"
                  style="font-size: 12px;"
                />
              </FormField>
            </div>
          </div>
        </TabsContent>

        <!-- Besöksadress flik -->
        <TabsContent value="visit-address" class="mt-6">
          <div class="max-w-2xl">
            <h3 class="font-semibold text-sm text-gray-900 mb-6">Besöksadress</h3>
            
            <div class="space-y-4">
              <FormField
                label="Gatuadress"
                field-name="streetAddress"
                :required="isRequired('streetAddress', customerValidationSchema)"
                :error="getError('streetAddress')"
                tooltip="Företagets besöksadress"
              >
                <Input
                  id="streetAddress"
                  v-model="editedCustomer.streetAddress"
                  @input="() => handleFieldChange('streetAddress')"
                  @blur="() => handleFieldBlur('streetAddress')"
                  placeholder="Gatunamn 123"
                  :class="[
                    'text-xs h-8 mt-1',
                    hasError('streetAddress') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  ]"
                  style="font-size: 12px;"
                />
              </FormField>
              
              <div class="grid grid-cols-2 gap-4">
                <FormField
                  label="Postnummer"
                  field-name="postalCode"
                  :required="isRequired('postalCode', customerValidationSchema)"
                  :error="getError('postalCode')"
                  tooltip="5-siffrigt postnummer"
                >
                  <Input
                    id="postalCode"
                    v-model="editedCustomer.postalCode"
                    @input="() => handleFieldChange('postalCode')"
                    @blur="() => handleFieldBlur('postalCode')"
                    placeholder="12345"
                    :class="[
                      'text-xs h-8 mt-1',
                      hasError('postalCode') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                    ]"
                    style="font-size: 12px;"
                  />
                </FormField>
                
                <FormField
                  label="Ort"
                  field-name="city"
                  :required="isRequired('city', customerValidationSchema)"
                  :error="getError('city')"
                  tooltip="Ort för besöksadressen"
                >
                  <Input
                    id="city"
                    v-model="editedCustomer.city"
                    @input="() => handleFieldChange('city')"
                    @blur="() => handleFieldBlur('city')"
                    placeholder="Stockholm"
                    :class="[
                      'text-xs h-8 mt-1',
                      hasError('city') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                    ]"
                    style="font-size: 12px;"
                  />
                </FormField>
              </div>
              
              <FormField
                label="Land"
                field-name="country"
                :required="isRequired('country', customerValidationSchema)"
                :error="getError('country')"
                tooltip="Land för besöksadressen"
              >
                <Input
                  id="country"
                  v-model="editedCustomer.country"
                  @input="() => handleFieldChange('country')"
                  @blur="() => handleFieldBlur('country')"
                  value="Sverige"
                  readonly
                  :class="[
                    'bg-gray-50 text-xs h-8 mt-1',
                    hasError('country') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  ]"
                  style="font-size: 12px;"
                />
              </FormField>
            </div>
          </div>
        </TabsContent>

        <!-- Faktureringsadress flik -->
        <TabsContent value="billing-address" class="mt-6">
          <div class="max-w-2xl">
            <h3 class="font-semibold text-sm text-gray-900 mb-6">Faktureringsadress</h3>
            
            <div class="space-y-4">
              <FormField
                label="Gatuadress"
                field-name="billingStreetAddress"
                :required="isRequired('billingStreetAddress', customerValidationSchema)"
                :error="getError('billingStreetAddress')"
                tooltip="Adress för fakturor (kan vara postbox)"
              >
                <Input
                  id="billingStreetAddress"
                  v-model="editedCustomer.billingStreetAddress"
                  @input="() => handleFieldChange('billingStreetAddress')"
                  @blur="() => handleFieldBlur('billingStreetAddress')"
                  placeholder="Gatunamn 123 eller Box 456"
                  :class="[
                    'text-xs h-8 mt-1',
                    hasError('billingStreetAddress') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  ]"
                  style="font-size: 12px;"
                />
              </FormField>
              
              <div class="grid grid-cols-2 gap-4">
                <FormField
                  label="Postnummer"
                  field-name="billingPostalCode"
                  :required="isRequired('billingPostalCode', customerValidationSchema)"
                  :error="getError('billingPostalCode')"
                  tooltip="5-siffrigt postnummer för faktureringsadressen"
                >
                  <Input
                    id="billingPostalCode"
                    v-model="editedCustomer.billingPostalCode"
                    @input="() => handleFieldChange('billingPostalCode')"
                    @blur="() => handleFieldBlur('billingPostalCode')"
                    placeholder="12345"
                    :class="[
                      'text-xs h-8 mt-1',
                      hasError('billingPostalCode') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                    ]"
                    style="font-size: 12px;"
                  />
                </FormField>
                
                <FormField
                  label="Ort"
                  field-name="billingCity"
                  :required="isRequired('billingCity', customerValidationSchema)"
                  :error="getError('billingCity')"
                  tooltip="Ort för faktureringsadressen"
                >
                  <Input
                    id="billingCity"
                    v-model="editedCustomer.billingCity"
                    @input="() => handleFieldChange('billingCity')"
                    @blur="() => handleFieldBlur('billingCity')"
                    placeholder="Stockholm"
                    :class="[
                      'text-xs h-8 mt-1',
                      hasError('billingCity') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                    ]"
                    style="font-size: 12px;"
                  />
                </FormField>
              </div>
              
              <FormField
                label="Land"
                field-name="billingCountry"
                :required="isRequired('billingCountry', customerValidationSchema)"
                :error="getError('billingCountry')"
                tooltip="Land för faktureringsadressen"
              >
                <Input
                  id="billingCountry"
                  v-model="editedCustomer.billingCountry"
                  @input="() => handleFieldChange('billingCountry')"
                  @blur="() => handleFieldBlur('billingCountry')"
                  value="Sverige"
                  readonly
                  :class="[
                    'bg-gray-50 text-xs h-8 mt-1',
                    hasError('billingCountry') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  ]"
                  style="font-size: 12px;"
                />
              </FormField>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <!-- Kontaktpersoner sektion - alltid synlig under flikarna -->
      <div class="mt-12">
        <Separator class="mb-6" />
        <div class="flex items-center justify-between mb-6 px-6">
          <h2 class="text-lg font-semibold">Kontaktpersoner</h2>
          <Dialog v-model:open="showAddContactDialog">
            <DialogTrigger asChild>
              <Button @click="addContactPerson" class="text-xs h-8">
                <Plus class="h-3 w-3 mr-1" />
                Lägg till kontaktperson
              </Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Lägg till ny kontaktperson</DialogTitle>
                <DialogDescription>
                  Fyll i informationen för den nya kontaktpersonen.
                </DialogDescription>
              </DialogHeader>
              <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for="contact-name" class="text-right text-xs">Namn *</Label>
                  <div class="col-span-3">
                    <FormField
                      label=""
                      field-name="name"
                      :required="isContactRequired('name', contactValidationSchema)"
                      :error="getContactError('name')"
                    >
                      <Input
                        id="contact-name"
                        v-model="newContact.name"
                        @input="() => handleContactFieldChange('name')"
                        @blur="() => handleContactFieldBlur('name')"
                        :class="[
                          'text-xs h-8',
                          hasContactError('name') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                        ]"
                        style="font-size: 12px;"
                        placeholder="Förnamn Efternamn"
                      />
                    </FormField>
                  </div>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for="contact-title" class="text-right text-xs">Titel</Label>
                  <Input
                    id="contact-title"
                    v-model="newContact.title"
                    class="col-span-3 text-xs h-8"
                    style="font-size: 12px;"
                    placeholder="VD, IT-chef, etc."
                  />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for="contact-department" class="text-right text-xs">Avdelning</Label>
                  <Input
                    id="contact-department"
                    v-model="newContact.department"
                    class="col-span-3 text-xs h-8"
                    style="font-size: 12px;"
                    placeholder="IT, Ekonomi, etc."
                  />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for="contact-phone" class="text-right text-xs">Telefon</Label>
                  <div class="col-span-3">
                    <FormField
                      label=""
                      field-name="phone"
                      :required="isContactRequired('phone', contactValidationSchema)"
                      :error="getContactError('phone')"
                    >
                      <Input
                        id="contact-phone"
                        v-model="newContact.phone"
                        @input="() => handleContactFieldChange('phone')"
                        @blur="() => handleContactFieldBlur('phone')"
                        :class="[
                          'text-xs h-8',
                          hasContactError('phone') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                        ]"
                        style="font-size: 12px;"
                        placeholder="070-123 45 67"
                      />
                    </FormField>
                  </div>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for="contact-email" class="text-right text-xs">E-post *</Label>
                  <div class="col-span-3">
                    <FormField
                      label=""
                      field-name="email"
                      :required="isContactRequired('email', contactValidationSchema)"
                      :error="getContactError('email')"
                    >
                      <Input
                        id="contact-email"
                        v-model="newContact.email"
                        @input="() => handleContactFieldChange('email')"
                        @blur="() => handleContactFieldBlur('email')"
                        type="email"
                        :class="[
                          'text-xs h-8',
                          hasContactError('email') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                        ]"
                        style="font-size: 12px;"
                        placeholder="namn@företag.se"
                      />
                    </FormField>
                  </div>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for="contact-main" class="text-right text-xs">Huvudkontakt</Label>
                  <div class="col-span-3 flex items-center space-x-2">
                    <Checkbox
                      id="contact-main"
                      v-model:checked="newContact.isMainContact"
                    />
                    <Label for="contact-main" class="text-xs text-gray-600">
                      Sätt som huvudkontakt
                    </Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" @click="saveNewContact" class="text-xs h-8">
                  Spara kontaktperson
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>

    <!-- Kontaktpersonstabell - full bredd som kundlistan -->
    <TooltipProvider>
        <div class="border-t border-gray-200">
          <Table>
            <TableHeader class="bg-gray-100 border-t border-gray-300">
              <TableRow>
                <TableHead class="bg-gray-100 text-xs">Namn</TableHead>
                <TableHead class="bg-gray-100 text-xs">Titel</TableHead>
                <TableHead class="bg-gray-100 text-xs">Avdelning</TableHead>
                <TableHead class="bg-gray-100 text-xs">Telefon</TableHead>
                <TableHead class="bg-gray-100 text-xs">Huvudkontakt</TableHead>
                <TableHead class="bg-gray-100 text-xs text-right">Åtgärder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
                v-for="person in contactPersons" 
                :key="person.id" 
                class="hover:bg-gray-50"
              >
                <TableCell class="text-xs font-medium text-slate-700">{{ person.name }}</TableCell>
                <TableCell class="text-xs">{{ person.title }}</TableCell>
                <TableCell class="text-xs">{{ person.department }}</TableCell>
                <TableCell class="text-xs">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a :href="`tel:${person.phone}`" class="text-blue-600 hover:underline">
                        {{ person.phone }}
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ring {{ person.name }}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell class="text-xs">
                  <Badge 
                    v-if="person.isMainContact" 
                    variant="secondary" 
                    class="text-xs px-2 py-0 bg-green-100 text-green-700 border border-green-200"
                  >
                    <Star class="h-3 w-3 mr-1 text-green-600 fill-green-600" />
                    Ja
                  </Badge>
                  <span v-else class="text-xs text-gray-500">-</span>
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          @click="sendEmail(person.email)"
                          class="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Mail class="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Skicka e-post till {{ person.name }}</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              class="p-1 text-red-600 hover:text-red-800"
                              :disabled="person.isMainContact"
                              :class="{ 'opacity-50 cursor-not-allowed': person.isMainContact }"
                            >
                              <Trash2 class="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{{ person.isMainContact ? 'Kan inte ta bort huvudkontakt' : `Ta bort ${person.name}` }}</p>
                          </TooltipContent>
                        </Tooltip>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Ta bort kontaktperson</AlertDialogTitle>
                          <AlertDialogDescription>
                            Är du säker på att du vill ta bort {{ person.name }} från kontaktlistan? 
                            Denna åtgärd kan inte ångras.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel class="text-xs h-8">Avbryt</AlertDialogCancel>
                          <AlertDialogAction 
                            @click="deleteContactPerson(person.id, person.name)"
                            class="text-xs h-8 bg-red-600 hover:bg-red-700"
                          >
                            Ta bort
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div class="border-b border-gray-300"></div>
        </div>
      </TooltipProvider>
  </PageLayout>
</template> 