import { ref } from 'vue'
import axios from 'axios'

// Types based on the reference implementation
export interface FilterCriteria {
  address: string
  branch: string
  city: string
  minEmployees: number
  maxEmployees: number
}

export interface Company {
  id: number
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
  branch: string
  status: string
  founded: string
}

export interface ProspectorResponse {
  companies: Company[]
  totalCount: number
  message?: string
}

export interface LandingPageInfo {
  welcomeText: string
  features: string[]
  description: string
}

// Configuration: Set to 'production' to use real API, 'mock' to use local server
const API_MODE: 'production' | 'mock' = 'production' // Change to 'production' when external API is accessible

export function useProspectorService() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // API configuration based on mode
  const baseURL = API_MODE === 'production' 
    ? ''  // Empty string for Vite proxy to production API
    : 'http://localhost:3001'  // Local mock server
  
  // Client credentials from reference implementation
  const clientId = "cid_1a883e3bac7f4b9198633c724a211033"
  const clientSecret = "cs_1HJWP03nk/elflvU45bOKT4gWhuORsYBbboXTi9oqYYiHL/Zj6SENP401sxK0Veyfpv7GPW4ysofSGzLGvOVNA=="
  
  // Create axios instance with authentication
  const apiClient = axios.create({
    baseURL,
    auth: {
      username: clientId,
      password: clientSecret
    },
    timeout: 10000
  })

  // Convert frontend filter format to API parameter format
  const convertToApiParams = (filters: FilterCriteria) => {
    const params = []
    
    // Add filters based on the reference implementation pattern
    if (filters.address) {
      params.push({
        filterCategory: "address",
        SelectOption: [filters.address]
      })
    }
    
    if (filters.branch) {
      params.push({
        filterCategory: "branch", 
        SelectOption: [filters.branch]
      })
    }
    
    if (filters.city) {
      params.push({
        filterCategory: "city",
        SelectOption: [filters.city]
      })
    }
    
    // Employee range filter
    if (filters.minEmployees > 0 || filters.maxEmployees < 1000) {
      params.push({
        filterCategory: "employees",
        SelectRange: {
          min: filters.minEmployees,
          max: filters.maxEmployees
        }
      })
    }
    
    return params
  }

  // Get available search filters
  const getSearchFilters = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await apiClient.get('/api/insight/filters')
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch search filters'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Get landing page information
  const getLandingPageInformation = async (): Promise<LandingPageInfo> => {
    try {
      isLoading.value = true
      error.value = null
      
      // Use appropriate base URL based on API mode
      const url = API_MODE === 'production' 
        ? '/api/information/landingpage'  // Goes through Vite proxy
        : `${baseURL}/api/information/landingpage`  // Direct to mock server
      
      const response = await axios.get(url)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch landing page information'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Search companies with filters - this is the main prospector search function
  const searchCompanies = async (filters: FilterCriteria): Promise<ProspectorResponse> => {
    try {
      isLoading.value = true
      error.value = null
      
      const apiParams = convertToApiParams(filters)
      
      // Use the prospects endpoint with pagination as shown in reference
      const response = await apiClient.post('/api/insight/prospects?skip=0&take=2500', apiParams)
      
      // Transform the response to match our frontend interface
      const companies = response.data.map((company: any, index: number) => ({
        id: company.organisationNumber || index + 1,
        name: company.name,
        organisationNumber: company.organisationNumber,
        description: company.description || '',
        employees: company.employees || 0,
        turnOver: company.turnOver || 0,
        legalEntity: company.legalEntity || '',
        vatNumber: company.vatNumber || '',
        phone: company.phone || '',
        address: company.address || '',
        postCode: company.postCode || '',
        city: company.city || '',
        branch: company.branch || filters.branch || 'Unknown',
        status: 'Active',
        founded: company.founded || 'Unknown'
      }))
      
      return {
        companies,
        totalCount: companies.length,
        message: 'Search completed successfully'
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to search companies'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Preview filter results (lighter version for quick preview)
  const previewFilterResults = async (filters: FilterCriteria) => {
    try {
      isLoading.value = true
      error.value = null
      
      const apiParams = convertToApiParams(filters)
      const response = await apiClient.post('/api/insight/filters', apiParams)
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to preview results'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Add company to prospects/selected list
  const addToProspects = async (company: Company) => {
    try {
      isLoading.value = true
      error.value = null
      
      // This would typically be a POST to create a lead/prospect
      const response = await apiClient.post('/api/insight/leads', [company])
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add company to prospects'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Validate access token/authentication
  const validateAccessToken = async (): Promise<boolean> => {
    try {
      const response = await apiClient.get('/api/insight/validatelogin')
      return response.status === 200
    } catch (err) {
      return false
    }
  }

  // Get account details
  const getAccountDetails = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await apiClient.get('/api/insight/account')
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch account details'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    isLoading,
    error,
    
    // Methods
    getSearchFilters,
    getLandingPageInformation,
    searchCompanies,
    previewFilterResults,
    addToProspects,
    validateAccessToken,
    getAccountDetails
  }
} 