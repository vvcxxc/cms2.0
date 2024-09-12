import sdk from 'sdk'
const { utils } = sdk
const { request } = utils
const isDev = process.env.NODE_ENV === 'development'
/**
 * 获取流程图xml
 * @returns
 */
export const getFlowXml = async (flowType: string | number) => {
  const res = await request.get(
    `/api/v1/flowmanagement/flowdesign/define?flowType=${flowType}`
  )
  return res
}

export const getFlowData = (category: string) => {
  return request.get(
    `/api/v1/flowmanagement/flowdesign/type?category=${category}`
  )
}

export const getFlowDetail = (type: string) => {
  return request.get(`/api/v1/flowmanagement/flowdesign/attribute?type=${type}`)
}

export const saveFlowData = (data: any) => {
  return request.post(`/api/v1/flowmanagement/flowdesign/define`, data)
}
