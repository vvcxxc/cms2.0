import { Base } from '@/libs/Base/Base'
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
 * 获取工位
 * @returns
 */
export const getStationList = () => {
  return request.get(
    `/api/v1/processmanagement/workstation?SkipCount=0&MaxResultCount=999`
  )
}

/**
 * 获取工序
 * @returns
 */
export const getProcessList = () => {
  return request.get(
    `/api/v1/processmanagement/worksection?SkipCount=0&MaxResultCount=999`
  )
}
/**
 * 获取流程模版
 * @param type 类型
 * @returns
 */
export const getFlowInfo = (type: number) => {
  return request.get(`/api/v1/messuite/query/flowdefinition/${type}`)
}

/**
 * 获取产线数据
 * @returns
 */
export const getProductLine = () => {
  return request.get('/api/v1/messuite/query/enumeration/ProductionLineSegment')
}

/**
 * 添加工序
 * @returns
 */
export const addWorkSection = (data: any) => {
  return request.post('/api/v1/processmanagement/worksection', data)
}

/**
 * 获取工序详情
 * @returns
 */
export const getWorkSection = (id: string) => {
  return request.get(
    `/api/v1/processmanagement/worksection/${id}?includeDetails=true`
    // `/api/v1/messuite/query/worksection/${id}?includeDetails=true`
  )
}

/**
 * 更新工序
 * @returns
 */
export const updateWorkSection = (data: any) => {
  return request.put(`/api/v1/processmanagement/worksection/${data.id}`, data)
}

/**
 * 删除工序
 * @returns
 */
export const deleteWorkSection = (id: string) => {
  return request.delete(`/api/v1/processmanagement/worksection/${id}`)
}

/**
 * 批量删除工序
 * @returns
 */
export const deleteWorkSections = (ids: string[]) => {
  return request({
    data: ids,
    url: '/api/v1/processmanagement/worksection',
    method: 'delete',
  })
}

/**
 * 添加工位
 * @returns
 */
export const addWorkStation = (data: any) => {
  return request.post('/api/v1/processmanagement/workstation', data)
}

/**
 * 获取工位详情
 * @returns
 */
export const getWorkStation = (id: string) => {
  return request.get(`/api/v1/processmanagement/workstation/${id}`)
}

/**
 * 更新工位
 * @returns
 */
export const updateWorkStation = (data: any) => {
  return request.put(`/api/v1/processmanagement/workstation/${data.id}`, data)
}

/**
 * 删除工位
 * @returns
 */
export const deleteWorkStation = (id: string) => {
  return request.delete(`/api/v1/processmanagement/workstation/${id}`)
}

/**
 * 批量删除工位
 * @returns
 */

export const deleteWorkStations = (ids: string[]) => {
  return request({
    data: ids,
    url: '/api/v1/processmanagement/workstation',
    method: 'delete',
  })
}
/**
 * 校验工位
 * @param id
 * @param data
 * @returns
 */
export const checkStation = (data: any, id?: string) => {
  const s = id ? `?id=${id}` : '?id=00000000-0000-0000-0000-000000000000'
  return request.put(`/api/v1/processmanagement/workstation/check${s}`, data)
}

/**
 * 克隆工序
 * @param data
 * @returns
 */
export const cloneWorkSection = (data: string[]) => {
  return request.post(`/api/v1/processmanagement/worksection/clone`, data)
}

/**
 * 克隆工位
 * @param data
 * @returns
 */
export const cloneWorkStation = (data: string[]) => {
  return request.post(`/api/v1/processmanagement/workstation/clone`, data)
}

/**
 * 克隆工位
 * @param data
 * @returns
 */
export const getWorkStationList = (filter: any) => {
  const str = new URLSearchParams(
    filter as unknown as URLSearchParams
  ).toString()
  return request.get(`/api/v1/processmanagement/workstation/list?${str}`)
}

/**
 * 获取设置
 * @returns
 */
export const getSettings = () => {
  return request.get(
    `/api/v1/settingmanagement/setting/G?namePrefix=SCMS.AppSettings`
  )
}

/**
 * 更新设置
 * @param data
 * @returns
 */
export const updateSetting = (data: {
  settings: Array<{ name: string | number; value: string }>
}) => {
  return request.post(`/api/v1/settingmanagement/setting/G`, data)
}

/**
 * 获取物料类型
 * @returns
 */
export const getMaterialTypes = async () => {
  return request.get(`/api/v1/messuite/query/enumeration/MaterialType`)
}
