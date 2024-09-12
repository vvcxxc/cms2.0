import { Base } from '@/libs/Base/Base'
import { getAllStep, getWorkSection, saveStep } from './Service/Service'

interface BaseStateType {
  data: any[]
  flowData: {}
}

export class SOPConfig extends Base<BaseStateType> {
  constructor() {
    super({
      data: [{}, {}],
      flowData: {},
    })
  }


  // 保存工步
  saveStep(id: string, formData: FormData) {
    return saveStep(id, formData)
  }


  // 获取全部工步
  getAllStep(id: string) {
    return getAllStep(id)
  }

  // 获取工序
  getWorkSection(filterForm: any){
    return getWorkSection(filterForm)
  }
}
