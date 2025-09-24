import { ref } from 'vue'

export interface SaveFile {
  name: string
  size: number
  originalContent: string
  yamlContent: string
  yamlError: string
  hasChanges: boolean
  characterInfo?: {
    name: string
    level: string
    className: string
  }
}

export function useSaveFiles() {
  const saveFiles = ref<SaveFile[]>([])
  const activeSaveFile = ref('')
  const uploading = ref(false)
  const downloading = ref(false)
  const error = ref('')
  const sessionId = ref('')

  const API_BASE = import.meta.env.VITE_API_BASE || `${window.location.origin}`

  // Upload save folder
  async function uploadSaveFolder(files: FileList, steamId: string): Promise<void> {
    if (!steamId) {
      throw new Error('Steam ID is required')
    }

    uploading.value = true
    error.value = ''
    saveFiles.value = []

    try {
      const formData = new FormData()
      formData.append('steamId', steamId)

      // Add all .sav files to the form data
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.name.toLowerCase().endsWith('.sav')) {
          formData.append('saveFiles', file, file.name)
        }
      }

      const response = await fetch(`${API_BASE}/api/bl4/upload-folder`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: errorText || 'Upload failed' }
        }
        console.error('Upload failed:', errorData)
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      console.log('Upload successful:', data)
      sessionId.value = data.sessionId
      saveFiles.value = data.files.map((file: any) => ({
        name: file.name,
        size: file.size,
        originalContent: file.yamlContent,
        yamlContent: file.yamlContent,
        yamlError: '',
        hasChanges: false,
        characterInfo: file.characterInfo
      }))
      
      // Set the first file as active
      if (saveFiles.value.length > 0) {
        activeSaveFile.value = saveFiles.value[0].name
      }

      // Update page title with character info
      updatePageTitle()

    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      uploading.value = false
    }
  }

  // Handle YAML changes
  function handleYamlChange(fileName: string, event: Event) {
    const textarea = event.target as HTMLTextAreaElement
    const newContent = textarea.value

    const fileIndex = saveFiles.value.findIndex(f => f.name === fileName)
    if (fileIndex !== -1) {
      saveFiles.value[fileIndex].yamlContent = newContent
      saveFiles.value[fileIndex].hasChanges = 
        newContent !== saveFiles.value[fileIndex].originalContent
    }
  }

  // Create backup
  function createBackup(fileName: string) {
    const file = saveFiles.value.find(f => f.name === fileName)
    if (file) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
      const backupName = `${fileName.replace('.sav', '')}-backup-${timestamp}.yaml`
      
      const blob = new Blob([file.yamlContent], { type: 'text/yaml' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = backupName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }
  }

  // Revert file
  function revertFile(fileName: string) {
    const fileIndex = saveFiles.value.findIndex(f => f.name === fileName)
    if (fileIndex !== -1) {
      saveFiles.value[fileIndex].yamlContent = saveFiles.value[fileIndex].originalContent
      saveFiles.value[fileIndex].hasChanges = false
    }
  }

  // Create all backups
  function createAllBackups() {
    saveFiles.value.forEach(file => createBackup(file.name))
  }

  // Download modified save folder
  async function downloadSaveFolder(steamId: string): Promise<void> {
    if (!sessionId.value) return

    downloading.value = true
    error.value = ''

    try {
      const allFiles = saveFiles.value.map(file => ({
        name: file.name,
        yamlContent: file.yamlContent
      }))

      const response = await fetch(`${API_BASE}/api/bl4/download-folder/${sessionId.value}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          steamId,
          modifiedFiles: allFiles
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Download failed')
      }

      // Download the zip file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      
      const timestamp = new Date().toISOString().slice(0, 10)
      a.download = `bl4-saves-modified-${timestamp}.zip`
      
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

    } catch (err) {
      error.value = (err as Error).message
    } finally {
      downloading.value = false
    }
  }

  // Update page title with character information
  function updatePageTitle() {
    const characterFiles = saveFiles.value.filter(file => 
      file.name.match(/\d+\.sav/) && file.characterInfo?.name
    )
    
    if (characterFiles.length > 0) {
      const names = characterFiles.map(file => file.characterInfo?.name).join(', ')
      document.title = `BL4 Save Editor - ${names}`
    } else if (saveFiles.value.length > 0) {
      document.title = `BL4 Save Editor - ${saveFiles.value.length} saves loaded`
    }
  }

  // Get file icon
  function getFileIcon(fileName: string): string {
    if (fileName === 'profile.sav') {
      return 'pi pi-user'
    } else if (fileName.match(/\d+\.sav/)) {
      return 'pi pi-user-plus'
    }
    return 'pi pi-file'
  }

  // Get file display name
  function getFileDisplayName(fileName: string): string {
    if (fileName === 'profile.sav') {
      return 'Profile'
    } else if (fileName.match(/\d+\.sav/)) {
      const match = fileName.match(/(\d+)\.sav/)
      const fileIndex = match ? match[1] : fileName.replace('.sav', '')
      const file = saveFiles.value.find(f => f.name === fileName)
      
      if (file?.characterInfo?.name) {
        return `${file.characterInfo.name} (${fileIndex})`
      }
      return `Character ${fileIndex}`
    }
    return fileName
  }

  return {
    saveFiles,
    activeSaveFile,
    uploading,
    downloading,
    error,
    sessionId,
    uploadSaveFolder,
    handleYamlChange,
    createBackup,
    revertFile,
    createAllBackups,
    downloadSaveFolder,
    updatePageTitle,
    getFileIcon,
    getFileDisplayName
  }
}