import { Base } from '@/libs/Base/Base'
import { getWorkSection, getWorkStation } from './Service/Service'

export class Console extends Base {
  constructor() {
    super({})
  }

  async getWorkSection() {
    const segment: Record<string, any[]> = {}
    const segTree: Record<string, any>[] = []
    const res = await getWorkSection({
      SkipCount: 0,
      MaxResultCount: 999,
    })
    res.items?.forEach((item: any) => {
      segment[item.segment?.id] = segment[item.segment?.id] || []
      segment[item.segment?.id].push(item)
    })
    Object.entries(segment).forEach(([key, value]) => {
      const parent = value[0].segment
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(...value)
      }
      segTree.push(parent)
    })
    return {
      tree: segTree,
      items: res.items || [],
    }
  }

  async getWorkStation(id: string) {
    const res = await getWorkStation({
      WorkSection: id,
      SkipCount: 0,
      MaxResultCount: 999,
    })
    return res.items || []
  }
}
