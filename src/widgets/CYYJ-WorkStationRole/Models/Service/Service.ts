import { Base } from '@/libs/Base/Base'
const request = Base.request

/**
 * 获取角色工位权限列表
 * @returns
 */
export const WorkStationRole = (data: any = {}) => {
  return request({
    url: `/api/v1/cyyjpack/workstationrole`,
    method: 'get',
    data,
    params: data,
  })
}

/**
 * 保存角色工位权限
 * @returns
 */
export const setWorkStationRole = (roleId: string, data: any = {}) => {
  return request({
    url: `/api/v1/cyyjpack/workstationrole/${roleId}`,
    method: 'put',
    data,
  })
}
