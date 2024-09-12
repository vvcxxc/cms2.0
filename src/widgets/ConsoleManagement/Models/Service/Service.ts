import { Base } from '@/libs/Base/Base'
const request = Base.request

/**
 * 获取工序
 * @returns
 */
export const getWorkSection = (filter: any) => {
  const str = new URLSearchParams(
    filter as unknown as URLSearchParams
  ).toString()
  return request.get(`/api/v1/messuite/query/worksection?` + str)
}

export const getWorkStation = (filter: any) => {
  const str = new URLSearchParams(
    filter as unknown as URLSearchParams
  ).toString()
  return request.get(`/api/v1/messuite/query/workstation?` + str)
}
