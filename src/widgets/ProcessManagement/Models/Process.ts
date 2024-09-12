import { Base } from '@/libs/Base/Base'
import { ref } from 'vue'
import {
  getProcessList,
  cloneWorkSection,
  deleteWorkSections,
} from './Service/Service'
export class Process extends Base<{ [key: string]: any }> {
  constructor() {
    super({
      data: [],
      fieldMap: {},
    })
  }
  onMounted() {
    // this.getRelationList()
  }
  /**
   * 删除工序
   * @param id
   * @returns
   */
  async deleteWorkSections(ids: string[]) {
    return deleteWorkSections(ids)
  }
  /**
   * 克隆工序
   * @param ids
   * @returns
   */
  cloneWorkSection(ids: string[]) {
    return cloneWorkSection(ids)
  }

  async getList() {
    const { items = [] } = await getProcessList()
    return items
  }
  /**
   * 流程分组
   */
  async getGroupProcess() {
    const items = await this.getList()
    const map: Record<string, any> = {}
    items.map((item: any) => {
      const keys = item.flowDefinitions.map((flow: any) => flow.type)
      const key = keys.sort((a: number, b: number) => a - b).join(',')
      if (map[key] && Array.isArray(map[key].value)) {
        map[key].value.push(item)
      } else {
        map[key] = ref([item])
      }
    })
    return { map, items }
  }
  /**
   * 产线段分组
   */
  async getGroupSegment() {
    const items = await this.getList()
    const map: Record<string, any> = {}
    items.map((item: any) => {
      const key = item?.segment?.name
      if (map[key] && Array.isArray(map[key].value)) {
        map[key].value.push(item)
      } else {
        map[key] = ref([item])
      }
    })
    return { map, items }
  }
}
