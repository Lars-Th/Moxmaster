import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const app = express()
const port = 3001

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json())

// Load mock data
const mockCompaniesPath = path.join(__dirname, '../public/api/mock-prospector-data.json')
let mockCompanies = []

try {
  if (fs.existsSync(mockCompaniesPath)) {
    const data = fs.readFileSync(mockCompaniesPath, 'utf8')
    mockCompanies = JSON.parse(data)
  }
} catch (error) {
  console.warn('Could not load mock companies data:', error.message)
  // Fallback data
  mockCompanies = [
    {
      name: "Tech Innovations AB",
      organisationNumber: "556789-1234",
      description: "Leading software development company specializing in AI and machine learning solutions",
      employees: 45,
      turnOver: 25000000,
      legalEntity: "AB",
      vatNumber: "SE556789123401",
      phone: "+46 8 123 456 78",
      address: "Kungsgatan 15",
      postCode: "111 43",
      city: "Stockholm",
      branch: "Technology"
    }
  ]
}

// Add missing fields to mock data
mockCompanies = mockCompanies.map((company, index) => ({
  ...company,
  id: company.organisationNumber || index + 1,
  status: "Active",
  founded: "2010",
  branch: company.branch || "Technology"
}))

// Mock authentication middleware
const authenticateRequest = (req, res, next) => {
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ message: 'Authentication required' })
  }
  
  // In a real implementation, validate the credentials
  // For mock, we just check if authorization header exists
  next()
}

// API Routes matching the prospector reference implementation

// GET /api/insight/filters - Get available search filters
app.get('/api/insight/filters', authenticateRequest, (req, res) => {
  res.json({
    filters: [
      {
        category: "address",
        type: "text",
        options: []
      },
      {
        category: "branch", 
        type: "select",
        options: ["Technology", "Finance", "Healthcare", "Manufacturing", "Retail"]
      },
      {
        category: "city",
        type: "text", 
        options: []
      },
      {
        category: "employees",
        type: "range",
        min: 0,
        max: 1000
      }
    ]
  })
})

// GET /api/information/landingpage - Get landing page information (no auth required)
app.get('/api/information/landingpage', (req, res) => {
  res.json({
    welcomeText: `Welcome to the Company Prospector Tool!

This advanced prospecting platform helps you discover and analyze potential business partners with precision and efficiency.

Key Features:
• Comprehensive company database with up-to-date information
• Advanced filtering by location, industry, and company size
• Real-time search across thousands of business profiles
• Detailed company insights including financials and contact information
• Export capabilities for seamless CRM integration

Our database contains verified information from official business registries and is updated regularly to ensure accuracy. Whether you're looking for new customers, suppliers, or partners, our tool provides the insights you need to make informed business decisions.

Start by setting your search criteria using the filters below, then click "Apply Filters" to discover companies that match your requirements. You can save promising prospects to your selection list for further analysis and outreach.`,
    features: [
      "Real-time company data",
      "Advanced search filters",
      "Export functionality", 
      "CRM integration",
      "Regular data updates"
    ],
    description: "Your gateway to business intelligence and prospecting success"
  })
})

// POST /api/insight/filters - Preview filter results (light version)
app.post('/api/insight/filters', authenticateRequest, (req, res) => {
  const filters = req.body
  
  // Apply basic filtering for preview
  let filteredCompanies = [...mockCompanies]
  
  filters.forEach(filter => {
    if (filter.filterCategory === "city" && filter.SelectOption?.length > 0) {
      filteredCompanies = filteredCompanies.filter(company => 
        filter.SelectOption.some(city => 
          company.city.toLowerCase().includes(city.toLowerCase())
        )
      )
    }
    
    if (filter.filterCategory === "branch" && filter.SelectOption?.length > 0) {
      filteredCompanies = filteredCompanies.filter(company => 
        filter.SelectOption.some(branch => 
          company.branch.toLowerCase().includes(branch.toLowerCase())
        )
      )
    }
    
    if (filter.filterCategory === "employees" && filter.SelectRange) {
      const { min, max } = filter.SelectRange
      filteredCompanies = filteredCompanies.filter(company => 
        company.employees >= (min || 0) && company.employees <= (max || 1000)
      )
    }
  })
  
  res.json({
    previewCount: filteredCompanies.length,
    totalAvailable: mockCompanies.length
  })
})

