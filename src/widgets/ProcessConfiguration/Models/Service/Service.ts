import { Base } from '@/libs/Base/Base'
const request = Base.request

/**
 *根据产线段查工序
 * @returns
 */
export const queryWorkSectionBySegment = (Segment: string) => {
  return request.get(
    `/api/v1/messuite/query/worksection?SkipCount=${0}&MaxResultCount=${999}&includeDetails=${true}&Segment=${Segment}`
  )
}

export const queryProductionLineStructure = () => {
  return request.get(
    `/api/v1/settingmanagement/setting/G?namePrefix=SCMS.AppSettings.ProductionLineStructure`
  )
}

export const queryWorkSectionDetail = (workSectionId: String) => {
  return request.get(
    `/api/v1/messuite/query/worksection/${workSectionId}?includeDetails=true`
  )
}

export const queryProductionLineSegment = () => {
  return request.get(`/api/v1/messuite/query/enumeration/ProductionLineSegment`)
}

export const queryProcessroutes = (productId: string) => {
  return request.get(
    `/api/v1/messuite/query/processroutes?SkipCount=0&MaxResultCount=999&productId=${productId}&includeDetails=false`
  )
}

export const traceprocesssetting = (data: any) => {
  return request.put(`/api/v1/tracemanagement/traceprocesssetting`, data)
}

export const getProductModelList = async () => {
  const res = await request.get(
    `/api/v1/messuite/query/product?MaxResultCount=999&hasFormula=true&SkipCount=0`
  )
  const data = res.items.map((item: any) => {
    return {
      label: item.model,
      value: item.id,
    }
  })
  return data
}
