import { Base } from '@/libs/Base/Base'
const request = Base.request

/**
 * 获取工序列表
 * @returns
 */
export const getWorksectionList = (data: any = {}) => {
  return request({
    url: `/api/v1/messuite/query/worksection?filter=${data.filter}&abilityType=${data.abilityType}&includeDetails=${data.includeDetails}&SkipCount=0&MaxResultCount=999`,
    method: 'get',
  })
}
/**
 * 获取工位列表
 * @returns
 */

export const getWorkstationList = (data: any = {}) => {
  return request({
    url: `/api/v1/messuite/query/workstation?filter=${data.filter}&WorkSection=${data.WorkSection}&SkipCount=0&MaxResultCount=999`,
    method: 'get',
  })
}

export const login = (data: any = {}) => {
  return request({
    url: `/api/v1/dxl/board/main/login`,
    method: 'post',
    data: data,
  })
}

export const getData = (data: any = {}) => {
  return request({
    url: `/api/v1/dxl/board/main/get?stationId=${data.stationId}`,
    method: 'post',
    data: data,
  })
}

export const getWorkstation = (data: any = {}) => {
  return request({
    url: `/api/v1/messuite/query/workstation/${data.workStationId}`,
    method: 'get',
  })
}

export const getSerialnumber = (data: any = {}) => {
  return request({
    url: `/api/v1/dxl/board/main/by/serialnumber?SerialNumber=${data.SerialNumber}&Inbound_EntrySignal=${data.Inbound_EntrySignal}&SerialNumberVariable=${data.SerialNumberVariable}`,
    method: 'get',
  })
}

export const finish = (data: any = {}) => {
  return request({
    url: `/api/v1/dxl/board/finish`,
    method: 'post',
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
