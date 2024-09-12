import { Base } from '@/libs/Base/Base'
const request = Base.request

/**
 * 获取业务流程字段
 * @returns
 */
export const getField = () => {
  return request.get(
    `/api/v1/settingmanagement/setting/G?namePrefix=SCMS.AppSettings.BusinessFiled`
  )
}

/**
 * 更新字段
 * @param data
 * @returns
 */
export const updateField = (data: {
  settings: Array<{ name: string; value: string }>
}) => {
  return request.post(
    `/api/v1/settingmanagement/setting/G?namePrefix=SCMS.AppSettings.BusinessFiled`,
    data
  )
}
