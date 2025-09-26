import { deepClone } from '../../../../utils'
import { REGIONS, type Region } from '../../../constants'
import type { QuickUnlockAction } from '../../../types'

export const collectPropagandaSpeakersAction: QuickUnlockAction = {
  id: 'collect-propaganda-speakers',
  label: 'Collect Propaganda Speakers',
  icon: 'pi pi-send',
  variant: 'secondary',
  run(data: any) {
    const updatedData = deepClone(data ?? {})
    const warnings: string[] = []

    for (const region of REGIONS) {
      for (let i = 0; i < region.propaspeakers; i++) {
        updatedData.stats.openworld.collectibles = updatedData.stats.openworld.collectibles || {}
        updatedData.stats.openworld.collectibles.propaspeakers = updatedData.stats.openworld.collectibles.propaspeakers || {}
        updatedData.stats.openworld.collectibles.propaspeakers[`propaspeakers_${region.name}_${i + 1}`] = 1
      }
    }

    return {
      data: updatedData,
      warnings: warnings.length ? warnings : undefined
    }
  }
}
