// @ts-ignore
import sdk from 'sdk'
const { utils } = sdk
const { request } = utils
import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'

// 获取工艺路线
export const getProcessList = (params: any) => {
  const data = omitBy(params, isUndefined)
  const query = new URLSearchParams(data).toString()
  const str = query ? `?${query}` : ''
  return request.get(`/api/v1/zc/processroute/page/route` + str)
}

export const getSegments = (id: string) => {
  return request.get(`/api/v1/ordermanagement/order/${id}/segments`)
}

/**
 * 获取bom
 * @param params
 * @returns
 */
export const getBomList = (params: any) => {
  const data = omitBy(params, isUndefined)
  const query = new URLSearchParams(data).toString()
  const str = query ? `?${query}` : ''
  return request.get(`/api/v1/zc/bom/page` + str)
}

/**
 * 获取lot
 * @param params
 * @returns
 */
export const getLotList = (params: any) => {
  const data = omitBy(params, isUndefined)
  const query = new URLSearchParams(data).toString()
  const str = query ? `?${query}` : ''
  return request.get(`/api/v1/zc/order/lot/page` + str)
}

/**
 * 更新
 * @returns
 */
export const update = () => {
  return request.get(`/api/v1/zc/order/update`)
}

/**
 * 更新工艺路线
 * @returns
 */
export const updateProcess = (OrderNumber: string) => {
  return request.get(`/api/v1/zc/processroute/renew?OrderNumber=${OrderNumber}`)
}

/**
 * 更新BOM
 * @returns
 */
export const updateBom = (OrderNumber: string) => {
  return request.get(`/api/v1/zc/bom/renew?OrderNumber=${OrderNumber}`)
}

/**
 * 更新LOT
 * @returns
 */
export const updateLot = (ordeR_ID: string) => {
  return request.post(`/api/v1/zc/order/update/lot`, {
    ordeR_ID,
  })
}
