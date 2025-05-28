<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter,
  Button,
  Input,
  Label,
  Textarea
} from '@/components/ui'

const route = useRoute()
const customer = ref({
  id: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  notes: ''
})

// Simulerad data - i en riktig applikation skulle detta komma från en API
const customers = [
  {
    id: '1',
    name: 'Anna Andersson',
    email: 'anna.andersson@example.com',
    phone: '070-123 45 67',
    address: 'Storgatan 1, 123 45 Stockholm',
    notes: 'VIP-kund sedan 2020'
  },
  {
    id: '2',
    name: 'Erik Svensson',
    email: 'erik.svensson@example.com',
    phone: '070-234 56 78',
    address: 'Kungsgatan 10, 111 43 Stockholm',
    notes: 'Intresserad av nya produkter'
  }
]

onMounted(() => {
  // Hitta kunden baserat på ID från URL:en
  const foundCustomer = customers.find(c => c.id === route.params.id)
  if (foundCustomer) {
    customer.value = { ...foundCustomer }
  }
})

const saveCustomer = () => {
  // Här skulle vi normalt skicka data till en API
  console.log('Sparar kund:', customer.value)
  // Visa en bekräftelse till användaren
  alert('Kundinformationen har sparats!')
}
</script>

<template>
  <div class="container mx-auto py-8">
    <Card>
      <CardHeader>
        <CardTitle>Kunddetaljer</CardTitle>
        <CardDescription>
          Hantera kundinformation och kontaktuppgifter
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-6">
          <div class="grid gap-2">
            <Label for="name">Namn</Label>
            <Input 
              id="name" 
              v-model="customer.name"
              placeholder="Ange kundens namn"
            />
          </div>
          
          <div class="grid gap-2">
            <Label for="email">E-post</Label>
            <Input 
              id="email" 
              v-model="customer.email"
              type="email"
              placeholder="kund@example.com"
            />
          </div>
          
          <div class="grid gap-2">
            <Label for="phone">Telefon</Label>
            <Input 
              id="phone" 
              v-model="customer.phone"
              placeholder="070-123 45 67"
            />
          </div>
          
          <div class="grid gap-2">
            <Label for="address">Adress</Label>
            <Input 
              id="address" 
              v-model="customer.address"
              placeholder="Gatuadress, postnummer stad"
            />
          </div>
          
          <div class="grid gap-2">
            <Label for="notes">Anteckningar</Label>
            <Textarea 
              id="notes" 
              v-model="customer.notes"
              placeholder="Lägg till anteckningar om kunden..."
              rows="4"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter class="flex justify-end gap-4">
        <Button variant="outline" @click="$router.back()">
          Avbryt
        </Button>
        <Button @click="saveCustomer">
          Spara ändringar
        </Button>
      </CardFooter>
    </Card>
  </div>
</template> 