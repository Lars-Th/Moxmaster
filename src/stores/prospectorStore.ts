import { defineStore } from 'pinia'

export interface CompanyFilter {
  id: number
  name: string
  address: string
  branch: string
  city: string
  employees: number
  status: 'Active' | 'Inactive'
  founded: string
}

interface ProspectorState {
  companies: CompanyFilter[]
  selectedCompanies: CompanyFilter[]
  filterCriteria: {
    address: string
    branch: string
    city: string
    minEmployees: number
    maxEmployees: number
  }
  predefinedText: string
}

export const useProspectorStore = defineStore('prospector', {
  state: (): ProspectorState => ({
    companies: [
      {
        id: 1,
        name: 'Tech Solutions AB',
        address: 'Kungsgatan 12, 111 43 Stockholm',
        branch: 'Technology',
        city: 'Stockholm',
        employees: 150,
        status: 'Active',
        founded: '2010'
      },
      {
        id: 2,
        name: 'Green Energy Corp',
        address: 'Storgatan 45, 411 38 Göteborg',
        branch: 'Energy',
        city: 'Göteborg',
        employees: 300,
        status: 'Active',
        founded: '2008'
      },
      {
        id: 3,
        name: 'Design Studio Ltd',
        address: 'Malmövägen 78, 214 31 Malmö',
        branch: 'Design',
        city: 'Malmö',
        employees: 25,
        status: 'Active',
        founded: '2015'
      },
      {
        id: 4,
        name: 'Finance Partners',
        address: 'Vasagatan 22, 111 20 Stockholm',
        branch: 'Finance',
        city: 'Stockholm',
        employees: 80,
        status: 'Inactive',
        founded: '2012'
      },
      {
        id: 5,
        name: 'Healthcare Innovation',
        address: 'Universitetsvägen 14, 581 83 Linköping',
        branch: 'Healthcare',
        city: 'Linköping',
        employees: 200,
        status: 'Active',
        founded: '2005'
      }
    ],
    selectedCompanies: [],
    filterCriteria: {
      address: '',
      branch: '',
      city: '',
      minEmployees: 0,
      maxEmployees: 1000
    },
    predefinedText: `Welcome to the Company Prospector!

This powerful tool helps you discover and analyze potential business partners and clients. Our comprehensive database contains detailed information about companies across various industries and locations.

Key Features:
• Advanced filtering by location, industry, and company size
• Real-time company data and insights
• Export capabilities for selected prospects
• Integration with CRM systems

Use the filters below to narrow down your search and find the perfect companies that match your business criteria. Click on any company to view detailed information and add them to your prospect list.

Start exploring now and unlock new business opportunities!`
  }),
  getters: {
    activeCompanies: (state): CompanyFilter[] => 
      state.companies.filter(company => company.status === 'Active'),
    companiesByBranch: (state) => (branch: string): CompanyFilter[] =>
      state.companies.filter(company => 
        company.branch.toLowerCase().includes(branch.toLowerCase())
      ),
    companiesByCity: (state) => (city: string): CompanyFilter[] =>
      state.companies.filter(company => 
        company.city.toLowerCase().includes(city.toLowerCase())
      ),
    companiesByEmployeeRange: (state) => (min: number, max: number): CompanyFilter[] =>
      state.companies.filter(company => 
        company.employees >= min && company.employees <= max
      ),
    filteredCompanies: (state): CompanyFilter[] => {
      return state.companies.filter(company => {
        const matchesAddress = !state.filterCriteria.address || 
          company.address.toLowerCase().includes(state.filterCriteria.address.toLowerCase())
        const matchesBranch = !state.filterCriteria.branch || 
          company.branch.toLowerCase().includes(state.filterCriteria.branch.toLowerCase())
        const matchesCity = !state.filterCriteria.city || 
          company.city.toLowerCase().includes(state.filterCriteria.city.toLowerCase())
        const matchesEmployees = company.employees >= state.filterCriteria.minEmployees && 
          company.employees <= state.filterCriteria.maxEmployees

        return matchesAddress && matchesBranch && matchesCity && matchesEmployees
      })
    },
    totalCompanies: (state): number => state.companies.length,
    selectedCompaniesCount: (state): number => state.selectedCompanies.length
  },
  actions: {
    updateFilterCriteria(criteria: Partial<ProspectorState['filterCriteria']>) {
      this.filterCriteria = { ...this.filterCriteria, ...criteria }
    },
    addToSelected(company: CompanyFilter) {
      if (!this.selectedCompanies.find(c => c.id === company.id)) {
        this.selectedCompanies.push(company)
      }
    },
    removeFromSelected(companyId: number) {
      this.selectedCompanies = this.selectedCompanies.filter(c => c.id !== companyId)
    },
    clearSelected() {
      this.selectedCompanies = []
    },
    clearFilters() {
      this.filterCriteria = {
        address: '',
        branch: '',
        city: '',
        minEmployees: 0,
        maxEmployees: 1000
      }
    },
    updatePredefinedText(newText: string) {
      this.predefinedText = newText
    }
  }
}) 