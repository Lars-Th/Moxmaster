<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProspectorStore } from '@/stores/prospectorStore'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Send, Bot, User, AlertCircle, CheckCircle } from 'lucide-vue-next'

interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  filters?: any
  isError?: boolean
}

const prospectorStore = useProspectorStore()

// Chat state
const currentMessage = ref('')
const chatHistory = ref<ChatMessage[]>([
  {
    id: '1',
    type: 'bot',
    content: 'Hello! I\'m your AI search assistant connected to the bizFinder API.\n\n💡 **Note:** This frontend-only demo will show API connection errors. For full functionality, the bizFinder API requires server-side proxy integration.\n\nTry asking: "Find technology companies in Stockholm" to see how the integration works!',
    timestamp: new Date()
  }
])
const isTyping = ref(false)

// Computed
const canSend = computed(() => currentMessage.value.trim().length > 0 && !isTyping.value)
const isLoading = computed(() => prospectorStore.isLoading)

// Methods
const addMessage = (type: 'user' | 'bot', content: string, filters?: any, isError = false) => {
  const message: ChatMessage = {
    id: Date.now().toString(),
    type,
    content,
    timestamp: new Date(),
    filters,
    isError
  }
  chatHistory.value.push(message)
}

const sendMessage = async () => {
  if (!canSend.value) return

  const userMessage = currentMessage.value.trim()
  currentMessage.value = ''

  // Add user message
  addMessage('user', userMessage)

  // Show typing indicator
  isTyping.value = true

  try {
    // Get AI filters
    const filters = await prospectorStore.getAIFilters(userMessage)
    
    // Add bot response with filters
    const responseContent = `I've analyzed your request and generated search filters. I found criteria like: ${getFilterSummary(filters)}. Click "Search Companies" to find matching businesses.`
    addMessage('bot', responseContent, filters)

  } catch (error) {
    // Show specific error message from the store
    const errorMessage = prospectorStore.error || 'Sorry, I encountered an error processing your request.'
    
    if (errorMessage.includes('CORS') || errorMessage.includes('server-side proxy')) {
      addMessage('bot', '⚠️ **API Connection Issue**\n\nThe real bizFinder API requires server-side integration to work properly. This is a frontend-only demo.\n\n**For production:** Set up server-side proxy routes like in the bizFinder implementation.\n\n**For now:** You can test the UI and see how the integration would work.', undefined, true)
    } else {
      addMessage('bot', `❌ **Error:** ${errorMessage}\n\nPlease try again or contact support if the problem persists.`, undefined, true)
    }
  } finally {
    isTyping.value = false
  }
}

const searchWithFilters = async (filters: any) => {
  try {
    await prospectorStore.searchCompanies(filters)
    
    // Add success message
    const resultCount = prospectorStore.searchResults.length
    if (resultCount > 0) {
      addMessage('bot', `Great! I found ${resultCount} companies matching your criteria. Check the results table on the right.`)
    } else {
      addMessage('bot', 'I searched for companies but found no exact matches. You might want to try a broader search or different criteria.')
    }
  } catch (error) {
    addMessage('bot', 'Sorry, there was an error searching for companies. Please try again or contact support if the problem persists.', undefined, true)
  }
}

const getFilterSummary = (filters: any): string => {
  if (!filters) return 'various search criteria'
  
  const summary = []
  if (filters.location) summary.push(`location: ${filters.location}`)
  if (filters.industry) summary.push(`industry: ${filters.industry}`)
  if (filters.employeeRange) summary.push(`employees: ${filters.employeeRange}`)
  if (filters.turnoverRange) summary.push(`turnover: ${filters.turnoverRange}`)
  
  return summary.length > 0 ? summary.join(', ') : 'search criteria'
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="flex flex-col h-[60vh] max-h-[600px]">
    <!-- Chat History -->
    <ScrollArea class="flex-1 p-4 border border-border rounded-t-md">
      <div class="space-y-4">
        <div
          v-for="message in chatHistory"
          :key="message.id"
          class="flex items-start gap-3"
          :class="message.type === 'user' ? 'flex-row-reverse' : ''"
        >
          <!-- Avatar -->
          <div 
            class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
            :class="message.type === 'user' 
              ? 'bg-primary text-primary-foreground' 
              : message.isError 
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'"
          >
            <User v-if="message.type === 'user'" class="h-4 w-4" />
            <AlertCircle v-else-if="message.isError" class="h-4 w-4" />
            <Bot v-else class="h-4 w-4" />
          </div>

          <!-- Message Content -->
          <div 
            class="flex-1 max-w-[80%]"
            :class="message.type === 'user' ? 'text-right' : ''"
          >
            <div
              class="inline-block p-3 rounded-lg text-sm"
              :class="message.type === 'user'
                ? 'bg-primary text-primary-foreground'
                : message.isError
                  ? 'bg-destructive/10 text-destructive border border-destructive/20'
                  : 'bg-muted text-muted-foreground'"
            >
              {{ message.content }}
            </div>
            
            <!-- Action button for bot messages with filters -->
            <div v-if="message.type === 'bot' && message.filters && !message.isError" class="mt-2">
              <Button 
                size="sm" 
                @click="searchWithFilters(message.filters)"
                :disabled="isLoading"
                class="flex items-center gap-2"
              >
                <CheckCircle class="h-3 w-3" />
                Search Companies
              </Button>
            </div>

            <!-- Timestamp -->
            <div 
              class="text-xs text-muted-foreground mt-1"
              :class="message.type === 'user' ? 'text-right' : ''"
            >
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="flex items-start gap-3">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 flex items-center justify-center">
            <Bot class="h-4 w-4" />
          </div>
          <div class="bg-muted text-muted-foreground p-3 rounded-lg text-sm">
            <div class="flex items-center gap-1">
              <div class="w-2 h-2 bg-current rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-current rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-current rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>

    <!-- Input Area -->
    <div class="border-x border-b border-border rounded-b-md p-4 bg-background">
      <div class="flex gap-2">
        <Textarea
          v-model="currentMessage"
          placeholder="Describe the companies you're looking for..."
          class="flex-1 min-h-[40px] max-h-[120px] resize-none"
          :disabled="isTyping"
          @keypress="handleKeyPress"
        />
        <Button 
          @click="sendMessage"
          :disabled="!canSend"
          size="icon"
          class="self-end"
        >
          <Send class="h-4 w-4" />
        </Button>
      </div>
      
      <!-- Status -->
      <div v-if="prospectorStore.error" class="mt-2">
        <Alert variant="destructive">
          <AlertCircle class="h-4 w-4" />
          <AlertDescription>
            {{ prospectorStore.error }}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Component-specific styles if needed */
</style> 