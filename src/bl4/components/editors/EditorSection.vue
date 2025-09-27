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
          <p v-if="section.description" class="text-sm leading-relaxed text-muted-foreground">
            {{ section.description }}
          </p>
        </div>
      </div>

      <div class="flex flex-row items-center gap-3">
        <div v-if="section.actions?.length" class="flex flex-wrap items-center gap-2">
          <button
            v-for="action in section.actions"
            :key="action.id"
            type="button"
            class="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase"
            :class="[
              actionButtonClass(action.variant),
              action.disabled
                ? 'opacity-60 cursor-not-allowed' : 'hover:border-muted-foreground/50'
            ]"
            :disabled="action.disabled"
            :title="action.label"
            @click.stop="handleActionClick(action.id)"
          >
            <i v-if="action.icon" :class="[action.icon, action.label ? 'text-xl' : 'text-2xl']"></i>
            <span v-if="action.label">{{ action.label }}</span>
          </button>
        </div>

        <button
          v-if="isCollapsible"
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-background/80 text-xs font-semibold text-muted-foreground transition hover:border-border hover:text-foreground focus:outline-none focus-visible:ring-2 "
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
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import EditorField from './EditorField.vue'
import { getValueByPath } from '../../lib/utils'
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
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const hasFields = computed(() => (props.section.fields?.length ?? 0) > 0)
const isCollapsible = computed(() => hasFields.value && props.section.collapsible !== false)

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

const getFieldCountLabel = (count: number) => {
  return `${count} ${count === 1 ? 'field' : 'fields'}`
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
</script>