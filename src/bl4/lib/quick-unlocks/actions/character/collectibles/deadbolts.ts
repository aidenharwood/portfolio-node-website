import { deepClone } from '../../../../utils'
// import { REGIONS } from '../../../constants'
import type { QuickUnlockAction } from '../../../types'

export const collectDeadboltsAction: QuickUnlockAction = {
  id: 'collect-deadbolts',
  label: 'Collect Deadbolts',
  icon: 'pi pi-send',
  variant: 'secondary',
  run(data: any) {
    const updatedData = deepClone(data ?? {})
    const warnings: string[] = []

    // for (const region of REGIONS) {
    //   for (let i = 0; i < region.deadbolts; i++) {
    //     updatedData.stats.openworld.collectibles = updatedData.stats.openworld.collectibles || {}
    //     updatedData.stats.openworld.collectibles.deadbolts = updatedData.stats.openworld.collectibles.deadbolts || {}
    //     updatedData.stats.openworld.collectibles.deadbolts[`deadbolt_${region.name}_${i + 1}`] = 1
    //   }
    // }
    
    return {
      data: updatedData,
      warnings: warnings.length ? warnings : undefined
    }
  }
}
