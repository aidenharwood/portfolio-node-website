import { ref, computed } from 'vue'

export interface SteamIdValidation {
  steamId: string
  isValid: boolean
  error: string
  displayValue: string
}

export function useSteamId() {
  const steamIdInput = ref('')
  const steamIdError = ref('')

  // Cookie utility functions
  function setCookie(name: string, value: string, days = 30) {
    const expires = new Date()
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`
  }

  function getCookie(name: string): string | null {
    const nameEQ = name + "="
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  // Extract Steam ID from various input formats
  function extractSteamId(input: string): SteamIdValidation {
    const trimmedInput = input.trim()
    
    if (!trimmedInput) {
      return {
        steamId: '',
        isValid: false,
        error: 'Steam ID or profile URL is required',
        displayValue: trimmedInput
      }
    }

    // Case 1: Direct Steam ID (17 digits starting with 7656119)
    const steamIdPattern = /^7656119\d{10}$/
    if (steamIdPattern.test(trimmedInput)) {
      return {
        steamId: trimmedInput,
        isValid: true,
        error: '',
        displayValue: trimmedInput
      }
    }

    // Case 2: Full profile URL with Steam ID
    const profileUrlPattern = /steamcommunity\.com\/profiles\/(\d+)/i
    const profileMatch = trimmedInput.match(profileUrlPattern)
    if (profileMatch) {
      const extractedId = profileMatch[1]
      if (steamIdPattern.test(extractedId)) {
        return {
          steamId: extractedId,
          isValid: true,
          error: '',
          displayValue: extractedId
        }
      } else {
        return {
          steamId: '',
          isValid: false,
          error: 'Invalid Steam ID format in profile URL',
          displayValue: trimmedInput
        }
      }
    }

    // Case 3: Custom URL format (steamcommunity.com/id/username)
    const customUrlPattern = /steamcommunity\.com\/id\/([^\/\s]+)/i
    const customMatch = trimmedInput.match(customUrlPattern)
    if (customMatch) {
      return {
        steamId: '',
        isValid: false,
        error: 'Custom profile URLs are not supported. Please use your numeric Steam ID or profile URL with numeric ID.',
        displayValue: trimmedInput
      }
    }

    // Case 4: Just the domain without full URL
    if (trimmedInput.includes('steamcommunity.com')) {
      return {
        steamId: '',
        isValid: false,
        error: 'Please provide the complete Steam profile URL',
        displayValue: trimmedInput
      }
    }

    // Default: Invalid format
    return {
      steamId: '',
      isValid: false,
      error: 'Please enter a valid Steam ID (17 digits starting with 7656119) or Steam profile URL',
      displayValue: trimmedInput
    }
  }

  // Computed properties
  const steamIdValidation = computed(() => extractSteamId(steamIdInput.value))
  const steamId = computed(() => steamIdValidation.value.steamId)
  const steamIdValid = computed(() => steamIdValidation.value.isValid)

  // Validate and update error state
  function validateSteamId() {
    const validation = steamIdValidation.value
    steamIdError.value = validation.error
    
    // Update display value if it changed (e.g., extracted from URL)
    if (validation.displayValue !== steamIdInput.value && validation.isValid) {
      steamIdInput.value = validation.displayValue
    }
    
    // Save valid Steam ID to cookie
    if (validation.isValid && validation.steamId) {
      setCookie('bl4_steam_id', validation.steamId)
    }
  }

  function clearSavedSteamId() {
    setCookie('bl4_steam_id', '', -1) // Delete cookie
    steamIdInput.value = ''
    steamIdError.value = ''
  }

  // Initialize from cookie
  function initializeSteamId() {
    const savedSteamId = getCookie('bl4_steam_id')
    if (savedSteamId) {
      steamIdInput.value = savedSteamId
      validateSteamId()
    }
  }

  return {
    steamIdInput,
    steamIdError,
    steamId,
    steamIdValid,
    isValidSteamId: steamIdValid, // Alias for compatibility
    steamIdValidation,
    validateSteamId,
    clearSavedSteamId,
    initializeSteamId,
    getCookie,
    setCookie
  }
}