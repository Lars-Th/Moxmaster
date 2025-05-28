<script setup lang="ts">
import { useNotifications } from '@/composables/useNotifications'
import { Button } from '@/components/ui/button'
import PageLayout from '@/components/ui/PageLayout.vue'

const { 
  warning, 
  success, 
  error, 
  info, 
  confirm, 
  clearNotifications,
  globalWarning,
  globalSuccess,
  globalError,
  globalInfo
} = useNotifications()

// Lokala notifikationer
const showWarning = () => {
  warning(
    'Osparade ändringar',
    'Du har osparade ändringar som kommer att förloras om du lämnar sidan.'
  )
}

const showSuccess = () => {
  success(
    'Åtgärd genomförd!',
    'Din begäran har behandlats framgångsrikt.'
  )
}

const showError = () => {
  error(
    'Ett fel uppstod',
    'Kunde inte slutföra åtgärden. Kontrollera din internetanslutning och försök igen.'
  )
}

const showInfo = () => {
  info(
    'Information',
    'Detta är ett informationsmeddelande som försvinner automatiskt.'
  )
}

// Globala notifikationer
const showGlobalWarning = () => {
  globalWarning(
    'Systemvarning',
    'Detta är en global varning som syns på alla sidor.'
  )
}

const showGlobalSuccess = () => {
  globalSuccess(
    'Global framgång!',
    'Detta meddelande följer med dig till andra sidor.'
  )
}

const showGlobalError = () => {
  globalError(
    'Systemfel',
    'Ett globalt fel som användaren bör se oavsett vilken sida de är på.'
  )
}

const showGlobalInfo = () => {
  globalInfo(
    'Systemuppdatering',
    'Systemet kommer att uppdateras kl 02:00 inatt.'
  )
}

const showConfirm = async () => {
  const confirmed = await confirm(
    'Bekräfta åtgärd',
    'Är du säker på att du vill fortsätta? Denna åtgärd kan inte ångras.',
    {
      confirmText: 'Ja, fortsätt',
      cancelText: 'Avbryt',
      confirmVariant: 'destructive'
    }
  )
  
  if (confirmed) {
    success('Bekräftat!', 'Du valde att fortsätta med åtgärden.')
  } else {
    info('Avbrutet', 'Åtgärden avbröts.')
  }
}

const showMultiple = () => {
  warning('Lokal varning', 'Detta är en lokal varning.')
  globalWarning('Global varning', 'Detta är en global varning.')
  setTimeout(() => {
    error('Lokalt fel', 'Detta är ett lokalt felmeddelande.')
    globalError('Globalt fel', 'Detta är ett globalt felmeddelande.')
  }, 500)
  setTimeout(() => {
    success('Lokal framgång', 'Detta är ett lokalt framgångsmeddelande.')
    globalSuccess('Global framgång', 'Detta är ett globalt framgångsmeddelande.')
  }, 1000)
}
</script>

