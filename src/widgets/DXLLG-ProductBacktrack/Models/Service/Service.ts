import { Base } from '@/libs/Base/Base'
const request = Base.request

export const getProductTrace = (data: any) => {
  const str = new URLSearchParams(data).toString()
  return request.get(`/api/v1/dxl/producttrace?${str}`, {})
}

export const exportProductTrace = (data: any) => {
  return request.post(`/api/v1/dxl/producttrace/export`, data, {
    responseType: 'blob',
  })
}
// 导出辅助线
export const exportbarcode = (data: any) => {
  return request.post(`/api/v1/dxl/producttrace/exportbarcode`, data, {
    responseType: 'blob',
  })
}

// 导入辅助线
export const importbarcode = (data: FormData) => {
  return request.post(`/api/v1/dxl/producttrace/importbarcode`, data)
}

export const exportinspectionreport = (data: any) => {
  return request.post(`/api/v1/dxl/producttrace/exportinspectionreport`, data, {
    responseType: 'blob',
  })
}
// 获取业务配置
export const getField = (namePrefix: string) => {
  return request.get(
    `/api/v1/settingmanagement/setting/G?namePrefix=${namePrefix}`
  )
}
