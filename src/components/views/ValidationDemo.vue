<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useValidation } from '@/composables/useValidation'
import { useNotifications } from '@/composables/useNotifications'
import FormField from '@/components/ui/FormField.vue'
import PageLayout from '@/components/ui/PageLayout.vue'

const { success, error } = useNotifications()

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

// Formulärdata
const formData = ref({
  companyName: '',
  email: '',
  phone: '',
  organizationNumber: '',
  website: '',
  postalCode: '',
  description: '',
  category: ''
})

// Valideringsschema
const validationSchema = {
  companyName: {
    rules: ['required'],
    displayName: 'Företagsnamn'
  },
  email: {
    rules: ['required', 'email'],
    displayName: 'E-postadress'
  },
  phone: {
    rules: ['phone'],
    displayName: 'Telefonnummer'
  },
  organizationNumber: {
    rules: ['organizationNumber'],
    displayName: 'Organisationsnummer'
  },
  website: {
    rules: ['website'],
    displayName: 'Webbplats'
  },
  postalCode: {
    rules: ['required', 'postalCode'],
    displayName: 'Postnummer'
  },
  description: {
    rules: [],
    displayName: 'Beskrivning'
  },
  category: {
    rules: ['required'],
    displayName: 'Kategori'
  }
}

// Hantera fältändringar
const handleFieldChange = (fieldName) => {
  if (validationSchema[fieldName]) {
    validateField(
      fieldName,
      formData.value[fieldName],
      validationSchema[fieldName].rules,
      validationSchema[fieldName].displayName
    )
  }
}

// Hantera när användaren lämnar ett fält
const handleFieldBlur = (fieldName) => {
  touchField(fieldName)
  if (validationSchema[fieldName]) {
    validateField(
      fieldName,
      formData.value[fieldName],
      validationSchema[fieldName].rules,
      validationSchema[fieldName].displayName
    )
  }
}

// Skicka formulär
const submitForm = () => {
  const isValid = validateAll(formData.value, validationSchema)
  
  if (!isValid) {
    // Markera alla fält som "touched" för att visa fel
    Object.keys(validationSchema).forEach(fieldName => {
      touchField(fieldName)
    })
    
    error(
      'Valideringsfel',
      'Kontrollera att alla obligatoriska fält är korrekt ifyllda.'
    )
    return
  }

  success(
    'Formulär skickat!',
    'Alla fält är korrekt ifyllda och formuläret har skickats.'
  )
}

// Återställ formulär
const resetForm = () => {
  formData.value = {
    companyName: '',
    email: '',
    phone: '',
    organizationNumber: '',
    website: '',
    postalCode: '',
    description: '',
    category: ''
  }
  clearErrors()
}

// Fyll i testdata
const fillTestData = () => {
  formData.value = {
    companyName: 'Test AB',
    email: 'test@example.com',
    phone: '08-123 45 67',
    organizationNumber: '556123-4567',
    website: 'www.test.se',
    postalCode: '12345',
    description: 'Detta är en testbeskrivning',
    category: 'Kund'
  }
  clearErrors()
}

// Fyll i felaktig data
const fillInvalidData = () => {
  formData.value = {
    companyName: '',
    email: 'felaktig-email',
    phone: 'abc123',
    organizationNumber: '123',
    website: 'felaktig-url',
    postalCode: '123',
    description: 'Detta är en testbeskrivning',
    category: ''
  }
  
  // Validera alla fält för att visa fel
  Object.keys(validationSchema).forEach(fieldName => {
    touchField(fieldName)
    validateField(
      fieldName,
      formData.value[fieldName],
      validationSchema[fieldName].rules,
      validationSchema[fieldName].displayName
    )
  })
}
</script>

