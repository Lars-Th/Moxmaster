import { defineStore } from 'pinia'
import type { 
  BaseEntity, 
  BaseStoreState
} from './baseTypes'
import { 
  validateForeignKey, 
  cascadeDelete, 
  generateId 
} from './baseTypes'
import customersData from './customers.json'
import contactsData from './contacts.json'

// =============================================================================
// ENTITY INTERFACES
// =============================================================================

export interface Customer extends BaseEntity {
  id: number
  name: string
  city: string
  phone: string
  companyName: string
  status: 'Aktiv' | 'Inaktiv'
  email: string
  // Detailed customer fields
  customerNumber: string
  organizationNumber: string
  referenceNumber: string
  streetAddress: string
  postalCode: string
  country: string
  billingStreetAddress: string
  billingPostalCode: string
  billingCity: string
  billingCountry: string
  switchboardNumber: string
  companyEmail: string
  website: string
  companyNotes: string
  companyType: 'Kund' | 'Leverantör' | 'ÅF' | 'Prospect'
}

export interface ContactPerson extends BaseEntity {
  id: number
  name: string
  title: string
  email: string
  phone: string
  department: string
  isMainContact: boolean
  customerId: number  // Foreign key to Customer
}

// =============================================================================
// DATA TRANSFORMATION
// =============================================================================

