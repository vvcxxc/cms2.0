import { Base } from '@/libs/Base/Base'
const request = Base.request

/**
 * 获取设置
 * @returns
 */
export const getSettings = () => {
  return request.get(
    `/api/v1/settingmanagement/setting/G?namePrefix=SCMS.AppSettings`
  )
}

/**
 * 更新设置
 * @param data
 * @returns
 */
export const updateSetting = (data: {
  settings: Array<{ name: string; value: string }>
}) => {
  return request.post(`/api/v1/settingmanagement/setting/G`, data)
}