<template>
  <PageLayout
    title="Notifikationssystem Demo"
    breadcrumbs="Home / Demo / Notifikationer"
    :show-stats="false"
  >
    <template #actions>
      <Button @click="clearNotifications" variant="outline" class="text-xs h-8">
        Rensa alla notifikationer
      </Button>
    </template>

    <template #filters>
      <!-- Inga filter för demo -->
    </template>

    <div class="px-6 py-8">
      <div class="max-w-6xl mx-auto">
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4">Globalt Notifikationssystem</h2>
          <p class="text-sm text-gray-600 mb-6">
            Detta notifikationssystem hanterar både <strong>lokala</strong> (sidspecifika) och <strong>globala</strong> notifikationer. 
            Lokala notifikationer försvinner när du navigerar till en annan sida, medan globala notifikationer följer med dig.
          </p>
        </div>

        <!-- Lokala notifikationer -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold mb-4 text-blue-700">🏠 Lokala Notifikationer (Sidspecifika)</h3>
          <p class="text-sm text-gray-600 mb-6">
            Dessa notifikationer försvinner automatiskt när du navigerar till en annan sida. 
            Perfekt för formulärvarningar, lokala bekräftelser och sidspecifik feedback.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Lokala notifikationer -->
            <div class="bg-white p-4 rounded-lg border">
              <h4 class="font-semibold text-sm mb-2 text-amber-700">Lokal Varning</h4>
              <p class="text-xs text-gray-600 mb-3">
                Försvinner vid navigering
              </p>
              <Button @click="showWarning" class="w-full text-xs h-7" variant="outline">
                Visa lokal varning
              </Button>
            </div>

            <div class="bg-white p-4 rounded-lg border">
              <h4 class="font-semibold text-sm mb-2 text-green-700">Lokal Framgång</h4>
              <p class="text-xs text-gray-600 mb-3">
                Försvinner vid navigering
              </p>
              <Button @click="showSuccess" class="w-full text-xs h-7" variant="outline">
                Visa lokal framgång
              </Button>
            </div>

            <div class="bg-white p-4 rounded-lg border">
              <h4 class="font-semibold text-sm mb-2 text-red-700">Lokalt Fel</h4>
              <p class="text-xs text-gray-600 mb-3">
                Försvinner vid navigering
              </p>
              <Button @click="showError" class="w-full text-xs h-7" variant="outline">
                Visa lokalt fel
              </Button>
            </div>

            <div class="bg-white p-4 rounded-lg border">
              <h4 class="font-semibold text-sm mb-2 text-blue-700">Lokal Info</h4>
              <p class="text-xs text-gray-600 mb-3">
                Försvinner vid navigering
              </p>
              <Button @click="showInfo" class="w-full text-xs h-7" variant="outline">
                Visa lokal info
              </Button>
            </div>
          </div>
        </div>

        <!-- Globala notifikationer -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold mb-4 text-purple-700">🌍 Globala Notifikationer</h3>
          <p class="text-sm text-gray-600 mb-6">
            Dessa notifikationer följer med dig till andra sidor. 
            Perfekt för systemmeddelanden, viktiga uppdateringar och åtgärder som påverkar hela appen.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded-lg border">
              <h4 class="font-semibold text-sm mb-2 text-amber-700">Global Varning</h4>
              <p class="text-xs text-gray-600 mb-3">
                Följer med vid navigering
              </p>
              <Button @click="showGlobalWarning" class="w-full text-xs h-7" variant="outline">
                Visa global varning
              </Button>
            </div>

            <div class="bg-white p-4 rounded-lg border">
              <h4 class="font-semibold text-sm mb-2 text-green-700">Global Framgång</h4>
              <p class="text-xs text-gray-600 mb-3">
                Följer med vid navigering
              </p>
              <Button @click="showGlobalSuccess" class="w-full text-xs h-7" variant="outline">
                Visa global framgång
              </Button>
            </div>

            <div class="bg-white p-4 rounded-lg border">
              <h4 class="font-semibold text-sm mb-2 text-red-700">Globalt Fel</h4>
              <p class="text-xs text-gray-600 mb-3">
                Följer med vid navigering
              </p>
              <Button @click="showGlobalError" class="w-full text-xs h-7" variant="outline">
                Visa globalt fel
              </Button>
            </div>

            <div class="bg-white p-4 rounded-lg border">
              <h4 class="font-semibold text-sm mb-2 text-blue-700">Global Info</h4>
              <p class="text-xs text-gray-600 mb-3">
                Följer med vid navigering
              </p>
              <Button @click="showGlobalInfo" class="w-full text-xs h-7" variant="outline">
                Visa global info
              </Button>
            </div>
          </div>
        </div>

        <!-- Speciella funktioner -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold mb-4 text-gray-700">🔧 Speciella Funktioner</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Bekräftelsedialoger -->
            <div class="bg-white p-6 rounded-lg border">
              <h4 class="font-semibold text-lg mb-3 text-orange-700">Bekräftelse</h4>
              <p class="text-sm text-gray-600 mb-4">
                Bekräftelsedialoger är alltid lokala och försvinner vid navigering.
              </p>
              <Button @click="showConfirm" class="w-full text-xs h-8" variant="outline">
                Visa bekräftelse
              </Button>
            </div>

            <!-- Flera samtidigt -->
            <div class="bg-white p-6 rounded-lg border">
              <h4 class="font-semibold text-lg mb-3 text-purple-700">Blandade meddelanden</h4>
              <p class="text-sm text-gray-600 mb-4">
                Visa både lokala och globala meddelanden samtidigt för att se skillnaden.
              </p>
              <Button @click="showMultiple" class="w-full text-xs h-8" variant="outline">
                Visa blandade
              </Button>
            </div>

            <!-- Test navigering -->
            <div class="bg-white p-6 rounded-lg border">
              <h4 class="font-semibold text-lg mb-3 text-indigo-700">Testa navigering</h4>
              <p class="text-sm text-gray-600 mb-4">
                Visa lokala meddelanden och navigera sedan för att se att de försvinner.
              </p>
              <div class="space-y-2">
                <Button @click="showWarning" class="w-full text-xs h-7" variant="outline">
                  Visa lokal varning
                </Button>
                <Button @click="$router.push('/customers')" class="w-full text-xs h-7" variant="default">
                  Gå till kundlista
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-12 bg-gray-50 p-6 rounded-lg">
          <h3 class="font-semibold text-lg mb-4">Användning i kod</h3>
          <div class="space-y-4 text-sm">
            <div>
              <h4 class="font-medium mb-2">Import:</h4>
              <code class="bg-gray-100 px-2 py-1 rounded text-xs">
                import { useNotifications } from '@/composables/useNotifications'
              </code>
            </div>
            <div>
              <h4 class="font-medium mb-2">Lokala notifikationer (standard):</h4>
              <pre class="bg-gray-100 p-3 rounded text-xs overflow-x-auto"><code>const { warning, success, error, info } = useNotifications()

// Försvinner vid navigering
warning('Osparade ändringar', 'Spara innan du lämnar sidan')
success('Sparat!', 'Ändringarna har sparats')</code></pre>
            </div>
            <div>
              <h4 class="font-medium mb-2">Globala notifikationer:</h4>
              <pre class="bg-gray-100 p-3 rounded text-xs overflow-x-auto"><code>const { globalWarning, globalSuccess, globalError, globalInfo } = useNotifications()

// Följer med vid navigering
globalSuccess('Data synkroniserat', 'All data har synkroniserats med servern')
globalWarning('Systemunderhåll', 'Planerat underhåll kl 02:00')</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template> 