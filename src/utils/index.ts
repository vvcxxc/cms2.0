// 工具类函数

import { SpeedTime } from '@/widgets/ProductDelivery/enum'

// 随机id
function createRandomId(): string {
  return (
    (Math.random() * 10000000).toString(16).substr(0, 4) +
    new Date().getTime() +
    Math.random().toString().substr(2, 5)
  )
}

// 随机数
function randomNumber(min = 1, max = 100) {
  return parseInt(Math.random() * (max - min + 1) + min.toString())
}

function getTableHeight(num?: number | undefined) {
  const pageHeight = window.innerHeight
  const height = num ? num / 100 : 0.81
  const heightPx = Math.floor(pageHeight * height)

  return heightPx
}

// 是否数字
function isNumber(val: string | number): boolean {
  // 不能转换为数字的直接抛出
  if (isNaN(Number(val))) return false

  // 去除所有空格，什么都没有
  const val1 = val.toString().replace(/\s+/g, '')
  if (!val1) return false

  // 小数点后，什么都没有
  const val2 = val.toString().split('.')
  if (val2.length >= 2) {
    if (!val2[1]) return false
  }

  return true
}

// 自适应分辨率
function adaptiveResolution() {
  // 获取屏幕宽、高
  // bodyW = document.body.clientWidth,
  // bodyH = document.body.clientHeight,
  var bodyW = window.innerWidth
  var bodyH = window.innerHeight
  // var bodyW = window.screen.width;
  // var bodyH = window.screen.height;

  var appBodyWRatio = bodyW / 1920 // 屏幕宽 与 设定的最小宽度 的比值
  var appBodyHRatio = bodyH / 1080 // 屏幕宽 与 设定的最小宽度 的比值
  // var appEle = document.getElementById('app') // #app
  var appEle = document.body // body
  appEle.style.position = 'relative'
  // console.log('appBodyWRatio == ', appBodyWRatio, 'appBodyHRatio == ', appBodyHRatio)
  if (appBodyWRatio <= 1 || appBodyHRatio <= 1) {
    // 比值小于1时，需要处理
    var appH = bodyH / appBodyHRatio // 重新设置页面高度
    var appW = bodyW / appBodyWRatio // 重新设置页面高度
    // var positionBase = (1 - appBodyRatio) / 2 * 100 + 9; // 重新设置位移值
    // var positionLeft = (1920 - bodyW) / 2; // 重新设置left位移值
    var positionRight = (appH - bodyH) / 2 // 重新设置left位移值
    // var positionRight = (appH - bodyH) / 2; // 重新设置right位移值
    var positionLeft = (appW - bodyW) / 2 // 重新设置right位移值
    // appEle.style.width = "1920px";
    appEle.style.width = appW + 'px'
    appEle.style.height = appH + 'px'
    // appEle.style.height = "1080px";
    appEle.style.transform =
      'scale(' + appBodyWRatio + ', ' + appBodyHRatio + ')'
    appEle.style.left = -positionLeft + 'px'
    appEle.style.top = -positionRight + 'px'
  } else {
    appEle.style.width = '100%'
    appEle.style.height = '100%'
    appEle.style.transform = ''
    appEle.style.position = '0'
    appEle.style.top = '0'
  }
}

function generateUniqueId() {
  let id = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < 10; i++) {
    id += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return id
}

// @ts-ignore
function downloadFile(file, fileName) {
  const blob = new Blob([file])
  // 兼容不同浏览器的URL对象
  // const url:any = window.URL || window.webkitURL || window.moxURL
  const url = window.URL || window.webkitURL
  // 创建下载链接
  const downloadHref = url.createObjectURL(blob)
  // 创建a标签并为其添加属性
  let downloadLink = document.createElement('a')
  downloadLink.href = downloadHref
  downloadLink.download = fileName
  // 触发点击事件执行下载
  downloadLink.click()
  // @ts-ignore
  window.URL.revokeObjectURL(url)
}

/**
 * 将map转换成数组list
 * @param map
 */
function genMapToArrayList(map: Record<string, any>): any[] {
  const list: any[] = []
  for (const key in map) {
    if (map.hasOwnProperty(key)) {
      list.push(map[key])
    }
  }
  return list
}

/**
 * 将[{description: 'xx', value: 1}]转成成[{label: 'xx',value: 1}]
 */
export function transformOptions(data: any): any[] {
  return data.map((item: any) => {
    return {
      label: item.description,
      value: item.value,
      name: item.name,
    }
  })
}

/**
 * 判断数组的某个字段是否有重复项
 * @param array 数组源
 * @param property 需要判断数组中对象的字段名
 * @returns boolean
 */
const hasDuplicates = (array: any[], property: string) => {
  var values = array.map((element) => element[property])
  var uniqueValues = new Set(values)
  return values.length !== uniqueValues.size
}
/**
 * 首字母小写
 * @param str
 * @returns
 */
export function lowerCaseFirstChar(str: string) {
  if (!str) return str // 如果字符串为空，则直接返回
  return str.charAt(0).toLowerCase() + str.slice(1)
}

// export const genSetInterval = (fn: () => void, time = 33) => {
//   let timer: any = null
//   return {
//     start() {
//       timer && clearInterval(timer)
//       timer = setInterval(() => fn(), time)
//     },
//     clear() {
//       if (timer) {
//         clearInterval(timer)
//         timer = null
//       }
//     },
//   }
// }
type Timer = {
  start: () => void
  clear: () => void
}

export const genSetInterval = (fn: () => void, time: number = 33): Timer => {
  let timerId: number | null = null
  let lastTime = performance.now()

  const loop = (currentTime: number) => {
    const deltaTime = currentTime - lastTime

    if (deltaTime >= time) {
      fn()
      lastTime = currentTime - (deltaTime % time) // 保留余下的时间，减少漂移
    }

    timerId = requestAnimationFrame(loop)
  }

  return {
    start() {
      if (timerId === null) {
        lastTime = performance.now() // 重置初始时间
        timerId = requestAnimationFrame(loop)
      }
    },
    clear() {
      if (timerId !== null) {
        cancelAnimationFrame(timerId)
        timerId = null
      }
    },
  }
}

export {
  hasDuplicates,
  genMapToArrayList,
  createRandomId,
  randomNumber,
  isNumber,
  adaptiveResolution,
  getTableHeight,
  generateUniqueId,
  downloadFile,
}
