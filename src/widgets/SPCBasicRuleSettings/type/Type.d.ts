export interface DataItemType {
  id?: string
  name?: string
  code?: string
  description?: string
}

export interface WorkSectionBaseType {
  id?: string
  name?: string
  code?: string
  value?: number
  description?: string
  options?: Array<DataItemType>
}

export interface FlowDefinitionType {
  id?: string
  name?: string
  code?: string
  description?: string
}
