import { reactive, onMounted, ref, Ref } from 'vue'
import {
  getEnumList,
  getWorkSectionApi,
  getWorkStationApi,
  getFormDataBySettings,
  getFlowData,
  getMaterialTypes,
  getMaterialTypesEnum,
  getFeatureListData,
} from '@/api/common-enum'

import type { ConfigureCodeType } from '@/widgets/SystemManagement/type/Configure.d'
import { createGlobalState } from '@vueuse/core'
import { FeatureItemType, FeatureType } from './Store.d'

interface BaseState {
  systemConfig: Record<string, any>
  workSectionList: Record<string, any>
  featureList: Record<string, any>
  featureMap: Record<string, any>
}

enum BaseKeyEnum {
  systemConfig = 'systemConfig',
  workSectionList = 'workSectionList',
  featureList = 'featureList',
  featureMap = 'featureMap',
}
declare global {
  interface Window {
    __globalState: any // 定义你要暴露给 window 的变量的类型
    __BaseState__: BaseState
  }
}
interface StateType<T> {
  state: Ref<T>
}

const baseDataGenerate = (key?: BaseKeyEnum) => {
  const data: BaseState = {
    systemConfig: {
      state: ref({}),
    },
    workSectionList: {
      state: ref([]),
    },
    featureList: {
      state: ref([]),
    },
    featureMap: {
      state: ref({}),
    },
  }
  if (key) {
    return data[key]
  }
  return data
}

const getDataValue = (key: BaseKeyEnum) => {
  const { systemConfig, workSectionList, featureList, featureMap } =
    window.__BaseState__
  return {
    systemConfig: systemConfig || baseDataGenerate(BaseKeyEnum.systemConfig),
    workSectionList:
      workSectionList || baseDataGenerate(BaseKeyEnum.workSectionList),
    featureList: featureList || baseDataGenerate(BaseKeyEnum.featureList),
    featureMap: featureMap || baseDataGenerate(BaseKeyEnum.featureMap),
  }[key]
}
/**
 * 全局状态
 */
export const globalState = reactive({})

if (window) {
  window.__BaseState__ = window.__BaseState__ || baseDataGenerate()
}

/**
 * 全局hook
 * @returns
 */