// Transform contacts.json data to ContactPerson format
const transformContactsToContactPersons = (): ContactPerson[] => {
  return contactsData.map((contact: any) => {
    // Find customer by company name to get customerId
    const customer = customersData.find((c: any) => c.companyName === contact.company)
    
    return {
      id: contact.id,
      name: contact.name,
      title: 'Kontaktperson', // Default title since not in contacts.json
      email: contact.email,
      phone: contact.phone,
      department: 'Allmän', // Default department since not in contacts.json
      isMainContact: contact.isMainContact,
      customerId: customer?.id || 1, // Fallback to customer 1 if not found
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
}

// =============================================================================
// STORE INTERFACES
// =============================================================================

interface CustomerStoreState extends BaseStoreState {
  customers: Customer[]
  contactPersons: ContactPerson[]
}

// =============================================================================
// RELATIONSHIP METADATA
// =============================================================================

const RELATIONSHIPS = {
  CUSTOMER_CONTACT_PERSONS: {
    type: 'one-to-many' as const,
    parentEntity: 'Customer',
    childEntity: 'ContactPerson',
    foreignKeyField: 'customerId',
    cascadeDelete: true
  }
}

// =============================================================================
// STORE DEFINITION
// =============================================================================

export const useCustomerStorage = defineStore('Customer', {
  state: (): CustomerStoreState => ({
    customers: customersData as Customer[],
    contactPersons: transformContactsToContactPersons(),
    loading: false,
    error: null,
    lastUpdated: null
  }),

  // =============================================================================
  // GETTERS
  // =============================================================================
  
  getters: {
    // Basic entity getters
    getCustomerById: (state) => (id: number): Customer | undefined => 
      state.customers.find(customer => customer.id === id),
    
    getContactPersonById: (state) => (id: number): ContactPerson | undefined =>
      state.contactPersons.find(contact => contact.id === id),

    // Status-based getters
    activeCustomers: (state): Customer[] => 
      state.customers.filter(customer => customer.status === 'Aktiv'),
    
    inactiveCustomers: (state): Customer[] => 
      state.customers.filter(customer => customer.status === 'Inaktiv'),

    // Type-based getters
    customersByType: (state) => (type: Customer['companyType']): Customer[] =>
      state.customers.filter(customer => customer.companyType === type),

    // =============================================================================
    // RELATIONSHIP GETTERS (ONE-TO-MANY: Customer -> Contact Persons)
    // =============================================================================
    
    getContactPersonsByCustomerId: (state) => (customerId: number): ContactPerson[] =>
      state.contactPersons.filter(contact => contact.customerId === customerId),
    
    getMainContactByCustomerId: (state) => (customerId: number): ContactPerson | undefined =>
      state.contactPersons.find(contact => 
        contact.customerId === customerId && contact.isMainContact
      ),

    // Enhanced getters with relationship data
    getCustomerWithContacts: (state) => (customerId: number) => {
      const customer = state.customers.find(c => c.id === customerId)
      if (!customer) return undefined
      
      const contactPersons = state.contactPersons.filter(cp => cp.customerId === customerId)
      const mainContact = contactPersons.find(cp => cp.isMainContact)
      
      return {
        ...customer,
        contactPersons,
        mainContact,
        contactCount: contactPersons.length
      }
    },

    getAllCustomersWithMainContact: (state) => {
      return state.customers.map(customer => ({
        ...customer,
        mainContact: state.contactPersons.find(cp => 
          cp.customerId === customer.id && cp.isMainContact
        )
      }))
    },

    // Statistics
    totalCustomers: (state): number => state.customers.length,
    totalContactPersons: (state): number => state.contactPersons.length,
    
    customersWithoutMainContact: (state): Customer[] => {
      return state.customers.filter(customer => 
        !state.contactPersons.some(cp => 
          cp.customerId === customer.id && cp.isMainContact
        )
      )
    }
  },

  // =============================================================================
  // ACTIONS
  // =============================================================================
  
  actions: {
    // =============================================================================
    // CUSTOMER CRUD OPERATIONS
    // =============================================================================
    
    async addCustomer(customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) {
      try {
        this.loading = true
        this.error = null
        
        const newCustomer: Customer = {
          ...customerData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        this.customers.push(newCustomer)
        this.lastUpdated = new Date()
        
        return { success: true, data: newCustomer }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to add customer'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async updateCustomer(updatedCustomer: Customer) {
      try {
        this.loading = true
        this.error = null
        
        const index = this.customers.findIndex(c => c.id === updatedCustomer.id)
        if (index === -1) {
          throw new Error(`Customer with ID ${updatedCustomer.id} not found`)
        }
        
        this.customers[index] = {
          ...updatedCustomer,
          updatedAt: new Date()
        }
        this.lastUpdated = new Date()
        
        return { success: true, data: this.customers[index] }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update customer'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async removeCustomer(customerId: number) {
      try {
        this.loading = true
        this.error = null
        
        const customerExists = this.customers.some(c => c.id === customerId)
        if (!customerExists) {
          throw new Error(`Customer with ID ${customerId} not found`)
        }
        
        // Remove customer
        this.customers = this.customers.filter(c => c.id !== customerId)
        
        // CASCADE DELETE: Remove all related contact persons
        if (RELATIONSHIPS.CUSTOMER_CONTACT_PERSONS.cascadeDelete) {
          this.contactPersons = cascadeDelete(
            this.contactPersons,
            RELATIONSHIPS.CUSTOMER_CONTACT_PERSONS.foreignKeyField,
            customerId
          )
        }
        
        this.lastUpdated = new Date()
        return { success: true }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to remove customer'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // =============================================================================
    // CONTACT PERSON CRUD OPERATIONS
    // =============================================================================
    
    async addContactPerson(contactData: Omit<ContactPerson, 'id' | 'createdAt' | 'updatedAt'>) {
      try {
        this.loading = true
        this.error = null
        
        // FOREIGN KEY VALIDATION
        validateForeignKey(
          this.customers,
          contactData.customerId,
          'Customer'
        )
        
        const newContact: ContactPerson = {
          ...contactData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        this.contactPersons.push(newContact)
        this.lastUpdated = new Date()
        
        return { success: true, data: newContact }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to add contact person'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async updateContactPerson(updatedContact: ContactPerson) {
      try {
        this.loading = true
        this.error = null
        
        // FOREIGN KEY VALIDATION
        validateForeignKey(
          this.customers,
          updatedContact.customerId,
          'Customer'
        )
        
        const index = this.contactPersons.findIndex(cp => cp.id === updatedContact.id)
        if (index === -1) {
          throw new Error(`Contact person with ID ${updatedContact.id} not found`)
        }
        
        this.contactPersons[index] = {
          ...updatedContact,
          updatedAt: new Date()
        }
        this.lastUpdated = new Date()
        
        return { success: true, data: this.contactPersons[index] }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update contact person'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async removeContactPerson(contactId: number) {
      try {
        this.loading = true
        this.error = null
        
        const contactExists = this.contactPersons.some(cp => cp.id === contactId)
        if (!contactExists) {
          throw new Error(`Contact person with ID ${contactId} not found`)
        }
        
        this.contactPersons = this.contactPersons.filter(cp => cp.id !== contactId)
        this.lastUpdated = new Date()
        
        return { success: true }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to remove contact person'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // =============================================================================
    // RELATIONSHIP-SPECIFIC OPERATIONS
    // =============================================================================
    
    async setMainContact(customerId: number, contactId: number) {
      try {
        this.loading = true
        this.error = null
        
        // Validate that customer exists
        validateForeignKey(this.customers, customerId, 'Customer')
        
        // Validate that contact exists and belongs to the customer
        const contact = this.contactPersons.find(cp => 
          cp.id === contactId && cp.customerId === customerId
        )
        
        if (!contact) {
          throw new Error(
            `Contact person with ID ${contactId} not found for customer ${customerId}`
          )
        }
        
        // Remove main contact status from all contacts for this customer
        this.contactPersons.forEach(cp => {
          if (cp.customerId === customerId) {
            cp.isMainContact = false
            cp.updatedAt = new Date()
          }
        })
        
        // Set the specified contact as main contact
        contact.isMainContact = true
        contact.updatedAt = new Date()
        
        this.lastUpdated = new Date()
        return { success: true, data: contact }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to set main contact'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // =============================================================================
    // DATA FETCHING (FOR FUTURE API INTEGRATION)
    // =============================================================================
    
    async fetchCustomers(): Promise<void> {
      this.loading = true
      this.error = null
      
      try {
        // TODO: Replace with actual API call
        // const response = await api.get('/customers')
        // this.customers = response.data
        
        // For now, data is loaded from JSON files
        this.lastUpdated = new Date()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch customers'
      } finally {
        this.loading = false
      }
    },

    async fetchContactPersons(): Promise<void> {
      this.loading = true
      this.error = null
      
      try {
        // TODO: Replace with actual API call
        // const response = await api.get('/contact-persons')
        // this.contactPersons = response.data
        
        // For now, data is loaded from JSON files
        this.lastUpdated = new Date()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch contact persons'
      } finally {
        this.loading = false
      }
    },

    // =============================================================================
    // UTILITY ACTIONS
    // =============================================================================
    
    clearError() {
      this.error = null
    },

    resetStore() {
      this.customers = customersData as Customer[]
      this.contactPersons = transformContactsToContactPersons()
      this.loading = false
      this.error = null
      this.lastUpdated = null
    }
  }
}) 