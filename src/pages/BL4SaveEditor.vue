<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="border-b bg-card/30 backdrop-blur-sm">
      <div class="container mx-auto px-6 py-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
            <i class="pi pi-shield text-accent text-lg"></i>
          </div>
          <h1 class="text-3xl font-bold">Borderlands 4 Save Editor</h1>
        </div>
        <p class="text-muted-foreground text-lg mb-4">
          Upload your save folder, edit character data, and download the modified files
        </p>
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <i class="pi pi-info-circle"></i>
          <span>Decryption logic based on the excellent work by</span>
          <a 
            href="https://github.com/glacierpiece" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-accent hover:text-accent/80 underline transition-colors"
          >
            @glacierpiece
          </a>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-6 py-8 space-y-8">
      <!-- Steam ID Input Section -->
      <section v-if="!sessionId" class="bg-card rounded-lg border p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 bg-blue-500/20 rounded-md flex items-center justify-center">
            <i class="pi pi-user text-blue-500"></i>
          </div>
          <h2 class="text-xl font-semibold">Steam Configuration</h2>
        </div>
        <SteamIdInput 
          v-model="steamIdInput" 
          :error="steamIdError"
          @validate="validateSteamId"
        />
      </section>

      <!-- Upload Section -->
      <section v-if="!sessionId && steamIdValid" class="bg-card rounded-lg border p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 bg-green-500/20 rounded-md flex items-center justify-center">
            <i class="pi pi-folder-open text-green-500"></i>
          </div>
          <h2 class="text-xl font-semibold">Upload Save Folder</h2>
        </div>
        <SaveFolderUpload
          :uploading="uploading"
          @upload="handleFolderUpload"
        />
      </section>

            <!-- Success Message -->
      <div v-if="sessionId && saveFiles.length > 0" class="bg-accent/10 border border-accent/20 rounded-lg p-6">
        <div class="flex items-center gap-3">
          <i class="pi pi-check-circle text-accent text-xl"></i>
          <div>
            <h3 class="font-semibold text-accent">Save Folder Loaded!</h3>
            <p class="text-muted-foreground">Successfully loaded {{ saveFiles.length }} save files</p>
          </div>
        </div>
      </div>

      <!-- File Editor Section -->
      <section v-if="saveFiles.length > 0" class="bg-card rounded-lg border">
        <div class="flex items-center justify-between p-6 border-b">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-purple-500/20 rounded-md flex items-center justify-center">
              <i class="pi pi-file-edit text-purple-500"></i>
            </div>
            <h2 class="text-xl font-semibold">Save Files Editor</h2>
          </div>
          <button 
            @click="handleDownload" 
            :disabled="downloading || !sessionId"
            class="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i class="pi pi-download" :class="{ 'pi-spin pi-spinner': downloading }"></i>
            {{ downloading ? 'Creating ZIP...' : 'Download Modified Saves' }}
          </button>
        </div>

        <div class="p-6">
          <SaveFileEditor
            :saveFiles="saveFiles"
            v-model:activeSaveFile="activeSaveFile"
            @yamlChange="handleYamlChange"
            @createBackup="createBackup"
            @revertFile="revertFile"
          />
        </div>
      </section>

      <!-- Error Display -->
      <div v-if="error" class="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-destructive">
            <i class="pi pi-exclamation-triangle"></i>
            <span>{{ error }}</span>
          </div>
          <button 
            @click="error = ''" 
            class="text-destructive/60 hover:text-destructive transition-colors"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useSteamId } from '../composables/useSteamId'
import { useSaveFiles } from '../composables/useSaveFiles'
import SteamIdInput from '../components/SteamIdInput.vue'
import SaveFolderUpload from '../components/SaveFolderUpload.vue'
import SaveFileEditor from '../components/SaveFileEditor.vue'

// Steam ID composable
const {
  steamIdInput,
  steamIdError,
  steamId,
  steamIdValid,
  validateSteamId,
  initializeSteamId
} = useSteamId()

// Save files composable
const {
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
  downloadSaveFolder
} = useSaveFiles()

// Initialize Steam ID from cookie on mount
onMounted(() => {
  initializeSteamId()
})

// Handle folder upload from child component
async function handleFolderUpload(files: FileList) {
  try {
    await uploadSaveFolder(files, steamId.value)
  } catch (err) {
    // Error is already handled in the composable
  }
}

// Handle download with Steam ID
async function handleDownload() {
  await downloadSaveFolder(steamId.value)
}
</script>

<style scoped>
/* Only keeping minimal custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container section,
.container > div {
  animation: fadeIn 0.4s ease-out;
}
</style>