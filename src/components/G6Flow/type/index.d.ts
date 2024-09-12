// export interface
import GraphEvent from '../core/GraphEvent'

export interface Store {
  lf: any
  xmlData: Ref<any>
  theme: Ref<any>
  flowMap: Map<string, any>
  selected: Ref<any>
  lastLines: Ref<any[]>
  graphEvent: GraphEvent
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

interface Condition {
  '@_xsi:type': string
  _xsiType: string // 对应 "_xsi:type"
  Expression: string
  Label: string
  Not: boolean
  Operator: string
  Property: string
  root: boolean
  Value: {
    _xsiType: string // 对应 "@_xsi:type"
    Text: string | number // 对应 "#text"
  }
  nodeId: string
  children: Condition[]
}
