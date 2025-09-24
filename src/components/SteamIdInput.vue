<template>
  <div class="steam-input-container">
    <div class="input-group">
      <label for="steamId" class="input-label">
        <i class="pi pi-user"></i>
        Steam ID <span class="required">*</span>
        <button
          type="button"
          class="help-button"
          :title="helpTooltip"
        >
          <i class="pi pi-question-circle"></i>
        </button>
      </label>
      
      <div class="input-wrapper">
        <input
          id="steamId"
          v-model="localValue"
          @input="handleInput"
          type="text"
          placeholder="Enter your Steam ID or profile URL (e.g., steamcommunity.com/profiles/76561198123456789)"
          class="steam-input"
          :class="{ 'invalid': error }"
        >
        <button
          v-if="localValue && hasSavedValue"
          @click="clearInput"
          type="button"
          class="clear-button"
          title="Clear saved Steam ID"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>
      
      <div v-if="extractedId && extractedId !== localValue" class="extracted-info">
        <i class="pi pi-check-circle"></i>
        Extracted Steam ID: {{ extractedId }}
      </div>
      
      <div v-if="error" class="error-message">
        <i class="pi pi-exclamation-triangle"></i>
        {{ error }}
      </div>
      
      <div v-else-if="isValid" class="success-message">
        <i class="pi pi-check"></i>
        Valid Steam ID
        <span v-if="hasSavedValue" class="saved-indicator">(saved)</span>
      </div>
      
      <div v-else class="help-text">
        You can enter either your Steam ID directly or your Steam profile URL.
        The Steam ID will be extracted automatically from the URL.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue: string
  error?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'validate'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

// Mock some properties that would come from the composable
const extractedId = ref('')
const isValid = ref(false)
const hasSavedValue = ref(false)

const helpTooltip = `How to find your Steam ID:

1. Open Steam and go to your profile
2. Right-click anywhere on your profile page  
3. Select 'Copy Page URL'
4. Your Steam ID is the 17-digit number in the URL

Example: steamcommunity.com/profiles/76561198XXXXXXXXX

You can also paste the full profile URL and the Steam ID will be extracted automatically.`

function handleInput() {
  emit('validate')
}

function clearInput() {
  localValue.value = ''
  emit('validate')
}
</script>

<style scoped>
.steam-input-container {
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-color);
  font-weight: 500;
  font-size: 1rem;
}

.required {
  color: var(--red-400);
}

.help-button {
  background: none;
  border: none;
  color: var(--text-color-secondary);
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  transition: color 0.2s ease;
}

.help-button:hover {
  color: rgb(var(--accent-color));
}

.input-wrapper {
  position: relative;
}

.steam-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(var(--accent-color), 0.3);
  border-radius: 8px;
  background: rgba(var(--accent-color), 0.02);
  color: var(--text-color);
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.steam-input:focus {
  outline: none;
  border-color: rgba(var(--accent-color), 0.6);
  box-shadow: 0 0 0 3px rgba(var(--accent-color), 0.15);
}

.steam-input.invalid {
  border-color: var(--red-400);
  box-shadow: 0 0 0 2px rgba(var(--red-500), 0.1);
}

.clear-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-color-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.clear-button:hover {
  color: var(--text-color);
  background: rgba(var(--surface-100), 0.1);
}

.extracted-info {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgb(var(--accent-color));
  font-size: 0.9rem;
  padding: 8px 12px;
  background: rgba(var(--accent-color), 0.1);
  border-radius: 6px;
  border: 1px solid rgba(var(--accent-color), 0.2);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--red-400);
  font-size: 0.9rem;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgb(var(--accent-color));
  font-size: 0.9rem;
  font-weight: 500;
}

.saved-indicator {
  opacity: 0.7;
  font-size: 0.8rem;
}

.help-text {
  color: var(--text-color-secondary);
  font-size: 0.85rem;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .steam-input {
    font-size: 16px; /* Prevent zoom on iOS */
  }
}
</style>