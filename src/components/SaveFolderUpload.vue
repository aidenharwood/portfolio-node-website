<template>
  <div class="save-folder-upload">
    <div 
      class="upload-area"
      :class="{ 
        'dragover': isDragOver,
        'uploading': uploading
      }"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
    >
      <div class="upload-content" v-if="!uploading">
        <i class="pi pi-cloud-upload upload-icon" 
           :class="{ 'drag-active': isDragOver }"></i>
        <h3>Drop your save folder here</h3>
        <p>Drop the entire save folder or select individual .sav files</p>
        
        <div class="upload-info">
          <div class="info-item">
            <strong>Expected files:</strong>
            <ul>
              <li>profile.sav (player profile)</li>
              <li>1.sav, 2.sav, etc. (character saves)</li>
            </ul>
          </div>
          <div class="info-item">
            <strong>Folder locations:</strong>
            <ul>
              <li><strong>Windows:</strong> Documents/My Games/Borderlands 4/Saved/SaveGames/[YourSteamID]/profiles/client/</li>
              <li><strong>Steam Deck/Linux:</strong> ~/.steam/steam/steamapps/compatdata/[AppID]/pfx/drive_c/users/steamuser/Documents/My Games/Borderlands 4/Saved/SaveGames/[YourSteamID]/profiles/client/</li>
            </ul>
          </div>
          <div class="info-item">
            <strong>Maximum folder size:</strong> 50MB
          </div>
        </div>
        
        <div class="upload-actions">
          <input
            ref="fileInput"
            type="file"
            multiple
            accept=".sav"
            @change="handleFileSelect"
            style="display: none"
          >
          <input
            ref="folderInput"
            type="file"
            webkitdirectory
            @change="handleFolderSelect"
            style="display: none"
          >
          <button @click="folderInput?.click()" class="btn btn-primary">
            <i class="pi pi-folder-open"></i>
            Browse Folder
          </button>
          <button @click="fileInput?.click()" class="btn btn-secondary">
            <i class="pi pi-file"></i>
            Browse Files
          </button>
        </div>
      </div>
      
      <div v-else class="upload-progress">
        <div class="spinner">
          <i class="pi pi-spin pi-spinner"></i>
        </div>
        <span>Processing save files...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  uploading: boolean
}

interface Emits {
  (e: 'upload', files: FileList): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const isDragOver = ref(false)
const fileInput = ref<HTMLInputElement>()
const folderInput = ref<HTMLInputElement>()

function handleDrop(event: DragEvent) {
  isDragOver.value = false
  
  const items = event.dataTransfer?.items
  if (items) {
    // Handle folder drop
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry()
        if (entry?.isDirectory) {
          handleFolderEntry(entry as FileSystemDirectoryEntry)
          return
        }
      }
    }
  }
  
  // Handle file drop if no folder found
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    emit('upload', files)
  }
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    emit('upload', target.files)
  }
}

function handleFolderSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    emit('upload', target.files)
  }
}

async function handleFolderEntry(entry: FileSystemDirectoryEntry) {
  const readDirectory = (dirEntry: FileSystemDirectoryEntry): Promise<File[]> => {
    return new Promise((resolve) => {
      const dirReader = dirEntry.createReader()
      dirReader.readEntries(async (entries) => {
        const filePromises = entries.map(entry => {
          if (entry.isFile && entry.name.toLowerCase().endsWith('.sav')) {
            return new Promise<File>((resolve, reject) => {
              (entry as FileSystemFileEntry).file(resolve, reject)
            })
          }
          return null
        }).filter(Boolean) as Promise<File>[]
        
        const files = await Promise.all(filePromises)
        resolve(files)
      })
    })
  }
  
  const folderFiles = await readDirectory(entry)
  if (folderFiles.length > 0) {
    // Convert File[] to FileList-like object
    const dt = new DataTransfer()
    folderFiles.forEach(file => dt.items.add(file))
    emit('upload', dt.files)
  }
}
</script>

<style scoped>
.save-folder-upload {
  width: 100%;
}

.upload-area {
  border: 2px dashed rgba(var(--accent-color), 0.4);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  background: rgba(var(--accent-color), 0.02);
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area.dragover {
  border-color: rgb(var(--accent-color));
  background: rgba(var(--accent-color), 0.08);
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(var(--accent-color), 0.2);
}

.upload-area.uploading {
  border-color: rgba(var(--accent-color), 0.6);
  background: rgba(var(--accent-color), 0.1);
}

.upload-content {
  max-width: 500px;
  margin: 0 auto;
}

.upload-icon {
  font-size: 4rem;
  color: var(--text-color-secondary);
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.upload-icon.drag-active {
  color: rgb(var(--accent-color));
  transform: scale(1.1);
}

.upload-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.upload-content > p {
  color: var(--text-color-secondary);
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.upload-info {
  text-align: left;
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: rgba(var(--accent-color), 0.05);
  border-radius: 8px;
  border: 1px solid rgba(var(--accent-color), 0.2);
}

.info-item {
  margin-bottom: 1rem;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item strong {
  color: rgb(var(--accent-color));
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.info-item ul {
  margin: 0;
  padding-left: 1.5rem;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
}

.info-item li {
  margin-bottom: 0.25rem;
}

.upload-actions {
  margin-top: 1.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, rgb(var(--accent-color)), rgba(var(--accent-color), 0.8));
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--accent-color), 0.3);
}

.btn-secondary {
  background: rgba(var(--surface-100), 0.1);
  color: var(--text-color-secondary);
  border: 1px solid rgba(var(--accent-color), 0.2);
}

.btn-secondary:hover {
  background: rgba(var(--accent-color), 0.1);
  color: rgb(var(--accent-color));
  border-color: rgba(var(--accent-color), 0.3);
  transform: translateY(-1px);
}

.upload-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: rgb(var(--accent-color));
  font-size: 1.1rem;
}

.spinner i {
  font-size: 2rem;
}

@media (max-width: 768px) {
  .upload-area {
    padding: 1.5rem 1rem;
    min-height: 250px;
  }
  
  .upload-icon {
    font-size: 3rem;
  }
  
  .upload-content h3 {
    font-size: 1.2rem;
  }
  
  .info-item ul {
    font-size: 0.8rem;
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}
</style>