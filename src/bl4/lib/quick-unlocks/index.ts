
import type { QuickUnlockAction, QuickUnlockMetadata, QuickUnlockResult } from './types'



import { unlockAllSdusAction } from './actions/character/progression/sdus'
import { unlockAllHoverdrivesAction } from './actions/character/progression/hoverdrives'

import { unlockAllSafehousesAction } from './actions/character/exploration/safehouses'
import { revealMapAction } from './actions/character/exploration/reveal-map'
import { unlockMapLocationsAction } from './actions/character/exploration/map-locations'
import { unlockAllCosmeticsAction } from './actions/character/progression/cosmetics'
import { completeAllMissionsAction } from './actions/character/progression/missions'
import { completeAncientCrawlersAction } from './actions/character/activities/ancient-crawlers'
import { completeAugerMinesAction } from './actions/character/activities/auger-mines'
import { completeOrderBunkersAction } from './actions/character/activities/order-bunkers'
import { completeRipperDrillSitesAction } from './actions/character/activities/ripper-drill-sites'
import { completeAllVaultsAction } from './actions/character/activities/vaults'

import { CHARACTER_QUICK_UNLOCK_GROUPS, PROFILE_QUICK_UNLOCK_GROUPS, type QuickUnlockGroup } from './groups'
import { collectAugerShrinesAction } from './actions/character/collectibles/auger-shrines'
import { collectDeadboltsAction } from './actions/character/collectibles/deadbolts'
import { collectEchoLogsAction } from './actions/character/collectibles/echo-logs'
import { collectElectiSafesAction } from './actions/character/collectibles/electi-safe'
import { collectEvocariumsAction } from './actions/character/collectibles/evocarium'
import { collectLostCapsulesAction } from './actions/character/collectibles/lost-capsules'
import { collectPropagandaSpeakersAction } from './actions/character/collectibles/propaganda-speakers'
import { collectSurvivalistCachesAction } from './actions/character/collectibles/survivalist-cache'
import { collectVaultSymbolsAction } from './actions/character/collectibles/vault-symbols'
import { completeOrderSilosAction } from './actions/character/activities/order-silos'

const QUICK_UNLOCK_ACTIONS: ReadonlyArray<QuickUnlockAction> = Object.freeze([
  unlockAllSdusAction,
  unlockAllHoverdrivesAction,
  revealMapAction,
  unlockAllSafehousesAction,
  unlockMapLocationsAction,
  unlockAllCosmeticsAction,
  completeAllMissionsAction,
  completeAncientCrawlersAction,
  completeAugerMinesAction,
  completeOrderBunkersAction,
  completeRipperDrillSitesAction,
  completeAllVaultsAction,
  completeOrderSilosAction,
  collectAugerShrinesAction,
  collectDeadboltsAction,
  collectEchoLogsAction,
  collectElectiSafesAction,
  collectEvocariumsAction,
  collectLostCapsulesAction,
  collectPropagandaSpeakersAction,
  collectSurvivalistCachesAction,
  collectVaultSymbolsAction
])

// Map of id -> action
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


// Returns quick unlock groups with their action metadata
export function getQuickUnlockGroups(saveType: string): Array<QuickUnlockGroup & { actions: QuickUnlockMetadata[] }> {
  let groups: QuickUnlockGroup[];
  switch (saveType) {
    case 'character':
      groups = CHARACTER_QUICK_UNLOCK_GROUPS
      break;
    case 'profile':
      groups = PROFILE_QUICK_UNLOCK_GROUPS
      break;
    default:
      return [];
  }

  return groups.map(group => {
    const actions = group.actionIds
      .map(id => QUICK_UNLOCK_ACTION_MAP.get(id))
      .filter((action): action is QuickUnlockAction => !!action)
      .map(({ id, label, icon, variant }) => ({ id, label, icon, variant }))
    return {
      ...group,
      actions
    }
  })
}

export function runQuickUnlock(actionId: string, data: any): QuickUnlockResult | null {
  const action = QUICK_UNLOCK_ACTION_MAP.get(actionId)
  if (!action) {
    return null
  }

  return action.run(data)
}

export type { QuickUnlockMetadata, QuickUnlockResult, QuickUnlockAction, QuickUnlockGroup }
