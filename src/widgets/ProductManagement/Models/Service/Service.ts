import { Base } from '@/libs/Base/Base'
import { ProductFilter, ProductFormType } from '../../type/Product'
import { StepMap } from '../../type/SOPConfig'
const request = Base.request
// export class Service extends Base {
//   constructor(){
//     super()
//   }
//   get
// }
export const getList = () => {
  request.get('/api/test')
}

/**
 *
 * @param type 类型
 * @returns
 */
export const getFlowInfo = (type = '10001') => {
  return request.get(`/api/v1/messuite/query/flowdefinition/${type}`)
}

// 添加产品
export const postProduct = (formData: ProductFormType) => {
  return request.post(`/api/v1/productmanagement/product`, formData)
}

// 更新产品
export const putProduct = (id: string, formData: ProductFormType) => {
  return request.put(`/api/v1/productmanagement/product/${id}`, formData)
}

// 删除产品
export const delProduct = (data: string[]) => {
  const url = `/api/v1/productmanagement/product`
  const method = 'DELETE'
  return request({ url, method, data })
}

// 获取产品列表
export const getProductList = (filter: ProductFilter) => {
  const str = new URLSearchParams(
    filter as unknown as URLSearchParams
  ).toString()
  return request.get(`/api/v1/productmanagement/product?` + str)
}

// 获取产品是否在使用中
export const getUseStatus = (id: string) => {
  return request.get(`/api/v1/productmanagement/product/${id}/used`)
}

// 导入
export const importProduct = (data: FormData) => {
  // return request.post(`/api/v1/productmanagement/product/import`, data)

  const url = `/api/v1/productmanagement/product/import`
  const method = 'PUT'
  return request({ url, method, data })
}

// 导出
export const exportProduct = (filter: string) => {
  return request.get(
    `/api/v1/productmanagement/product/export?filter=${filter}`,
    {
      responseType: 'blob',
    }
  )
}

// 保存工步集合
export const saveStep = (id: string, data: FormData) => {
  const url = `/api/v1/productmanagement/product/${id}/step`
  const method = 'PUT'
  return request({ url, method, data, contentType: 'multipart/form-data' })
}

// 获取工步集合
export const getAllStep = (id: string): Promise<StepMap[]> => {
  return request.get(`/api/v1/productmanagement/product/${id}/step`)
}

// 获取工序
export const getWorkSection = (
  filter?: any
): Promise<{ items: any[]; totalCount: number }> => {
  const str = new URLSearchParams(
    filter as unknown as URLSearchParams
  ).toString()
  return request.get(`/api/v1/messuite/query/worksection?` + str)
}

// 下载/获取 pdf
export const getPdf = (
  productId: string,
  processId: string,
  stepId: string
) => {
  const url = `/api/v1/productmanagement/product/${productId}/${processId}/${stepId}/download`
  const method = 'GET'
  return request({
    url,
    method,
    responseType: 'blob',
    contentType: 'application/pdf',
  })
}
export const getProductex = (): Promise<StepMap[]> => {
  return request.get(`/api/v1/jieyunlangfang/productex/list`)
}

export const saveProductex = (data: any): Promise<StepMap[]> => {
  return request.post(`/api/v1/jieyunlangfang/productex/save`, data)
}
