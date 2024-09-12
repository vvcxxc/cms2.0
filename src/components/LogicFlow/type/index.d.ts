import { BaseEdgeModel, BaseNodeModel } from '@logicflow/core'

// export interface
export interface Store {
  lf: any
  xmlData: Ref<any>
  theme: Ref<any>
  flowMap: Map<string, any>
  selected: Ref<any>
  lastLines: Ref<BaseEdgeModel[]>
  onSelectNode: (node: any, event: Event) => void
  onCancelSelect: (event: Event) => void
  showEdgeAnimation: (data: Record<string, any>) => void
}

export enum StoreKey {
  LF = 'lf',
  THEME = 'theme',
  FLOW_MAP = 'flowMap',
  SELECTED = 'selected',
  LAST_LINES = 'lastLines',
  XML_DATA = 'xmlData',
}

export interface FlowType {
  edges: any[]
  nodes: any[]
}
