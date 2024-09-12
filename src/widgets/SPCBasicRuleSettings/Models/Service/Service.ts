import { Base } from '@/libs/Base/Base'
const request = Base.request

export const getRuleList = () => {
  return request.get(`/api/v1/basicruleconfig/anomaly-rule-config/all`)
}

export const getRange = () => {
  return request.get(`/api/v1/basicruleconfig/monitoring-time-range/get`)
}

export const saveRuleList = (data: any) => {
  return request.post(`/api/v1/basicruleconfig/anomaly-rule-config/save`, data)
}
export const saveRange = (data: any) => {
  return request.post(
    `/api/v1/basicruleconfig/monitoring-time-range/save?timeRange=${data.timeRange}`,
    data
  )
}

export const recover = () => {
  return request.post(`/api/v1/basicruleconfig/default/recover`)
}
