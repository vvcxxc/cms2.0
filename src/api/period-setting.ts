// @ts-ignore
import sdk from 'sdk'
const { utils } = sdk
const { request } = utils

import type {
  IVariables,
  IPeriod,
  IPeriodSetting,
} from '@/api/period-setting.type'

interface MyResponse<T> {
  data: {
    variables: IVariables[]
    periods: IPeriod[]
    [key: string]: any
  }
  status: number
  statusText: string
  headers: any
  config: any
}

// 设备台账Table
export default {
  getPeriodConfigs: (): Promise<MyResponse<IPeriodSetting>> => {
    return request({
      url: `/api/v1/periodmanagement/periodsetting`,
      method: 'get',
    })
  },
  postPeriodConfigs: (data: any) => {
    return request({
      url: `/api/v1/periodmanagement/periodsetting`,
      method: 'post',
      data,
    })
  },
}
