import { SetupContext, reactive, ref, onMounted, nextTick } from 'vue'
import { ConfigureCodeMap } from '../enum'
import type { ConfigureCodeType } from '../type/Configure.d'
import { Create } from '@/libs/Create/Create'
import { injectModel } from '@/libs/Provider/Provider'
import { Configure } from '../Models/Configure'
import uniqWith from 'lodash/uniqWith'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import { ElMessage } from 'element-plus'
// @ts-ignore
import { v4 as uuidv4 } from 'uuid'
import { useGlobalState } from '@/libs/Store/Store'
import { _t } from '../app'
import {
  formData,
  formRef,
  productTableRef,
  systemData,
} from '../Controllers/State'
import { isFunction } from 'lodash'

interface InitConfigType {
  formData?: any
  ConfigureCodeMap?: any
  beforeUpdate?: (settings: any) => void
}
interface PluginType {
  name: string
  id: string
  widget: any
  sort: number
  initConfig?: () => InitConfigType
}
let isInit = false

export const useSystem = (props: any, ctx: SetupContext) => {
  const configureRef = ref()
  const { onSave } = useConfigure(props, ctx)
  const onUpdate = (menu: PluginType) => {
    // configureRef.value?.onSave()
    onSave(menu.initConfig)
  }
  return {
    configureRef,
    onUpdate,
  }
}

export const useConfigure = (props: any, { emit, expose }: SetupContext) => {
  const configure = injectModel<Configure>('configure')
  const { getSystemConfig } = useGlobalState()

  /**
   * 删除id，并重新uuid
   * @param dataSource
   */
  const delDataId = (dataSource: any[]) => {
    return dataSource.map((item) => {
      if (item.id?.includes('row_')) {
        delete item.id
        item.id = uuidv4()
      }
      if (!item.id) {
        item.id = uuidv4()
      }
      return item
    })
  }

  const checkUnique = (v: any[]) => {
    const data = cloneDeep(v)
    const name = data.map((item) => ({
      name: item.name,
    }))
    const product = data.map((item) => ({
      product: item.product,
    }))
    return (
      !isEqual(name, uniqWith(name, isEqual)) ||
      !isEqual(product, uniqWith(product, isEqual))
    )
  }

  /**
   * 保存配置
   */
  const onSave = (initFn?: () => InitConfigType) => {
    //@ts-ignore
    const initConfig: InitConfigType = initFn ? initFn() : {}
    // 校验
    if (productTableRef.value) {
      const data = productTableRef.value?.getData()

      if (!data) return
      if (checkUnique(data)) {
        return ElMessage.error(_t('产线段不可重复，请检查'))
      }
    }

    formRef.value.validate().then(async (valid: boolean, err: Error) => {
      if (valid) {
        const data: {
          name: string
          value: string
        }[] = []
        if (initConfig?.formData) {
          // @ts-ignore
          formData.update(initConfig.formData)
        }
        if (initConfig?.ConfigureCodeMap) {
          Object.assign(ConfigureCodeMap, initConfig?.ConfigureCodeMap || {})
        }
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined || value !== null || value !== '') {
            const item = {
              // @ts-ignore
              name: ConfigureCodeMap[key],
              value: String(value),
            }
            if (typeof value === 'object') {
              item.value = JSON.stringify(delDataId(cloneDeep(value)))
            }
            data.push(item)
          }
        })

        // 更新
        const settings = {
          settings: data,
        }
        if (isFunction(initConfig?.beforeUpdate)) {
          initConfig?.beforeUpdate(settings)
        }
        await configure.updateSetting(settings)
        getSystemConfig()
        ElMessage.success(_t('保存成功'))
      } else {
        console.error(err)
      }
    })
  }

  onMounted(async () => {
    if (!isInit) {
      isInit = true
      let data = systemData.value
      if (!Object.keys(systemData.value)?.length) {
        data = await configure.getFormDataBySettings()
        data.TimeRangeForDetection = Number(data.TimeRangeForDetection)
      }
      // @ts-ignore
      formData.update(data)
    }
  })

  expose({
    onSave,
  })

  return {
    formData,
    productTableRef,
    formRef,
    onSave,
  }
}
