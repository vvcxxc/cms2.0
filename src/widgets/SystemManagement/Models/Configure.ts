import { Base } from '@/libs/Base/Base'
import { updateSetting, getSettings } from './Service/Service'
import type { ConfigureCodeType } from '../type/Configure.d'
import { ConfigureCodeMap, SwappedConfigureCodeMap } from '../enum'

interface SettingType {
  settings: {
    name: string
    value: string
  }[]
}
export class Configure extends Base<{ [key: string]: any }> {
  constructor() {
    super({
      data: [],
      formData: {},
    })
  }
  /**
   * 判断是否为对象
   * @param str
   * @returns
   */
  isStringAnObject(str: string) {
    try {
      const obj = JSON.parse(str)
      return typeof obj === 'object' && obj !== null
    } catch (e) {
      return false
    }
  }
  /**
   * 获取用户设置
   */
  async getFormDataBySettings() {
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
            if (this.isStringAnObject(item.value)) {
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
   * 更新配置
   * @param data
   * @returns
   */
  async updateSetting(data: SettingType) {
    return updateSetting(data)
  }
}
