<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronUp, ChevronDown, ArrowUpDown, Plus, Filter, Mail, Trash2, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-vue-next'
import PageLayout from '@/components/ui/PageLayout.vue'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const { confirm, success } = useNotifications()

// Simulerad kunddata med 25 kunder och ort istället för email
const customers = ref([
  { id: 1, name: 'Anna Andersson', city: 'Stockholm', phone: '070-123 45 67', company: 'Tech Solutions AB', status: 'Aktiv', email: 'anna.andersson@email.se' },
  { id: 2, name: 'Erik Svensson', city: 'Göteborg', phone: '070-234 56 78', company: 'Digital Innovations', status: 'Aktiv', email: 'erik.svensson@email.se' },
  { id: 3, name: 'Maria Lindberg', city: 'Malmö', phone: '070-345 67 89', company: 'Future Systems', status: 'Inaktiv', email: 'maria.lindberg@email.se' },
  { id: 4, name: 'Johan Nilsson', city: 'Uppsala', phone: '070-456 78 90', company: 'Smart Tech', status: 'Aktiv', email: 'johan.nilsson@email.se' },
  { id: 5, name: 'Lisa Bergström', city: 'Västerås', phone: '070-567 89 01', company: 'Nordic Solutions', status: 'Aktiv', email: 'lisa.bergstrom@email.se' },
  { id: 6, name: 'Peter Ekström', city: 'Örebro', phone: '070-678 90 12', company: 'Tech Partners', status: 'Inaktiv', email: 'peter.ekstrom@email.se' },
  { id: 7, name: 'Emma Johansson', city: 'Linköping', phone: '070-789 01 23', company: 'Digital Future', status: 'Aktiv', email: 'emma.johansson@email.se' },
  { id: 8, name: 'Anders Larsson', city: 'Helsingborg', phone: '070-890 12 34', company: 'Smart Systems', status: 'Aktiv', email: 'anders.larsson@email.se' },
  { id: 9, name: 'Sofia Karlsson', city: 'Jönköping', phone: '070-901 23 45', company: 'Tech Vision', status: 'Inaktiv', email: 'sofia.karlsson@email.se' },
  { id: 10, name: 'Mikael Bergman', city: 'Norrköping', phone: '070-012 34 56', company: 'Future Tech', status: 'Aktiv', email: 'mikael.bergman@email.se' },
  { id: 11, name: 'Karin Holm', city: 'Lund', phone: '070-111 22 33', company: 'Innovation Labs', status: 'Aktiv', email: 'karin.holm@email.se' },
  { id: 12, name: 'Magnus Olsson', city: 'Umeå', phone: '070-222 33 44', company: 'Northern Tech', status: 'Aktiv', email: 'magnus.olsson@email.se' },
  { id: 13, name: 'Helena Strand', city: 'Karlstad', phone: '070-333 44 55', company: 'West Solutions', status: 'Inaktiv', email: 'helena.strand@email.se' },
  { id: 14, name: 'Robert Lindqvist', city: 'Gävle', phone: '070-444 55 66', company: 'Central Systems', status: 'Aktiv', email: 'robert.lindqvist@email.se' },
  { id: 15, name: 'Camilla Nyberg', city: 'Sundsvall', phone: '070-555 66 77', company: 'North Digital', status: 'Aktiv', email: 'camilla.nyberg@email.se' },
  { id: 16, name: 'Daniel Forsberg', city: 'Borås', phone: '070-666 77 88', company: 'Textile Tech', status: 'Inaktiv', email: 'daniel.forsberg@email.se' },
  { id: 17, name: 'Susanne Ek', city: 'Eskilstuna', phone: '070-777 88 99', company: 'Metro Solutions', status: 'Aktiv', email: 'susanne.ek@email.se' },
  { id: 18, name: 'Patrik Hedberg', city: 'Halmstad', phone: '070-888 99 00', company: 'Coast Digital', status: 'Aktiv', email: 'patrik.hedberg@email.se' },
  { id: 19, name: 'Jenny Blomqvist', city: 'Växjö', phone: '070-999 00 11', company: 'Forest Tech', status: 'Inaktiv', email: 'jenny.blomqvist@email.se' },
  { id: 20, name: 'Mattias Sjöberg', city: 'Kalmar', phone: '070-000 11 22', company: 'Baltic Systems', status: 'Aktiv', email: 'mattias.sjoberg@email.se' },
  { id: 21, name: 'Annika Lundgren', city: 'Kristianstad', phone: '070-111 33 55', company: 'South Innovations', status: 'Aktiv', email: 'annika.lundgren@email.se' },
  { id: 22, name: 'Tobias Engström', city: 'Trollhättan', phone: '070-222 44 66', company: 'River Tech', status: 'Inaktiv', email: 'tobias.engstrom@email.se' },
  { id: 23, name: 'Malin Andersson', city: 'Skövde', phone: '070-333 55 77', company: 'Central Digital', status: 'Aktiv', email: 'malin.andersson@email.se' },
  { id: 24, name: 'Fredrik Gustafsson', city: 'Falun', phone: '070-444 66 88', company: 'Mountain Systems', status: 'Aktiv', email: 'fredrik.gustafsson@email.se' },
  { id: 25, name: 'Cecilia Wallin', city: 'Sandviken', phone: '070-555 77 99', company: 'Steel Tech', status: 'Inaktiv', email: 'cecilia.wallin@email.se' },
])

