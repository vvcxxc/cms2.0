// @ts-ignore
import sdk from 'sdk'
const { utils } = sdk
const { request } = utils
import axios from 'axios'

const requestByAxios = axios.create({})
requestByAxios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    return error.response.data
  }
)
import type {
  IProductParams,
  IProductTableList,
  IProductOptionsResponse,
  IProductParamsRequest,
  IAbilityTypeResponse,
} from '@/api/product'
const NAME_SPACE = 'SCMS.AppSettings.FiledModel.OrderManagement'
export default {
  getTableHead: () => {
    return request({
      url: `api/v1/settingmanagement/setting?namePrefix=${NAME_SPACE}`,
      method: 'get',
    })
  },
  getTable: ({
    Filter,
    StartTime,
    FinishTime,
    Status,
    Sorting,
    SkipCount,
    MaxResultCount,
    Product,
  }: IProductParams): Promise<IProductTableList> => {
    const str = Product ? `&Product=${Product}` : ''
    return request({
      url: `/api/v1/ordermanagement/order?Filter=${Filter}&StartTime=${StartTime}&FinishTime=${FinishTime}&Status=${Status}&Sorting=${Sorting}&SkipCount=${SkipCount}&MaxResultCount=${MaxResultCount}${str}`,
      method: 'get',
    })
  },

  // 获取产品型号列表
  getModelOptions: (
    filter: string = '',
    hasFormula: boolean = true,
    includeFormula: boolean = false
  ): Promise<IProductOptionsResponse[]> => {
    return request({
      url: `/api/v1/messuite/query/product?filter=${filter}&hasFormula=${hasFormula}&includeFormula=${includeFormula}`,
      method: 'get',
    })
  },
  getModelOptionsNew: () => {
    return request({
      url: `/api/v1/messuite/query/enumeration/ProductModel`,
      method: 'get',
    })
  },

  // @ts-ignore
  addOrder: (data) => {
    return request({
      url: `/api/v1/ordermanagement/order`,
      method: 'post',
      data,
    })
  },
  // @ts-ignore
  updateOrder: (data, id: string) => {
    return request({
      url: `/api/v1/ordermanagement/order/${id}`,
      method: 'put',
      data,
    })
  },

  delOrder: (ids: string[]) => {
    return request({
      url: `/api/v1/ordermanagement/order`,
      method: 'delete',
      data: ids,
    })
  },

  getOrder: (id: string) => {
    return request({
      url: `/api/v1/ordermanagement/order/${id}`,
      method: 'get',
    })
  },

  // 下发
  putDeliver: (id: string, data?: any) => {
    const deliverData: any = {
      url: `/api/v1/ordermanagement/order/${id}/deliver`,
      method: 'put',
    }
    if (data) {
      deliverData.data = data
    }
    return request(deliverData)
  },
  // 暂停
  putPause: (id: string) => {
    return request({
      url: `/api/v1/ordermanagement/order/${id}/pause`,
      method: 'put',
    })
  },

  // 撤销
  putRevoke: (id: string) => {
    return request({
      url: `/api/v1/ordermanagement/order/${id}/revoke`,
      method: 'put',
    })
  },

  // 结束
  putFinish: (id: string, finishReason: string) => {
    return request({
      url: `/api/v1/ordermanagement/order/${id}/finish`,
      method: 'put',
      data: {
        finishReason,
      },
    })
  },
  // 备料查询
  getPrepare: (id: string) => {
    return request({
      url: `/api/v1/ordermanagement/order/${id}/prepare`,
      method: 'put',
    })
  },

  putComplete: (id: string) => {
    return request({
      url: `/api/v1/ordermanagement/order/${id}/complete`,
      method: 'put',
    })
  },

  // 激活
  putPrepareActive: (id: string) => {
    return request({
      url: `/api/v1/ordermanagement/order/${id}/activate`,
      method: 'put',
    })
  },
  // 更新物料状态
  putMaterial: (id: string) => {
    return request({
      url: `/api/v1/ordermanagement/order/${id}/feeding`,
      method: 'put',
    })
  },

  // 更新工单
  putOrder: (id: string) => {
    return request({
      url: `/api/v1/ordermanagement/order/${id}/feeding`,
      method: 'put',
    })
  },

  // 判断产品是否存在不通过的开机点检任务
  hasanyfailedinspectiontask: (id: string) => {
    return request({
      url: `/api/v1/messuite/check/product/hasanyfailedinspectiontask?id=${id}`,
      method: 'get',
    })
  },
  exportOrder: ({
    Filter,
    StartTime,
    FinishTime,
    Status,
    Sorting,
    SkipCount,
    MaxResultCount,
  }: IProductParams) => {
    return request({
      url: `/api/v1/ordermanagement/order/export?Filter=${Filter}&StartTime=${StartTime}&FinishTime=${FinishTime}&Status=${Status}&Sorting=${Sorting}&SkipCount=${SkipCount}&MaxResultCount=${MaxResultCount}`,
      method: 'get',
      responseType: 'blob',
    })
  },
  // 排序
  sortTable(id: string, index: number) {
    return request({
      url: `api/v1/ordermanagement/order/${id}/adjustsort/${index}`,
      method: 'put',
    })
  },

  // 下载模版
  downloadTemplate() {
    return request({
      url: `/api/v1/ordermanagement/order/download`,
      method: 'get',
      responseType: 'blob',
    })
  },
  // @ts-ignore
  postImport(file) {
    return request({
      url: `/api/v1/ordermanagement/order/import`,
      method: 'post',
      data: file,
    })
  },
  // 获取配方信息
  getFormula: (id: string) => {
    return request({
      url: `/api/v1/messuite/query/formula?ProductIds=${[id]}`,
      method: 'get',
    })
  },
  // // 激活全部信息
  // active: (id?: string) => {
  //   const query = id ? `?id=${id}` : ''
  //   return request({
  //     url: `/api/v1/zc/order/active${query}`,
  //     method: 'put',
  //   })
  // },
  // // 全部暂停全部信息
  // stop: (id?: string) => {
  //   const query = id ? `?id=${id}` : ''
  //   return request({
  //     url: `/api/v1/zc/order/stop${query}`,
  //     method: 'put',
  //   })
  // },
  // 全部暂停
  allPutRevoke: () => {
    return request({
      url: `/api/v1/ordermanagement/order/pause`,
      method: 'put',
    })
  },
  // 全部激活
  allPutPrepareActive: () => {
    return request({
      url: `/api/v1/ordermanagement/order/activate`,
      method: 'put',
    })
  },
  /**
   * 更新
   * @returns
   */
  updateAll: (data: string[]) => {
    return request.post(`/api/v1/zc/order/update`, data)
  },
  /**
   * 获取工单
   * @returns
   */
  getOrderData: (code?: string) => {
    code = code ? `?code=${code}` : ''
    return request.get(`/api/v1/zc/order/get${code}`)
  },
  /**
   * 重启工单
   * @returns
   */
  restart: (data: any = {}) => {
    let url = `/api/v1/zc/order/order/restart`
    const method = 'get'
    if (method === 'get') url += '?' + new URLSearchParams(data).toString()
    return request({ url, method, data })
  },
  /**
   * 获取工单 不走sdk
   * @returns
   */
  getOrderDataNotSdk: (code?: string) => {
    code = code ? `?code=${code}` : ''
    return requestByAxios.get(`/api/v1/zc/order/get${code}`)
  },
}
