<template>
  <div
    @dragover="handleDragOver"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    @drop="handleFolderDrop"
    class="border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300"
    :class="{
      'border-accent/40 bg-accent/10 scale-105': isDragging,
      'border-muted': !isDragging && !steamIdValid,
      'border-accent': !isDragging && steamIdValid
    }"
  >
    <input
      ref="folderInput"
      type="file"
      webkitdirectory
      @change="handleFolderSelect"
      class="hidden"
    />
    
    <div v-if="!uploading">
      <i class="pi pi-folder text-4xl text-muted-foreground mb-4 transition-all duration-300" :class="{ 'scale-110 text-accent': isDragging }"></i>
      <h3 class="text-lg font-semibold text-foreground mb-2">
        Drop your save folder here
        <button
          class="ml-2 text-muted-foreground hover:text-foreground transition-colors"
          title="Save folder locations:&#10;&#10;Windows:&#10;%USERPROFILE%/Documents/My Games/Borderlands 4/Saved/SaveGames/[YourSteamID]/&#10;&#10;Steam Deck/Linux:&#10;~/.steam/steam/steamapps/compatdata/[AppID]/pfx/drive_c/users/steamuser/Documents/My Games/Borderlands 4/Saved/SaveGames/[YourSteamID]/&#10;&#10;The folder should contain profile.sav and numbered save files like 1.sav, 2.sav, etc."
        >
          <i class="pi pi-question-circle text-sm"></i>
        </button>
      </h3>
      <p class="text-muted-foreground mb-4">
        or <button @click="folderInput?.click()" class="text-accent underline hover:text-accent/80 transition-colors duration-200">browse folders</button>
      </p>
      <div class="text-sm text-muted-foreground space-y-1">
        <p>Select your entire Borderlands 4 save folder containing:</p>
        <ul class="list-disc list-inside space-y-1 mt-2">
          <li>profile.sav (player profile)</li>
          <li>1.sav, 2.sav, etc. (character saves)</li>
        </ul>
        <p class="mt-2">Maximum folder size: 50MB</p>
      </div>
    </div>
    
    <div v-else class="flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mr-3"></div>
      <span class="text-foreground">Processing save folder...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  steamIdValid: boolean
  uploading: boolean
}

interface Emits {
  (e: 'upload', files: FileList): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isDragging = ref(false)
const folderInput = ref<HTMLInputElement>()

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  if (!props.steamIdValid) return
  isDragging.value = true
}

function handleDragEnter(e: DragEvent) {
  e.preventDefault()
  if (!props.steamIdValid) return
  isDragging.value = true
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault()
  // Only set to false if we're leaving the entire drop zone
  const currentTarget = e.currentTarget as HTMLElement
  const relatedTarget = e.relatedTarget as HTMLElement
  if (!currentTarget || !relatedTarget || !currentTarget.contains(relatedTarget)) {
    isDragging.value = false
  }
}

function handleFolderDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  
  if (!props.steamIdValid) {
    return
  }

  const items = e.dataTransfer?.items
  if (items) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.webkitGetAsEntry) {
        const entry = item.webkitGetAsEntry()
        if (entry && entry.isDirectory) {
          // Extract files from the directory
          const files: File[] = []
          processDirectory(entry as FileSystemDirectoryEntry, files).then(() => {
            if (files.length > 0) {
              const fileList = createFileList(files)
              emit('upload', fileList)
            }
          })
          return
        }
      }
    }
  }
}

function handleFolderSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    emit('upload', input.files)
  }
}

async function processDirectory(directory: FileSystemDirectoryEntry, files: File[]): Promise<void> {
  return new Promise((resolve) => {
    const reader = directory.createReader()
    reader.readEntries(async (entries) => {
      for (const entry of entries) {
        if (entry.isFile && entry.name.toLowerCase().endsWith('.sav')) {
          const file = await getFileFromEntry(entry as FileSystemFileEntry)
          if (file) files.push(file)
        }
      }
      resolve()
    })
  })
}

function getFileFromEntry(entry: FileSystemFileEntry): Promise<File | null> {
  return new Promise((resolve) => {
    entry.file(resolve, () => resolve(null))
  })
}

function createFileList(files: File[]): FileList {
  const dt = new DataTransfer()
  files.forEach(file => dt.items.add(file))
  return dt.files
}
</script>