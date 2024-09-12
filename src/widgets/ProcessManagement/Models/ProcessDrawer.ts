import { Base } from '@/libs/Base/Base'
import {
  addWorkSection,
  getWorkSection,
  updateWorkSection,
  getMaterialTypes,
} from './Service/Service'
import { AddDataType } from '../type/ProcessDrawer.d'
import { useGlobalState } from '@/libs/Store/Store'
import find from 'lodash/find'
export class ProcessDrawer extends Base<{ [key: string]: any }> {
  constructor() {
    super({
      data: [],
      workSection: {},
    })
    const { productionLineList } = useGlobalState()
    this.productionLineList = productionLineList
  }

  /**
   * 处理工序数据
   * @returns
   */
  private handleWorkSection(sectionData: AddDataType) {
    const { state }: any = this.productionLineList
    const {
      processParameters,
      formulaParameters,
      materielParameters,
      formData,
      sort,
    } = sectionData
    const segment = find(state.value, ['value', formData.segment])
    const data: Record<string, any> = {
      ...formData,
      processParameters,
      formulaParameters,
      materialDetections: materielParameters,
      sort,
    }
    if (segment) {
      Object.assign(segment, segment.data || {})
      data.segment = segment
    } else {
      data.segment = formData.segmentData
      delete data.segmentData
    }
    return data
  }

  /**
   * 添加工序
   * @param data
   */
  async addWorkSection(sectionData: AddDataType) {
    const data = this.handleWorkSection(sectionData)
    return addWorkSection(data)
  }
  /**
   * 更新工序
   * @param data
   */
  async updateWorkSection(sectionData: AddDataType) {
    const data = this.handleWorkSection(sectionData)

    return updateWorkSection(data)
  }

  /**
   * 获取工序详情
   */
  async getWorkSectionDetail(current: any, id?: string) {
    return getWorkSection(id || current?.id)
  }

  async getMaterialTypes() {
    const res: Array<{
      value: number
      description: string
    }> = await getMaterialTypes()
    const data = res.map((item) => {
      return {
        value: Number(item.value),
        label: item.description,
      }
    })
    return data
  }
}
