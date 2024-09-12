import sdk from 'sdk'
import type {
  ConfigureCodeType,
  SettingType,
} from '@/widgets/SystemManagement/type/Configure.d'
import {
  ConfigureCodeMap,
  SwappedConfigureCodeMap,
} from '@/widgets/SystemManagement/enum'
// import { getSettings } from '@/widgets/SystemManagement/Models/Service/Service'
const { utils } = sdk
const { request } = utils
/**
 * 判断是否为对象
 * @param str
 * @returns
 */
const isStringAnObject = (str: string) => {
  try {
    const obj = JSON.parse(str)
    return typeof obj === 'object' && obj !== null
  } catch (e) {
    return false
  }
}

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
 * 枚举获取接口
 * @param type 枚举值
 * @returns
 */
export const getEnumList = (type: string): Promise<any> => {
  return request({
    url: `/api/v1/messuite/query/enumeration/${type}`,
    method: 'get',
  })
}

/**
 * 获取工序接口
 * @param filter 筛选
 * @returns
 */
export const getWorkSectionApi = (
  filter?: any
): Promise<{ items: any[]; totalCount: number }> => {
  const str = new URLSearchParams(
    filter as unknown as URLSearchParams
  ).toString()
  return request.get(`/api/v1/messuite/query/worksection?` + str)
}

/**
 * 获取工位
 * @param filter 筛选
 * @returns
 */
export const getWorkStationApi = (
  filter?: any
): Promise<{ items: any[]; totalCount: number }> => {
  const str = new URLSearchParams(
    filter as unknown as URLSearchParams
  ).toString()
  return request.get(`/api/v1/processmanagement/workstation?` + str)
}

export const getFormDataBySettings = async () => {
  const { settings }: SettingType = (await getSettings()) || {
    settings: [],
  }
  const formData: ConfigureCodeType = {}

  settings.forEach((item: any) => {
    const key = SwappedConfigureCodeMap[item.name]
    if (key) {
      if (typeof item.name === ConfigureCodeMap.ProductionLineSegment) {
        try {
          item.value = JSON.parse(item.value)
          formData[key] = item.value
        } catch (error) {
          item.value = []
        }
      } else {
        try {
          if (isStringAnObject(item.value)) {
            formData[key] = JSON.parse(item.value)
          } else {
            formData[key] = item.value
          }
        } catch (error) {
          formData[key] = []
          console.error(error)
        }
      }
    }
  })

  return formData
}

/**
 * 获取流程列表
 * @returns
 */
export const getFlowData = () => {
  return request.get(
    `/api/v1/messuite/query/flowdefinition?MaxResultCount=9999&SkipCount=0`
  )
}
// 获取物料类型
export const getMaterialTypes = () => {
  return request.get(`/api/v1/materialmanagement/material/types`)
}

/**
 * 获取物料类型
 * @returns
 */
export const getMaterialTypesEnum = async () => {
  return request.get(`/api/v1/messuite/query/enumeration/MaterialType`)
}

// 版本功能列表
export const getFeatureListData = (providerKey: string = 'Basic') => {
  if (providerKey) {
    return request.get(
      `/api/v1/featuremanagement/feature/E?providerKey=${providerKey}`
    )
  }
  return Promise.resolve({
    group: [],
  })
}
