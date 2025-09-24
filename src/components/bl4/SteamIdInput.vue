<template>
  <div class="space-y-4">
    <div>
      <label for="steamId" class="block text-sm font-medium text-foreground mb-2">
        <i class="pi pi-user mr-1"></i>
        Steam ID or Profile URL (Required)
        <button
          class="ml-2 text-muted-foreground hover:text-foreground transition-colors"
          title="How to find your Steam ID:&#10;&#10;Option 1: Direct Steam ID&#10;• Your 17-digit Steam ID (starts with 7656119)&#10;&#10;Option 2: Steam Profile URL&#10;• Go to your Steam profile&#10;• Copy the URL from your browser&#10;• Example: steamcommunity.com/profiles/76561198XXXXXXXXX&#10;&#10;Option 3: Via Steam Client&#10;• Steam → View → Settings → Interface → Display Steam URL address bar&#10;• Go to your profile and copy the URL"
        >
          <i class="pi pi-question-circle text-xs"></i>
        </button>
      </label>
      <div class="relative">
        <input
          id="steamId"
          v-model="steamIdInput"
          @input="validateSteamId"
          @blur="validateSteamId"
          type="text"
          placeholder="76561198... or steamcommunity.com/profiles/76561198..."
          class="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 pr-12"
          :class="{
            'border-destructive ring-2 ring-destructive/20': steamIdError,
            'border-accent ring-2 ring-accent/20': steamIdValid && !steamIdError,
            'border-border': !steamIdError && !steamIdValid
          }"
        />
        <button
          v-if="steamIdInput && getCookie('bl4_steam_id')"
          @click="clearSavedSteamId"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          title="Clear saved Steam ID"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>
      <transition 
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <p v-if="steamIdError" class="mt-2 text-sm text-destructive">
          <i class="pi pi-exclamation-triangle mr-1"></i>
          {{ steamIdError }}
        </p>
        <p v-else-if="steamIdValid" class="mt-2 text-sm text-accent">
          <i class="pi pi-check mr-1"></i>
          Valid Steam ID: {{ steamId }}
          <span v-if="getCookie('bl4_steam_id')" class="ml-2 text-xs opacity-75">(saved)</span>
        </p>
        <p v-else class="mt-2 text-sm text-muted-foreground">
          Enter your Steam ID or paste your Steam profile URL
          <span v-if="getCookie('bl4_steam_id')" class="block text-xs opacity-75 mt-1">Previously saved Steam ID loaded</span>
        </p>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useSteamId } from '@/composables/useSteamId'

const {
  steamIdInput,
  steamIdError,
  steamId,
  steamIdValid,
  validateSteamId,
  clearSavedSteamId,
  initializeSteamId,
  getCookie
} = useSteamId()

// Expose the steamId and validation state to parent
defineExpose({
  steamId,
  steamIdValid,
  steamIdError
})

onMounted(() => {
  initializeSteamId()
})
</script>