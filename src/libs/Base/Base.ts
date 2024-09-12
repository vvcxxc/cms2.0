import sdk from 'sdk'
import { ref, reactive, Ref, computed, onMounted, nextTick } from 'vue'
import { Create } from '@/libs/Create/Create'
import { globalState } from '../Store/globalState'
const { request } = sdk.utils
// @ts-ignore
import compose from 'koa-compose'
import {
  ConfigureCodeMap,
  SwappedConfigureCodeMap,
} from '@/widgets/SystemManagement/enum'
import type { ConfigureCodeType } from '@/widgets/SystemManagement/type/Configure.d'
import { getSettings } from '@/api/common-enum'
interface SettingType {
  settings: {
    name: string
    value: string
  }[]
}

let composeMiddleArray: any = []

let flag = 0

export class Base<T extends {} = {}> {
  // 状态
  [key: string]: any
  constructor(initState?: T) {
    if (initState) {
      this.initState(initState)
      this.getVariable()
      this.onMounted && onMounted(this.onMounted.bind(this))
    }
  }
  /**
   * 全局状态
   */
  //@ts-ignore
  static globalState = globalState
  /**
   * 请求request，request.get request.post...
   */
  static request = request

  /**
   * 变量key
   */
  static MAP_KEY = 'varMap'

  /**
   * 缓存时间KEY
   */
  static CACHE_KEY = 'cacheKey'

  /**
   * 缓存时长，目前5分钟
   */
  static CACHE_TIME = 5 * 60 * 1000

  /**
   * 系统配置
   */
  baseSystemConfig = ref({})

  /**
   * 判断是否为对象
   * @param str
   * @returns
   */
  isStringAnObject(str: string) {
    try {
      const obj = JSON.parse(str)
      return typeof obj === 'object' && obj !== null
    } catch (e) {
      return false
    }
  }
  /**
   * 获取用户设置
   */
  async getFormDataBySettings() {
    const { settings }: SettingType = (await getSettings()) || {
      settings: [],
    }
    const formData: ConfigureCodeType = {}
    settings.forEach((item: any) => {
      const key = SwappedConfigureCodeMap[item.name]
      if (key) {
        if (typeof item.name === ConfigureCodeMap.ProductionLineSegment) {
          try {
            item.value = JSON.parse(item.value)
            formData[key] = item.value
          } catch (error) {
            item.value = []
          }
        } else {
          try {
            if (this.isStringAnObject(item.value)) {
              formData[key] = JSON.parse(item.value)
            } else {
              formData[key] = item.value
            }
          } catch (error) {
            formData[key] = []
            console.error(error)
          }
        }
      }
    })
    console.log(settings, formData, 'settings')
    return formData
  }

  /**
   * 初始化系统配置
   */
  private async initSystemConfig() {
    isInit = true
    this.baseSystemConfig.value = await this.getFormDataBySettings()
  }
  /**
   * 根据name获取变量ID
   * @param name
   * @returns
   */
  static getVariableIdByName(name: string) {
    const map = globalState[Base.MAP_KEY]
    return map.get(name) || ''
  }

  /**
   * 将变量转换成Map
   * @param args 数组
   * @returns
   */
  private transformArrayToMap(args: any[]) {
    const map = new Map()
    args.forEach((item) => {
      map.set(item.name, item.id)
    })
    return map
  }

  /**
   * 查询变量，5分钟缓存
   * @param next
   * @returns
   */
  private async queryVariable(next: () => void) {
    const size = this.getState(Base.MAP_KEY)?.size
    const t = this.getState(Base.CACHE_KEY) || Date.now()
    flag++
    this.clear()
    // 缓存一分钟,如果下次重新请求，则更新
    if (size > 0 && Date.now() - t < Base.CACHE_TIME) return next && next()
    try {
      const vars = await request.get('/api/v1/variable/query')
      const varMap = this.transformArrayToMap(vars.result)
      this.setState(Base.CACHE_KEY, Date.now())
      this.setState(Base.MAP_KEY, varMap)
      next && next()
    } catch (error) {
      // next()
      console.error(error, '变量查询接口报错，暂停请求')
    }
  }
  /**
   * 清理全局参数
   */
  private clear() {
    if (flag === composeMiddleArray.length) {
      composeMiddleArray = []
      flag = 0
    }
  }

  /**
   * 获取变量按队列执行
   */
  private async getVariable() {
    composeMiddleArray.push((context: any, next: () => void) =>
      this.queryVariable(next)
    )

    nextTick(() => {
      if (!flag) {
        const fn = compose(composeMiddleArray)
        fn()
      }
    })
  }

  private initState(state = {}) {
    const entry = Object.entries(state)
    if (Array.isArray(entry)) {
      entry.forEach(([key, value]) => {
        this[key] = ref(value)
      })
    }
  }

  // 状态
  /**
   * 获取状态值
   * @param key key
   * @returns any
   */
  getState(key: string | symbol) {
    return Base.globalState[key]
  }
  /**
   * 修改状态
   * @param key key
   * @param value value
   * @returns void
   */
  setState(key: string | symbol, value: any) {
    return (Base.globalState[key] = ref(value))
  }

  removeState(key: string) {
    if (!key) return
    return delete Base.globalState[key]
  }

  /**
   * 初始化对象
   * @param data
   * @returns
   */
  createObject(data: string | number | any[][] | any) {
    return new Create(data)
  }
  /**
   * 获取用户信息
   */
  get userInfo() {
    return sdk.userInfo || {}
  }

  static userInfo = sdk.userInfo || {}

  // useVModels
}
