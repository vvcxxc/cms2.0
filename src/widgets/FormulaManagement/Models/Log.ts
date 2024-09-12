import { Base } from '@/libs/Base/Base'
import { getFormulaList, createApply, exportLog } from './Service/Service'

export class Log extends Base<{ [key: string]: any }> {
  constructor() {
    super({})
  }

  getFormulaList(data: any) {
    return getFormulaList(data)
  }
  exportLog(data: any){
    return exportLog(data)
  }
}
