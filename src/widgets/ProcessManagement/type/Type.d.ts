export interface DataItemType {
  id?: string
  name?: string
  code?: string
  description?: string
  label?: string
  value?: string | number
}

export interface WorkSectionBaseType {
  id?: string
  name?: string
  code?: string
  value?: number
  description?: string
  options?: Array<DataItemType>
  abilityValue?: number | string
  data?: DataItemType
  defaultValue?: string | number
  flow: string
}

export interface FlowDefinitionType {
  id?: string
  name?: string
  code?: string
  description?: string
}
