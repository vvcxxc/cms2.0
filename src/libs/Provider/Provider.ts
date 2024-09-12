import { onBeforeMount, onUnmounted, reactive, ref, toRefs, Ref } from 'vue'
import set from 'lodash/set'
import get from 'lodash/get'
import { Base } from '@/libs/Base/Base'

interface ControllerType {
  Models: Record<string, Function>
}

let Modules = {}
/**
 * 获取文件名
 * @param filePath
 * @returns
 */
const extractNameFromPath = (filePath: string) => {
  const regex = /\/([A-Za-z]+)\.ts$/
  const match = filePath.match(regex)

  if (match && match[1]) {
    return match[1]
  } else {
    return null
  }
}

/**
 * 转换成名称函数数组
 * @param fileMap
 */
const getFunctionByName = (fileMap: Record<string, Function>) => {
  const entries = Object.entries(fileMap)
  return entries.map(([filePath, fn]) => {
    const name = extractNameFromPath(filePath)
    if (name) {
      return [name, fn]
    } else {
      throw new Error(`${filePath} 文件名格式不正确，请检查`)
    }
  })
}

/**
 * 存入modules
 * @param data [[a,b]]
 * @param namespace
 * @param bool 是否实例化类，默认为false
 */
const saveModules = (data: (string | Function)[][]) => {
  for (let i = 0; i < data.length; i++) {
    const [name, Module]: any[] = data[i]

    Object.entries(Module).map(([hookName, fn]: any) => {
      const fnKey = hookName.toLocaleLowerCase()
      try {
        set(Modules, fnKey, new fn())
      } catch (error) {
        console.error(error)
        throw new Error(`${name} 类中 ${fnKey} 方法格式不正确，请检查`)
      }
    })
  }
}

/**
 * 初始化models
 * @param param
 */
export const createModels = ({ Models }: ControllerType) => {
  const models = getFunctionByName(Models)
  saveModules(models)
}

/**
 * 获取model
 * @param modelName
 * @returns
 */
export const injectModel = <T>(modelName: string): T => {
  const key = modelName.toLocaleLowerCase()
  const InstanceModel = get(Modules, key)
  return InstanceModel
}

/**
 * 获取全局models
 * @param modelName
 * @returns
 */
export const injectModels = () => {
  return Modules
}
