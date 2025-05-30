<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ref, computed, onMounted } from 'vue'
import { useProspectorService, type FilterCriteria, type Company, type LandingPageInfo } from '@/composables/useProspectorService'
import DashboardCard from '@/components/custom/DashboardCard.vue'

// Use the API service instead of store
const prospectorService = useProspectorService()

const showPredefinedText = ref(false)
const companies = ref<Company[]>([])
const landingPageInfo = ref<LandingPageInfo | null>(null)
const selectedCompanies = ref<Company[]>([])

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

// Load initial data
onMounted(async () => {
  try {
    // Load landing page information
    landingPageInfo.value = await prospectorService.getLandingPageInformation()
  } catch (error) {
    console.error('Failed to load landing page information:', error)
  }
})

const showWelcomeText = () => {
  showPredefinedText.value = true
}

// API call - POST /api/insight/prospects with filter criteria
const applyFilters = async () => {
  try {
    const response = await prospectorService.searchCompanies(activeFilters.value)
    companies.value = response.companies
  } catch (err: any) {
    console.error('Failed to fetch companies:', err)
    // You might want to show a toast notification here
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
  // Clear the results
  companies.value = []
}

// API call - POST /api/insight/leads with company data
const addToSelected = async (company: Company) => {
  try {
    await prospectorService.addToProspects(company)
    
    // Add to local selected list if not already there
    if (!selectedCompanies.value.find(c => c.id === company.id)) {
      selectedCompanies.value.push(company)
    }
  } catch (err: any) {
    console.error('Failed to add company to prospects:', err)
    // You might want to show a toast notification here
  }
}

const removeFromSelected = (companyId: number) => {
  selectedCompanies.value = selectedCompanies.value.filter(c => c.id !== companyId)
}

const clearSelected = () => {
  selectedCompanies.value = []
}

// Get welcome text from landing page info or fallback
const predefinedText = computed(() => {
  return landingPageInfo.value?.welcomeText || 
    `Welcome to our advanced company prospecting tool! 

This powerful platform allows you to:
• Filter companies by location, industry, and size
• Search through thousands of business profiles
• Export prospect lists for your sales team
• Analyze market opportunities in your sector

Our database is updated regularly to ensure you have access to the most current business information. Use the filters below to narrow down your search and find the perfect prospects for your business development efforts.

Get started by setting your search criteria and clicking "Apply Filters" to discover new business opportunities!`
})
</script>

<template>
  <div class="p-4 space-y-6">
    <!-- Header Section -->
    <div>
      <h1 class="text-3xl font-bold text-foreground">Company Prospector</h1>
      <p class="text-muted-foreground">
        Discover and analyze potential business partners using advanced filtering tools
      </p>
    </div>

    <!-- Filter Section -->
    <DashboardCard
      title="Company Filters"
      description="Filter companies by location, industry, and size"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="space-y-2">
          <Label for="address-filter">Address</Label>
          <Input 
            id="address-filter"
            v-model="activeFilters.address"
            placeholder="Enter address or location..."
          />
        </div>

        <div class="space-y-2">
          <Label for="branch-filter">Industry/Branch</Label>
          <Input 
            id="branch-filter"
            v-model="activeFilters.branch"
            placeholder="e.g., Technology, Finance..."
          />
        </div>

        <div class="space-y-2">
          <Label for="city-filter">City</Label>
          <Input 
            id="city-filter"
            v-model="activeFilters.city"
            placeholder="Enter city name..."
          />
        </div>

        <div class="space-y-2">
          <Label for="min-employees">Min Employees</Label>
          <Input 
            id="min-employees"
            v-model.number="activeFilters.minEmployees"
            type="number"
            min="0"
            placeholder="0"
          />
        </div>

        <div class="space-y-2">
          <Label for="max-employees">Max Employees</Label>
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
            {{ prospectorService.isLoading.value ? 'Searching...' : 'Apply Filters' }}
          </Button>
          <Button variant="outline" @click="clearAllFilters">
            Clear
          </Button>
        </div>
      </div>
    </DashboardCard>

    <!-- Loading spinner -->
    <div v-if="prospectorService.isLoading.value" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <!-- Error handling -->
    <div v-if="prospectorService.error.value" class="text-center py-8">
      <p class="text-red-500">{{ prospectorService.error.value }}</p>
      <Button @click="applyFilters" variant="outline" class="mt-2">Retry</Button>
    </div>

    <!-- Results Section -->
    <DashboardCard
      title="Company Results"
      :description="`Found ${filteredCompanies.length} companies out of ${totalCompanies} total`"
      full-width
    >
      <div v-if="filteredCompanies.length === 0 && !prospectorService.isLoading.value" class="text-center py-8">
        <p class="text-muted-foreground">No companies match your current filter criteria.</p>
        <Button variant="outline" @click="clearAllFilters" class="mt-2">
          Clear Filters
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
              <p><strong>Address:</strong> {{ company.address }}</p>
              <p><strong>City:</strong> {{ company.city }}</p>
              <p><strong>Employees:</strong> {{ company.employees }}</p>
              <p><strong>Founded:</strong> {{ company.founded }}</p>
            </div>
            <Button @click="addToSelected(company)" size="sm" class="w-full mt-3" :disabled="prospectorService.isLoading.value">
              Add to Prospects
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardCard>

    <!-- Selected Companies Summary -->
    <DashboardCard
      v-if="selectedCompaniesCount > 0"
      title="Selected Prospects"
      :description="`You have selected ${selectedCompaniesCount} companies`"
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
            Remove
          </Button>
        </div>
        <Button variant="outline" @click="clearSelected()" class="w-full mt-4">
          Clear All Selected
        </Button>
      </div>
    </DashboardCard>
  </div>
</template>

<style scoped>
/* Component-specific styles if needed */
</style> 