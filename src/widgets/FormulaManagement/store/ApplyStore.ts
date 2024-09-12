import { provide, inject, ref, computed, watchEffect, watch } from 'vue'
const KEY = 'SOP_CONFIG'

const useStore = (props: any, ctx: any) => {
  const curFormula = ref<any>()
  const checkedList = ref<any[]>([])
  return {
    curFormula,
    checkedList
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
