import { Base } from '@/libs/Base/Base'
const request = Base.request

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
  return request.get(`/api/v1/processmanagement/worksection/${id}`)
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

export const getFlowTypes = async () => {
  const data = await request.get(
    '/api/v1/messuite/query/enumeration/FlowBusinessType?prependAll=true'
  )

  return data
    .map((item: { description: string; value: number; name: string }) => {
      return {
        label: item.description,
        value: item.value,
      }
    })
    .filter((v: { value: number }) => v.value)
}
