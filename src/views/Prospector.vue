<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ref, computed, onMounted } from 'vue'
import { useProspectorService, type FilterCriteria, type Company, type LandingPageInfo } from '@/composables/useProspectorService'
import { LayoutGrid, List, Search, Filter } from 'lucide-vue-next'
import PageLayout from '@/components/custom/PageLayout.vue'
import DataTable from '@/components/custom/DataTable.vue'
import DashboardCard from '@/components/custom/DashboardCard.vue'

// Use the API service instead of store
const prospectorService = useProspectorService()

const companies = ref<Company[]>([])
const landingPageInfo = ref<LandingPageInfo | null>(null)
const selectedCompanies = ref<Company[]>([])
const viewMode = ref<'cards' | 'list'>('cards')

const activeFilters = ref<FilterCriteria>({
  address: '',
  branch: '',
  city: '',
  minEmployees: 0,
  maxEmployees: 1000
})

// API-driven computed properties
const filteredCompanies = computed(() => companies.value)
const totalCompanies = computed(() => companies.value.length)
const selectedCompaniesCount = computed(() => selectedCompanies.value.length)

// View mode button variants
const cardViewVariant = computed(() => viewMode.value === 'cards' ? 'default' : 'outline')
const listViewVariant = computed(() => viewMode.value === 'list' ? 'default' : 'outline')

// Column configuration for list view (samma som DataTable i Customers)
const columns = [
  {
    key: 'name',
    label: 'Företag',
    sortable: true
  },
  {
    key: 'city',
    label: 'Ort', 
    sortable: true
  },
  {
    key: 'branch',
    label: 'Bransch',
    sortable: true
  },
  {
    key: 'employees',
    label: 'Anställda',
    sortable: true
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    type: 'badge' as const,
    badgeVariant: (status: string) => status === 'Active' ? 'default' : 'secondary'
  },
  {
    key: 'actions',
    label: 'Åtgärder',
    sortable: false,
    type: 'actions' as const,
    align: 'right' as const
  }
]

// Statistik för PageLayout
const stats = computed(() => [
  {
    value: totalCompanies.value,
    label: 'Totalt företag'
  },
  {
    value: filteredCompanies.value.filter(c => c.status === 'Active').length,
    label: 'Aktiva',
    color: 'text-green-600'
  },
  {
    value: selectedCompaniesCount.value,
    label: 'Valda',
    color: 'text-blue-600'
  }
])

// Load initial data
onMounted(async () => {
  try {
    // Load landing page information
    landingPageInfo.value = await prospectorService.getLandingPageInformation()
  } catch (error) {
    console.error('Failed to load landing page information:', error)
  }
})

// API call - POST /api/insight/prospects with filter criteria
const applyFilters = async () => {
  try {
    const response = await prospectorService.searchCompanies(activeFilters.value)
    companies.value = response.companies
  } catch (err: any) {
    console.error('Failed to fetch companies:', err)
  }
}

const clearAllFilters = () => {
  activeFilters.value = {
    address: '',
    branch: '',
    city: '',
    minEmployees: 0,
    maxEmployees: 1000
  }
  companies.value = []
}

// API call - POST /api/insight/leads with company data
const addToSelected = async (company: Company) => {
  try {
    await prospectorService.addToProspects(company)
    
    if (!selectedCompanies.value.find(c => c.id === company.id)) {
      selectedCompanies.value.push(company)
    }
  } catch (err: any) {
    console.error('Failed to add company to prospects:', err)
  }
}

const removeFromSelected = (companyId: number) => {
  selectedCompanies.value = selectedCompanies.value.filter(c => c.id !== companyId)
}

const clearSelected = () => {
  selectedCompanies.value = []
}

// DataTable action handlers
const viewCompanyDetails = (company: Company) => {
  console.log('View company details:', company.name)
}

const sendEmailToCompany = (company: Company, event: Event) => {
  if (company.phone) {
    console.log('Contact company:', company.name)
  }
}

const addCompanyToProspects = (company: Company, event: Event) => {
  addToSelected(company)
}

// Get welcome text from landing page info or fallback
</script>

