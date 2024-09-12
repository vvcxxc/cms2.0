export interface ProductFormType {
  name: string
  model: string
  shortNumber?: string
  remark?: string
  identificationCode?: string
}
export interface ProductFilter {
  PageIndex: number
  PageSize: number
  Filter?: string
}

export interface ProductType {
  extraProperties: Record<string, string>
  id: string
  sort: number
  name: string
  model: string
  shortNumber: string
  formulaName: string
  pocessRoutes: string[] | null
  remark: string
  concurrencyStamp: string
}
