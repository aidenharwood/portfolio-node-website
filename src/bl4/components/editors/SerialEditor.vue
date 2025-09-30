<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-0"
      leave-to-class="opacity-100"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="handleClose"
      >
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-0 scale-95"
          leave-to-class="opacity-100 scale-100"
        >
          <div
            v-if="show"
            class="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl border border-border/60 bg-background shadow-2xl"
          >
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-border/60 bg-card/60 px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-accent/20 rounded-md flex items-center justify-center">
                  <i class="pi pi-code text-accent"></i>
                </div>
                <div>
                  <h2 class="text-lg font-semibold">{{ itemDisplayName }}</h2>
                  <p class="text-sm text-muted-foreground">
                    {{ decodedItem?.itemCategory || 'Unknown Item' }}
                    <span class="text-xs text-muted-foreground/70">({{ decodedItem?.confidence || 'unknown' }} confidence)</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-background/80 text-muted-foreground transition hover:border-border hover:text-foreground"
                @click="handleClose"
              >
                <i class="pi pi-times text-sm"></i>
                <span class="sr-only">Close</span>
              </button>
            </div>

            <!-- Content -->
            <div class="max-h-[calc(90vh-140px)] overflow-y-auto p-6">
              <!-- Item controls (moved from header): Item Type, Equipped, State Flags -->
              <div class="mb-4 rounded-lg border border-border/60 bg-card/60 p-4">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                  <div>
                    <label class="block text-xs font-medium text-muted-foreground mb-1">Item Type</label>
                    <select
                      v-model="editableItemType"
                      class="text-sm rounded-md border border-border/60 bg-background px-2 py-1"
                      @change="handleItemTypeChange"
                    >
                      <option
                        v-for="option in itemTypeOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                  <div class="flex items-center gap-2">
                    <label class="block text-xs font-medium text-muted-foreground mb-1">Equipped</label>
                    <label class="inline-flex items-center gap-2 ml-2">
                      <input type="checkbox" v-model="editableFlags" class="h-4 w-4" />
                      <span class="text-xs text-muted-foreground">Equipped</span>
                    </label>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-muted-foreground mb-1">State Flags</label>
                    <select v-model.number="editableStateFlag" class="text-sm rounded-md border border-border/60 bg-background px-2 py-1">
                      <option :value="0">New</option>
                      <option :value="1">Seen</option>
                      <option :value="3">Favorite</option>
                      <option :value="5">Trash</option>
                      <option :value="17">Tag group 1</option>
                      <option :value="33">Tag group 2</option>
                      <option :value="65">Tag group 3</option>
                      <option :value="129">Tag group 4</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Original Serial -->
              <div class="rounded-lg border border-border/60 bg-card/60 p-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-foreground">Original Serial</span>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      @click="copyToClipboard(originalSerial)"
                      :class="[BUTTON_BASE, 'ml-0', 'rounded-md', 'px-2']"
                    >
                      <i class="pi pi-copy text-xs"></i>
                      Copy
                    </button>
                    <button
                      type="button"
                      @click="revertChanges"
                      :class="[BUTTON_BASE, 'ml-0', 'rounded-md', 'px-2']"
                      title="Revert edits to the original serial values"
                    >
                      <i class="pi pi-undo text-xs"></i>
                      Revert
                    </button>
                  </div>
                </div>
                <div class="mt-2 break-all rounded-md bg-muted/50 p-3 font-mono text-xs text-muted-foreground">
                  {{ originalSerial }}
                </div>
              </div>

              <!-- Live Encoded Serial -->
              <div class="rounded-lg border border-accent/40 bg-accent/5 p-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-foreground">Live Encoded Serial</span>
                  <button
                    type="button"
                    @click="copyToClipboard(liveEncodedSerial)"
                    :class="[BUTTON_BASE, 'ml-0', 'rounded-md', 'px-2']"
                  >
                    <i class="pi pi-copy text-xs"></i>
                    Copy
                  </button>
                </div>
                <div class="mt-2 break-all rounded-md bg-accent/10 p-3 font-mono text-xs text-accent-foreground">
                  {{ liveEncodedSerial }}
                </div>
                <div class="mt-2 text-xs text-muted-foreground">
                  Updates automatically as you edit values
                </div>
              </div>

              <!-- Error State -->
              <div v-if="decodedItem?.itemType === 'error'" class="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4">
                <div class="flex items-center gap-2 text-destructive">
                  <i class="pi pi-exclamation-triangle"></i>
                  <span class="font-medium">Failed to decode serial</span>
                </div>
                <p class="mt-2 text-sm text-destructive/80">
                  {{ decodedItem.rawFields?.error || 'Unknown error occurred while decoding this serial.' }}
                </p>
              </div>

              <!-- Stats Editor -->
              <div v-else-if="decodedItem" class="space-y-6">
                <!-- Item Info -->
                <!-- <div class="grid grid-cols-2 gap-4">
                  <div class="rounded-lg border border-border/60 bg-card/60 p-4">
                    <span class="text-sm font-medium text-foreground">Item Type</span>
                    <div class="mt-2 text-lg font-semibold text-accent">
                      {{ decodedItem.itemType.toUpperCase() }}
                    </div>
                  </div>
                  <div class="rounded-lg border border-border/60 bg-card/60 p-4">
                    <span class="text-sm font-medium text-foreground">Data Length</span>
                    <div class="mt-2 text-lg font-semibold text-accent">
                      {{ decodedItem.length }} bytes
                    </div>
                  </div>
                </div> -->

                <!-- Editable Stats -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <h3 class="text-sm font-semibold text-foreground uppercase tracking-wide">Item Stats</h3>
                    <div class="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                      Raw values (BL4 mappings unknown)
                    </div>
                  </div>

                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <!-- Primary Stat -->
                    <div class="rounded-lg border border-border/60 bg-card/60 p-4">
                      <label class="block text-sm font-medium text-foreground">Primary Stat</label>
                      <input
                        v-model.number="editableStats.primaryStat"
                        type="number"
                        min="0"
                        max="65535"
                        class="mt-2 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
                        :placeholder="decodedItem.stats.primaryStat?.toString() || 'N/A'"
                      />
                    </div>

                    <!-- Secondary Stat -->
                    <div class="rounded-lg border border-border/60 bg-card/60 p-4">
                      <label class="block text-sm font-medium text-foreground">Secondary Stat</label>
                      <input
                        v-model.number="editableStats.secondaryStat"
                        type="number"
                        min="0"
                        max="65535"
                        class="mt-2 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
                        :placeholder="decodedItem.stats.secondaryStat?.toString() || 'N/A'"
                      />
                    </div>

                    <!-- Level -->
                    <div class="rounded-lg border border-border/60 bg-card/60 p-4">
                      <label class="block text-sm font-medium text-foreground">Level</label>
                      <input
                        v-model.number="editableStats.level"
                        type="number"
                        min="1"
                        max="72"
                        class="mt-2 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
                        :placeholder="decodedItem.stats.level?.toString() || 'N/A'"
                      />
                    </div>

                    <!-- Rarity -->
                    <div class="rounded-lg border border-border/60 bg-card/60 p-4">
                      <label class="block text-sm font-medium text-foreground">Rarity</label>
                      <select
                        v-model.number="editableStats.rarity"
                        class="mt-2 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Select Rarity</option>
                        <option
                          v-for="option in rarityOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>
                    </div>

                    <!-- Manufacturer -->
                    <div class="rounded-lg border border-border/60 bg-card/60 p-4">
                      <label class="block text-sm font-medium text-foreground">Manufacturer</label>
                      <input
                        v-model.number="editableStats.manufacturer"
                        type="number"
                        min="0"
                        max="255"
                        class="mt-2 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
                        :placeholder="decodedItem.stats.manufacturer?.toString() || 'N/A'"
                      />
                    </div>

                    <!-- Item Class -->
                    <div class="rounded-lg border border-border/60 bg-card/60 p-4">
                      <label class="block text-sm font-medium text-foreground">Item Class</label>
                      <input
                      v-model.number="editableStats.itemClass"
                      type="number"
                      min="0"
                      max="255"
                      class="mt-2 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
                      :placeholder="decodedItem.stats.itemClass?.toString() || 'N/A'"
                      />
                    </div>
                  </div>

                  <!-- Parts -->
                  <div class="rounded-lg border border-border/60 bg-card/60 p-4">
                    <label class="block text-sm font-medium text-foreground mb-2">Parts</label>
                    <div class="space-y-2">
                      <div v-if="!editableStats.parts || editableStats.parts.length === 0" class="text-sm text-muted-foreground">
                        No parts configured
                      </div>
                      <div v-else class="space-y-2">
                        <div
                          v-for="(_, index) in editableStats.parts"
                          :key="index"
                          class="flex items-center gap-2"
                        >
                          <span class="text-sm font-medium min-w-[60px]">Part {{ index + 1 }}:</span>
                          <input
                            v-model.number="editableStats.parts[index]"
                            type="number"
                            min="1"
                            max="999"
                            class="flex-1 rounded-md border border-border/60 bg-background px-2 py-1 text-sm"
                            :placeholder="'Value'"
                          />
                          <button
                            type="button"
                            class="inline-flex items-center justify-center w-6 h-6 rounded border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 transition"
                            @click="removePart(index)"
                          >
                            <i class="pi pi-minus text-xs"></i>
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        class="inline-flex items-center gap-2 rounded-md border border-border/60 bg-background/80 px-3 py-1 text-sm transition hover:border-border hover:bg-background"
                        @click="addPart"
                      >
                        <i class="pi pi-plus text-xs"></i>
                        Add Part
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Raw Fields (Debug) -->
                <details class="rounded-lg border border-border/60 bg-card/60">
                  <summary class="cursor-pointer p-4 text-sm font-medium text-foreground">
                    Raw Fields (Debug)
                  </summary>
                  <div class="border-t border-border/60 p-4">
                    <pre class="text-xs text-muted-foreground">{{ JSON.stringify(decodedItem.rawFields, null, 2) }}</pre>
                  </div>
                </details>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 border-t border-border/60 bg-card/60 px-6 py-4">
              <button
                type="button"
                @click="handleClose"
                :class="[BUTTON_BASE, 'px-4', 'font-medium', 'text-foreground', 'bg-background/80']"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="handleSave"
                :class="[BUTTON_BASE, 'px-4', 'font-medium', 'bg-accent', 'text-accent-foreground']"
              >
                <i class="pi pi-save text-xs"></i>
                Save Changes
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { decodeItemSerial, encodeItemSerial, getItemDisplayName, type DecodedItem, type ItemStats } from '../../lib/utils/serial-utils'
import { copyToClipboard } from '../../lib/utils/clipboard'
import { ITEM_TYPE_OPTIONS, RARITY_OPTIONS } from '../../lib/constants/serial-constants'


