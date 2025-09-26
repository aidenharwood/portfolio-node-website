import type { QuickUnlockAction, QuickUnlockMetadata, QuickUnlockResult } from './types'
import { unlockAllSdusAction } from './actions/sdus'
import { unlockAllHoverdrivesAction } from './actions/hoverdrives'

const QUICK_UNLOCK_ACTIONS: ReadonlyArray<QuickUnlockAction> = Object.freeze([
  unlockAllSdusAction,
  unlockAllHoverdrivesAction
])

const QUICK_UNLOCK_ACTION_MAP = new Map<string, QuickUnlockAction>(
  QUICK_UNLOCK_ACTIONS.map((action) => [action.id, action])
)

export function getQuickUnlockActions(): QuickUnlockMetadata[] {
  return QUICK_UNLOCK_ACTIONS.map(({ id, label, icon, variant }) => ({
    id,
    label,
    icon,
    variant
  }))
}

export function runQuickUnlock(actionId: string, data: any): QuickUnlockResult | null {
  const action = QUICK_UNLOCK_ACTION_MAP.get(actionId)
  if (!action) {
    return null
  }

  return action.run(data)
}

export type { QuickUnlockMetadata, QuickUnlockResult, QuickUnlockAction }
