/**
 * Borderlands serial number constants and mappings
 * Based on BL3 serial number understanding and BL4 observations
 */

export interface NumericDropdownOption {
  value: number
  label: string
}

export interface StringDropdownOption {
  value: string
  label: string
}

export type DropdownOption = NumericDropdownOption | StringDropdownOption

// Rarity mappings (0-4: common, uncommon, rare, epic, legendary)
export const RARITY_OPTIONS: NumericDropdownOption[] = [
  { value: 0, label: 'Common' },
  { value: 1, label: 'Uncommon' },
  { value: 2, label: 'Rare' },
  { value: 3, label: 'Epic' },
  { value: 4, label: 'Legendary' }
]

// Manufacturer mappings (based on BL4 manufacturers)
export const MANUFACTURER_OPTIONS: NumericDropdownOption[] = [
  { value: 1, label: 'Atlas' },
  { value: 2, label: 'COV' },
  { value: 3, label: 'Dahl' },
  { value: 4, label: 'Hyperion' },
  { value: 5, label: 'Jakobs' },
  { value: 6, label: 'Maliwan' },
  { value: 7, label: 'Tediore' },
  { value: 8, label: 'Torgue' },
  { value: 9, label: 'Vladof' },
  { value: 10, label: 'Gearbox' },
  { value: 11, label: 'Eridian' },
  { value: 12, label: 'Pangolin' },
  { value: 13, label: 'Anshin' },
  { value: 14, label: 'Bandit' },
  { value: 15, label: 'Children of the Vault' },
  { value: 16, label: 'Psycho' },
  { value: 17, label: 'Rarity' },
  { value: 18, label: 'Seraph' },
  { value: 19, label: 'Stalker' },
  { value: 20, label: 'Titan' },
  { value: 21, label: 'Torch' },
  { value: 22, label: 'Varkid' },
  { value: 23, label: 'Zane' },
  { value: 24, label: 'FL4K' },
  { value: 25, label: 'Amara' },
  { value: 26, label: 'Moze' },
  { value: 27, label: 'Siren' },
  { value: 28, label: 'Operative' },
  { value: 29, label: 'Beastmaster' },
  { value: 30, label: 'Gunner' },
  { value: 31, label: 'Unknown Manufacturer' }
]

// Item class mappings (weapon types and equipment classes)
export const ITEM_CLASS_OPTIONS: NumericDropdownOption[] = [
  // Weapons
  { value: 1, label: 'Pistol' },
  { value: 2, label: 'SMG' },
  { value: 3, label: 'Assault Rifle' },
  { value: 4, label: 'Shotgun' },
  { value: 5, label: 'Sniper Rifle' },
  { value: 6, label: 'Rocket Launcher' },
  { value: 7, label: 'Grenade' },
  { value: 8, label: 'Melee Weapon' },
  { value: 9, label: 'Heavy Weapon' },
  { value: 10, label: 'Shield' },
  { value: 11, label: 'Grenade Mod' },
  { value: 12, label: 'Class Mod' },
  { value: 13, label: 'Artifact' },
  { value: 14, label: 'Relic' },
  { value: 15, label: 'Utility Item' },
  { value: 16, label: 'Consumable' },
  { value: 17, label: 'Mission Item' },
  { value: 18, label: 'Currency' },
  { value: 19, label: 'Key' },
  { value: 20, label: 'Vehicle Part' },
  { value: 21, label: 'Customization' },
  { value: 22, label: 'Unknown Item Class' }
]

// Item type mappings (from serial prefixes)
export const ITEM_TYPE_OPTIONS: StringDropdownOption[] = [
  { value: 'r', label: 'Weapon (r)' },
  { value: 'e', label: 'Equipment Type E (e)' },
  { value: 'd', label: 'Equipment Type D (d)' },
  { value: 'w', label: 'Weapon Special (w)' },
  { value: 'u', label: 'Utility (u)' },
  { value: 'f', label: 'Consumable (f)' },
  { value: '!', label: 'Special (!) (f)' },
  { value: 'v', label: 'Vehicle Part (v)' }
]

// Helper functions to get labels
export function getRarityLabel(value: number): string {
  const option = RARITY_OPTIONS.find(opt => opt.value === value)
  return option ? option.label : `Unknown (${value})`
}

export function getManufacturerLabel(value: number): string {
  const option = MANUFACTURER_OPTIONS.find(opt => opt.value === value)
  return option ? option.label : `Unknown (${value})`
}

export function getItemClassLabel(value: number): string {
  const option = ITEM_CLASS_OPTIONS.find(opt => opt.value === value)
  return option ? option.label : `Unknown (${value})`
}

export function getItemTypeLabel(type: string): string {
  const option = ITEM_TYPE_OPTIONS.find(opt => opt.value === type)
  return option ? option.label : `Unknown (${type})`
}

// Reverse lookup functions (get value from label)
export function getRarityValue(label: string): number | undefined {
  const option = RARITY_OPTIONS.find(opt => opt.label === label)
  return option?.value
}

export function getManufacturerValue(label: string): number | undefined {
  const option = MANUFACTURER_OPTIONS.find(opt => opt.label === label)
  return option?.value
}

export function getItemClassValue(label: string): number | undefined {
  const option = ITEM_CLASS_OPTIONS.find(opt => opt.label === label)
  return option?.value
}