import { deepClone } from '../../../../utils'
import { REGIONS, type Region } from '../../../constants'
import type { QuickUnlockAction } from '../../../types'

const REGION_SLUG_MAP : Record<string, string> = {
  'mountains': 'mtn',
  'grasslands': 'gra',
  'shatteredlands': 'sha',
  'elpis': 'elp',
  'city': 'city',
}

const KIND_MAP : Record<string, string> = {
  'general': 'gen',
  'arjay': 'arj',
  'vaulthunter': 'vh'
}

export const collectEchoLogsAction: QuickUnlockAction = {
  id: 'collect-echo-logs',
  label: 'Collect Echo Logs',
  icon: 'pi pi-send',
  variant: 'secondary',
  run(data: any) {
    const updatedData = deepClone(data ?? {})
    const warnings: string[] = []
    
    // General logs
      for (const region of REGIONS) {
        for (let i = 0; i < region.echologs_general_gen; i++) {
          updatedData.stats.openworld.collectibles.echologs_general = updatedData.stats.openworld.collectibles.echologs_general || {}
          updatedData.stats.openworld.collectibles.echologs_general[`el_g_${region.name}`] = updatedData.stats.openworld.collectibles.echologs_general[`el_g_${region.name}`] || {}
          updatedData.stats.openworld.collectibles.echologs_general[`el_g_${region.name}`][`${REGION_SLUG_MAP[region.name]}_gen_${i + 1}`] = 1
        }
        for (let i = 0; i < region.echologs_general_mis; i++) {
          updatedData.stats.openworld.collectibles.echologs_general = updatedData.stats.openworld.collectibles.echologs_general || {}
          updatedData.stats.openworld.collectibles.echologs_general[`el_g_${region.name}`] = updatedData.stats.openworld.collectibles.echologs_general[`el_g_${region.name}`] || {}
          updatedData.stats.openworld.collectibles.echologs_general[`el_g_${region.name}`][`${REGION_SLUG_MAP[region.name]}_mis_${i + 1}`] = 1
        }
        
        for (let i = 0; i < region.echologs_arjay; i++) {
          updatedData.stats.openworld.collectibles.echologs_arjay = updatedData.stats.openworld.collectibles.echologs_arjay || {}
          updatedData.stats.openworld.collectibles.echologs_arjay[`el_a_${region.name}`] = updatedData.stats.openworld.collectibles.echologs_arjay[`el_a_${region.name}`] || {}
          updatedData.stats.openworld.collectibles.echologs_arjay[`el_a_${region.name}`][`${REGION_SLUG_MAP[region.name]}_arj_${i + 1}`] = 1
        }

        for (let i = 0; i < region.echologs_vaulthunter; i++) {
          updatedData.stats.openworld.collectibles.echologs_vaulthunter = updatedData.stats.openworld.collectibles.echologs_vaulthunter || {}
          updatedData.stats.openworld.collectibles.echologs_vaulthunter[`el_v_${region.name}`] = updatedData.stats.openworld.collectibles.echologs_vaulthunter[`el_v_${region.name}`] || {}
          updatedData.stats.openworld.collectibles.echologs_vaulthunter[`el_v_${region.name}`][`${REGION_SLUG_MAP[region.name]}_vh_${i + 1}`] = 1
        }
      }
    
    return {
      data: updatedData,
      warnings: warnings.length ? warnings : undefined
    }
  }
}
