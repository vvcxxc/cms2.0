import { Base } from '@/libs/Base/Base'
import { getFlowInfo } from './Service/Service'
import mergeWith from 'lodash/mergeWith'
import { Ref } from 'vue'

interface BaseStateType {
  flowData: any
  commonRefs: Record<string, Ref>
}

export class ParamsSignal extends Base<BaseStateType> {
  constructor() {
    super({
      flowData: {},
      commonRefs: {},
    })
  }
  /**
   * 合并数据
   * @param objValue
   * @param srcValue
   * @returns
   */
  mergeArray(objValue: Record<string, any>, srcValue: Record<string, any>) {
    if (Array.isArray(objValue)) {
      return objValue.concat(srcValue)
    }
  }
  /**
   * 获取所有流程数据
   * @param types
   */
  async getAllFlowData(types: number[]) {
    return new Promise((resolve) => {
      if (!types.length) return {}
      const allFlow = types.map((type) => getFlowInfo(type))
      Promise.all(allFlow).then((data: any) => {
        // @ts-ignore
        this.flowData.value = mergeWith(...data, this.mergeArray)
        resolve(this.flowData)
      })
    })
  }
}
