import { ref, computed } from 'vue'

export interface SteamProfile {
  personaName?: string
  profileUrl?: string
  avatarUrl?: string
  summary?: string
}

export type GamePlatform = 'steam' | 'epic'

export interface GamePlatformValidation {
  platformId: string
  platform: GamePlatform
  isValid: boolean
  error: string
  displayValue: string
  needsResolution?: boolean
  profile?: SteamProfile | EpicProfile
}

export interface EpicProfile {
  displayName: string
  epicAccountId?: string
  profileUrl?: string
  // Epic doesn't have avatars in the same way Steam does
}

// Keep legacy interface for compatibility
export interface SteamIdValidation extends GamePlatformValidation {
  steamId: string
}

export function useSteamId() {
  const profileIdInput = ref('')
  const profileError = ref('')
  const isResolving = ref(false)
  const gameProfile = ref<SteamProfile | EpicProfile | null>(null)

  // Resolve Steam input to Steam ID and profile using our own API
  async function resolveSteamInput(input: string): Promise<{ platformId: string; platform: GamePlatform; steamId?: string; profile?: SteamProfile } | null> {
    try {
      isResolving.value = true
      
      const API_BASE = window.location.origin
      const response = await fetch(`${API_BASE}/api/steam/resolve-vanity/${encodeURIComponent(input)}`)
      
      if (!response.ok) {
        throw new Error(`Failed to resolve Steam input: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success && data.steamId) {
        // Update profile information
        if (data.profile) {
          gameProfile.value = data.profile
        }
        
        return {
          platformId: data.steamId,
          platform: 'steam',
          steamId: data.steamId,
          profile: data.profile
        }
      } else {
        return null
      }
    } catch (error) {
      console.error('Error resolving profile ID input:', error)
      return null
    } finally {
      isResolving.value = false
    }
  }

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

  // Extract platform ID from various input formats
  function extractGamePlatformId(input: string): GamePlatformValidation {
    const trimmedInput = input.trim()
    
    if (!trimmedInput) {
      return {
        platformId: '',
        platform: 'steam', // default
        isValid: false,
        error: 'Gaming platform ID or profile URL is required',
        displayValue: trimmedInput
      }
    }

    // Check for Epic Games Account ID patterns FIRST (to avoid false Steam matches)
    // Epic Account IDs are 32-character hexadecimal strings (e.g., fb0d983582f74e7cb4602d9611466e11)
    if (/^[a-f0-9]{32}$/.test(trimmedInput.toLowerCase())) {
      return {
        platformId: trimmedInput.toLowerCase(),
        platform: 'epic',
        isValid: true, // Epic Account ID is valid if it matches the pattern
        error: '',
        displayValue: trimmedInput.toLowerCase(),
        needsResolution: false // No API lookup needed - just validate format
      }
    }

    // Check for Steam patterns second
    const steamResult = extractSteamId(trimmedInput)
    if (steamResult.isValid || steamResult.needsResolution || steamResult.error.includes('Steam')) {
      return {
        platformId: steamResult.steamId,
        platform: 'steam',
        isValid: steamResult.isValid,
        error: steamResult.error,
        displayValue: steamResult.displayValue,
        needsResolution: steamResult.needsResolution
      }
    }

    // If no pattern matches, default to error
    return {
      platformId: '',
      platform: 'steam', // default
      isValid: false,
      error: 'Please enter a valid Steam ID, Steam profile URL, or Epic Games Account ID (32-character hex string)',
      displayValue: trimmedInput
    }
  }

  // Extract Steam ID from various input formats (legacy function for Steam-specific logic)
  function extractSteamId(input: string): SteamIdValidation {
    const trimmedInput = input.trim()
    
    if (!trimmedInput) {
      return {
        steamId: '',
        platformId: '',
        platform: 'steam',
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
        platformId: trimmedInput,
        platform: 'steam',
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
          platformId: extractedId,
          platform: 'steam',
          isValid: true,
          error: '',
          displayValue: extractedId
        }
      } else {
        return {
          steamId: '',
          platformId: '',
          platform: 'steam',
          isValid: false,
          error: 'Invalid Steam ID format in profile URL',
          displayValue: trimmedInput
        }
      }
    }

    // Case 3: Custom URL format (steamcommunity.com/id/username) - needs async resolution
    const customUrlPattern = /steamcommunity\.com\/id\/([^\/\s]+)/i
    const customMatch = trimmedInput.match(customUrlPattern)
    if (customMatch) {
      return {
        steamId: customMatch[1], // Store the vanity name temporarily
        platformId: customMatch[1],
        platform: 'steam',
        isValid: false, // Will be validated async
        error: '', // No error initially, will resolve async
        displayValue: trimmedInput,
        needsResolution: true // Flag to indicate this needs async resolution
      }
    }

    // Case 4: Just the domain without full URL
    if (trimmedInput.includes('steamcommunity.com')) {
      return {
        steamId: '',
        platformId: '',
        platform: 'steam',
        isValid: false,
        error: 'Please provide the complete Steam profile URL',
        displayValue: trimmedInput
      }
    }

    // Case 5: Direct vanity name (username without URL) - needs async resolution
    // Only if it's not a Steam ID and doesn't contain special characters
    if (!/^7656119\d{10}$/.test(trimmedInput) && 
        /^[a-zA-Z0-9_-]+$/.test(trimmedInput) && 
        trimmedInput.length >= 3 && 
        trimmedInput.length <= 32) {
      return {
        steamId: trimmedInput, // Store the vanity name temporarily
        platformId: trimmedInput,
        platform: 'steam',
        isValid: false, // Will be validated async
        error: '', // No error initially, will resolve async
        displayValue: trimmedInput,
        needsResolution: true // Flag to indicate this needs async resolution
      }
    }

    // Default: Invalid format
    return {
      steamId: '',
      platformId: '',
      platform: 'steam',
      isValid: false,
      error: 'Please enter a valid Steam ID (17 digits starting with 7656119) or Steam profile URL',
      displayValue: trimmedInput
    }
  }

  // Computed properties
  const platformValidation = computed(() => extractGamePlatformId(profileIdInput.value))
  const steamIdValidation = computed(() => extractSteamId(profileIdInput.value)) // Keep for compatibility
  const steamId = computed(() => platformValidation.value.isValid ? platformValidation.value.platformId : '')
  const profileIdValid = computed(() => platformValidation.value.isValid)
  const platformType = computed(() => platformValidation.value.platform)

  // Validate and update error state (now async to handle resolution)
  async function validateProfileId() {
    // If clicking "Change" or clearing validation, reset profile and error state
    if (!profileIdInput.value || profileIdInput.value.trim() === '') {
      gameProfile.value = null
      profileError.value = ''
      return
    }
    
    // Handle platform validation differently
    const platform = platformType.value
    const validation = platformValidation.value
    
    if (platform === 'epic') {
      // For Epic Games, just validate the format - no API lookup
      if (validation.isValid) {
        profileError.value = ''
        // Create a basic Epic profile for display
        gameProfile.value = {
          displayName: `Epic User ${validation.platformId.substring(0, 8)}...`,
          epicAccountId: validation.platformId
        }
        // Save Epic Account ID to cookie for persistence
        setCookie('bl4_steam_id', validation.platformId)
      } else {
        profileError.value = 'Invalid Epic Games Account ID format. Must be a 32-character hexadecimal string.'
        gameProfile.value = null
      }
    } else {
      // For Steam, resolve via API
      profileError.value = 'Resolving profile ID...'
      
      const result = await resolveSteamInput(profileIdInput.value)
      
      if (result) {
        // Update the input with the resolved Steam ID
        profileIdInput.value = result.platformId
        profileError.value = ''
        // For Steam, use Steam ID cookie for compatibility
        if (result.platform === 'steam' && 'steamId' in result && result.steamId) {
          setCookie('bl4_steam_id', result.steamId)
        }
      } else {
        profileError.value = 'Could not resolve Steam profile. Please check your Steam ID, username, or profile URL.'
        gameProfile.value = null
      }
    }
  }

  function clearSavedProfileId() {
    setCookie('bl4_steam_id', '', -1) // Delete cookie (keep same name for compatibility)
    profileIdInput.value = ''
    profileError.value = ''
    gameProfile.value = null
  }

  function resetValidation() {
    profileError.value = ''
    gameProfile.value = null
  }

  // Initialize from cookie - detect platform and handle appropriately
  function initializeProfileId() {
    const savedId = getCookie('bl4_steam_id') // Keep checking same cookie for compatibility
    if (savedId) {
      profileIdInput.value = savedId
      const platformValidation = extractGamePlatformId(savedId)
      
      if (platformValidation.platform === 'epic' && platformValidation.isValid) {
        // For Epic, just create the profile without API call
        profileError.value = '' // Clear any previous errors
        gameProfile.value = {
          displayName: `Epic User ${savedId.substring(0, 8)}...`,
          epicAccountId: savedId
        }
      } else {
        // For Steam, validate via API
        validateProfileId()
      }
    }
  }

  return {
    // New generic names
    profileIdInput,
    profileError,
    profileIdValid,
    gameProfile,
    validateProfileId,
    clearSavedProfileId,
    initializeProfileId,
    
    // Legacy compatibility - map new variables to old names
    steamIdInput: profileIdInput,
    steamIdError: profileError,
    steamId,
    steamIdValid: profileIdValid,
    isValidSteamId: profileIdValid, // Alias for compatibility
    steamIdValidation,
    steamProfile: gameProfile,
    isResolving,
    validateSteamId: validateProfileId,
    resetValidation,
    clearSavedSteamId: clearSavedProfileId,
    initializeSteamId: initializeProfileId,
    getCookie,
    setCookie
  }
}