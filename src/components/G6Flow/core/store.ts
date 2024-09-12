import { provide, inject, ref, isRef, Ref, reactive, toRaw } from 'vue'
import mitt from 'mitt'
import type { Store, StoreKey } from '../type/index'
import GraphEvent from './GraphEvent'

const selected = ref(null)
const lf = ref()
const theme = ref({})
const lastLines = ref<any[]>([])
const flowMap = new Map()
const flowNodeMap = new Map()
const xmlData = ref(null)

const store = {
  lf,
  theme,
  xmlData,
  flowNodeMap,
  flowMap,
  selected,
  lastLines,
  graphEvent: new GraphEvent(),
} as Store

export const createStore = () => {
  return store
}

export const injectStore = (key?: StoreKey) => {
  if (key) {
    return store[key]
  }
  return store
}

export const emitter = mitt()
