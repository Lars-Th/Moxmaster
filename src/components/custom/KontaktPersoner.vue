<template>
  <div>
    <!-- Kontaktpersoner sektion header -->
    <div class="mt-12">
      <Separator class="mb-6" />
      <div class="flex items-center justify-between mb-6 px-6">
        <h2 class="text-lg font-semibold">Kontaktpersoner</h2>
        <Dialog v-model:open="showAddContactDialog">
          <DialogTrigger asChild>
            <Button @click="addContactPerson" class="text-xs h-8">
              <Plus class="h-3 w-3 mr-1" />
              Lägg till kontaktperson
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Lägg till ny kontaktperson</DialogTitle>
              <DialogDescription>
                Fyll i informationen för den nya kontaktpersonen.
              </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="contact-name" class="text-right text-xs">Namn *</Label>
                <Input
                  id="contact-name"
                  v-model="newContact.name"
                  class="col-span-3 text-xs h-8"
                  style="font-size: 12px;"
                  placeholder="Förnamn Efternamn"
                />
              </div>
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="contact-title" class="text-right text-xs">Titel</Label>
                <Input
                  id="contact-title"
                  v-model="newContact.title"
                  class="col-span-3 text-xs h-8"
                  style="font-size: 12px;"
                  placeholder="VD, IT-chef, etc."
                />
              </div>
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="contact-department" class="text-right text-xs">Avdelning</Label>
                <Input
                  id="contact-department"
                  v-model="newContact.department"
                  class="col-span-3 text-xs h-8"
                  style="font-size: 12px;"
                  placeholder="IT, Ekonomi, etc."
                />
              </div>
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="contact-phone" class="text-right text-xs">Telefon</Label>
                <Input
                  id="contact-phone"
                  v-model="newContact.phone"
                  class="col-span-3 text-xs h-8"
                  style="font-size: 12px;"
                  placeholder="070-123 45 67"
                />
              </div>
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="contact-email" class="text-right text-xs">E-post *</Label>
                <Input
                  id="contact-email"
                  v-model="newContact.email"
                  type="email"
                  class="col-span-3 text-xs h-8"
                  style="font-size: 12px;"
                  placeholder="namn@företag.se"
                />
              </div>
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="contact-main" class="text-right text-xs">Huvudkontakt</Label>
                <div class="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="contact-main"
                    v-model:checked="newContact.isMainContact"
                  />
                  <Label for="contact-main" class="text-xs text-gray-600">
                    Sätt som huvudkontakt
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" @click="saveNewContact" class="text-xs h-8">
                Spara kontaktperson
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <!-- Kontaktpersonstabell - full bredd som kundlistan -->
    <TooltipProvider>
      <div class="border-t border-gray-200">
        <Table>
          <TableHeader class="bg-gray-100 border-t border-gray-300">
            <TableRow>
              <TableHead class="bg-gray-100 text-xs">Namn</TableHead>
              <TableHead class="bg-gray-100 text-xs">Titel</TableHead>
              <TableHead class="bg-gray-100 text-xs">Avdelning</TableHead>
              <TableHead class="bg-gray-100 text-xs">Telefon</TableHead>
              <TableHead class="bg-gray-100 text-xs">Huvudkontakt</TableHead>
              <TableHead class="bg-gray-100 text-xs text-right">Åtgärder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow 
              v-for="person in contactPersons" 
              :key="person.id" 
              class="hover:bg-gray-50"
            >
              <TableCell class="text-xs font-medium text-slate-700">{{ person.name }}</TableCell>
              <TableCell class="text-xs">{{ person.title }}</TableCell>
              <TableCell class="text-xs">{{ person.department }}</TableCell>
              <TableCell class="text-xs">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a :href="`tel:${person.phone}`" class="text-blue-600 hover:underline">
                      {{ person.phone }}
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ring {{ person.name }}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
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
              <TableCell class="text-right">
                <div class="flex justify-end space-x-2">
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
                          @click="deleteContactPerson(person.id, person.name)"
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
    </TooltipProvider>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Plus, Mail, Trash2, Star } from 'lucide-vue-next'
import type { ContactPerson } from '@/stores/customerDetailStore'

interface Props {
  contactPersons: ContactPerson[]
}

defineProps<Props>()

const emit = defineEmits<{
  'add-contact': [contact: Omit<ContactPerson, 'id' | 'customerId'>]
  'delete-contact': [id: number, name: string]
  'send-email': [email: string]
}>()

// Dialog för ny kontaktperson
const showAddContactDialog = ref(false)
const newContact = ref({
  name: '',
  title: '',
  email: '',
  phone: '',
  department: '',
  isMainContact: false
})

const addContactPerson = () => {
  showAddContactDialog.value = true
}

const saveNewContact = () => {
  if (newContact.value.name && newContact.value.email) {
    emit('add-contact', { ...newContact.value })
    
    // Återställ formuläret
    newContact.value = {
      name: '',
      title: '',
      email: '',
      phone: '',
      department: '',
      isMainContact: false
    }
    
    showAddContactDialog.value = false
  }
}

const sendEmail = (email: string) => {
  emit('send-email', email)
}

const deleteContactPerson = (id: number, name: string) => {
  emit('delete-contact', id, name)
}
</script> 