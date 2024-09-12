import { provide, inject, ref, computed, watchEffect, watch } from 'vue'

const KEY = 'Formula'

const useStore = (props: any, ctx: any) => {
  const currentFormula = ref<any>()
  const currentWorkSection = ref<any>()
  const processParameterChecked = ref<any[]>([])
  const formulaParameterChecked = ref<any[]>([])
  return {
    currentFormula,
    currentWorkSection,
    processParameterChecked,
    formulaParameterChecked
  }
}

export type StoreType = ReturnType<typeof useStore>

export const createProvider = (props: any, ctx: any) => {
  const store = useStore(props, ctx)
  provide(KEY, store)
  return store
}

export const createInjector = () => {
  return inject(KEY) as StoreType
}
