import { Base } from '@/libs/Base/Base'
import {
  deleteWorkStations,
  cloneWorkStation,
  getStationList,
} from './Service/Service'
import { ref } from 'vue'

interface BaseStateType {
  data: any[]
  flowData: {}
}

export class Station extends Base<BaseStateType> {
  constructor() {
    super({
      data: [],
      flowData: {},
    })
  }

  /**
   * 删除工位
   * @param id
   * @returns
   */
  deleteStations(ids: string[]) {
    return deleteWorkStations(ids)
  }

  /**
   * 克隆工序
   * @param ids
   * @returns
   */
  cloneWorkStation(ids: string[]) {
    return cloneWorkStation(ids)
  }

  async getList() {
    return getStationList()
  }

  /**
   * 工位分组
   */
  async getGroupWorkStation() {
    const { items } = await this.getList()
    const map: Record<string, any> = {}
    items.map((item: any) => {
      const key = item?.workSectionId
      if (map[key] && Array.isArray(map[key].value)) {
        map[key].value.push(item)
      } else {
        map[key] = ref([item])
      }
    })
    return { map, items }
  }
}
