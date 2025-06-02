<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useImprovedCustomerStorage } from '@/storages/improvedCustomerStorage'
import { useProjectStorage } from '@/storages/projectStorage'

// =============================================================================
// STORE IMPORTS AND SETUP
// =============================================================================

const route = useRoute()
const customerStore = useImprovedCustomerStorage()
const projectStore = useProjectStorage()

// =============================================================================
// REACTIVE DATA
// =============================================================================

const selectedCustomerId = ref<number | null>(null)
const selectedProjectId = ref<number | null>(null)

// =============================================================================
// ONE-TO-MANY RELATIONSHIP EXAMPLE (Customer → Contact Persons)
// =============================================================================

// Get customer with all related data
const customerWithData = computed(() => {
  if (!selectedCustomerId.value) return null
  return customerStore.getCustomerWithContacts(selectedCustomerId.value)
})

// Get contact persons for selected customer
const contactPersons = computed(() => {
  if (!selectedCustomerId.value) return []
  return customerStore.getContactPersonsByCustomerId(selectedCustomerId.value)
})

// Get main contact for selected customer
const mainContact = computed(() => {
  if (!selectedCustomerId.value) return null
  return customerStore.getMainContactByCustomerId(selectedCustomerId.value)
})

// =============================================================================
// MANY-TO-MANY RELATIONSHIP EXAMPLE (Project ↔ Team Members)
// =============================================================================

// Get project with full team data
const projectWithTeam = computed(() => {
  if (!selectedProjectId.value) return null
  return projectStore.getProjectWithTeam(selectedProjectId.value)
})

// Get team members for selected project
const projectTeamMembers = computed(() => {
  if (!selectedProjectId.value) return []
  return projectStore.getTeamMembersByProjectId(selectedProjectId.value)
})

// Get project lead
const projectLead = computed(() => {
  if (!selectedProjectId.value) return null
  return projectStore.getProjectLead(selectedProjectId.value)
})

// =============================================================================
// CROSS-STORE LOOKUP EXAMPLE
// =============================================================================

// Example of combining data from multiple stores
const enrichedCustomerData = computed(() => {
  if (!selectedCustomerId.value) return null
  
  const customer = customerStore.getCustomerById(selectedCustomerId.value)
  if (!customer) return null
  
  const contacts = customerStore.getContactPersonsByCustomerId(selectedCustomerId.value)
  
  // Example: Get projects where customer contacts are team members
  const relatedProjects = contacts.flatMap(contact => {
    // Find team members with matching email (example cross-reference)
    const teamMembers = projectStore.teamMembers.filter(member => 
      member.email === contact.email
    )
    
    return teamMembers.flatMap(member =>
      projectStore.getProjectsByTeamMemberId(member.id)
    )
  })
  
  return {
    customer,
    contacts,
    mainContact: contacts.find(c => c.isMainContact),
    relatedProjects,
    stats: {
      contactCount: contacts.length,
      relatedProjectCount: relatedProjects.length
    }
  }
})

// =============================================================================
// ACTION METHODS
// =============================================================================

const addContactPerson = async (contactData: any) => {
  if (!selectedCustomerId.value) return
  
  const result = await customerStore.addContactPerson({
    ...contactData,
    customerId: selectedCustomerId.value
  })
  
  if (result.success) {
    console.log('Contact person added successfully')
  } else {
    console.error('Failed to add contact person:', result.error)
  }
}

const assignTeamMemberToProject = async (teamMemberId: number, assignmentData: any) => {
  if (!selectedProjectId.value) return
  
  const result = await projectStore.assignTeamMemberToProject(
    selectedProjectId.value,
    teamMemberId,
    assignmentData
  )
  
  if (result.success) {
    console.log('Team member assigned successfully')
  } else {
    console.error('Failed to assign team member:', result.error)
  }
}

const setMainContact = async (contactId: number) => {
  if (!selectedCustomerId.value) return
  
  const result = await customerStore.setMainContact(selectedCustomerId.value, contactId)
  
  if (result.success) {
    console.log('Main contact set successfully')
  } else {
    console.error('Failed to set main contact:', result.error)
  }
}

