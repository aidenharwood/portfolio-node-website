const SDU_NODE_PREFIXES = [
  'Ammo_Pistol',
  'Ammo_SMG',
  'Ammo_AR',
  'Ammo_SG',
  'Ammo_SR',
  'Backpack',
  'Bank',
  'Lost_Loot'
]

const SDU_POINT_SPENDS: number[] = [5, 10, 20, 30, 50, 80, 120, 235]

export const ALL_SDU_NODES = Object.freeze(
  SDU_NODE_PREFIXES.flatMap((prefix) =>
    SDU_POINT_SPENDS.map((points_spent, index) => ({
      name: `${prefix}_${(index + 1).toString().padStart(2, '0')}`,
      points_spent
    }))
  )
)

const HOVERDRIVE_MANUFACTURERS = [
  'Daedalus',
  'Jakobs',
  'Maliwan',
  'Order',
  'Ripper',
  'Tediore',
  'Torgue',
  'Vladof'
]

const HOVERDRIVES_PER_MANUFACTURER = 5

export const ALL_HOVERDRIVE_PATHS = Object.freeze(
  HOVERDRIVE_MANUFACTURERS.flatMap((manufacturer) =>
    Array.from({ length: HOVERDRIVES_PER_MANUFACTURER }, (_, index) =>
      `unlockable_hoverdrives.manufacturer_${manufacturer.toLowerCase()}_${(index + 1)
        .toString()
        .padStart(2, '0')}`
    )
  )
)