export const useGlobalState = createGlobalState(() => {
  // if(!sessionStorage.getItem('Token')) return {}
  /**
   * 工序列表
   */
  const workSectionList = getDataValue(BaseKeyEnum.workSectionList)
  /**
   * 系统配置
   */
  const systemConfig = getDataValue(BaseKeyEnum.systemConfig)
  /**
   * 版本控制
   */
  const featureList = getDataValue(BaseKeyEnum.featureList)
  /**
   * 版本控制Map
   */
  const featureMap = getDataValue(BaseKeyEnum.featureMap)

  /**
   * 产线列表
   */
  const productionLineList: StateType<Array<any>> = {
    state: ref([]),
  }
  /**
   * 产品型号列表
   */
  const ProductModelList: StateType<Array<any>> = {
    state: ref([]),
  }

  /**
   * 物料列表
   */
  const materialTypeList: StateType<Array<any>> = {
    state: ref([]),
  }

  /**
   * 工位列表
   */
  const workStationList: StateType<Array<any>> = {
    state: ref([]),
  }

  /**
   * (异步)产线段数据
   */
  const getProductList = async () => {
    const res = await getEnumList('ProductionLineSegment')
    const data = res?.map(
      (item: { name: string; description: string; value: string }) => {
        return {
          ...item,
          product: item.description,
        }
      }
    )
    productionLineList.state.value = data || []
    return data || []
  }

  /**
   * (异步)产品型号数据
   */
  const getProductModelList = async () => {
    const res = await getEnumList('ProductModel')
    ProductModelList.state.value = res || []
    return res
  }

  /**
   * (异步)获取工序
   */
  const getWorkSectionList = async (segmentId?: string) => {
    const params: Record<string, any> = {
      MaxResultCount: 999,
      SkipCount: 0,
    }
    if (segmentId) {
      params.Segment = segmentId
    }
    const res = await getWorkSectionApi(params)
    const items = res.items.map((v) => {
      return {
        label: v.name,
        value: v.id,
        workSectionCode: v.code,
      }
    })
    if (!segmentId) {
      workSectionList.state.value = items || []
    }
    return items
  }

  /**
   * (异步)获取工位
   */
  const getWorkStationList = async () => {
    const res = await getWorkStationApi({
      MaxResultCount: 999,
      SkipCount: 0,
    })
    const items = res.items.map((v) => {
      return {
        label: v.name,
        value: v.id,
      }
    })
    workStationList.state.value = items || []
    return items
  }

  const config: ConfigureCodeType = {}
  let systemSetTimeT: any
  let oldSystemSetTimeT: any
  const getSystemConfig = async (checked: boolean = false) => {
    const fn = async () => {
      const data = await getFormDataBySettings()
      systemConfig.state.value = data || config
    }
    async function handleCheckedState() {
      await fn()
      await getFeatureList()
    }

    async function awaitInitLoading() {
      return new Promise<void>((resolve) => {
        const t = setInterval(() => {
          if (
            Object.keys(systemConfig.state.value).length &&
            Object.keys(featureList.state.value).length
          ) {
            resolve()
            clearInterval(t)
          }
        }, 100)
      })
    }
    return new Promise<void>((resolve) => {
      const getConfig = async () => {
        const condition = systemSetTimeT !== oldSystemSetTimeT && !checked
        oldSystemSetTimeT = systemSetTimeT
        if (condition) {
          await handleCheckedState()
          resolve()
        } else {
          await awaitInitLoading()
          resolve()
        }

        systemSetTimeT && clearTimeout(systemSetTimeT)
      }
      systemSetTimeT = setTimeout(getConfig, 100)
    })
  }
  /**
   * 获取流程数据
   * @returns
   */
  const getFlowList = async () => {
    const data = await getFlowData()
    return data.items.map((item: Record<string, any>) => {
      return {
        label: item.name,
        value: item.type,
        id: item.id,
      }
    })
  }

  const getMaterialTypeList = async () => {
    const res: Array<{
      value: number
      description: string
    }> = await getMaterialTypesEnum()
    const types = res.map((item) => {
      return {
        value: Number(item.value),
        label: item.description,
      }
    })
    materialTypeList.state.value = types
    return types
    // const types = []
    // const res = await getMaterialTypes()
    // // const
    // await getMaterialTypesEnum()
    // for (let key in res) {
    //   types.push({
    //     label: res[key],
    //     value: Number(key),
    //   })
    // }
    // materialTypeList.state.value = types
    // return types
  }

  const getFeatureList = async () => {
    if (
      !featureList.state.value.length &&
      systemConfig.state.value?.PluginEdition
    ) {
      const res = await getFeatureListData(
        systemConfig.state.value?.PluginEdition
      )
      featureList.state.value = res.groups || []
      res.groups.forEach((item: FeatureItemType) => {
        item.features.forEach((feature: FeatureType) => {
          let value: string | boolean | number = feature.value
          const key: string = feature.name
          if (feature.valueType.validator.name === 'BOOLEAN') {
            value = feature.value === 'true'
          }
          featureMap.state.value[key] = {
            ...feature,
            value,
          }
        })
      })
      return res
    }
    return
  }

  getProductList()
  getProductModelList()
  getWorkSectionList()
  getWorkStationList()
  getMaterialTypeList()
  getSystemConfig()

  const state = {
    productionLineList,
    ProductModelList,
    workStationList,
    materialTypeList,
    workSectionList,
    systemConfig,
    featureList,
    featureMap,
    getSystemConfig,
    getWorkSectionList,
    getProductModelList,
    getFlowList,
    getMaterialTypeList,
    getWorkStationList,
    getProductList,
  }

  window.__globalState = state
  return state
})
