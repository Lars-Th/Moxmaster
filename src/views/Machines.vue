<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWorkOrderStore } from '@/stores/workOrderStore'
import { useNotifications } from '@/composables/useNotifications'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import PageLayout from '@/components/custom/PageLayout.vue'
import DataTable from '@/components/custom/DataTable.vue'

const workOrderStore = useWorkOrderStore()
const { success, error, confirm } = useNotifications()

// Modal state
const isMachineModalOpen = ref(false)
const editingMachine = ref<string | null>(null)
const machineForm = ref({
  name: ''
})

// Machine columns for DataTable
const machineColumns = [
  {
    key: 'name',
    label: 'Maskinnamn',
    sortable: true,
    width: '70%'
  },
  {
    key: 'actions',
    label: 'Åtgärder',
    sortable: false,
    width: '30%',
    type: 'actions' as const,
    align: 'right' as const
  }
]

// Transform machines for DataTable
const transformedMachines = computed(() => {
  return workOrderStore.machines.map((machine, index) => ({
    id: index,
    name: machine
  }))
})

// Page stats
const stats = computed(() => [
  {
    title: 'Totalt maskiner',
    value: workOrderStore.machines.length.toString(),
    change: '',
    trend: 'neutral' as const
  },
  {
    title: 'Aktiva maskiner',
    value: workOrderStore.machines.length.toString(),
    change: '',
    trend: 'up' as const
  },
  {
    title: 'Nya denna månad',
    value: '2',
    change: '+100%',
    trend: 'up' as const
  },
  {
    title: 'Underhåll planerat',
    value: '3',
    change: '',
    trend: 'neutral' as const
  }
])

// Machine management
const openMachineModal = (machine?: any) => {
  if (machine) {
    editingMachine.value = machine.name
    machineForm.value.name = machine.name
  } else {
    editingMachine.value = null
    machineForm.value.name = ''
  }
  isMachineModalOpen.value = true
}

const saveMachine = () => {
  if (!machineForm.value.name.trim()) {
    error('Maskinnamn saknas', 'Vänligen ange ett maskinnamn.')
    return
  }

  if (editingMachine.value) {
    // Update existing machine
    const index = workOrderStore.machines.findIndex(m => m === editingMachine.value)
    if (index >= 0) {
      workOrderStore.machines[index] = machineForm.value.name.trim()
      success('Maskin uppdaterad', 'Maskinens namn har uppdaterats.')
    }
  } else {
    // Add new machine
    if (workOrderStore.machines.includes(machineForm.value.name.trim())) {
      error('Maskin finns redan', 'En maskin med detta namn finns redan.')
      return
    }
    workOrderStore.machines.push(machineForm.value.name.trim())
    success('Maskin tillagd', 'Ny maskin har lagts till.')
  }

  isMachineModalOpen.value = false
}

const deleteMachine = async (machine: any) => {
  const confirmed = await confirm(
    'Ta bort maskin',
    `Är du säker på att du vill ta bort maskinen "${machine.name}"?`,
    {
      confirmText: 'Ta bort',
      cancelText: 'Avbryt',
      confirmVariant: 'destructive'
    }
  )

  if (confirmed) {
    const index = workOrderStore.machines.findIndex(m => m === machine.name)
    if (index >= 0) {
      workOrderStore.machines.splice(index, 1)
      success('Maskin borttagen', 'Maskinen har tagits bort.')
    }
  }
}
</script>

<template>
  <PageLayout
    title="Maskiner"
    breadcrumbs="Home / Maskiner"
    :stats="stats"
  >
    <template #actions>
      <div class="space-x-2">
        <Dialog v-model:open="isMachineModalOpen">
          <DialogTrigger asChild>
            <Button @click="openMachineModal()" class="text-xs h-8">
              <Plus class="h-3 w-3 mr-1" />
              Lägg till maskin
            </Button>
          </DialogTrigger>
          <DialogContent class="max-w-md">
            <DialogHeader>
              <DialogTitle>{{ editingMachine ? 'Redigera maskin' : 'Ny maskin' }}</DialogTitle>
            </DialogHeader>
            
            <div class="space-y-4">
              <div class="space-y-2">
                <Label for="machineName">Maskinnamn *</Label>
                <Input
                  id="machineName"
                  v-model="machineForm.name"
                  placeholder="T.ex. Grävmaskin CAT 320"
                  class="text-xs"
                />
              </div>

              <div class="flex justify-end space-x-2 pt-4">
                <Button variant="outline" @click="isMachineModalOpen = false" class="text-xs">
                  Avbryt
                </Button>
                <Button @click="saveMachine" class="text-xs">
                  {{ editingMachine ? 'Uppdatera' : 'Lägg till' }}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </template>

    <DataTable
      :data="transformedMachines"
      :columns="machineColumns"
      :items-per-page="10"
      :search-fields="['name']"
      :on-edit="openMachineModal"
      :on-delete="deleteMachine"
      delete-confirm-message="Är du säker på att du vill ta bort denna maskin?"
    >
      <!-- Custom actions -->
      <template #actions="{ row }">
        <div class="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            @click="openMachineModal(row)"
            class="h-6 w-6 p-0"
          >
            <Edit class="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            @click="deleteMachine(row)"
            class="h-6 w-6 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 class="h-3 w-3" />
          </Button>
        </div>
      </template>
    </DataTable>
  </PageLayout>
</template> 