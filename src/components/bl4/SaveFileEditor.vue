<template>
  <div class="save-file-editor">
    <!-- Tab Navigation -->
    <div class="flex flex-wrap gap-2 p-4 bg-muted/30 border-b rounded-t-lg" v-if="saveFiles.length > 0">
      <button
        v-for="file in saveFiles"
        :key="file.name"
        :class="[
          'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
          {
            'bg-accent text-accent-foreground shadow-md ring-2 ring-accent/20 scale-105': props.activeSaveFile === file.name,
            'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground': props.activeSaveFile !== file.name,
            'ring-2 ring-orange-400/50': file.hasChanges
          }
        ]"
        @click="emit('update:activeSaveFile', file.name)"
      >
        <i :class="getFileIcon(file.name)" class="text-sm"></i>
        <span>{{ getFileDisplayName(file.name) }}</span>
        <div 
          v-if="file.hasChanges" 
          class="w-2 h-2 bg-orange-400 rounded-full animate-pulse"
          title="Modified"
        ></div>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="bg-card border-b border-l border-r rounded-b-lg" v-if="activeSaveFile">
      <div 
        v-for="file in saveFiles" 
        :key="file.name"
        v-show="props.activeSaveFile === file.name"
        class="p-6"
      >
        <!-- File Actions -->
        <div class="flex items-start justify-between mb-6 p-4 bg-muted/20 rounded-lg border">
          <div class="flex-1">
            <h3 class="text-lg font-semibold mb-2">{{ getFileDisplayName(file.name) }}</h3>
            <div class="flex items-center gap-4 text-sm text-muted-foreground">
              <div class="flex items-center gap-1">
                <i class="pi pi-file text-xs"></i>
                <span>{{ (file.size / 1024).toFixed(1) }} KB</span>
              </div>
              <div v-if="file.characterInfo" class="flex items-center gap-1">
                <i class="pi pi-user text-xs"></i>
                <span>{{ file.characterInfo?.className }} Level {{ file.characterInfo?.level }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button 
              v-if="file.hasChanges" 
              @click="revertFile(file.name)"
              class="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md transition-colors"
              title="Revert changes"
            >
              <i class="pi pi-undo text-xs"></i>
              Revert
            </button>
          </div>
        </div>

        <!-- YAML Editor -->
        <div class="space-y-4">
          <div v-if="file.yamlError" class="flex items-center gap-2 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm">
            <i class="pi pi-exclamation-triangle"></i>
            <span>{{ file.yamlError }}</span>
          </div>
          
          <div class="relative">
            <div class="absolute top-3 right-3 z-10 pointer-events-none">
              <div class="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md font-mono">
                YAML
              </div>
            </div>
            <textarea
              ref="yamlTextarea"
              :value="file.yamlContent"
              @input="handleYamlChange(file.name, $event)"
              class="yaml-textarea"
              spellcheck="false"
              placeholder="YAML content will appear here..."
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <i class="pi pi-file-o text-6xl mb-4 opacity-30"></i>
      <p class="text-lg">No save files loaded. Upload a save folder to get started.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type SaveFile } from '@/composables/useSaveFiles'

interface Props {
  saveFiles: SaveFile[]
  activeSaveFile: string
}

interface Emits {
  (e: 'update:activeSaveFile', value: string): void
  (e: 'yamlChange', fileName: string, event: Event): void
  (e: 'createBackup', fileName: string): void
  (e: 'revertFile', fileName: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const yamlTextarea = ref<HTMLTextAreaElement>()

function handleYamlChange(fileName: string, event: Event) {
  emit('yamlChange', fileName, event)
}

function revertFile(fileName: string) {
  emit('revertFile', fileName)
}

function getFileIcon(fileName: string): string {
  if (fileName === 'profile.sav') {
    return 'pi pi-user'
  } else if (fileName.match(/\d+\.sav/)) {
    return 'pi pi-user-plus'
  }
  return 'pi pi-file'
}

function getFileDisplayName(fileName: string): string {
  if (fileName === 'profile.sav') {
    return 'Profile'
  } else if (fileName.match(/\d+\.sav/)) {
    const match = fileName.match(/(\d+)\.sav/)
    const fileIndex = match ? match[1] : fileName.replace('.sav', '')
    const file = props.saveFiles.find(f => f.name === fileName)
    
    if (file?.characterInfo?.name) {
      return `${file.characterInfo.name} - Lvl ${file.characterInfo.level} (${fileIndex})`
    }
    return `Character ${fileIndex}`
  }
  return fileName
}
</script>

<style scoped>
.yaml-textarea {
  width: 100%;
  height: 400px;
  min-height: 300px;
  padding: 1rem;
  background: oklch(var(--muted));
  color: oklch(var(--foreground));
  border: 1px solid oklch(var(--border));
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  tab-size: 2;
  white-space: pre;
  overflow-wrap: normal;
  word-break: normal;
}

.yaml-textarea:focus {
  border-color: oklch(var(--accent));
  box-shadow: 0 0 0 2px oklch(var(--accent) / 0.2);
}

.yaml-textarea::placeholder {
  color: oklch(var(--muted-foreground));
  opacity: 0.6;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .yaml-textarea {
    font-size: 0.8rem;
    height: 300px;
    min-height: 250px;
    padding: 0.75rem;
  }
}
</style>