const setProjectLead = async (teamMemberId: number) => {
  if (!selectedProjectId.value) return
  
  const result = await projectStore.setProjectLead(selectedProjectId.value, teamMemberId)
  
  if (result.success) {
    console.log('Project lead set successfully')
  } else {
    console.error('Failed to set project lead:', result.error)
  }
}

// =============================================================================
// COMPUTED LISTS FOR DROPDOWNS
// =============================================================================

const availableCustomers = computed(() => customerStore.activeCustomers)
const availableProjects = computed(() => projectStore.activeProjects)
const availableTeamMembers = computed(() => projectStore.activeTeamMembers)

// =============================================================================
// REACTIVE STATISTICS
// =============================================================================

const statistics = computed(() => ({
  customers: {
    total: customerStore.totalCustomers,
    active: customerStore.activeCustomers.length,
    withoutMainContact: customerStore.customersWithoutMainContact.length
  },
  projects: {
    total: projectStore.totalProjects,
    active: projectStore.activeProjects.length,
    withoutLead: projectStore.projectsWithoutLead.length
  },
  teamMembers: {
    total: projectStore.totalTeamMembers,
    active: projectStore.activeTeamMembers.length,
    unassigned: projectStore.unassignedTeamMembers.length
  }
}))
</script>

<template>
  <div class="space-y-8 p-6">
    <!-- =================================================================== -->
    <!-- HEADER -->
    <!-- =================================================================== -->
    <div>
      <h1 class="text-2xl font-bold">Relationship Examples</h1>
      <p class="text-gray-600">
        Demonstrating standardized relationship patterns using foreign keys and store lookups
      </p>
    </div>

    <!-- =================================================================== -->
    <!-- STATISTICS DASHBOARD -->
    <!-- =================================================================== -->
    <div class="grid grid-cols-3 gap-4">
      <div class="bg-blue-50 p-4 rounded-lg">
        <h3 class="font-semibold text-blue-800">Customers</h3>
        <div class="text-sm text-blue-600">
          <div>Total: {{ statistics.customers.total }}</div>
          <div>Active: {{ statistics.customers.active }}</div>
          <div>Without Main Contact: {{ statistics.customers.withoutMainContact }}</div>
        </div>
      </div>
      
      <div class="bg-green-50 p-4 rounded-lg">
        <h3 class="font-semibold text-green-800">Projects</h3>
        <div class="text-sm text-green-600">
          <div>Total: {{ statistics.projects.total }}</div>
          <div>Active: {{ statistics.projects.active }}</div>
          <div>Without Lead: {{ statistics.projects.withoutLead }}</div>
        </div>
      </div>
      
      <div class="bg-purple-50 p-4 rounded-lg">
        <h3 class="font-semibold text-purple-800">Team Members</h3>
        <div class="text-sm text-purple-600">
          <div>Total: {{ statistics.teamMembers.total }}</div>
          <div>Active: {{ statistics.teamMembers.active }}</div>
          <div>Unassigned: {{ statistics.teamMembers.unassigned }}</div>
        </div>
      </div>
    </div>

    <!-- =================================================================== -->
    <!-- ONE-TO-MANY EXAMPLE: CUSTOMER → CONTACT PERSONS -->
    <!-- =================================================================== -->
    <div class="border rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">One-to-Many: Customer → Contact Persons</h2>
      
      <!-- Customer Selection -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Select Customer:</label>
        <select 
          v-model="selectedCustomerId" 
          class="w-full p-2 border rounded"
        >
          <option :value="null">-- Select a customer --</option>
          <option 
            v-for="customer in availableCustomers" 
            :key="customer.id" 
            :value="customer.id"
          >
            {{ customer.companyName }} ({{ customer.name }})
          </option>
        </select>
      </div>

      <!-- Customer Details -->
      <div v-if="customerWithData" class="bg-gray-50 p-4 rounded">
        <h3 class="font-semibold">{{ customerWithData.companyName }}</h3>
        <p class="text-sm text-gray-600">
          {{ customerWithData.contactCount }} contact person(s)
        </p>
        
        <!-- Main Contact -->
        <div v-if="mainContact" class="mt-2">
          <strong>Main Contact:</strong> {{ mainContact.name }} ({{ mainContact.title }})
        </div>
        
        <!-- All Contact Persons -->
        <div v-if="contactPersons.length > 0" class="mt-4">
          <h4 class="font-medium">Contact Persons:</h4>
          <ul class="list-disc list-inside">
            <li 
              v-for="contact in contactPersons" 
              :key="contact.id"
              class="text-sm"
              :class="{ 'font-semibold': contact.isMainContact }"
            >
              {{ contact.name }} - {{ contact.title }} 
              <span v-if="contact.isMainContact" class="text-green-600">(Main)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- =================================================================== -->
    <!-- MANY-TO-MANY EXAMPLE: PROJECT ↔ TEAM MEMBERS -->
    <!-- =================================================================== -->
    <div class="border rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Many-to-Many: Project ↔ Team Members</h2>
      
      <!-- Project Selection -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Select Project:</label>
        <select 
          v-model="selectedProjectId" 
          class="w-full p-2 border rounded"
        >
          <option :value="null">-- Select a project --</option>
          <option 
            v-for="project in availableProjects" 
            :key="project.id" 
            :value="project.id"
          >
            {{ project.name }} ({{ project.status }})
          </option>
        </select>
      </div>

      <!-- Project Details -->
      <div v-if="projectWithTeam" class="bg-gray-50 p-4 rounded">
        <h3 class="font-semibold">{{ projectWithTeam.name }}</h3>
        <p class="text-sm text-gray-600">
          Team Size: {{ projectWithTeam.teamSize }} | 
          Budget Allocated: ${{ projectWithTeam.totalBudgetAllocated }}
        </p>
        
        <!-- Project Lead -->
        <div v-if="projectLead" class="mt-2">
          <strong>Project Lead:</strong> 
          {{ projectLead.firstName }} {{ projectLead.lastName }} ({{ projectLead.role }})
        </div>
        
        <!-- Team Members -->
        <div v-if="projectTeamMembers.length > 0" class="mt-4">
          <h4 class="font-medium">Team Members:</h4>
          <ul class="list-disc list-inside">
            <li 
              v-for="member in projectTeamMembers" 
              :key="member.id"
              class="text-sm"
              :class="{ 'font-semibold': member.isLead }"
            >
              {{ member.firstName }} {{ member.lastName }} - {{ member.role }} 
              (${{ member.hourlyRate }}/hr)
              <span v-if="member.isLead" class="text-blue-600">(Lead)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- =================================================================== -->
    <!-- CROSS-STORE LOOKUP EXAMPLE -->
    <!-- =================================================================== -->
    <div class="border rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Cross-Store Lookup Example</h2>
      
      <div v-if="enrichedCustomerData" class="bg-gray-50 p-4 rounded">
        <h3 class="font-semibold">{{ enrichedCustomerData.customer.companyName }}</h3>
        
        <div class="grid grid-cols-2 gap-4 mt-4">
          <div>
            <h4 class="font-medium">Contact Information:</h4>
            <ul class="text-sm">
              <li v-for="contact in enrichedCustomerData.contacts" :key="contact.id">
                {{ contact.name }} ({{ contact.email }})
              </li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-medium">Related Projects:</h4>
            <ul class="text-sm">
              <li v-for="project in enrichedCustomerData.relatedProjects" :key="project.id">
                {{ project.name }} - {{ project.role }}
              </li>
            </ul>
          </div>
        </div>
        
        <div class="mt-4 text-sm text-gray-600">
          Stats: {{ enrichedCustomerData.stats.contactCount }} contacts, 
          {{ enrichedCustomerData.stats.relatedProjectCount }} related projects
        </div>
      </div>
    </div>
  </div>
</template> 