import { ref, watch } from 'vue'
import { loadAdvanced, saveAdvanced } from '../utils/persistence'

// One app-wide switch: someone who wants advanced options wants them everywhere.
const advanced = ref(loadAdvanced())
watch(advanced, value => saveAdvanced(value))

/**
 * Whether advanced options are shown. A hidden option still appears when it
 * matters: callers also show it when it differs from its default, or when a
 * warning or adjustment points at it.
 */
export function useAdvanced() {
  return advanced
}
