import { defineStore } from 'pinia'
import contactsData from './contacts.json'

export interface Contact {
  id: number
  name: string
  city: string
  phone: string
  company: string
  status: 'Aktiv' | 'Inaktiv'
  email: string
  isMainContact: boolean
}

interface ContactState {
  contacts: Contact[]
}

export const useContactStore = defineStore('contact', {
  state: (): ContactState => ({
    contacts: contactsData as Contact[],
  }),
  getters: {
    activeContacts: (state): Contact[] => state.contacts.filter(contact => contact.status === 'Aktiv'),
    inactiveContacts: (state): Contact[] => state.contacts.filter(contact => contact.status === 'Inaktiv'),
    mainContacts: (state): Contact[] => state.contacts.filter(contact => contact.isMainContact),
    totalContacts: (state): number => state.contacts.length,
    getContactById: (state) => (id: number): Contact | undefined => state.contacts.find(contact => contact.id === id),
    getContactsByCompany: (state) => (company: string): Contact[] => state.contacts.filter(contact => contact.company === company),
  },
  actions: {
    addContact(contact: Omit<Contact, 'id'>) {
      this.contacts.push({ ...contact, id: Date.now() })
    },
    removeContact(id: number) {
      this.contacts = this.contacts.filter(c => c.id !== id)
    },
    updateContact(updated: Contact) {
      const index = this.contacts.findIndex(c => c.id === updated.id)
      if (index !== -1) {
        this.contacts[index] = updated
      }
    },
    async fetchContacts(): Promise<void> {
      // Replace this later with: await axios.get('/api/contacts')
      // For now, data is already loaded from JSON file
    }
  }
}) 