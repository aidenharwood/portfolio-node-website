import { deepClone, setValueByPath } from '../../utils'
import { ALL_HOVERDRIVE_PATHS } from '../constants'
import type { QuickUnlockAction } from '../types'

export const unlockAllHoverdrivesAction: QuickUnlockAction = {
  id: 'unlock-all-hoverdrives',
  label: 'Unlock All Hoverdrives',
  icon: 'pi pi-send',
  variant: 'secondary',
  run(data: any) {
    const updatedData = deepClone(data ?? {})
    const warnings: string[] = []

    ALL_HOVERDRIVE_PATHS.forEach((path) => {
      const success = setValueByPath(updatedData, path, true)
      if (!success) {
        warnings.push(path)
      }
    })

    return {
      data: updatedData,
      warnings: warnings.length ? warnings : undefined
    }
  }
}
