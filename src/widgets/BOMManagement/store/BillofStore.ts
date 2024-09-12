import { provide, inject, ref, computed, watchEffect, watch } from 'vue'
const KEY = 'BillofStore'

const useStore = (props: any, ctx: any) => {
  const curRowData = ref<any>(null)

  return {
    curRowData
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
