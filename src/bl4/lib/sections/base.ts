/**
 * Base interfaces and classes for BL4 save file sections
 */

// ===== CORE INTERFACES =====

export interface SaveSection {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly icon: string
}

export interface FieldDefinition {
  readonly path: string
  readonly name: string
  readonly type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect' | 'array'
  readonly placeholder?: string
  readonly min?: number
  readonly max?: number
  readonly step?: number
  readonly options?: Array<{ value: any; label: string }>
  readonly validation?: (value: any) => boolean
}

export interface SerializableSection extends SaveSection {
  fields: FieldDefinition[]
  serialize(data: any): Record<string, any>
  deserialize(data: Record<string, any>): any
  validate(data: any): boolean
}

export interface ItemContainer extends SaveSection {
  readonly itemSchema: readonly FieldDefinition[]
  readonly maxItems: number
  readonly itemIdField: string
  serializeItems(items: any[]): Record<string, any>
  deserializeItems(data: Record<string, any>): any[]
  createEmptyItem(): any
  getContainerPath(): string[]
}

export interface SlotBasedSection extends SaveSection {
  readonly itemSchema: readonly FieldDefinition[]
  readonly maxItems: number
  generateSlotSections(saveData: any): Array<{
    id: string
    title: string
    description: string
    icon: string
    fields: readonly FieldDefinition[]
    actions?: Array<{
      id: string
      label: string
      icon: string
      variant?: 'primary' | 'secondary' | 'danger'
    }>
  }>
  serializeItems(items: any[]): Record<string, any>
  deserializeItems(data: Record<string, any>): any[]
  createEmptyItem(): any
  getContainerPath(): string[]
}

/**
 * Base class for inventory-style sections (backpack, bank, etc.)
 * Provides shared functionality for slot-based item management
 */
export abstract class BaseInventorySection implements SlotBasedSection {
  abstract readonly id: string
  abstract readonly title: string
  abstract readonly description: string
  abstract readonly icon: string
  abstract readonly maxItems: number
  abstract getContainerPath(): string[]
  
  // Default item schema - subclasses can override this
  readonly itemSchema: readonly FieldDefinition[] = [
    {
      path: 'serial',
      name: 'Serial Number',
      type: 'string',
      placeholder: 'Item serial number...'
    },
    {
      path: 'flags',
      name: 'Flags',
      type: 'number',
      min: 0,
      max: 999,
      step: 1
    },
    {
      path: 'state_flags', 
      name: 'State Flags',
      type: 'number',
      min: 0,
      max: 999,
      step: 1
    }
  ]
  
  // Default empty item template - subclasses can override this
  protected getItemTemplate(): Record<string, any> {
    return {
      serial: '',
      flags: 1,
      state_flags: 1
    }
  }

  generateSlotSections(saveData: any): Array<{
    id: string
    title: string
    description: string
    icon: string
    fields: readonly FieldDefinition[]
    actions?: Array<{
      id: string
      label: string
      icon: string
      variant?: 'primary' | 'secondary' | 'danger'
    }>
  }> {
    const items = this.deserializeItems(saveData)
    const sections: Array<any> = []

    // Create a section for each existing item
    items.forEach((item, index) => {
      if (item && item.serial) {
        sections.push({
          id: `${this.id}_slot_${index}`,
          title: `Item ${index + 1}`,
          description: item.serial,
          icon: 'pi pi-box',
          fields: this.itemSchema.map(schemaField => ({
            path: `_slot_${this.id}_${index}.${schemaField.path}`,
            name: schemaField.name,
            type: schemaField.type,
            placeholder: schemaField.placeholder,
            min: schemaField.min,
            max: schemaField.max,
            step: schemaField.step,
            validation: schemaField.validation
          })) as readonly FieldDefinition[],
          actions: [
            {
              id: 'remove-item',
              icon: 'pi pi-trash',
              variant: 'danger' as const
            }
          ]
        })
      }
    })

    return sections
  }

  createEmptyItem(): any {
    return this.getItemTemplate()
  }

  // These methods need to be implemented by subclasses for their specific data paths
  abstract serializeItems(items: any[]): Record<string, any>
  abstract deserializeItems(data: Record<string, any>): any[]
}