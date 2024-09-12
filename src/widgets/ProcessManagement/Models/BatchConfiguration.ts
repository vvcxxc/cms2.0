import { Base } from '@/libs/Base/Base'
import { onMounted } from 'vue'
import { getWorkStationList } from './Service/Service'
import { productionLine } from '../enum'

interface Filter {
  name?: string
  flowType?: string
}

interface ItemType {
  name: string
  id: string
}
export class BatchConfiguration extends Base<{ [key: string]: any }> {
  constructor() {
    super({
      state: [],
    })
  }
  // onMounted() {}
  /**
   * 获取工位列表
   * @param filter
   * @returns
   */
  async getStationList(filter: Filter) {
    const data = await getWorkStationList(filter)
    const state = data.map((item: ItemType) => {
      return {
        label: item.name,
        value: item.id,
      }
    })
    return state
  }
}
