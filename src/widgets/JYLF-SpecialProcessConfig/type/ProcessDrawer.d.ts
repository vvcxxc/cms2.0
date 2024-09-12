export interface Data {
  name: string
  description: string
  id: string | number
}

export interface AddDataType {
  processParameters: Data[]
  formulaParameters: Data[]
  materielParameters: any[]
  formData: Record<string, any>
  sort: number
}
