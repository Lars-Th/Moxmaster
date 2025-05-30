<script setup lang="ts">
import { ref, computed, onMounted, provide } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useProspectorStore } from '@/stores/prospectorStore'
import PageLayout from '@/components/custom/PageLayout.vue'
import ProspectorChat from '@/components/custom/ProspectorChat.vue'
import CompanyResultsTable from '@/components/custom/CompanyResultsTable.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogOut, AlertCircle } from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const router = useRouter()
const prospectorStore = useProspectorStore()

// Local state for API data
const loading = ref(false)
const error = ref<string | null>(null)
const apiCredentials = ref({
  client_id: 'cid_1a883e3bac7f4b9198633c724a211033',
  client_secret: 'cs_1HJWP03nk/elflvU45bOKT4gWhuORsYBbboXTi9oqYYiHL/Zj6SENP401sxK0Veyfpv7GPW4ysofSGzLGvOVNA=='
})

// Computed properties
const isAuthenticated = computed(() => prospectorStore.isAuthenticated)
const hasResults = computed(() => prospectorStore.hasResults)
const searchResults = computed(() => prospectorStore.searchResults)

// Axios configuration for API calls
const apiClient = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
})

// API methods using axios
const validateToken = async () => {
  try {
    const response = await apiClient.get('/prospector_validate_token')
    return response.data.result
  } catch (err) {
    console.error('Token validation failed:', err)
    return false
  }
}

const getAIFilters = async (prompt: string) => {
  try {
    loading.value = true
    error.value = null
    
    const response = await apiClient.post('/prospector_ai_prompt_filters', {
      params: { prompt }
    })
    
    return response.data.result
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to get AI filters'
    console.error('AI filters request failed:', err)
    throw err
  } finally {
    loading.value = false
  }
}

const searchCompanies = async (filters: any) => {
  try {
    loading.value = true
    error.value = null
    
    const response = await apiClient.post('/prospector_filter_results', {
      params: filters
    })
    
    const results = response.data.result
    prospectorStore.searchResults = results
    return results
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to search companies'
    console.error('Company search failed:', err)
    throw err
  } finally {
    loading.value = false
  }
}

const createLeads = async (companies: any[]) => {
  try {
    loading.value = true
    error.value = null
    
    const response = await apiClient.post('/prospector_create_leads', {
      params: companies
    })
    
    return response.data.result
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to create leads'
    console.error('Lead creation failed:', err)
    throw err
  } finally {
    loading.value = false
  }
}

const getAccountDetails = async () => {
  try {
    const response = await apiClient.get('/prospector_my_account')
    return response.data.result
  } catch (err) {
    console.error('Failed to get account details:', err)
    throw err
  }
}

// Auto-authenticate on component mount
onMounted(async () => {
  try {
    // Set the provided credentials and authentication state
    prospectorStore.credentials = apiCredentials.value
    prospectorStore.isAuthenticated = true
    
    // Validate the token
    const isValid = await validateToken()
    
    if (!isValid) {
      console.warn('Token validation failed, but continuing in demo mode')
    }
    
    console.log('Authentication setup complete')
  } catch (err) {
    console.error('Authentication setup failed:', err)
    error.value = 'Failed to initialize authentication'
  }
})

// Provide API methods to child components
const apiMethods = {
  getAIFilters,
  searchCompanies,
  createLeads,
  getAccountDetails,
  loading: computed(() => loading.value),
  error: computed(() => error.value)
}

// Provide to child components
provide('apiMethods', apiMethods)

// Methods
const handleLogout = async () => {
  try {
    await apiClient.get('/prospector_logout')
  } catch (err) {
    console.error('Logout error:', err)
  } finally {
    prospectorStore.logout()
    router.push('/')
  }
}
</script>

<template>
  <PageLayout
    title="AI Prospector"
    breadcrumbs="Home / AI Prospector"
  >
    <!-- Main Interface (authentication bypassed) -->
    <div class="p-4 space-y-4">
      <!-- API Status Alert -->
      <Alert v-if="error" variant="destructive" class="mb-4">
        <AlertCircle class="h-4 w-4" />
        <AlertTitle>API Connection Issue</AlertTitle>
        <AlertDescription>
          {{ error }}
          <br><br>
          <strong>Note:</strong> Using direct axios calls to server-side controllers.
        </AlertDescription>
      </Alert>

      <!-- Loading indicator -->
      <Alert v-if="loading" class="mb-4">
        <AlertCircle class="h-4 w-4" />
        <AlertTitle>Processing</AlertTitle>
        <AlertDescription>
          API request in progress...
        </AlertDescription>
      </Alert>

      <!-- Header with logout -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold">AI Company Search</h1>
        <Button 
          variant="outline" 
          @click="handleLogout"
          class="flex items-center gap-2"
        >
          <LogOut class="h-4 w-4" />
          Logout
        </Button>
      </div>

      <!-- Main content area -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[70vh]">
        <!-- Left side: Chatbot -->
        <Card class="h-fit">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <span class="text-blue-500">🤖</span>
              AI Search Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProspectorChat />
          </CardContent>
        </Card>

        <!-- Right side: Results Table -->
        <Card class="h-fit">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <span class="text-green-500">📊</span>
              Company Results
              <span v-if="hasResults" class="text-sm font-normal text-muted-foreground">
                ({{ searchResults.length }} companies found)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CompanyResultsTable />
          </CardContent>
        </Card>
      </div>
    </div>
  </PageLayout>
</template>

<style scoped>
/* Component-specific styles if needed */
</style> 