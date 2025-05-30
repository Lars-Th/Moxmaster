import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface CompanyData {
  name: string
  organisationNumber: string
  description: string
  employees: number
  turnOver: number
  legalEntity: string
  vatNumber: string
  phone: string
  address: string
  postCode: string
  city: string
}

interface APICredentials {
  client_id: string
  client_secret: string
}

interface JSONRPCResponse<T> {
  jsonrpc: string
  id: number
  result: T
}

export const useProspectorStore = defineStore('prospector', () => {
  // State
  const isAuthenticated = ref(false)
  const credentials = ref<APICredentials | null>(null)
  const loading = ref(false)
  const searchResults = ref<CompanyData[]>([])
  const searchFilters = ref<any>(null)
  const error = ref<string | null>(null)

  // Computed
  const hasResults = computed(() => searchResults.value.length > 0)
  const isLoading = computed(() => loading.value)

  // Helper function to make requests to server-side controllers
  const makeControllerRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for Odoo authentication
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const jsonRpcResponse: JSONRPCResponse<T> = await response.json()
    return jsonRpcResponse.result
  }

  // Actions
  const initializeAuthentication = async (): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      // First, validate if we already have a valid token
      const isValid = await makeControllerRequest<boolean>('/prospector_validate_token')
      
      if (isValid) {
        isAuthenticated.value = true
        // Get account details to populate credentials info
        await getAccountDetails()
      } else {
        isAuthenticated.value = false
        credentials.value = null
      }
    } catch (err) {
      console.error('Failed to validate existing token:', err)
      isAuthenticated.value = false
      credentials.value = null
    } finally {
      loading.value = false
    }
  }

  const startAuthenticationFlow = async (): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      // Call the server-side login endpoint which will handle OAuth flow
      const authResult = await makeControllerRequest<any>('/prospector_login')
      
      if (authResult && authResult.redirectUrl) {
        // Redirect to OAuth provider
        window.location.href = authResult.redirectUrl
      } else {
        throw new Error('Failed to get OAuth URL')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to start authentication'
      console.error('Authentication flow failed:', err)
    } finally {
      loading.value = false
    }
  }

  const getSearchFilters = async (): Promise<any> => {
    if (!isAuthenticated.value) {
      throw new Error('Not authenticated')
    }

    loading.value = true
    error.value = null

    try {
      const filters = await makeControllerRequest<any>('/prospector_get_search_filters')
      searchFilters.value = filters
      return filters
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to get search filters'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getAIFilters = async (prompt: string): Promise<any> => {
    if (!isAuthenticated.value) {
      throw new Error('Not authenticated')
    }

    loading.value = true
    error.value = null

    try {
      const filters = await makeControllerRequest<any>('/prospector_ai_prompt_filters', {
        method: 'POST',
        body: JSON.stringify({
          params: { prompt }
        })
      })
      
      searchFilters.value = filters
      return filters
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to get AI filters'
      throw err
    } finally {
      loading.value = false
    }
  }

  const previewFilterResults = async (filters: any): Promise<any> => {
    if (!isAuthenticated.value) {
      throw new Error('Not authenticated')
    }

    loading.value = true
    error.value = null

    try {
      const preview = await makeControllerRequest<any>('/prospector_preview_filter_results', {
        method: 'POST',
        body: JSON.stringify({
          params: filters
        })
      })
      
      return preview
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to preview results'
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchCompanies = async (filters: any): Promise<CompanyData[]> => {
    if (!isAuthenticated.value) {
      throw new Error('Not authenticated')
    }

    loading.value = true
    error.value = null

    try {
      const results = await makeControllerRequest<CompanyData[]>('/prospector_filter_results', {
        method: 'POST',
        body: JSON.stringify({
          params: filters
        })
      })
      
      searchResults.value = results
      return results
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to search companies'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createLeads = async (companies: CompanyData[]): Promise<boolean> => {
    if (!isAuthenticated.value) {
      throw new Error('Not authenticated')
    }

    loading.value = true
    error.value = null

    try {
      const result = await makeControllerRequest<boolean>('/prospector_create_leads', {
        method: 'POST',
        body: JSON.stringify({
          params: companies
        })
      })
      
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create leads'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getAccountDetails = async (): Promise<any> => {
    if (!isAuthenticated.value) {
      throw new Error('Not authenticated')
    }

    try {
      const accountDetails = await makeControllerRequest<any>('/prospector_my_account')
      return accountDetails
    } catch (err) {
      console.error('Failed to get account details:', err)
      throw err
    }
  }

  const getAllOrganisationNumbers = async (): Promise<string[]> => {
    try {
      const orgNumbers = await makeControllerRequest<string[]>('/prospector_get_all_organisation_numbers', {
        method: 'POST'
      })
      return orgNumbers
    } catch (err) {
      console.error('Failed to get organisation numbers:', err)
      throw err
    }
  }

  const getAllLeadOrganisationNumbers = async (): Promise<string[]> => {
    try {
      const orgNumbers = await makeControllerRequest<string[]>('/prospector_get_all_lead_organisation_numbers', {
        method: 'POST'
      })
      return orgNumbers
    } catch (err) {
      console.error('Failed to get lead organisation numbers:', err)
      throw err
    }
  }

  const getLandingPageInformation = async (): Promise<any> => {
    try {
      const info = await makeControllerRequest<any>('/get_landing_page_information')
      return info
    } catch (err) {
      console.error('Failed to get landing page information:', err)
      throw err
    }
  }

  const getAISearchInformation = async (): Promise<any> => {
    try {
      const info = await makeControllerRequest<any>('/get_ai_search_information')
      return info
    } catch (err) {
      console.error('Failed to get AI search information:', err)
      throw err
    }
  }

  const generateSearchDescription = async (filters: any): Promise<string> => {
    try {
      const description = await makeControllerRequest<string>('/prospector_search_description', {
        method: 'POST',
        body: JSON.stringify({
          params: filters
        })
      })
      return description
    } catch (err) {
      console.error('Failed to generate search description:', err)
      throw err
    }
  }

  const applyQualityFilter = async (detailedResults: any[], filters: any): Promise<any> => {
    try {
      const qualityResults = await makeControllerRequest<any>('/prospector_quality_filter', {
        method: 'POST',
        body: JSON.stringify({
          params: {
            detailedResults,
            filters
          }
        })
      })
      return qualityResults
    } catch (err) {
      console.error('Failed to apply quality filter:', err)
      throw err
    }
  }

  const clearResults = () => {
    searchResults.value = []
    searchFilters.value = null
    error.value = null
  }

  const logout = async (): Promise<void> => {
    loading.value = true
    
    try {
      await makeControllerRequest<any>('/prospector_logout')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      isAuthenticated.value = false
      credentials.value = null
      searchResults.value = []
      searchFilters.value = null
      error.value = null
      loading.value = false
    }
  }

  return {
    // State
    isAuthenticated,
    credentials,
    loading,
    searchResults,
    searchFilters,
    error,
    
    // Computed
    hasResults,
    isLoading,
    
    // Actions
    initializeAuthentication,
    startAuthenticationFlow,
    getSearchFilters,
    getAIFilters,
    previewFilterResults,
    searchCompanies,
    createLeads,
    getAccountDetails,
    getAllOrganisationNumbers,
    getAllLeadOrganisationNumbers,
    getLandingPageInformation,
    getAISearchInformation,
    generateSearchDescription,
    applyQualityFilter,
    clearResults,
    logout
  }
}) 