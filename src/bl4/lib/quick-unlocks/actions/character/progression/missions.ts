import { deepClone } from '../../../../utils'
import type { QuickUnlockAction } from '../../../types'

export const completeAllMissionsAction: QuickUnlockAction = {
  id: 'complete-all-missions',
  label: 'Complete All Missions',
  icon: 'pi pi-send',
  variant: 'secondary',
  run(data: any) {
    const updatedData = deepClone(data ?? {})
    const warnings: string[] = []
    
    // Placeholder    
    
    return {
      data: updatedData,
      warnings: warnings.length ? warnings : undefined
    }
  }
}
