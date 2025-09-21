import { ref, onMounted, watch, readonly } from 'vue'

export type Theme = 'light' | 'dark'

const theme = ref<Theme>('dark') // Default to dark mode

export function useTheme() {
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    
    // Update DOM class
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Persist in localStorage
    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  const initTheme = () => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const initialTheme = savedTheme || 'dark'
    
    // Check for system preference only if no saved preference
    if (!savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    } else {
      setTheme(initialTheme)
    }
  }

  // Watch for changes and persist them
  watch(theme, (newTheme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  })

  onMounted(() => {
    initTheme()
  })

  return {
    theme: readonly(theme),
    setTheme,
    toggleTheme,
    initTheme
  }
}