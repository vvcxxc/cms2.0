export interface EnumListItemType {
  name?: string
  value?: string | number
  description?: string
  id?: string
}

export interface CommonEnumListInfoType {
  list?: EnumListItemType[]
  desc?: string
}
export interface FeatureType {
  depth: number
  description: string
  dispalyName: string
  name: string
  parentName: string
  provider: {
    name: string
    key: string
  }
  value: string | number | boolean
  valueType: {
    name: string
    properties: Record<string, any>
    validator: {
      name: string
      properties: Record<string, any>
    }
  }
}
export interface FeatureItemType {
  dispalyName?: string
  features: FeatureType[]
  name: string
}
