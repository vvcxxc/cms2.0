import { Base } from '@/libs/Base/Base'
import { UUID } from 'crypto'
const request = Base.request

export const getCheckitemconfigAll = (data: any) => {
  return request.get(`/api/v1/checkitemconfig/all?filter=${data.filter}`)
}

export const setCheckitemconfig = (data: any) => {
  return request.post(`/api/v1/checkitemconfig/set`, data)
}

export const getDataconfigTree = () => {
  return request.get(`/api/v1/dataconfig/tree`)
}

/**nodeType为2时获取字段 */
export const getFilingtable = (id: UUID) => {
  return request.get(`/api/v1/dataconfig/filingtable/${id}/fields`)
}
/**nodeType为3时获取字段 */
export const getAggregatetable = (id: UUID) => {
  return request.get(`/api/v1/dataconfig/aggregatetable/${id}/fields`)
}
export const getOriginal = (data: any) => {
  return request.post(`/api/v1/data/original`, data)
}
