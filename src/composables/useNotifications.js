import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

// Global state för notifikationer
const notifications = ref([])
let notificationId = 0
let currentRoute = null

export function useNotifications() {
  const router = useRouter()
  
  // Spåra aktuell rutt för att rensa lokala notifikationer
  if (router && !currentRoute) {
    currentRoute = router.currentRoute.value.path
    
    // Lyssna på ruttändringar och rensa lokala notifikationer
    router.afterEach((to) => {
      if (currentRoute !== to.path) {
        clearLocalNotifications()
        currentRoute = to.path
      }
    })
  }

  // Lägg till en notifikation
  const addNotification = (type, title, message, options = {}) => {
    const id = ++notificationId
    const notification = {
      id,
      type, // 'warning', 'success', 'error', 'info', 'confirm'
      title,
      message,
      duration: options.duration || (type === 'warning' ? 0 : 4000), // Varningar stannar tills de stängs
      persistent: options.persistent || type === 'warning',
      global: options.global || false, // Ny: markera som global notifikation
      route: options.global ? null : (router?.currentRoute.value.path || null), // Spara rutt för lokala notifikationer
      ...options
    }
    
    notifications.value.push(notification)
    
    // Auto-remove efter duration (om inte persistent)
    if (!notification.persistent && notification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration)
    }
    
    return id
  }

  // Ta bort en notifikation
  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  // Rensa alla notifikationer
  const clearNotifications = () => {
    notifications.value = []
  }

  // Rensa lokala notifikationer (vid sidnavigering)
  const clearLocalNotifications = () => {
    notifications.value = notifications.value.filter(n => n.global === true)
  }

  // Rensa notifikationer av en viss typ
  const clearNotificationsOfType = (type) => {
    notifications.value = notifications.value.filter(n => n.type !== type)
  }

  // Rensa lokala notifikationer av en viss typ
  const clearLocalNotificationsOfType = (type) => {
    notifications.value = notifications.value.filter(n => 
      n.type !== type || n.global === true
    )
  }

  // Bekvämlighetsmetoder för olika typer - LOKALA som standard
  const warning = (title, message, options = {}) => {
    return addNotification('warning', title, message, { 
      persistent: true, 
      global: false, // Lokala som standard
      ...options 
    })
  }

  const success = (title, message, options = {}) => {
    return addNotification('success', title, message, { 
      duration: 4000, 
      global: false, // Lokala som standard
      ...options 
    })
  }

  const error = (title, message, options = {}) => {
    return addNotification('error', title, message, { 
      duration: 6000, 
      global: false, // Lokala som standard
      ...options 
    })
  }

  const info = (title, message, options = {}) => {
    return addNotification('info', title, message, { 
      duration: 4000, 
      global: false, // Lokala som standard
      ...options 
    })
  }

  // Globala versioner av metoderna
  const globalWarning = (title, message, options = {}) => {
    return addNotification('warning', title, message, { 
      persistent: true, 
      global: true, 
      ...options 
    })
  }

  const globalSuccess = (title, message, options = {}) => {
    return addNotification('success', title, message, { 
      duration: 4000, 
      global: true, 
      ...options 
    })
  }

  const globalError = (title, message, options = {}) => {
    return addNotification('error', title, message, { 
      duration: 6000, 
      global: true, 
      ...options 
    })
  }

  const globalInfo = (title, message, options = {}) => {
    return addNotification('info', title, message, { 
      duration: 4000, 
      global: true, 
      ...options 
    })
  }

  // Bekräftelsedialog - alltid lokal
  const confirm = (title, message, options = {}) => {
    return new Promise((resolve) => {
      const id = addNotification('confirm', title, message, {
        persistent: true,
        global: false, // Bekräftelser är alltid lokala
        onConfirm: () => {
          removeNotification(id)
          resolve(true)
        },
        onCancel: () => {
          removeNotification(id)
          resolve(false)
        },
        confirmText: options.confirmText || 'Bekräfta',
        cancelText: options.cancelText || 'Avbryt',
        confirmVariant: options.confirmVariant || 'destructive',
        ...options
      })
    })
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    clearLocalNotifications,
    clearNotificationsOfType,
    clearLocalNotificationsOfType,
    
    // Lokala notifikationer (standard)
    warning,
    success,
    error,
    info,
    confirm,
    
    // Globala notifikationer
    globalWarning,
    globalSuccess,
    globalError,
    globalInfo
  }
} 