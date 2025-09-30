<template>
  <section
    class="editor-section rounded-2xl bg-card/80 shadow-sm transition hover:border-border/80"
    :class="{ 'compact-section': section && section.id && section.id.includes('_slot_') }"
    :data-collapsible="isCollapsible"
  >
    <div
      class="section-header flex flex-col gap-4 border-b border-border/40 p-5 sm:flex-row sm:items-start sm:justify-between"
      :class="isCollapsible ? 'cursor-pointer hover:bg-background/60' : ''"
      @click="isCollapsible ? toggleSection() : undefined"
    >
      <div class="flex flex-1 items-start gap-4">
        <div
          v-if="section.icon"
          class="flex h-12 w-12 items-center justify-center rounded-xl text-2xl text-accent shadow-sm"
        >
          <i :class="section.icon"></i>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex flex-wrap items-center gap-3">
            <h4 class="text-base font-semibold text-foreground">{{ section.title }}</h4>
          </div>
          <!-- Item summary + serial for slot sections -->
          <div v-if="isSlotSection && (itemSerial || (props.section as any)?.meta?.serial)" class="mt-1 text-xs text-muted-foreground flex flex-col gap-1">
            <span v-if="(props.section as any)?.meta?.summary" class="font-medium">{{ (props.section as any).meta.summary }}</span>
          </div>
        </div>
      </div>

      <div class="flex flex-row items-center gap-3">
        <div v-if="section.actions?.length" class="flex flex-wrap items-center gap-2">
          <template v-for="action in section.actions">
            <!-- Special-case copy-serial: render icon-only and show serial text next to it -->
            <div v-if="action.id === 'copy-serial'" :key="action.id + '-copy'" class="flex items-center gap-2">
              <button
                type="button"
                :class="[BUTTON_BASE, 'px-3', 'font-mono', action.disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-muted-foreground/50']"
                :disabled="action.disabled"
                :title="action.label"
                @click.stop="handleActionClick(action.id)"
              >
                <span class="">{{ action.label || itemSerial }}</span>
                <i class="pi pi-copy text-sm"></i>
              </button>
            </div>
            <!-- Default action rendering -->
            <button
              v-else
              :key="action.id + '-default'"
              type="button"
              :class="[BUTTON_BASE, actionButtonClass(action.variant), action.disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-muted-foreground/50', 'font-semibold', 'uppercase']"
              :disabled="action.disabled"
              :title="action.label"
              @click.stop="handleActionClick(action.id)"
            >
              <i v-if="action.icon" :class="[action.icon, action.label ? 'text-xl' : 'text-2xl']"></i>
              <span v-if="action.label">{{ action.label }}</span>
            </button>
          </template>
        </div>

        <button
          v-if="isCollapsible"
          type="button"
          :class="[BUTTON_BASE, 'w-9', 'h-9', 'text-muted-foreground', 'bg-background/80']"
          @click.stop="toggleSection()"
          :aria-expanded="expanded"
          :aria-label="expanded ? 'Collapse section' : 'Expand section'"
        >
          <i class="pi" :class="expanded ? 'pi-chevron-up' : 'pi-chevron-right'"></i>
        </button>
      </div>
    </div>

    <div v-if="hasFields && (expanded || section.collapsible === false)" class="section-content space-y-4 p-5">
      <div class="section-fields space-y-2">
        <EditorField
          v-for="field in section.fields"
          :key="field.yamlPath"
          v-bind="field"
          :value="getFieldValue(field.yamlPath)"
          @update="(value) => handleFieldUpdate(field.yamlPath, value)"
          @openItemEditor="(yamlPath) => emit('openItemEditor', yamlPath)"
        />
      </div>
    </div>
    
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import EditorField from './EditorField.vue'
import { getValueByPath } from '../../lib/utils'
// getItemDisplayName not needed here; section.meta.summary provides summary info
import type { EditorSectionConfig } from '../../lib/types/editor-interfaces'

interface Props {
  section: EditorSectionConfig
  yamlData: any
  expanded: boolean
}

interface Emits {
  (e: 'toggle', sectionId: string): void
  (e: 'fieldUpdate', yamlPath: string, value: any): void
  (e: 'sectionAction', actionId: string, sectionId: string): void
  (e: 'openItemEditor', yamlPath: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const hasFields = computed(() => (props.section.fields?.length ?? 0) > 0)
const isCollapsible = computed(() => hasFields.value && props.section.collapsible !== false)

// Determine whether this section is a slot-based item section (e.g., _slot_backpack_3)
const isSlotSection = computed(() => !!(props.section?.id && String(props.section.id).includes('_slot_')))

// Try to locate a serial field within this section's fields and read the serial from yamlData
const serialFieldPath = computed(() => {
  const fields = props.section?.fields ?? []
  const serialField = fields.find((f: any) => {
    if (!f || !f.yamlPath) return false
    const p = String(f.yamlPath).toLowerCase()
    return p.endsWith('.serial') || (f.semanticName && String(f.semanticName).toLowerCase().includes('serial'))
  })
  return serialField?.yamlPath ?? null
})

const itemSerial = computed(() => {
  // Prefer explicit meta.serial provided for slot sections
  const metaAny = (props.section as any)?.meta
  if (metaAny && metaAny.serial) return metaAny.serial
  if (!serialFieldPath.value) return null
  try {
    return getValueByPath(props.yamlData, serialFieldPath.value)
  } catch {
    return null
  }
})

// itemSummary is provided via section.meta.summary now; fall back to itemSerial where needed

const toggleSection = () => {
  if (!isCollapsible.value) {
    return
  }
  emit('toggle', props.section.id)
}

const getFieldValue = (yamlPath: string): any => {
  return getValueByPath(props.yamlData, yamlPath)
}

const handleFieldUpdate = (yamlPath: string, value: any) => {
  emit('fieldUpdate', yamlPath, value)
}

const handleActionClick = (actionId: string) => {
  emit('sectionAction', actionId, props.section.id)
}

const actionButtonClass = (variant: 'primary' | 'secondary' | 'danger' | undefined) => {
  switch (variant) {
    case 'primary':
      return 'bg-primary/50 text-accent shadow-sm text-muted-foreground hover:text-foreground border-primary/70'
    case 'danger':
      return 'border-destructive/50 bg-destructive/15 text-destructive'
    default:
      return 'bg-muted-foreground text-foreground'
  }
}

// Standard button base consistent with EditorField
const BUTTON_BASE = 'inline-flex items-center justify-center h-10 gap-2 rounded-lg border px-3 text-xs'
</script>