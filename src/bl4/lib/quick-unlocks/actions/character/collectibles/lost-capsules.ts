import { deepClone } from '../../../../utils'
import { REGIONS } from '../../../constants'
import type { QuickUnlockAction } from '../../../types'

export const collectLostCapsulesAction: QuickUnlockAction = {
  id: 'collect-lost-capsules',
  label: 'Collect Lost Capsules',
  icon: 'pi pi-send',
  variant: 'secondary',
  run(data: any) {
    const updatedData = deepClone(data ?? {})
    const warnings: string[] = []

    for (const region of REGIONS) {
      for (let i = 0; i < region.capsules; i++) {
        updatedData.stats.openworld.collectibles = updatedData.stats.openworld.collectibles || {}
        updatedData.stats.openworld.collectibles.capsules = updatedData.stats.openworld.collectibles.capsules || {}
        updatedData.stats.openworld.collectibles.capsules[`capsule_${region.name}_${i + 1}`] = 1
      }
    }

    return {
      data: updatedData,
      warnings: warnings.length ? warnings : undefined
    }
  }
}