// Paginering
const currentPage = ref(1)
const itemsPerPage = 20

// Sök och filter
const searchQuery = ref('')
const statusFilter = ref('all')

// Sortering
const sortField = ref('')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Filtrerad och sorterad lista
const filteredCustomers = computed(() => {
  let filtered = customers.value.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      customer.city.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = statusFilter.value === 'all' || customer.status === statusFilter.value
    
    return matchesSearch && matchesStatus
  })

  // Sortering
  if (sortField.value) {
    filtered.sort((a, b) => {
      const aValue = a[sortField.value as keyof typeof a]
      const bValue = b[sortField.value as keyof typeof b]
      
      if (sortDirection.value === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }

  return filtered
})

// Paginerad lista
const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredCustomers.value.slice(start, end)
})

// Totalt antal sidor
const totalPages = computed(() => {
  return Math.ceil(filteredCustomers.value.length / itemsPerPage)
})

// Statistik för PageLayout
const stats = computed(() => [
  {
    value: customers.value.length,
    label: 'Totalt kunder'
  },
  {
    value: filteredCustomers.value.length,
    label: 'Visas nu'
  },
  {
    value: customers.value.filter(c => c.status === 'Aktiv').length,
    label: 'Aktiva',
    color: 'text-green-600'
  },
  {
    value: customers.value.filter(c => c.status === 'Inaktiv').length,
    label: 'Inaktiva',
    color: 'text-orange-600'
  }
])

const viewCustomerDetails = (customerId: number) => {
  router.push(`/customers/${customerId}`)
}

const getStatusBadgeVariant = (status: string) => {
  return status === 'Aktiv' ? 'default' : 'secondary'
}

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const getSortIcon = (field: string) => {
  if (sortField.value !== field) return ArrowUpDown
  return sortDirection.value === 'asc' ? ChevronUp : ChevronDown
}

const addNewCustomer = () => {
  // Här skulle vi navigera till en "lägg till kund" sida
  console.log('Lägg till ny kund')
}

const sendEmail = (customer: any, event: Event) => {
  event.stopPropagation() // Förhindra att raden klickas
  window.location.href = `mailto:${customer.email}`
}

