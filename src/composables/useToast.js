import { ref } from 'vue'
import { useNotifications } from './useNotifications'

const toasts = ref([])
let toastId = 0

export function useToast() {
  const notifications = useNotifications()

  const showToast = (options) => {
    const id = ++toastId
    const toast = {
      id,
      show: true,
      type: options.type || 'success',
      title: options.title,
      message: options.message || '',
      duration: options.duration || 3000,
      position: options.position || 'top-center'
    }
    
    toasts.value.push(toast)
    
    // Auto remove after duration
    if (toast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration)
    }
    
    return id
  }
  
  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  const success = (title, message, options = {}) => {
    return showToast({
      type: 'success',
      title,
      message,
      ...options
    })
  }
  
  const error = (title, message, options = {}) => {
    return showToast({
      type: 'error',
      title,
      message,
      ...options
    })
  }
  
  const warning = (title, message, options = {}) => {
    return showToast({
      type: 'warning',
      title,
      message,
      ...options
    })
  }
  
  const info = (title, message, options = {}) => {
    return showToast({
      type: 'info',
      title,
      message,
      ...options
    })
  }
  
  const clearAll = () => {
    toasts.value = []
  }
  
  return {
    toasts,
    showToast,
    removeToast,
    success: notifications.success,
    error: notifications.error,
    warning: notifications.warning,
    info: notifications.info,
    confirm: notifications.confirm,
    clearAll
  }
} 