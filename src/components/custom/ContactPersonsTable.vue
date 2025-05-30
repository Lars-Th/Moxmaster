<script setup lang="ts">
import { ref, computed } from 'vue'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Mail, Trash2, Star, Edit, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-vue-next'
import type { ContactPerson } from '@/stores/customerStore'

interface Props {
  contactPersons: ContactPerson[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'delete-contact': [id: number, name: string]
  'send-email': [email: string]
  'edit-contact': [person: ContactPerson]
}>()

// Sorting
const sortField = ref('')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Sorted data
const sortedData = computed(() => {
  if (!sortField.value) return props.contactPersons
  
  return [...props.contactPersons].sort((a, b) => {
    const aValue = a[sortField.value as keyof ContactPerson]
    const bValue = b[sortField.value as keyof ContactPerson]
    
    if (sortDirection.value === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })
})

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

const sendEmail = (email: string) => {
  emit('send-email', email)
}

const deleteContact = (id: number, name: string) => {
  emit('delete-contact', id, name)
}

const editContact = (person: ContactPerson) => {
  emit('edit-contact', person)
}

// Column definitions
const columns = [
  { key: 'name', label: 'Namn', sortable: true },
  { key: 'title', label: 'Titel', sortable: true },
  { key: 'department', label: 'Avdelning', sortable: true },
  { key: 'phone', label: 'Telefon', sortable: false },
  { key: 'isMainContact', label: 'Huvudkontakt', sortable: true },
  { key: 'actions', label: 'Åtgärder', sortable: false }
]
</script>

<template>
  <div class="border-t border-gray-200">
    <Table>
      <TableHeader class="bg-gray-100 border-t border-gray-300">
        <TableRow>
          <TableHead 
            v-for="column in columns" 
            :key="column.key"
            :class="[
              'bg-gray-100 text-xs',
              column.sortable ? 'cursor-pointer' : '',
              column.key === 'actions' ? 'text-right' : ''
            ]"
            @click="column.sortable ? sortBy(column.key) : null"
          >
            <div v-if="column.sortable" class="flex items-center gap-2">
              {{ column.label }}
              <component :is="getSortIcon(column.key)" class="h-3 w-3" />
            </div>
            <span v-else>{{ column.label }}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="sortedData.length === 0">
          <TableCell :colspan="columns.length" class="text-center py-8">
            <p class="text-muted-foreground text-sm">Inga kontaktpersoner registrerade.</p>
          </TableCell>
        </TableRow>
        <TableRow 
          v-else
          v-for="person in sortedData" 
          :key="person.id" 
          class="hover:bg-gray-50"
        >
          <!-- Name -->
          <TableCell class="text-xs font-medium text-slate-700">
            {{ person.name }}
          </TableCell>
          
          <!-- Title -->
          <TableCell class="text-xs">
            {{ person.title || '-' }}
          </TableCell>
          
          <!-- Department -->
          <TableCell class="text-xs">
            {{ person.department || '-' }}
          </TableCell>
          
          <!-- Phone -->
          <TableCell class="text-xs">
            <Tooltip v-if="person.phone">
              <TooltipTrigger asChild>
                <a :href="`tel:${person.phone}`" class="text-blue-600 hover:underline">
                  {{ person.phone }}
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ring {{ person.name }}</p>
              </TooltipContent>
            </Tooltip>
            <span v-else class="text-gray-500">-</span>
          </TableCell>
          
          <!-- Main Contact -->
          <TableCell class="text-xs">
            <Badge 
              v-if="person.isMainContact" 
              variant="secondary" 
              class="text-xs px-2 py-0 bg-green-100 text-green-700 border border-green-200"
            >
              <Star class="h-3 w-3 mr-1 text-green-600 fill-green-600" />
              Ja
            </Badge>
            <span v-else class="text-xs text-gray-500">-</span>
          </TableCell>
          
          <!-- Actions -->
          <TableCell class="text-right">
            <div class="flex justify-end space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    @click="editContact(person)"
                    class="p-1 text-green-600 hover:text-green-800"
                  >
                    <Edit class="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ändra {{ person.name }}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    @click="sendEmail(person.email)"
                    class="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <Mail class="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Skicka e-post till {{ person.name }}</p>
                </TooltipContent>
              </Tooltip>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        class="p-1 text-red-600 hover:text-red-800"
                        :disabled="person.isMainContact"
                        :class="{ 'opacity-50 cursor-not-allowed': person.isMainContact }"
                      >
                        <Trash2 class="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{{ person.isMainContact ? 'Kan inte ta bort huvudkontakt' : `Ta bort ${person.name}` }}</p>
                    </TooltipContent>
                  </Tooltip>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Ta bort kontaktperson</AlertDialogTitle>
                    <AlertDialogDescription>
                      Är du säker på att du vill ta bort {{ person.name }} från kontaktlistan? 
                      Denna åtgärd kan inte ångras.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel class="text-xs h-8">Avbryt</AlertDialogCancel>
                    <AlertDialogAction 
                      @click="deleteContact(person.id, person.name)"
                      class="text-xs h-8 bg-red-600 hover:bg-red-700"
                    >
                      Ta bort
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <div class="border-b border-gray-300"></div>
  </div>
</template> 