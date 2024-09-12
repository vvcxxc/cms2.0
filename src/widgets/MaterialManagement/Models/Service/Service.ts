import { Base } from '@/libs/Base/Base'
const request = Base.request

// 添加
export const createMaterial = (formData: any) => {
  return request.post(`/api/v1/materialmanagement/material`, formData)
}

// 更新
export const updateMaterial = (id: string, formData: any) => {
  return request.put(`/api/v1/materialmanagement/material/${id}`, formData)
}

// 删除
export const deleteMaterial = (data: string[]) => {
  console.log(data)
  const url = `/api/v1/materialmanagement/material`
  const method = 'DELETE'
  return request({ url, method, data })
}
// 获取物料类型
export const getMaterialTypes = () => {
  return request.get(`/api/v1/materialmanagement/material/types`)
}

// 获取物料详情
export const getMaterialById = (id: string) => {
  return request.get(`/api/v1/materialmanagement/material/${id}/info`)
}

// 获取物料明细列表
export const getMaterialDetail = (materialId: string, params: any) => {
  const str = new URLSearchParams(params as URLSearchParams).toString()
  return request.get(`/api/v1/materialmanagement/material/${materialId}?${str}`)
}

// 创建物料明细
export const createMaterialDetail = (materialId: string, formData: any) => {
  return request.post(
    `/api/v1/materialmanagement/material/${materialId}`,
    formData
  )
}

// 更新物料明细
export const updateMaterialDetail = (
  materialId: string,
  materialDetailId: string,
  formData: any
) => {
  return request.put(
    `/api/v1/materialmanagement/material/${materialId}/${materialDetailId}`,
    formData
  )
}

// 删除物料明细
export const deleteMaterialDetail = (materialId: string, data: string[]) => {
  const url = `/api/v1/materialmanagement/material/${materialId}`
  const method = 'DELETE'
  return request({ url, method, data })
}

// 导入
export const importMaterial = (data: FormData) => {
  const url = `/api/v1/materialmanagement/material/import`
  const method = 'PUT'
  return request({ url, method, data })
}

// 导出
export const exportMaterial = () => {
  return request.get(`/api/v1/materialmanagement/material/export`, {
    responseType: 'blob',
  })
}

export const getFeeding = () => {
  return request.get(`/api/v1/jieyunlangfang/material/feeding`)
}

export const putFeeding = (data: any = {}) => {
  return request({
    url: `/api/v1/jieyunlangfang/material/feeding`,
    method: 'put',
    data,
  })
}

export const setvalues = (data: any = {}) => {
  return request({
    url: `/api/v1/variable/setvalues`,
    method: 'post',
    data,
  })
}
