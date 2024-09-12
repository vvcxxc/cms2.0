export interface Rect {
  length: number
  progress: number
  serialNumber: string
  speed: number
  x?: number
  unit: number
  endpoint: number
  index: number
  status: 0 | 1 // 0,不渲染，1渲染,
  originEndpoint: number
  destroy?: boolean
  isQualified?: boolean
  beforeDestroy?: boolean
}

export type Timer = {
  start: () => void
  clear: () => void
}

export enum TipTypeEnum {
  tip = 'tip',
  table = 'table',
}
