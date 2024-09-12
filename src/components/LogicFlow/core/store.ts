import { provide, inject, ref, isRef, Ref, reactive, toRaw } from 'vue'
import { BaseEdgeModel } from '@logicflow/core'
import mitt from 'mitt'
import type { Store, StoreKey } from '../type/index'

const selected = ref(null)
const lf = ref()
const theme = ref({})
const lastLines = ref<BaseEdgeModel[]>([])
const flowMap = new Map()
const xmlData = ref(null)

/**
 * 选择节点
 * @param node
 */
const onSelectNode = (node: any, event: Event) => {
  store.selected.value = node.id
}

const onCancelSelect = (event: Event) => {
  // @ts-ignore
  if (event.target?.nodeName === 'svg') {
    store.selected.value = null
    cancelEdgeAnimation()
  }
}
const cancelEdgeAnimation = () => {
  const lfRef = toRaw(lf?.value)
  lastLines.value.forEach((line) => {
    lfRef?.closeEdgeAnimation(line.id)
  })
  lastLines.value = []
}
/**
 * 边动画
 * @param data
 */
const showEdgeAnimation = (data: Record<string, any>) => {
  if (lastLines.value.length) {
    cancelEdgeAnimation()
  }
  const lines = lf.value.getEdgeModels({
    sourceNodeId: data.id,
  })
  lastLines.value = lines
  lines.forEach((line: BaseEdgeModel) => {
    lf.value.openEdgeAnimation(line.id)
  })
}

const store = {
  lf,
  theme,
  xmlData,
  flowMap,
  selected,
  lastLines,
  onSelectNode,
  onCancelSelect,
  showEdgeAnimation,
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
