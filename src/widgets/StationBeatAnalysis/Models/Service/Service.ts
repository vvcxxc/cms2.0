import { Base } from '@/libs/Base/Base'
const request = Base.request
/**
 * 产线整体情况
 */
export const getProductlineDetail = (data: any) => {
  return request.get(
    `/api/v1/beatanalysis/productline/${
      data.segmentId || '00000000-0000-0000-0000-000000000000'
    }/${data.dateTime}`
  )
}

/**这里的工位概念实际上是工序 */
export const getWorkStationDetail = (data: any) => {
  return request.get(
    `/api/v1/beatanalysis/productline/worksection/${data.dateTime}/${
      data.workSectionId || '00000000-0000-0000-0000-000000000000'
    }/${data.productModel}`
  )
}

/**
 * 获取产线设置
 */
export const getProductlinesetting = (data: any) => {
  return request.get(
    `/api/v1/beatanalysis/productline/productlinesetting/${data.date}/${
      data.segmentId || '00000000-0000-0000-0000-000000000000'
    }`
  )
}

/**
 * 保存目标变量
 */
export const putTargetproduction = (data: any) => {
  return request.put(
    `/api/v1/beatanalysis/productline/productlinesetting/targetproduction`,
    data
  )
}

/**
 * 保存理论加工周期
 */
export const putProcessingcycle = (data: any) => {
  return request.put(
    `/api/v1/beatanalysis/productline/productlinesetting/processingcycle`,
    data
  )
}

/**
 * 获取系统设置
 * @returns
 */
export const getSettings = (namePrefix: string) => {
  return request.get(
    `/api/v1/settingmanagement/setting/G?namePrefix=${namePrefix}`
  )
}

export const getProduct = () => {
  return request.get(`/api/v1/messuite/query/product?filter=&hasFormula=false`)
}
export const getWorksectionBySegment = (Segment: string) => {
  return request.get(
    `/api/v1/messuite/query/worksection?SkipCount=0&MaxResultCount=999&Segment=${Segment}`
  )
}