interface Props {
  serial?: string
  flags?: number
  state_flags?: number
}

interface Emits {
  (e: 'close'): void
  (e: 'update:serial', value: string): void
  (e: 'save', value: { serial: string, flags: number, state_flags: number }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const show = ref(false)
const originalSerial = ref('')
const decodedItem = ref<DecodedItem | null>(null)
const editableStats = ref<ItemStats>({})
const editableItemType = ref<string>('')

// State flag (default to 0 = New)
const editableStateFlag = ref<number>(0)
// Item-level 'equipped' flag represented as a boolean for checkbox
const editableFlags = ref<boolean>(false)

// Computed
const itemDisplayName = computed(() => {
  if (!decodedItem.value) return 'Edit Item Serial'
  return `Edit ${getItemDisplayName(decodedItem.value.serial)} [WORK IN PROGRESS]`
})
const itemTypeOptions = computed(() => ITEM_TYPE_OPTIONS)
const rarityOptions = computed(() => RARITY_OPTIONS)

// Standard button base to keep buttons uniform height and alignment with EditorField
const BUTTON_BASE = 'inline-flex items-center justify-center h-10 gap-2 rounded-lg border px-3 text-xs'

// Real-time encoded serial
const liveEncodedSerial = computed(() => {
  if (!decodedItem.value) return ''
  try {
    const modifiedItem: DecodedItem = {
      ...decodedItem.value,
      stats: { ...editableStats.value },
      itemType: editableItemType.value
    }
    
    // Check if parts have changed
    const originalParts = decodedItem.value.stats.parts || []
    const currentParts = editableStats.value.parts || []
    const partsChanged = JSON.stringify(originalParts) !== JSON.stringify(currentParts)
    
    if (partsChanged && currentParts.length > 0) {
      // For live display, append parts info to make it decodable
      const encoded = encodeItemSerial(modifiedItem)
      return encoded + `#parts=${currentParts.join(',')}`
    } else {
      return encodeItemSerial(modifiedItem)
    }
  } catch (error) {
    console.warn('Failed to encode serial:', error)
    return originalSerial.value
  }
})

// Watchers
watch(() => props.serial, (newSerial) => {
  if (newSerial) {
    openEditor(newSerial)
  }
}, { immediate: true })

// Methods
function openEditor(serial: string) {
  originalSerial.value = serial
  decodedItem.value = decodeItemSerial(serial)
  editableStats.value = { 
    ...decodedItem.value.stats,
    parts: decodedItem.value.stats.parts ? [...decodedItem.value.stats.parts] : []
  }
  editableItemType.value = decodedItem.value.itemType
  show.value = true

  // Prefill editable flags/state_flags from props if provided, else fall back to decoded serial
  if (typeof props.flags === 'number') {
    editableFlags.value = props.flags === 1
  } else {
    editableFlags.value = ((decodedItem.value as any).flags ?? 0) === 1
  }
  if (typeof props.state_flags === 'number') {
    editableStateFlag.value = props.state_flags
  } else if (decodedItem.value && decodedItem.value.state_flag !== undefined) {
    editableStateFlag.value = decodedItem.value.state_flag
  } else {
    editableStateFlag.value = 0
  }
}

function handleClose() {
  show.value = false
  emit('close')
}

function handleItemTypeChange() {
  // When item type changes, we need to re-decode with the new type
  // This is a simplified approach - in a real implementation, you'd want to
  // preserve the raw data and re-encode with the new type prefix
  if (decodedItem.value && editableItemType.value !== decodedItem.value.itemType) {
    // For now, just update the item type in the decoded item
    decodedItem.value.itemType = editableItemType.value
  }
}

function handleSave() {
  if (!decodedItem.value) return

  // Create modified item with updated stats and type
  // Only include state_flag if not 0 (New)
  let modifiedItem: DecodedItem
  if (editableStateFlag.value && editableStateFlag.value !== 0) {
    modifiedItem = {
      ...decodedItem.value,
      stats: { ...editableStats.value },
      itemType: editableItemType.value,
      state_flag: editableStateFlag.value
    }
  } else {
    // Remove state_flag if present
    const { state_flag, ...rest } = decodedItem.value as any
    delete rest.state_flag
    modifiedItem = {
      ...rest,
      stats: { ...editableStats.value },
      itemType: editableItemType.value
    }
  }

  // Encode back to serial
  const newSerial = encodeItemSerial(modifiedItem)

  // Emit update for serial and also emit consolidated save with item-level flags/state_flags
  emit('update:serial', newSerial)
  const payload: any = { serial: newSerial }
  // Always include flags/state_flags as numeric values; parent will remove them when 0
  payload.flags = editableFlags.value ? 1 : 0
  payload.state_flags = typeof editableStateFlag.value === 'number' ? editableStateFlag.value : 0
  emit('save', payload)
  handleClose()
}

function addPart() {
  if (!editableStats.value.parts) {
    editableStats.value.parts = []
  }
  const nextPart = editableStats.value.parts.length + 1
  editableStats.value.parts = [...editableStats.value.parts, nextPart]
}

function removePart(index: number) {
  if (editableStats.value.parts && editableStats.value.parts.length > index) {
    const newParts = [...editableStats.value.parts]
    newParts.splice(index, 1)
    editableStats.value.parts = newParts
  }
}

function revertChanges() {
  if (!decodedItem.value) return
  // Reset editable stats, item type and flags to original decoded values
  editableStats.value = {
    ...decodedItem.value.stats,
    parts: decodedItem.value.stats.parts ? [...decodedItem.value.stats.parts] : []
  }
  editableItemType.value = decodedItem.value.itemType
  // If the decoded item contains item-level flags/state_flag, restore those; otherwise default
  editableFlags.value = ((decodedItem.value as any).flags ?? 0) === 1
  editableStateFlag.value = (decodedItem.value as any).state_flag ?? 0
}
</script>