<template>
  <PageLayout
    title="Prospector"
    breadcrumbs="Home / Prospector"
    :show-stats="true"
    :stats="stats"
  >
    <!-- Loading spinner -->
    <div v-if="prospectorService.isLoading.value" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <!-- Error handling -->
    <div v-if="prospectorService.error.value" class="text-center py-8">
      <p class="text-red-500">{{ prospectorService.error.value }}</p>
      <Button @click="applyFilters" variant="outline" class="mt-2">Försök igen</Button>
    </div>

    <!-- Main content container with same padding as CustomerDetails -->
    <div class="px-6 mt-6">
      <!-- Filter Section -->
      <DashboardCard
        title="Sökfilter"
        description="Filtrera företag efter plats, bransch och storlek"
        class="mb-6"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="space-y-2">
            <Label for="address-filter">Adress</Label>
            <Input 
              id="address-filter"
              v-model="activeFilters.address"
              placeholder="Ange adress eller plats..."
            />
          </div>

          <div class="space-y-2">
            <Label for="branch-filter">Bransch</Label>
            <Input 
              id="branch-filter"
              v-model="activeFilters.branch"
              placeholder="t.ex. Teknik, Finans..."
            />
          </div>

          <div class="space-y-2">
            <Label for="city-filter">Ort</Label>
            <Input 
              id="city-filter"
              v-model="activeFilters.city"
              placeholder="Ange ortnamn..."
            />
          </div>

          <div class="space-y-2">
            <Label for="min-employees">Min anställda</Label>
            <Input 
              id="min-employees"
              v-model.number="activeFilters.minEmployees"
              type="number"
              min="0"
              placeholder="0"
            />
          </div>

          <div class="space-y-2">
            <Label for="max-employees">Max anställda</Label>
            <Input 
              id="max-employees"
              v-model.number="activeFilters.maxEmployees"
              type="number"
              min="0"
              placeholder="1000"
            />
          </div>

          <div class="flex items-end space-x-2">
            <Button @click="applyFilters" class="flex-1" :disabled="prospectorService.isLoading.value">
              <Search class="w-4 h-4 mr-2" />
              {{ prospectorService.isLoading.value ? 'Söker...' : 'Sök företag' }}
            </Button>
            <Button variant="outline" @click="clearAllFilters">
              <Filter class="w-4 h-4 mr-2" />
              Rensa
            </Button>
          </div>
        </div>
      </DashboardCard>

      <!-- View Mode Toggle -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex space-x-2">
          <Button
            :variant="cardViewVariant"
            size="sm"
            @click="viewMode = 'cards'"
          >
            <LayoutGrid class="w-4 h-4 mr-2" />
            Kort
          </Button>
          <Button
            :variant="listViewVariant"
            size="sm"
            @click="viewMode = 'list'"
          >
            <List class="w-4 h-4 mr-2" />
            Lista
          </Button>
        </div>
        
        <div class="text-sm text-muted-foreground">
          {{ filteredCompanies.length }} företag hittade
        </div>
      </div>

      <!-- Card View Results (inside container) -->
      <div v-if="!prospectorService.isLoading.value && !prospectorService.error.value && viewMode === 'cards'">
        <div v-if="filteredCompanies.length === 0" class="text-center py-8">
          <p class="text-muted-foreground">Inga företag matchar dina sökkriterier.</p>
          <Button variant="outline" @click="clearAllFilters" class="mt-2">
            Rensa filter
          </Button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card v-for="company in filteredCompanies" :key="company.id" class="hover:shadow-md transition-shadow">
            <CardHeader class="pb-3">
              <div class="flex justify-between items-start">
                <CardTitle class="text-lg">{{ company.name }}</CardTitle>
                <Badge :variant="company.status === 'Active' ? 'default' : 'secondary'">
                  {{ company.status }}
                </Badge>
              </div>
              <CardDescription>{{ company.branch }}</CardDescription>
            </CardHeader>
            <CardContent class="space-y-2">
              <div class="text-sm">
                <p><strong>Adress:</strong> {{ company.address }}</p>
                <p><strong>Ort:</strong> {{ company.city }}</p>
                <p><strong>Anställda:</strong> {{ company.employees }}</p>
                <p><strong>Grundat:</strong> {{ company.founded }}</p>
              </div>
              <Button @click="addToSelected(company)" size="sm" class="w-full mt-3" :disabled="prospectorService.isLoading.value">
                Lägg till som prospekt
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Selected Companies Summary -->
      <DashboardCard
        v-if="selectedCompaniesCount > 0"
        title="Valda prospekt"
        :description="`Du har valt ${selectedCompaniesCount} företag`"
        class="mt-6"
      >
        <div class="space-y-2">
          <div v-for="company in selectedCompanies" :key="company.id" 
               class="flex justify-between items-center p-2 bg-muted/50 rounded">
            <span class="font-medium">{{ company.name }}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              @click="removeFromSelected(company.id)"
            >
              Ta bort
            </Button>
          </div>
          <Button variant="outline" @click="clearSelected()" class="w-full mt-4">
            Rensa alla valda
          </Button>
        </div>
      </DashboardCard>
    </div>

    <!-- List View Results (outside container, full width like Customers) -->
    <div v-if="!prospectorService.isLoading.value && !prospectorService.error.value && viewMode === 'list'">
      <DataTable
        :data="filteredCompanies"
        :columns="columns"
        :search-fields="['name', 'city', 'branch']"
        :on-row-click="viewCompanyDetails"
        :on-send-email="sendEmailToCompany"
        :on-delete="addCompanyToProspects"
        delete-confirm-message="Lägg till detta företag som prospekt?"
        delete-button-text="Lägg till"
        delete-button-variant="default"
      />
    </div>
  </PageLayout>
</template>

<style scoped>
/* Component-specific styles if needed */
</style> 