const deleteCustomer = async (customerId: number, event: Event) => {
  event.stopPropagation() // Förhindra att raden klickas
  
  const customer = customers.value.find(c => c.id === customerId)
  if (!customer) return
  
  const confirmed = await confirm(
    'Ta bort kund',
    `Är du säker på att du vill ta bort ${customer.name} (${customer.company}) från kundlistan? Denna åtgärd kan inte ångras.`,
    {
      confirmText: 'Ta bort',
      cancelText: 'Avbryt',
      confirmVariant: 'destructive'
    }
  )
  
  if (confirmed) {
    const index = customers.value.findIndex(c => c.id === customerId)
    if (index > -1) {
      customers.value.splice(index, 1)
      success('Kund borttagen', `${customer.name} har tagits bort från kundlistan.`)
    }
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
</script>

<template>
  <PageLayout
    title="Kunder"
    breadcrumbs="Home / Kunder"
    :show-stats="true"
    :stats="stats"
  >
    <template #actions>
      <Button @click="addNewCustomer" class="text-xs h-8">
        <Plus class="h-3 w-3 mr-1" />
        Lägg till ny kund
      </Button>
    </template>

    <template #filters>
      <div class="flex flex-col gap-2">
        <div class="flex gap-2 items-center">
          <Input
            v-model="searchQuery"
            placeholder="Sök på namn, ort eller företag..."
            class="w-64 h-8"
            style="font-size: 12px;"
          />
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SlidersHorizontal class="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem @click="statusFilter = 'all'">Alla</DropdownMenuItem>
              <DropdownMenuItem @click="statusFilter = 'Aktiv'">Aktiv</DropdownMenuItem>
              <DropdownMenuItem @click="statusFilter = 'Inaktiv'">Inaktiv</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <!-- Filter lista under -->
        <div v-if="statusFilter !== 'all'" class="flex gap-2 text-xs">
          <span class="text-muted-foreground">Filter:</span>
          <span class="bg-primary/10 text-primary px-2 py-1 rounded-md">
            Status: {{ statusFilter }}
            <button @click="statusFilter = 'all'" class="ml-1 hover:text-primary/70">×</button>
          </span>
        </div>
      </div>
    </template>

    <Table>
      <TableHeader class="bg-gray-100">
        <TableRow>
          <TableHead class="cursor-pointer bg-gray-100 text-xs" @click="sortBy('company')">
            <div class="flex items-center gap-2">
              Företag
              <component :is="getSortIcon('company')" class="h-3 w-3" />
            </div>
          </TableHead>
          <TableHead class="cursor-pointer bg-gray-100 text-xs" @click="sortBy('city')">
            <div class="flex items-center gap-2">
              Ort
              <component :is="getSortIcon('city')" class="h-3 w-3" />
            </div>
          </TableHead>
          <TableHead class="cursor-pointer bg-gray-100 text-xs" @click="sortBy('name')">
            <div class="flex items-center gap-2">
              Namn
              <component :is="getSortIcon('name')" class="h-3 w-3" />
            </div>
          </TableHead>
          <TableHead class="bg-gray-100 text-xs">Telefon</TableHead>
          <TableHead class="cursor-pointer bg-gray-100 text-xs" @click="sortBy('status')">
            <div class="flex items-center gap-2">
              Status
              <component :is="getSortIcon('status')" class="h-3 w-3" />
            </div>
          </TableHead>
          <TableHead class="bg-gray-100 text-xs text-right">Åtgärder</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="customer in paginatedCustomers" :key="customer.id" class="hover:bg-muted/30 cursor-pointer" @click="viewCustomerDetails(customer.id)">
          <TableCell class="font-bold text-xs">{{ customer.company }}</TableCell>
          <TableCell class="text-xs">{{ customer.city }}</TableCell>
          <TableCell class="text-slate-600 hover:text-slate-800 text-xs">{{ customer.name }}</TableCell>
          <TableCell class="text-xs">{{ customer.phone }}</TableCell>
          <TableCell>
            <Badge :variant="getStatusBadgeVariant(customer.status)" class="text-xs">
              {{ customer.status }}
            </Badge>
          </TableCell>
          <TableCell>
            <div class="flex gap-1 justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                class="text-xs h-6 w-6 p-0" 
                @click="sendEmail(customer, $event)"
                title="Skicka e-post"
              >
                <Mail class="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                class="text-xs h-6 w-6 p-0 text-red-600 hover:text-red-800" 
                @click="deleteCustomer(customer.id, $event)"
                title="Radera kund"
              >
                <Trash2 class="h-3 w-3" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- Paginering -->
    <div class="flex items-center justify-between mt-4 mb-8 px-4">
      <div class="text-xs text-muted-foreground">
        Visar {{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredCustomers.length) }} av {{ filteredCustomers.length }} kunder
      </div>
      <div class="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          class="text-xs h-8"
          @click="previousPage"
          :disabled="currentPage === 1"
        >
          <ChevronLeft class="h-3 w-3 mr-1" />
          Föregående
        </Button>
        
        <div class="flex gap-1">
          <Button
            v-for="page in Math.min(totalPages, 5)"
            :key="page"
            variant="outline"
            size="sm"
            class="text-xs h-8 w-8"
            :class="{ 'bg-primary text-primary-foreground': page === currentPage }"
            @click="goToPage(page)"
          >
            {{ page }}
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          class="text-xs h-8"
          @click="nextPage"
          :disabled="currentPage === totalPages"
        >
          Nästa
          <ChevronRight class="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  </PageLayout>
</template> 