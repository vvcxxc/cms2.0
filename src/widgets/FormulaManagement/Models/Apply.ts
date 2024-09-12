import { Base } from '@/libs/Base/Base'
import { getFormulaList, createApply } from './Service/Service'

export class Apply extends Base<{ [key: string]: any }> {
  constructor() {
    super({})
  }

  getFormulaList(data: any) {
    return getFormulaList(data)
  }

  createApply(data: any) {
    return createApply(data)
  }
}
