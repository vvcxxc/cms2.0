import sdk from 'sdk'
import { Message } from 'element-plus'

const MessageType = ['success', 'warning', 'info', 'error'] as const
const MessageBoxType = ['alert', 'confirm', 'prompt'] as const

const ElMessage: any = (...args: any) => {
  sdk.importAsync('element-plus').then((elementPlus: any) => {
    elementPlus.ElMessage(...args)
  })
}

MessageType.forEach((type) => {
  ElMessage[type] = (...args: any) => {
    sdk.importAsync('element-plus').then((elementPlus: any) => {
      elementPlus.ElMessage[type](...args)
    })
  }
})

const ElMessageBox: any = (...args: any[]) => {
  sdk.importAsync('element-plus').then((elementPlus: any) => {
    elementPlus.ElMessageBox(...args)
  })
}

MessageBoxType.forEach((type) => {
  ElMessageBox[type] = (...args: any) => {
    return new Promise((resolve, reject) => {
      sdk.importAsync('element-plus').then((elementPlus: any) => {
        elementPlus.ElMessageBox[type](...args)
          .then((action: any) => {
            resolve(action)
          })
          .catch((action: any) => {
            reject(action)
          })
      })
    })
  }
})

export { ElMessageBox, ElMessage }
