import { defineStore } from 'pinia'
import customersData from './customers.json'
import contactPersonsData from './contactPersons.json'

export interface Customer {
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

export interface ContactPerson {
  id: number
  name: string
  title: string
  email: string
  phone: string
  department: string
  isMainContact: boolean
  customerId: number
}

interface CustomerState {
  customers: Customer[]
  contactPersons: ContactPerson[]
}

export const useCustomerStore = defineStore('customer', {
  state: (): CustomerState => ({
    customers: customersData as Customer[],
    contactPersons: contactPersonsData as ContactPerson[]
  }),
  getters: {
    activeCustomers: (state): Customer[] => state.customers.filter(customer => customer.status === 'Aktiv'),
    inactiveCustomers: (state): Customer[] => state.customers.filter(customer => customer.status === 'Inaktiv'),
    totalCustomers: (state): number => state.customers.length,
    getCustomerById: (state) => (id: number): Customer | undefined => state.customers.find(customer => customer.id === id),
    getContactPersonsByCustomerId: (state) => (customerId: number): ContactPerson[] => state.contactPersons.filter(contact => contact.customerId === customerId),
    getMainContactByCustomerId: (state) => (customerId: number): ContactPerson | undefined => state.contactPersons.find(contact => contact.customerId === customerId && contact.isMainContact),
    customersByType: (state) => (type: 'Kund' | 'Leverantör' | 'ÅF' | 'Prospect'): Customer[] => state.customers.filter(customer => customer.companyType === type),
  },
  actions: {
    addCustomer(customer: Omit<Customer, 'id'>) {
      this.customers.push({ ...customer, id: Date.now() })
    },
    removeCustomer(id: number) {
      this.customers = this.customers.filter(c => c.id !== id)
      // Also remove associated contact persons
      this.contactPersons = this.contactPersons.filter(cp => cp.customerId !== id)
    },
    updateCustomer(updated: Customer) {
      const index = this.customers.findIndex(c => c.id === updated.id)
      if (index !== -1) {
        this.customers[index] = updated
      }
    },
    addContactPerson(contactPerson: Omit<ContactPerson, 'id'>) {
      this.contactPersons.push({ ...contactPerson, id: Date.now() })
    },
    removeContactPerson(id: number) {
      this.contactPersons = this.contactPersons.filter(cp => cp.id !== id)
    },
    updateContactPerson(updated: ContactPerson) {
      const index = this.contactPersons.findIndex(cp => cp.id === updated.id)
      if (index !== -1) {
        this.contactPersons[index] = updated
      }
    },
    setMainContact(customerId: number, contactId: number) {
      // First, remove main contact status from all contacts for this customer
      this.contactPersons.forEach(cp => {
        if (cp.customerId === customerId) {
          cp.isMainContact = false
        }
      })
      // Then set the specified contact as main contact
      const contact = this.contactPersons.find(cp => cp.id === contactId)
      if (contact) {
        contact.isMainContact = true
      }
    },
    async fetchCustomers(): Promise<void> {
      // Replace this later with: await axios.get('/api/customers')
      // For now, data is already loaded from JSON files
    }
  }
}) 