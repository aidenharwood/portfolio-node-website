import { deepClone } from '../../../../utils'

import type { QuickUnlockAction } from '../../../types'

export const completeAllVaultsAction: QuickUnlockAction = {
  id: 'complete-vaults',
  label: 'Complete Vaults',
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
