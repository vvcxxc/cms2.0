import { Base } from '@/libs/Base/Base'
import {
  getTableLayout,
  getProductList,
  getSectionList,
} from './Service/Service'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { _t } from '../app'

interface BaseStateType {}

export class Trace extends Base<BaseStateType> {
  constructor() {
    super({})
  }
  /**
   * 布局数据
   * @param params
   */
  async getTableLayout(params: { productId: string; tableId: string }) {
    const res = await getTableLayout(params)
    return res.columns || []
  }
  /**
   * 产品
   * @returns
   */
  async getProductList() {
    const res = await getProductList()
    const items = res.items || []
    items.unshift({
      id: 'all',
      model: _t('全部'),
    })
    return res.items || []
  }

  /**
   * 获取工序列表tree
   * @returns
   */
  async getSectionList(id: string) {
    const res = await getSectionList(id)
    res.tree.forEach((item: Record<string, any>) => {
      if (!item.isSummary) {
        item.headerId = item.headerId.includes(
          '00000000-0000-0000-0000-000000000000'
        )
          ? uuidv4()
          : item.headerId
        item.value = item.headerId
        item.label = item.header
        item.children = item.childs?.map((child: Record<string, any>) => {
          return {
            ...child,
            value: item.headerId,
            label: child.header,
          }
        })
      }
    })
    return (res.tree || []).filter((item: any) => !item.isSummary)
  }
}
