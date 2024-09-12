import { Base } from '@/libs/Base/Base'
const request = Base.request

export const getProductTrace = (data: any) => {
  const str = new URLSearchParams(data).toString()
  return request.get(`/api/v1/tracemanagement/producttrace?${str}`, {})
}
export const reupLoadMes = (data: any) => {
  const url = `/api/v1/huidingtuopushuibeng/mes/reupload/produceddata`
  const method = 'post'
  return request({ url, method, data })
}
export const exportProductTrace = (data: any) => {
  return request.post(`/api/v1/tracemanagement/producttrace/export`, data, {
    responseType: 'blob',
  })
}
// 导出辅助线
export const exportbarcode = (data: any) => {
  return request.post(
    `/api/v1/huidingtuopushuibeng/producttrace/exportbarcode`,
    data,
    {
      responseType: 'blob',
    }
  )
}

// 导入辅助线
export const importbarcode = (data: FormData) => {
  return request.post(
    `/api/v1/huidingtuopushuibeng/producttrace/importbarcode`,
    data
  )
}
