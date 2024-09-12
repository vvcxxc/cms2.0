import { ref, provide, inject } from 'vue'
import api from '@/api/period-setting'
import { generateUniqueId } from '@/utils/index'
import type { IPeriod } from '@/api/period-setting.type'

const KEY = 'Variable'

export function useStore() {
  const parentData = ref({})
  const variableList = ref([])
  const Trace = ref<IPeriod[]>([])

  async function initPeriodConfig() {
    const result = await api.getPeriodConfigs()
    // @ts-ignore
    variableList.value = result.variables?.map((item) => ({
      UUID: generateUniqueId(),
      ...item,
    }))
    // @ts-ignore
    Trace.value = result.Trace
  }

  return { parentData, initPeriodConfig, variableList, Trace }
}

export function createProvider(): ReturnType<typeof useStore> {
  let value = useStore()
  provide(KEY, value)
  return value
}

export function createInjector(): ReturnType<typeof useStore> {
  return inject(KEY) as ReturnType<typeof useStore>
}
