export interface IProductParams {
  Filter?: string
  StartTime?: string
  FinishTime?: string
  Status?: string
  Sorting?: string
  SkipCount?: string
  MaxResultCount?: string
}

export interface IProductTableList {
  items: IProductTableItem[]
  totalCount: number
}

export interface IProductTableItem {
  id: string
  code: string
  productModel: string
  planQty: string
  qualifiedQty: string
  shift: string
  planStartTime: string
  planFinishTime: string
  status: number
  segments: any[]
}

export interface IProductParamsRequest {
  model: string
  name: string
  code: string
  supplier: string
  remark: string
}

export interface IAbilityTypeResponse {
  text: string
  value: string
}

export interface IProductOptionsResponse {
  id: string
  model: string
  name: string
  remark: string
  supplier: string
}
