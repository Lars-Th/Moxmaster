import { ref, computed } from 'vue'

export function useValidation() {
  const errors = ref({})
  const touched = ref({})

  // Valideringsregler
  const rules = {
    required: (value, fieldName) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return `${fieldName} är obligatoriskt`
      }
      return null
    },
    
    email: (value, fieldName) => {
      if (!value) return null // Om fältet inte är obligatoriskt
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return `${fieldName} måste vara en giltig e-postadress`
      }
      return null
    },
    
    phone: (value, fieldName) => {
      if (!value) return null // Om fältet inte är obligatoriskt
      const phoneRegex = /^[\d\s\-\+\(\)]+$/
      if (!phoneRegex.test(value)) {
        return `${fieldName} måste vara ett giltigt telefonnummer`
      }
      return null
    },
    
    organizationNumber: (value, fieldName) => {
      if (!value) return null // Om fältet inte är obligatoriskt
      const orgRegex = /^\d{6}-\d{4}$/
      if (!orgRegex.test(value)) {
        return `${fieldName} måste ha formatet 556123-4567`
      }
      return null
    },
    
    postalCode: (value, fieldName) => {
      if (!value) return null // Om fältet inte är obligatoriskt
      const postalRegex = /^\d{5}$/
      if (!postalRegex.test(value)) {
        return `${fieldName} måste vara 5 siffror`
      }
      return null
    },
    
    website: (value, fieldName) => {
      if (!value) return null // Om fältet inte är obligatoriskt
      const websiteRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
      if (!websiteRegex.test(value)) {
        return `${fieldName} måste vara en giltig webbadress`
      }
      return null
    }
  }

  // Validera ett enskilt fält
  const validateField = (fieldName, value, fieldRules, displayName) => {
    const fieldErrors = []
    
    if (fieldRules && Array.isArray(fieldRules)) {
      for (const rule of fieldRules) {
        if (typeof rule === 'string' && rules[rule]) {
          const error = rules[rule](value, displayName || fieldName)
          if (error) {
            fieldErrors.push(error)
          }
        } else if (typeof rule === 'function') {
          const error = rule(value, displayName || fieldName)
          if (error) {
            fieldErrors.push(error)
          }
        }
      }
    }
    
    if (fieldErrors.length > 0) {
      errors.value[fieldName] = fieldErrors[0] // Visa bara första felet
    } else {
      delete errors.value[fieldName]
    }
    
    return fieldErrors.length === 0
  }

  // Validera alla fält enligt schema
  const validateAll = (data, schema) => {
    errors.value = {}
    let isValid = true
    
    for (const [fieldName, config] of Object.entries(schema)) {
      const value = data[fieldName]
      const fieldValid = validateField(
        fieldName, 
        value, 
        config.rules, 
        config.displayName || fieldName
      )
      
      if (!fieldValid) {
        isValid = false
      }
    }
    
    return isValid
  }

  // Markera fält som "touched" (användaren har interagerat med det)
  const touchField = (fieldName) => {
    touched.value[fieldName] = true
  }

  // Kontrollera om ett fält har fel och har blivit "touched"
  const hasError = (fieldName) => {
    return touched.value[fieldName] && errors.value[fieldName]
  }

  // Hämta felmeddelande för ett fält
  const getError = (fieldName) => {
    return hasError(fieldName) ? errors.value[fieldName] : null
  }

  // Kontrollera om ett fält är obligatoriskt enligt schema
  const isRequired = (fieldName, schema) => {
    return schema[fieldName]?.rules?.includes('required') || false
  }

  // Rensa alla fel
  const clearErrors = () => {
    errors.value = {}
    touched.value = {}
  }

  // Rensa fel för specifikt fält
  const clearFieldError = (fieldName) => {
    delete errors.value[fieldName]
    delete touched.value[fieldName]
  }

  // Computed för att kontrollera om formuläret har några fel
  const hasAnyErrors = computed(() => {
    return Object.keys(errors.value).length > 0
  })

  // Computed för att få alla felmeddelanden
  const allErrors = computed(() => {
    return Object.values(errors.value).filter(Boolean)
  })

  return {
    errors,
    touched,
    validateField,
    validateAll,
    touchField,
    hasError,
    getError,
    isRequired,
    clearErrors,
    clearFieldError,
    hasAnyErrors,
    allErrors
  }
} 