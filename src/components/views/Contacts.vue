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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronUp, ChevronDown, ArrowUpDown, Plus, Mail, Trash2, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-vue-next'
import PageLayout from '@/components/ui/PageLayout.vue'

const router = useRouter()

// Simulerad kontaktpersonsdata med 25 kontakter
const contacts = ref([
  { id: 1, name: 'Anna Andersson', city: 'Stockholm', phone: '070-123 45 67', company: 'Tech Solutions AB', status: 'Aktiv', email: 'anna.andersson@techsolutions.se', isMainContact: true },
  { id: 2, name: 'Erik Svensson', city: 'Göteborg', phone: '070-234 56 78', company: 'Digital Innovations', status: 'Aktiv', email: 'erik.svensson@digitalinnovations.se', isMainContact: true },
  { id: 3, name: 'Maria Lindberg', city: 'Malmö', phone: '070-345 67 89', company: 'Future Systems', status: 'Inaktiv', email: 'maria.lindberg@futuresystems.se', isMainContact: false },
  { id: 4, name: 'Johan Nilsson', city: 'Uppsala', phone: '070-456 78 90', company: 'Smart Tech', status: 'Aktiv', email: 'johan.nilsson@smarttech.se', isMainContact: true },
  { id: 5, name: 'Lisa Bergström', city: 'Västerås', phone: '070-567 89 01', company: 'Nordic Solutions', status: 'Aktiv', email: 'lisa.bergstrom@nordicsolutions.se', isMainContact: false },
  { id: 6, name: 'Peter Ekström', city: 'Örebro', phone: '070-678 90 12', company: 'Tech Partners', status: 'Inaktiv', email: 'peter.ekstrom@techpartners.se', isMainContact: false },
  { id: 7, name: 'Emma Johansson', city: 'Linköping', phone: '070-789 01 23', company: 'Digital Future', status: 'Aktiv', email: 'emma.johansson@digitalfuture.se', isMainContact: true },
  { id: 8, name: 'Anders Larsson', city: 'Helsingborg', phone: '070-890 12 34', company: 'Smart Systems', status: 'Aktiv', email: 'anders.larsson@smartsystems.se', isMainContact: true },
  { id: 9, name: 'Sofia Karlsson', city: 'Jönköping', phone: '070-901 23 45', company: 'Tech Vision', status: 'Inaktiv', email: 'sofia.karlsson@techvision.se', isMainContact: false },
  { id: 10, name: 'Mikael Bergman', city: 'Norrköping', phone: '070-012 34 56', company: 'Future Tech', status: 'Aktiv', email: 'mikael.bergman@futuretech.se', isMainContact: true },
  { id: 11, name: 'Karin Holm', city: 'Lund', phone: '070-111 22 33', company: 'Innovation Labs', status: 'Aktiv', email: 'karin.holm@innovationlabs.se', isMainContact: true },
  { id: 12, name: 'Magnus Olsson', city: 'Umeå', phone: '070-222 33 44', company: 'Northern Tech', status: 'Aktiv', email: 'magnus.olsson@northerntech.se', isMainContact: true },
  { id: 13, name: 'Helena Strand', city: 'Karlstad', phone: '070-333 44 55', company: 'West Solutions', status: 'Inaktiv', email: 'helena.strand@westsolutions.se', isMainContact: false },
  { id: 14, name: 'Robert Lindqvist', city: 'Gävle', phone: '070-444 55 66', company: 'Central Systems', status: 'Aktiv', email: 'robert.lindqvist@centralsystems.se', isMainContact: true },
  { id: 15, name: 'Camilla Nyberg', city: 'Sundsvall', phone: '070-555 66 77', company: 'North Digital', status: 'Aktiv', email: 'camilla.nyberg@northdigital.se', isMainContact: true },
  { id: 16, name: 'Daniel Forsberg', city: 'Borås', phone: '070-666 77 88', company: 'Textile Tech', status: 'Inaktiv', email: 'daniel.forsberg@textiletech.se', isMainContact: false },
  { id: 17, name: 'Susanne Ek', city: 'Eskilstuna', phone: '070-777 88 99', company: 'Metro Solutions', status: 'Aktiv', email: 'susanne.ek@metrosolutions.se', isMainContact: true },
  { id: 18, name: 'Patrik Hedberg', city: 'Halmstad', phone: '070-888 99 00', company: 'Coast Digital', status: 'Aktiv', email: 'patrik.hedberg@coastdigital.se', isMainContact: true },
  { id: 19, name: 'Jenny Blomqvist', city: 'Växjö', phone: '070-999 00 11', company: 'Forest Tech', status: 'Inaktiv', email: 'jenny.blomqvist@foresttech.se', isMainContact: false },
  { id: 20, name: 'Mattias Sjöberg', city: 'Kalmar', phone: '070-000 11 22', company: 'Baltic Systems', status: 'Aktiv', email: 'mattias.sjoberg@balticsystems.se', isMainContact: true },
  { id: 21, name: 'Annika Lundgren', city: 'Kristianstad', phone: '070-111 33 55', company: 'South Innovations', status: 'Aktiv', email: 'annika.lundgren@southinnovations.se', isMainContact: true },
  { id: 22, name: 'Tobias Engström', city: 'Trollhättan', phone: '070-222 44 66', company: 'River Tech', status: 'Inaktiv', email: 'tobias.engstrom@rivertech.se', isMainContact: false },
  { id: 23, name: 'Malin Andersson', city: 'Skövde', phone: '070-333 55 77', company: 'Central Digital', status: 'Aktiv', email: 'malin.andersson@centraldigital.se', isMainContact: true },
  { id: 24, name: 'Fredrik Gustafsson', city: 'Falun', phone: '070-444 66 88', company: 'Mountain Systems', status: 'Aktiv', email: 'fredrik.gustafsson@mountainsystems.se', isMainContact: true },
  { id: 25, name: 'Cecilia Wallin', city: 'Sandviken', phone: '070-555 77 99', company: 'Steel Tech', status: 'Inaktiv', email: 'cecilia.wallin@steeltech.se', isMainContact: false },
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
const filteredContacts = computed(() => {
  let filtered = contacts.value.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      contact.city.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = statusFilter.value === 'all' || contact.status === statusFilter.value
    
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
const paginatedContacts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredContacts.value.slice(start, end)
})

// Totalt antal sidor
const totalPages = computed(() => {
  return Math.ceil(filteredContacts.value.length / itemsPerPage)
})

// Statistik för PageLayout
const stats = computed(() => [
  {
    value: contacts.value.length,
    label: 'Totalt kontakter'
  },
  {
    value: filteredContacts.value.length,
    label: 'Visas nu'
  },
  {
    value: contacts.value.filter(c => c.isMainContact).length,
    label: 'Huvudkontakter',
    color: 'text-green-600'
  }
])

const viewContactDetails = (contactId: number) => {
  router.push(`/contacts/${contactId}`)
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

const addNewContact = () => {
  // Här skulle vi navigera till en "lägg till kontakt" sida
  console.log('Lägg till ny kontakt')
}

const sendEmail = (contact: any, event: Event) => {
  event.stopPropagation() // Förhindra att raden klickas
  window.location.href = `mailto:${contact.email}`
}

const deleteContact = (contactId: number, event: Event) => {
  event.stopPropagation() // Förhindra att raden klickas
  if (confirm('Är du säker på att du vill radera denna kontakt?')) {
    const index = contacts.value.findIndex(c => c.id === contactId)
    if (index > -1) {
      contacts.value.splice(index, 1)
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
    title="Kontaktpersoner"
    :breadcrumbs="`Home / Kontaktpersoner (${contacts.length})`"
    :show-stats="true"
    :stats="stats"
  >
    <template #actions>
      <Button @click="addNewContact" class="text-xs h-8">
        <Plus class="h-3 w-3 mr-1" />
        Lägg till ny kontakt
      </Button>
    </template>

    <template #filters>
      <div class="flex flex-col gap-2">
        <div class="flex gap-2 items-center">
          <Input
            v-model="searchQuery"
            placeholder="Sök på namn, företag eller telefon..."
            class="w-64 h-8"
            style="font-size: 12px;"
          />
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SlidersHorizontal class="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem @click="statusFilter = 'all'">Alla</DropdownMenuItem>
              <DropdownMenuItem @click="statusFilter = 'Huvudkontakt'">Huvudkontakter</DropdownMenuItem>
              <DropdownMenuItem @click="statusFilter = 'Kontakt'">Kontakter</DropdownMenuItem>
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
          <TableHead class="cursor-pointer bg-gray-100 text-xs" @click="sortBy('name')">
            <div class="flex items-center gap-2">
              Fullständigt namn
              <component :is="getSortIcon('name')" class="h-3 w-3" />
            </div>
          </TableHead>
          <TableHead class="cursor-pointer bg-gray-100 text-xs" @click="sortBy('company')">
            <div class="flex items-center gap-2">
              Företag
              <component :is="getSortIcon('company')" class="h-3 w-3" />
            </div>
          </TableHead>
          <TableHead class="bg-gray-100 text-xs">Telefon</TableHead>
          <TableHead class="cursor-pointer bg-gray-100 text-xs" @click="sortBy('isMainContact')">
            <div class="flex items-center gap-2">
              Status
              <component :is="getSortIcon('isMainContact')" class="h-3 w-3" />
            </div>
          </TableHead>
          <TableHead class="bg-gray-100 text-xs text-right">Åtgärder</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="contact in paginatedContacts" :key="contact.id" class="hover:bg-muted/30 cursor-pointer" @click="viewContactDetails(contact.id)">
          <TableCell class="font-bold text-xs">{{ contact.name }}</TableCell>
          <TableCell class="text-xs">{{ contact.company }}</TableCell>
          <TableCell class="text-xs">{{ contact.phone }}</TableCell>
          <TableCell>
            <Badge 
              :variant="contact.isMainContact ? 'default' : 'secondary'" 
              class="text-xs"
            >
              {{ contact.isMainContact ? 'Huvudkontakt' : 'Kontakt' }}
            </Badge>
          </TableCell>
          <TableCell>
            <div class="flex gap-1 justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                class="text-xs h-6 w-6 p-0" 
                @click="sendEmail(contact, $event)"
                title="Skicka e-post"
              >
                <Mail class="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                class="text-xs h-6 w-6 p-0 text-red-600 hover:text-red-800" 
                @click="deleteContact(contact.id, $event)"
                title="Radera kontakt"
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
        Visar {{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredContacts.length) }} av {{ filteredContacts.length }} kontakter
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