<template>
  <PageLayout
    title="Valideringssystem Demo"
    breadcrumbs="Home / Demo / Validering"
    :show-stats="false"
  >
    <template #actions>
      <div class="space-x-2">
        <Button @click="fillTestData" variant="outline" class="text-xs h-8">
          Fyll korrekt data
        </Button>
        <Button @click="fillInvalidData" variant="outline" class="text-xs h-8">
          Fyll felaktig data
        </Button>
        <Button @click="resetForm" variant="outline" class="text-xs h-8">
          Återställ
        </Button>
      </div>
    </template>

    <template #filters>
      <!-- Inga filter för demo -->
    </template>

    <div class="px-6 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4">Valideringssystem med Tooltips och Asterisker</h2>
          <p class="text-sm text-gray-600 mb-6">
            Detta valideringssystem visar obligatoriska fält med <strong>röda asterisker (*)</strong>, 
            ger hjälpsamma <strong>tooltips</strong> och visar <strong>felmeddelanden</strong> när data är felaktig.
          </p>
        </div>

        <!-- Formulär -->
        <div class="bg-white p-8 rounded-lg border">
          <h3 class="text-lg font-semibold mb-6">Testformulär</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Kolumn 1 -->
            <div class="space-y-4">
              <FormField
                label="Företagsnamn"
                field-name="companyName"
                :required="isRequired('companyName', validationSchema)"
                :error="getError('companyName')"
                tooltip="Det officiella namnet på företaget (obligatoriskt)"
              >
                <Input
                  id="companyName"
                  v-model="formData.companyName"
                  @input="() => handleFieldChange('companyName')"
                  @blur="() => handleFieldBlur('companyName')"
                  placeholder="Ange företagsnamn"
                  :class="[
                    'text-xs h-8',
                    hasError('companyName') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  ]"
                />
              </FormField>

              <FormField
                label="E-postadress"
                field-name="email"
                :required="isRequired('email', validationSchema)"
                :error="getError('email')"
                tooltip="Giltig e-postadress (obligatoriskt)"
              >
                <Input
                  id="email"
                  v-model="formData.email"
                  @input="() => handleFieldChange('email')"
                  @blur="() => handleFieldBlur('email')"
                  type="email"
                  placeholder="namn@företag.se"
                  :class="[
                    'text-xs h-8',
                    hasError('email') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  ]"
                />
              </FormField>

              <FormField
                label="Telefonnummer"
                field-name="phone"
                :required="isRequired('phone', validationSchema)"
                :error="getError('phone')"
                tooltip="Telefonnummer med siffror, mellanslag och bindestreck (valfritt)"
              >
                <Input
                  id="phone"
                  v-model="formData.phone"
                  @input="() => handleFieldChange('phone')"
                  @blur="() => handleFieldBlur('phone')"
                  placeholder="08-123 45 67"
                  :class="[
                    'text-xs h-8',
                    hasError('phone') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  ]"
                />
              </FormField>

              <FormField
                label="Organisationsnummer"
                field-name="organizationNumber"
                :required="isRequired('organizationNumber', validationSchema)"
                :error="getError('organizationNumber')"
                tooltip="Format: 556123-4567 (valfritt)"
              >
                <Input
                  id="organizationNumber"
                  v-model="formData.organizationNumber"
                  @input="() => handleFieldChange('organizationNumber')"
                  @blur="() => handleFieldBlur('organizationNumber')"
                  placeholder="556123-4567"
                  :class="[
                    'text-xs h-8',
                    hasError('organizationNumber') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  ]"
                />
              </FormField>
            </div>

            <!-- Kolumn 2 -->
            <div class="space-y-4">
              <FormField
                label="Webbplats"
                field-name="website"
                :required="isRequired('website', validationSchema)"
                :error="getError('website')"
                tooltip="Webbadress med eller utan http:// (valfritt)"
              >
                <Input
                  id="website"
                  v-model="formData.website"
                  @input="() => handleFieldChange('website')"
                  @blur="() => handleFieldBlur('website')"
                  placeholder="www.företag.se"
                  :class="[
                    'text-xs h-8',
                    hasError('website') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  ]"
                />
              </FormField>

              <FormField
                label="Postnummer"
                field-name="postalCode"
                :required="isRequired('postalCode', validationSchema)"
                :error="getError('postalCode')"
                tooltip="5-siffrigt postnummer (obligatoriskt)"
              >
                <Input
                  id="postalCode"
                  v-model="formData.postalCode"
                  @input="() => handleFieldChange('postalCode')"
                  @blur="() => handleFieldBlur('postalCode')"
                  placeholder="12345"
                  :class="[
                    'text-xs h-8',
                    hasError('postalCode') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  ]"
                />
              </FormField>

              <FormField
                label="Kategori"
                field-name="category"
                :required="isRequired('category', validationSchema)"
                :error="getError('category')"
                tooltip="Välj en kategori (obligatoriskt)"
              >
                <Select
                  v-model="formData.category"
                  @update:model-value="() => handleFieldChange('category')"
                >
                  <SelectTrigger 
                    :class="[
                      'text-xs h-8',
                      hasError('category') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                    ]"
                    @blur="() => handleFieldBlur('category')"
                  >
                    <SelectValue placeholder="Välj kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kund">Kund</SelectItem>
                    <SelectItem value="Leverantör">Leverantör</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                    <SelectItem value="Prospect">Prospect</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label="Beskrivning"
                field-name="description"
                :required="isRequired('description', validationSchema)"
                :error="getError('description')"
                description="Valfri beskrivning av företaget"
              >
                <Textarea
                  id="description"
                  v-model="formData.description"
                  @input="() => handleFieldChange('description')"
                  @blur="() => handleFieldBlur('description')"
                  rows="3"
                  placeholder="Beskriv företaget..."
                  :class="[
                    'resize-none text-xs',
                    hasError('description') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  ]"
                />
              </FormField>
            </div>
          </div>

          <!-- Knappar -->
          <div class="flex justify-between items-center mt-8 pt-6 border-t">
            <div class="text-xs text-gray-500">
              <span v-if="hasAnyErrors" class="text-red-600">
                ⚠️ Formuläret innehåller fel som måste åtgärdas
              </span>
              <span v-else class="text-green-600">
                ✅ Alla fält är korrekt ifyllda
              </span>
            </div>
            
            <div class="space-x-2">
              <Button @click="resetForm" variant="outline" class="text-xs h-8">
                Återställ
              </Button>
              <Button @click="submitForm" class="text-xs h-8">
                Skicka formulär
              </Button>
            </div>
          </div>
        </div>

        <!-- Information om valideringssystemet -->
        <div class="mt-12 bg-gray-50 p-6 rounded-lg">
          <h3 class="font-semibold text-lg mb-4">Valideringssystem funktioner</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 class="font-medium mb-2">🔴 Obligatoriska fält</h4>
              <ul class="space-y-1 text-gray-600">
                <li>• Markeras med röd asterisk (*)</li>
                <li>• Måste fyllas i för att formuläret ska kunna skickas</li>
                <li>• Visar felmeddelande om de lämnas tomma</li>
              </ul>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">💡 Tooltips</h4>
              <ul class="space-y-1 text-gray-600">
                <li>• Hjälpikon (?) bredvid fältnamnet</li>
                <li>• Hover för att se hjälptext</li>
                <li>• Förklarar vad som förväntas i fältet</li>
              </ul>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">⚠️ Felmeddelanden</h4>
              <ul class="space-y-1 text-gray-600">
                <li>• Visas när fältet lämnas (blur) med felaktig data</li>
                <li>• Röd ram runt fältet</li>
                <li>• Tydligt meddelande om vad som är fel</li>
              </ul>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">✅ Valideringsregler</h4>
              <ul class="space-y-1 text-gray-600">
                <li>• E-post: Giltig e-postadress</li>
                <li>• Telefon: Siffror, mellanslag, bindestreck</li>
                <li>• Org.nr: Format 556123-4567</li>
                <li>• Postnummer: 5 siffror</li>
                <li>• Webbplats: Giltig URL</li>
              </ul>
            </div>
          </div>
          
          <div class="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
            <h4 class="font-medium text-blue-800 mb-2">Testa systemet:</h4>
            <p class="text-sm text-blue-700">
              Använd knapparna ovan för att fylla i korrekt eller felaktig data och se hur valideringssystemet fungerar.
              Prova att lämna obligatoriska fält tomma eller fylla i felaktiga format.
            </p>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template> 