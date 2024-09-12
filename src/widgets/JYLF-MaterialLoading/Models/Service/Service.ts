import { Base } from '@/libs/Base/Base'
const request = Base.request

export const getMaterial = () => {
  return request.get(`/api/v1/jieyunlangfang/material`)
}

export const setvalues = (data: any = {}) => {
  return request({
    url: `/api/v1/variable/setvalues`,
    method: 'post',
    data,
  })
}
