import { Base } from '@/libs/Base/Base'
const request = Base.request

// 获取产品列表
export const getProductList = (filter: any) => {
  const str = new URLSearchParams(
    filter as unknown as URLSearchParams
  ).toString()
  return request.get(`/api/v1/productmanagement/product?` + str)
}

/**
 * 保存角色工位权限
 * @returns
 */
export const addSpotcheck = (data: any = {}) => {
  return request({
    url: `/api/v1/jieyunlangfang/spotcheck`,
    method: 'post',
    data,
  })
}

export const editSpotcheck = (data: any = {}) => {
  return request({
    url: `/api/v1/jieyunlangfang/spotcheck/${data.id}`,
    method: 'put',
    data,
  })
}

export const deleteSpotcheck = (data: any = {}) => {
  return request({
    url: `/api/v1/jieyunlangfang/spotcheck`,
    method: 'delete',
    data,
  })
}

export const sortSpotcheck = (data: any = {}) => {
  return request({
    url: `/api/v1/jieyunlangfang/spotcheck/${data.id}/adjustsort/${data.sort}`,
    method: 'put',
  })
}
export const startSpotcheck = (data: any = {}) => {
  return request({
    url: `/api/v1/jieyunlangfang/spotcheck/${data.id}/${data.operatorname}/start`,
    method: 'get',
  })
}

export const getSpotcheckDetail = (data: any = {}) => {
  return request({
    url: `/api/v1/jieyunlangfang/spotcheck/${data.id}/detail`,
    method: 'get',
  })
}

export const getVariableconfig = () => {
  return request({
    url: `/api/v1/jieyunlangfang/spotcheck/variableconfig`,
    method: 'get',
  })
}

export const putVariableconfig = (data: any = {}) => {
  return request({
    url: `/api/v1/jieyunlangfang/spotcheck/variableconfig`,
    method: 'put',
    data,
  })
}
export const setValue = (data: any = {}) => {
  return request({
    url: `/api/v1/variable/setvalues`,
    method: 'post',
    data: data,
  })
}
