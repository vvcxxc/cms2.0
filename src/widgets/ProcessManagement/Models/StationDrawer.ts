import { Base } from '@/libs/Base/Base'
import {
  getWorkStation,
  updateWorkStation,
  addWorkStation,
  checkStation,
} from './Service/Service'
import { stationKeys } from '../enum'
import { Configuration } from '../type/StationDrawer'
import omit from 'lodash/omit'
import merge from 'lodash/merge'
import { Create } from '@/libs/Create/Create'

interface BaseStateType {
  flowData: {}
}

export class StationDrawer extends Base<BaseStateType> {
  constructor() {
    super({
      flowData: {},
    })
  }
  onMounted() {
    // this.getFlowData()
    // 初始化数据
  }
  /**
   * 获取工位详情
   * @param id
   * @returns
   */
  async getStationDetail(id: string) {
    return getWorkStation(id)
    // this.data.value.push({})
  }
  /**
   * 合并动态字段为数组
   * @param keys
   * @returns
   */
  mergeArr(keys: Record<string, any[]>) {
    let data: any[] = []
    Object.values(keys).forEach((arr) => {
      data = data.concat(arr)
    })
    const mergeData = data.map((item) => {
      if (typeof item.value === 'object') {
        return item.value
      }
      return {
        value: item.value,
        description: item?.data?.description,
        name: item?.data?.name,
      }
    })

    return mergeData.filter((v) => v)
  }

  /**
   * 处理编辑和新增
   * @param paramsMap
   * @param formData
   * @returns
   */
  handleData(paramsMap: Configuration, formData: any, sort: number = 0) {
    const filterItems = omit(paramsMap, stationKeys)

    const data = new Create({
      kanbanIpAddress: formData.kanbanIpAddress,
      name: formData.name,
      sopVariable: formData.sopVariable,
      updateCodeVariable: formData.updateCodeVariable,
      workSectionId: formData.workSection?.id,
      flowAbilitys:
        paramsMap.abilitys?.map((item: any) => {
          return {
            name: item.code,
            description: item?.data.description,
            value: item.abilityValue,
          }
        }) || [],
      flowFields: this.mergeArr(filterItems),
      processParameters: paramsMap.params || [],
      formulaParameters: paramsMap.formula || [],
      unqualifiedReasons: paramsMap.quality || [],
      materialDetections: paramsMap.materiel || [],
      sort,
      remark: formData.remark,
    })
    return data
  }
  /**
   * 添加工位
   */
  addStation({
    paramsMap,
    formData,
    sort,
  }: {
    paramsMap: Configuration
    formData: any
    sort: number
  }) {
    const data = this.handleData(paramsMap, formData, sort)
    return addWorkStation(data)
  }
  /**
   * 更新工位
   * @param id
   * @param param1
   * @returns
   */
  updateStation(
    id: string,
    {
      paramsMap,
      formData,
      sort,
    }: { paramsMap: Configuration; formData: any; sort: number }
  ) {
    const data = this.handleData(paramsMap, formData, sort)
    data.insert('id', id)
    data.insert('concurrencyStamp', formData.concurrencyStamp)

    return updateWorkStation(data)
  }
  /**
   * 校验工位
   * @param id
   * @param param1
   * @returns
   */
  checkStation(
    {
      paramsMap,
      formData,
      sort,
    }: {
      paramsMap: Configuration
      formData: any
      sort: number
    },
    id: string
  ) {
    const data = this.handleData(paramsMap, formData, sort)
    return checkStation(data, id)
  }
}
