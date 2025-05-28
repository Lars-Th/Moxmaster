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
import { AlertTriangle, CheckCircle, Plus, Mail, Trash2, Phone, Star, Building2, Users, MapPin, Receipt } from 'lucide-vue-next'
import PageLayout from '@/components/ui/PageLayout.vue'

const route = useRoute()
const router = useRouter()
const { success, error } = useToast()

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

onMounted(() => {
  if (!customer.value) {
    router.push('/customers')
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
    // Här skulle vi normalt göra en API-anrop för att spara ändringarna
    Object.assign(customer.value, editedCustomer.value)
    hasChanges.value = false
    showSaveConfirmation.value = true
    
    // Dölj bekräftelsen efter 4 sekunder
    setTimeout(() => {
      showSaveConfirmation.value = false
    }, 4000)
  } catch (err) {
    error(
      'Fel vid sparande',
      'Kunde inte spara ändringarna. Försök igen.',
      { duration: 4000 }
    )
  }
}

const resetChanges = () => {
  editedCustomer.value = { ...customer.value }
  hasChanges.value = false
  showSaveConfirmation.value = true
  
  // Dölj bekräftelsen efter 3 sekunder
  setTimeout(() => {
    showSaveConfirmation.value = false
  }, 3000)
}

// Kontaktperson funktioner
const addContactPerson = () => {
  showAddContactDialog.value = true
}

const saveNewContact = () => {
  if (newContact.value.name && newContact.value.email) {
    const newId = Math.max(...contactPersons.value.map(p => p.id)) + 1
    
    contactPersons.value.push({
      id: newId,
      ...newContact.value
    })
    
    // Om den nya kontakten ska vara huvudkontakt, sätt den som huvudkontakt
    if (newContact.value.isMainContact) {
      setMainContact(newId)
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
    success('Kontaktperson tillagd', 'Den nya kontaktpersonen har lagts till framgångsrikt.')
  }
}

const sendEmail = (email: string) => {
  window.location.href = `mailto:${email}`
}

const deleteContactPerson = (id: number, name: string) => {
  contactPersons.value = contactPersons.value.filter(person => person.id !== id)
  success('Kontaktperson borttagen', `${name} har tagits bort från kontaktlistan.`)
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

    <!-- Varningsbox för osparade ändringar -->
    <div v-if="hasChanges" class="mx-6 mb-4 flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
      <AlertTriangle class="h-4 w-4 text-amber-600" />
      <p class="text-xs text-amber-800 font-medium">
        Osparade ändringar - Spara för att behålla ändringarna
      </p>
    </div>
    
    <!-- Bekräftelsebox för sparade ändringar -->
    <div v-if="showSaveConfirmation" class="mx-6 mb-4 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
      <CheckCircle class="h-4 w-4 text-green-600" />
      <p class="text-xs text-green-800 font-medium">
        Ändringar sparade! Företagsinformationen har uppdaterats framgångsrikt.
      </p>
    </div>
    
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
                  <div>
                    <Label for="customerNumber" class="text-xs font-medium text-gray-700">Kundnummer</Label>
                    <Input
                      id="customerNumber"
                      v-model="editedCustomer.customerNumber"
                      @input="handleFieldChange"
                      placeholder="KU-001"
                      class="text-xs h-8 mt-1"
                      style="font-size: 12px;"
                    />
                  </div>
                  
                  <div>
                    <Label for="companyName" class="text-xs font-medium text-gray-700">Företagsnamn *</Label>
                    <Input
                      id="companyName"
                      v-model="editedCustomer.companyName"
                      @input="handleFieldChange"
                      placeholder="Ange företagsnamn"
                      class="text-xs h-8 mt-1 font-medium"
                      style="font-size: 12px;"
                    />
                  </div>
                  
                  <div>
                    <Label for="organizationNumber" class="text-xs font-medium text-gray-700">Organisationsnummer</Label>
                    <Input
                      id="organizationNumber"
                      v-model="editedCustomer.organizationNumber"
                      @input="handleFieldChange"
                      placeholder="556123-4567"
                      class="text-xs h-8 mt-1"
                      style="font-size: 12px;"
                    />
                  </div>
                  
                  <div>
                    <Label for="referenceNumber" class="text-xs font-medium text-gray-700">Referensnummer</Label>
                    <Input
                      id="referenceNumber"
                      v-model="editedCustomer.referenceNumber"
                      @input="handleFieldChange"
                      placeholder="Internt referensnummer"
                      class="text-xs h-8 mt-1"
                      style="font-size: 12px;"
                    />
                  </div>
                </div>
              </div>

              <!-- Kolumn 2: Kontaktinfo -->
              <div class="space-y-4">
                <h3 class="font-semibold text-sm text-gray-900 mb-4">Kontaktinformation</h3>
                
                <div class="space-y-3">
                  <div>
                    <Label for="switchboardNumber" class="text-xs font-medium text-gray-700">Växelnummer</Label>
                    <Input
                      id="switchboardNumber"
                      v-model="editedCustomer.switchboardNumber"
                      @input="handleFieldChange"
                      placeholder="08-123 45 67"
                      class="text-xs h-8 mt-1"
                      style="font-size: 12px;"
                    />
                  </div>
                  
                  <div>
                    <Label for="companyEmail" class="text-xs font-medium text-gray-700">E-postadress</Label>
                    <Input
                      id="companyEmail"
                      v-model="editedCustomer.companyEmail"
                      @input="handleFieldChange"
                      type="email"
                      placeholder="info@företag.se"
                      class="text-xs h-8 mt-1"
                      style="font-size: 12px;"
                    />
                  </div>
                  
                  <div>
                    <Label for="website" class="text-xs font-medium text-gray-700">Webbplats</Label>
                    <Input
                      id="website"
                      v-model="editedCustomer.website"
                      @input="handleFieldChange"
                      placeholder="www.företag.se"
                      class="text-xs h-8 mt-1"
                      style="font-size: 12px;"
                    />
                  </div>
                </div>
              </div>

              <!-- Kolumn 3: Status -->
              <div class="space-y-4">
                <h3 class="font-semibold text-sm text-gray-900 mb-4">Status & Klassificering</h3>
                
                <div class="space-y-3">
                  <div>
                    <Label for="companyType" class="text-xs font-medium text-gray-700">Typ av företag</Label>
                    <Select
                      v-model="editedCustomer.companyType"
                      @update:model-value="handleFieldChange"
                    >
                      <SelectTrigger class="text-xs h-8 mt-1 flex items-center justify-between" style="font-size: 12px;">
                        <SelectValue placeholder="Välj typ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kund">Kund</SelectItem>
                        <SelectItem value="Leverantör">Leverantör</SelectItem>
                        <SelectItem value="ÅF">ÅF (Återförsäljare)</SelectItem>
                        <SelectItem value="Prospect">Prospect</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label for="status" class="text-xs font-medium text-gray-700">Status</Label>
                    <Select
                      v-model="editedCustomer.status"
                      @update:model-value="handleFieldChange"
                    >
                      <SelectTrigger class="text-xs h-8 mt-1 flex items-center justify-between" style="font-size: 12px;">
                        <SelectValue placeholder="Välj status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aktiv">Aktiv</SelectItem>
                        <SelectItem value="Inaktiv">Inaktiv</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Anteckningar -->
            <div class="space-y-4">
              <h3 class="font-semibold text-sm text-gray-900 mb-4">Anteckningar om bolaget</h3>
              
              <div>
                <Label for="companyNotes" class="text-xs font-medium text-gray-700">Anteckningar</Label>
                <Textarea
                  id="companyNotes"
                  v-model="editedCustomer.companyNotes"
                  @input="handleFieldChange"
                  rows="4"
                  placeholder="Lägg till anteckningar om företaget, viktiga kontakter, avtal, etc..."
                  class="resize-none text-xs mt-1"
                  style="font-size: 12px;"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <!-- Besöksadress flik -->
        <TabsContent value="visit-address" class="mt-6">
          <div class="max-w-2xl">
            <h3 class="font-semibold text-sm text-gray-900 mb-6">Besöksadress</h3>
            
            <div class="space-y-4">
              <div>
                <Label for="streetAddress" class="text-xs font-medium text-gray-700">Gatuadress</Label>
                <Input
                  id="streetAddress"
                  v-model="editedCustomer.streetAddress"
                  @input="handleFieldChange"
                  placeholder="Gatunamn 123"
                  class="text-xs h-8 mt-1"
                  style="font-size: 12px;"
                />
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <Label for="postalCode" class="text-xs font-medium text-gray-700">Postnummer</Label>
                  <Input
                    id="postalCode"
                    v-model="editedCustomer.postalCode"
                    @input="handleFieldChange"
                    placeholder="12345"
                    class="text-xs h-8 mt-1"
                    style="font-size: 12px;"
                  />
                </div>
                
                <div>
                  <Label for="city" class="text-xs font-medium text-gray-700">Ort</Label>
                  <Input
                    id="city"
                    v-model="editedCustomer.city"
                    @input="handleFieldChange"
                    placeholder="Stockholm"
                    class="text-xs h-8 mt-1"
                    style="font-size: 12px;"
                  />
                </div>
              </div>
              
              <div>
                <Label for="country" class="text-xs font-medium text-gray-700">Land</Label>
                <Input
                  id="country"
                  v-model="editedCustomer.country"
                  @input="handleFieldChange"
                  value="Sverige"
                  readonly
                  class="bg-gray-50 text-xs h-8 mt-1"
                  style="font-size: 12px;"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <!-- Faktureringsadress flik -->
        <TabsContent value="billing-address" class="mt-6">
          <div class="max-w-2xl">
            <h3 class="font-semibold text-sm text-gray-900 mb-6">Faktureringsadress</h3>
            
            <div class="space-y-4">
              <div>
                <Label for="billingStreetAddress" class="text-xs font-medium text-gray-700">Gatuadress</Label>
                <Input
                  id="billingStreetAddress"
                  v-model="editedCustomer.billingStreetAddress"
                  @input="handleFieldChange"
                  placeholder="Gatunamn 123 eller Box 456"
                  class="text-xs h-8 mt-1"
                  style="font-size: 12px;"
                />
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <Label for="billingPostalCode" class="text-xs font-medium text-gray-700">Postnummer</Label>
                  <Input
                    id="billingPostalCode"
                    v-model="editedCustomer.billingPostalCode"
                    @input="handleFieldChange"
                    placeholder="12345"
                    class="text-xs h-8 mt-1"
                    style="font-size: 12px;"
                  />
                </div>
                
                <div>
                  <Label for="billingCity" class="text-xs font-medium text-gray-700">Ort</Label>
                  <Input
                    id="billingCity"
                    v-model="editedCustomer.billingCity"
                    @input="handleFieldChange"
                    placeholder="Stockholm"
                    class="text-xs h-8 mt-1"
                    style="font-size: 12px;"
                  />
                </div>
              </div>
              
              <div>
                <Label for="billingCountry" class="text-xs font-medium text-gray-700">Land</Label>
                <Input
                  id="billingCountry"
                  v-model="editedCustomer.billingCountry"
                  @input="handleFieldChange"
                  value="Sverige"
                  readonly
                  class="bg-gray-50 text-xs h-8 mt-1"
                  style="font-size: 12px;"
                />
              </div>
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
                  <Input
                    id="contact-name"
                    v-model="newContact.name"
                    class="col-span-3 text-xs h-8"
                    style="font-size: 12px;"
                    placeholder="Förnamn Efternamn"
                  />
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
                  <Input
                    id="contact-phone"
                    v-model="newContact.phone"
                    class="col-span-3 text-xs h-8"
                    style="font-size: 12px;"
                    placeholder="070-123 45 67"
                  />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for="contact-email" class="text-right text-xs">E-post *</Label>
                  <Input
                    id="contact-email"
                    v-model="newContact.email"
                    type="email"
                    class="col-span-3 text-xs h-8"
                    style="font-size: 12px;"
                    placeholder="namn@företag.se"
                  />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for="contact-main" class="text-right text-xs">Huvudkontakt</Label>
                  <div class="col-span-3 flex items-center space-x-2">
                    <Switch
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