// POST /api/insight/prospects - Get full filter results with pagination
app.post('/api/insight/prospects', authenticateRequest, (req, res) => {
  const filters = req.body
  const skip = parseInt(req.query.skip) || 0
  const take = parseInt(req.query.take) || 25
  
  console.log('Received filters:', JSON.stringify(filters, null, 2))
  
  // Apply filtering
  let filteredCompanies = [...mockCompanies]
  
  filters.forEach(filter => {
    if (filter.filterCategory === "address" && filter.SelectOption?.length > 0) {
      filteredCompanies = filteredCompanies.filter(company => 
        filter.SelectOption.some(address => 
          company.address.toLowerCase().includes(address.toLowerCase())
        )
      )
    }
    
    if (filter.filterCategory === "city" && filter.SelectOption?.length > 0) {
      filteredCompanies = filteredCompanies.filter(company => 
        filter.SelectOption.some(city => 
          company.city.toLowerCase().includes(city.toLowerCase())
        )
      )
    }
    
    if (filter.filterCategory === "branch" && filter.SelectOption?.length > 0) {
      filteredCompanies = filteredCompanies.filter(company => 
        filter.SelectOption.some(branch => 
          company.branch.toLowerCase().includes(branch.toLowerCase())
        )
      )
    }
    
    if (filter.filterCategory === "employees" && filter.SelectRange) {
      const { min, max } = filter.SelectRange
      filteredCompanies = filteredCompanies.filter(company => 
        company.employees >= (min || 0) && company.employees <= (max || 1000)
      )
    }
  })
  
  // Apply pagination
  const paginatedResults = filteredCompanies.slice(skip, skip + take)
  
  console.log(`Returning ${paginatedResults.length} companies out of ${filteredCompanies.length} filtered from ${mockCompanies.length} total`)
  
  res.json(paginatedResults)
})

// POST /api/insight/leads - Create leads from selected companies  
app.post('/api/insight/leads', authenticateRequest, (req, res) => {
  const companies = req.body
  
  console.log(`Creating leads for ${companies.length} companies`)
  
  // In a real implementation, this would save to database
  // For mock, we just return success
  res.json({
    success: true,
    leadsCreated: companies.length,
    message: 'Companies successfully added to prospects'
  })
})

// GET /api/insight/validatelogin - Validate authentication
app.get('/api/insight/validatelogin', authenticateRequest, (req, res) => {
  res.json({
    valid: true,
    message: 'Authentication successful'
  })
})

// GET /api/insight/account - Get account details
app.get('/api/insight/account', authenticateRequest, (req, res) => {
  res.json({
    clientId: "demo_client",
    accountType: "Premium",
    searchesRemaining: 9500,
    expiryDate: "2024-12-31",
    features: ["Advanced Search", "Export", "API Access"]
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err)
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'API endpoint not found',
    path: req.path
  })
})

app.listen(port, () => {
  console.log(`Mock Prospector API server running at http://localhost:${port}`)
  console.log(`Loaded ${mockCompanies.length} mock companies`)
  console.log('Available endpoints:')
  console.log('  GET  /api/insight/filters')
  console.log('  GET  /api/information/landingpage') 
  console.log('  POST /api/insight/filters')
  console.log('  POST /api/insight/prospects')
  console.log('  POST /api/insight/leads')
  console.log('  GET  /api/insight/validatelogin')
  console.log('  GET  /api/insight/account')
}) 