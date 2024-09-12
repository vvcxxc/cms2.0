import { ElMessage, messageTypes } from 'element-plus'

function toast(
  messageOrOptions: string | Partial<any>,
  type: (typeof messageTypes)[number],
  duration?: any['duration']
) {
  let elMessage: ReturnType<typeof ElMessage>

  // fix: setTimeout 修复同时调用多个时会堆叠
  setTimeout(() => {
    elMessage = ElMessage({
      message: String(messageOrOptions),
      type,
      duration,
      grouping: true,
      showClose: true,
      ...Object(typeof messageOrOptions === 'object' ? messageOrOptions : {}),
    })
  })

  return {
    close() {
      setTimeout(() => {
        elMessage?.close()
      })
    },
  }
}

/**
 * 返回一个会自动关闭上一个的 toast
 */
function createSingleToast() {
  let single: ReturnType<typeof toast> | undefined

  return function singleToast(...args: Parameters<typeof toast>) {
    single?.close()
    single = toast(...args)
  }
}
export const singleToast = createSingleToast()

function warn(message: string) {
  toast(message, 'warning')
}

export { toast as default, createSingleToast, toast, warn }

// @ts-ignore
window.toast = toast
