import { ref } from 'vue'
import * as yaml from 'js-yaml'
import { processYamlFile, type FileTypeInfo } from '../lib/utils/file-detection'

export interface SaveFile {
  name: string
  size: number
  originalContent: string
  yamlContent: string        // YAML string for display
  jsonData: any             // Parsed JSON object for editing
  yamlError: string
  hasChanges: boolean
  fileType?: FileTypeInfo   // File type detection info
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

  // Helper function to check if a file contains binary data
  async function checkIfBinaryFile(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const buffer = e.target?.result as ArrayBuffer
        const bytes = new Uint8Array(buffer)
        
        // Check for null bytes - definitive indicator of binary data
        // YAML files should never contain null bytes
        const hasNullBytes = bytes.some(byte => byte === 0)
        
        resolve(hasNullBytes)
      }
      reader.onerror = () => resolve(false) // Default to text if can't read
      
      // Read first 1KB to check for binary content
      reader.readAsArrayBuffer(file.slice(0, 1024))
    })
  }

  // Process YAML files directly (client-side)
  async function processYamlFiles(yamlFiles: File[]): Promise<void> {
    const processedFiles: SaveFile[] = []

    for (const file of yamlFiles) {
      try {
        const processed = await processYamlFile(file)
        
        // Extract character info if it's a character file
  const characterInfo = extracted_character_info(processed.jsonData)
        
        processedFiles.push({
          name: processed.fileName,
          size: file.size,
          originalContent: processed.originalContent,
          yamlContent: processed.yamlContent,
          jsonData: processed.jsonData,
          yamlError: '',
          hasChanges: processed.yamlContent !== processed.originalContent, // Mark as changed if account ID was injected
          fileType: processed.fileType,
          characterInfo
        })
      } catch (err) {
        console.error(`Failed to process ${file.name}:`, err)
        error.value = `Failed to process ${file.name}: ${(err as Error).message}`
      }
    }

    saveFiles.value = processedFiles
    
    // Set the first file as active
    if (saveFiles.value.length > 0) {
      activeSaveFile.value = saveFiles.value[0].name
    }

    // Update page title with character info
    updatePageTitle()
  }

  // Extract character info from YAML data
  // Extract character info from parsed YAML/JSON data
  // Be permissive about structure: BL4 data often nests under `state`, but
  // other YAML exports may use different top-level keys. Try several common
  // patterns and fall back to safe defaults rather than failing outright.
  function extracted_character_info(jsonData: any) {
    if (!jsonData || typeof jsonData !== 'object') return undefined

    try {
      // Prefer the BL4 `state` object when present, otherwise fall back to
      // other common container names or the root object itself.
      const candidate = jsonData.state || jsonData.character_data || jsonData.player_character || jsonData

      // Name may be under several keys depending on exporter/version
      const name = candidate.char_name || candidate.character_name || candidate.name || candidate.player_name || (candidate.player && candidate.player.name)

      // Class likewise has a few common keys
      const className = candidate.class || candidate.character_class || candidate.player_class || (candidate.player && candidate.player.class)

      // Level is most commonly stored in state.experience[0].level for BL4
      let level: any = undefined
      if (Array.isArray(candidate.experience) && candidate.experience[0]?.level !== undefined) {
        level = candidate.experience[0].level
      } else if (candidate.level !== undefined) {
        level = candidate.level
      } else if (candidate.experience_level !== undefined) {
        level = candidate.experience_level
      } else if (candidate.stats && candidate.stats.level !== undefined) {
        level = candidate.stats.level
      }

      return {
        name: name ? String(name) : 'Unknown',
        level: level !== undefined ? String(level) : '1',
        className: className ? String(className) : 'Unknown'
      }
    } catch (err) {
      console.warn('Failed to extract character info:', err)
      return undefined
    }
  }

  // Upload save files (SAV or YAML)
  async function uploadSaveFolder(files: FileList, steamId: string): Promise<void> {
    if (!steamId) {
      throw new Error('Steam ID is required')
    }

    uploading.value = true
    error.value = ''
    saveFiles.value = []

    try {
      // Separate files by actual content type, not just extension
      const yamlFiles: File[] = []
      const savFiles: File[] = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Check file content to determine if it's binary (SAV) or text (YAML)
        const isBinary = await checkIfBinaryFile(file)
        
        if (isBinary) {
          savFiles.push(file)
        } else {
          yamlFiles.push(file)
        }
      }

      // If we have YAML files, process them directly
      if (yamlFiles.length > 0) {
        await processYamlFiles(yamlFiles)
        return
      }

      // Process SAV files through the API
      const formData = new FormData()
      formData.append('steamId', steamId)

      // Add all binary files to the form data with .sav extension
      savFiles.forEach(file => {
        // Ensure the file has a .sav extension for the backend validation
        const savFileName = file.name.replace(/\.[^.]+$/, '') + '.sav'
        formData.append('saveFiles', file, savFileName)
      })

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
        yamlContent: file.yamlContent,    // YAML string for display
        jsonData: file.jsonData,          // JSON object for editing
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

  // Handle YAML changes (manual text editing)
  function handleYamlChange(fileName: string, event: Event) {
    const textarea = event.target as HTMLTextAreaElement
    const newContent = textarea.value

    const fileIndex = saveFiles.value.findIndex(f => f.name === fileName)
    if (fileIndex !== -1) {
      saveFiles.value[fileIndex].yamlContent = newContent
      
      // Try to parse the YAML and update jsonData
      try {
        const parsedData = yaml.load(newContent)
        saveFiles.value[fileIndex].jsonData = parsedData
        saveFiles.value[fileIndex].yamlError = ''
      } catch (error) {
        saveFiles.value[fileIndex].yamlError = error instanceof Error ? error.message : 'Invalid YAML'
      }
      
      saveFiles.value[fileIndex].hasChanges = 
        newContent !== saveFiles.value[fileIndex].originalContent
    }
  }

  // Handle JSON changes (visual editor)
  function handleJsonChange(fileName: string, newJsonData: any) {
    const fileIndex = saveFiles.value.findIndex(f => f.name === fileName)
    if (fileIndex !== -1) {
      const file = saveFiles.value[fileIndex]
      file.jsonData = newJsonData
      
      // Convert JSON back to YAML for display
      try {
        const yamlContent = yaml.dump(newJsonData, {
          indent: 2,
          lineWidth: -1,
          noRefs: true,
          sortKeys: false,
          schema: yaml.DEFAULT_SCHEMA, // Use DEFAULT_SCHEMA for consistency with backend BL4_SCHEMA
          skipInvalid: true, // Skip invalid values instead of failing
          flowLevel: -1,
          styles: {
            '!!null': 'canonical' // Handle null values properly
          },
          // Ensure we preserve all data types correctly
          replacer: (_key, value) => {
            // Handle special cases for BL4 data
            if (typeof value === 'number' && !isFinite(value)) {
              return null // Replace NaN/Infinity with null
            }
            return value
          }
        })
        file.yamlContent = yamlContent
        file.yamlError = ''
      } catch (error) {
        file.yamlError = error instanceof Error ? error.message : 'Failed to convert to YAML'
        console.error('YAML dump error:', error)
      }
      
      // Visual editing always creates changes
      file.hasChanges = true

      // Deduplicate unique_rewards to avoid duplicates introduced elsewhere
      try {
        if (Array.isArray(file.jsonData?.state?.unique_rewards)) {
          file.jsonData.state.unique_rewards = Array.from(new Set(file.jsonData.state.unique_rewards))
        }
      } catch (e) {
        // ignore
      }

      // Debug: log updated stats.challenge for the file (temporary)
      try {
        // eslint-disable-next-line no-console
        console.debug('[useSaveFiles] handleJsonChange updated stats.challenge for', fileName, file.jsonData?.stats?.challenge)
      } catch (e) {}
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
      const file = saveFiles.value[fileIndex]
      
      // Reset all content to original
      file.yamlContent = file.originalContent
      
      // Reparse the original content to reset jsonData
      try {
        // Use safer YAML loading options to handle problematic content
        const parsedData = yaml.load(file.originalContent, {
          schema: yaml.FAILSAFE_SCHEMA, // Use safer schema
          json: true // Allow JSON fallback
        })
        file.jsonData = parsedData
        file.yamlError = ''
        console.log(`Successfully reverted file ${fileName}`)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Invalid YAML'
        file.yamlError = errorMessage
        console.error(`Error reverting file ${fileName}:`, error)
        
        // Try to parse as JSON as fallback
        try {
          const jsonData = JSON.parse(file.originalContent)
          file.jsonData = jsonData
          file.yamlError = 'Loaded as JSON (YAML parse failed)'
          console.log(`Fallback: loaded ${fileName} as JSON`)
        } catch (jsonError) {
          console.error(`Both YAML and JSON parsing failed for ${fileName}:`, jsonError)
          // Keep the original error message
        }
      }
      
      // Mark as no changes
      file.hasChanges = false
      
      console.log(`Reverted file ${fileName} - hasChanges: ${file.hasChanges}`)
    }
  }

  // Create all backups
  function createAllBackups() {
    saveFiles.value.forEach(file => createBackup(file.name))
  }

  // Download files in specified format
  async function downloadSaveFolder(steamId: string, format: 'sav' | 'yaml' = 'sav'): Promise<void> {
    downloading.value = true
    error.value = ''

    try {
      if (format === 'yaml') {
        // Download as YAML files directly (client-side)
        await downloadAsYaml()
      } else {
        // Download as SAV files (requires API conversion)
        await downloadAsSav(steamId)
      }
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      downloading.value = false
    }
  }

  // Download as YAML files (client-side)
  async function downloadAsYaml(): Promise<void> {
    // Create a zip file with all YAML files
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()

    saveFiles.value.forEach(file => {
      // Use .yaml extension for all files
      const yamlFileName = file.name.replace(/\.(sav|ya?ml)$/, '.yaml')
      zip.file(yamlFileName, file.yamlContent)
    })

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    downloadBlob(zipBlob, 'bl4-saves-yaml.zip')
  }

  // Download as SAV files (API conversion)
  async function downloadAsSav(steamId: string): Promise<void> {
    // Check if we have a session (from SAV file uploads)
    if (sessionId.value) {
      // Use existing folder download endpoint for SAV uploads
      const allFiles = saveFiles.value.map(file => ({
        name: file.name,
        jsonData: file.jsonData,        // Send JSON data for processing
        yamlContent: file.yamlContent   // Keep YAML as fallback
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

      const blob = await response.blob()
      downloadBlob(blob, 'bl4-saves-sav.zip')
    } else {
      // Handle YAML files - download individually if single file, or as ZIP if multiple
      // Handle YAML files - always package converted SAV(s) into a ZIP
      // (single-file case: produce a zip with one .sav entry)
      if (saveFiles.value.length === 1) {
        // For single file, if zip=true, just download the response ZIP directly
        const file = saveFiles.value[0]
        const response = await fetch(`${API_BASE}/api/bl4/convert-yaml-to-sav?zip=true`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            yamlContent: file.yamlContent,
            steamId
          })
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || `Failed to convert ${file.name}`)
        }

        const zipBlob = await response.blob()
        downloadBlob(zipBlob, 'bl4-saves-sav.zip')
      } else {
        // Download multiple files as ZIP
        const JSZip = (await import('jszip')).default
        const zip = new JSZip()

        for (const file of saveFiles.value) {
          try {
            const response = await fetch(`${API_BASE}/api/bl4/convert-yaml-to-sav?zip=true`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                yamlContent: file.yamlContent,
                steamId
              })
            })

            if (!response.ok) {
              const data = await response.json()
              throw new Error(data.error || `Failed to convert ${file.name}`)
            }

            const savBlob = await response.blob()
            const savArrayBuffer = await savBlob.arrayBuffer()
            // Ensure the filename has .sav extension, regardless of original extension
            const baseName = file.name.replace(/\.[^.]+$/, '') // Remove any extension
            const savFileName = `${baseName}.sav`
            zip.file(savFileName, savArrayBuffer)
          } catch (error) {
            console.error(`Failed to convert ${file.name}:`, error)
            throw new Error(`Failed to convert ${file.name}: ${(error as Error).message}`)
          }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' })
        downloadBlob(zipBlob, 'bl4-saves-sav.zip')
      }
    }
  }

  // Helper function to download a blob
  function downloadBlob(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    
    const timestamp = new Date().toISOString().slice(0, 10)
    a.download = `${timestamp}-${fileName}`
    
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
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

  // Clear all loaded files and reset state
  function clearFiles() {
    saveFiles.value = []
    activeSaveFile.value = ''
    sessionId.value = ''
    updatePageTitle()
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
    handleJsonChange,
    createBackup,
    revertFile,
    createAllBackups,
    downloadSaveFolder,
    updatePageTitle,
    clearFiles,
    getFileIcon,
    getFileDisplayName
  }
}