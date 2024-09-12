import { Base } from '@/libs/Base/Base'
import { onMounted } from 'vue'
import {
  getWorkSectionSpecial,
  updateWorkSectionSpecial,
  updateByFormula,
  deleteSectionSpecial,
  deleteSectionSpecialParams,
} from './Service/Service'

export class SpecialProcess extends Base<{ [key: string]: any }> {
  constructor() {
    super({
      data: [],
    })
  }
  getWorkSectionSpecial(id: number) {
    return getWorkSectionSpecial(id)
  }
  updateWorkSectionSpecial(id: number, data: any) {
    return updateWorkSectionSpecial(id, data)
  }
  updateByFormula(data: any) {
    return updateByFormula(data)
  }
  deleteSectionSpecial(id: number) {
    return deleteSectionSpecial(id)
  }
  deleteSectionSpecialParams(id: number) {
    return deleteSectionSpecialParams(id)
  }
}
