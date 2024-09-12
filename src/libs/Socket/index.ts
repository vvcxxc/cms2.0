import sdk from 'sdk'
import { createSingleToast } from './toast'
import * as signalR from '@microsoft/signalr'
import { onUnmounted, Ref } from 'vue'
import { Language } from '@/libs/Language/Language'
const baseURL = sdk.baseURL
/**
 *
 * 封装 signalR.HubConnection
 *
 * @example
 * socket = new Socket({url, name})
 *
 * @example
 * // 调用方法
 * socket.call('fun', ...args)
 *
 * // 等价于
 * connection.invoke('fun', ...args)
 *
 * @example
 * // 注册事件
 * socket.on(type, callback)
 * socket.on(type, callback, {params})
 *
 * // 等价于
 * connection.invoke('on', {
 *   type,
 *   params,
 *   callbackId, // autoCreateCallbackID
 * })
 * connection.on(callbackId, callback)
 *
 * // 保存注册事件信息，重连时重新注册
 * callbackMap.set(callback, {
 *   type,
 *   params,
 *   callbackId,
 * })
 *
 * @example
 * // vue 组件中注册事件，卸载时自动注销
 * socket.useOn(type, callback)
 * socket.useOn(type, callback, {params})
 *
 * @example
 * // 注销事件
 * socket.off(type, callback)
 *
 * // 等价于
 * connection.invoke('off', {
 *   type,
 *   callbackId,
 * })
 * connection.off(callbackId)
 * callbackMap.delete(callback)
 */
export class Socket {
  url = '/hubs/v1/variables'
  name = '变量服务'
  connection
  /**
   * 保存注册事件信息，重连时重新注册
   * callbackMap.set(callback, callbackInfo)
   */
  callbackMap = new Map<
    Function,
    {
      type: string
      params: Record<string, any>
      callbackId: string
    }
  >()

  constructor(object: Partial<Socket> = {}) {
    Object.assign(this, object)
    this.connection = Socket.createConnection(this.url)
    Socket.lockWS()
  }
  /**
   * 调用方法
   */
  call(...args: Parameters<signalR.HubConnection['invoke']>) {
    return this.connection.invoke(...args)
  }
  /**
   * 注册事件
   * @returns off()
   */

  on(
    type: string,
    callback: (...args: any[]) => void,
    params: Record<string, any> = {}
  ) {
    const connection = this.connection
    const callbackId = type
    const callbackInfo = {
      type,
      params,
      callbackId,
    }

    // connection.invoke('on', params)
    connection.on(callbackId, callback)
    this.callbackMap.set(callback, callbackInfo)

    return () => {
      this.off(type, callback)
    }
  }
  /**
   * vue 组件卸载时自动注销
   * @returns off()
   */
  useOn(...args: Parameters<Socket['on']>) {
    const off = this.on(...args)
    onUnmounted(() => {
      this.off(args[0], args[1])
    })
    return off
  }
  /**
   * 注销事件
   */
  off(type: string, callback: Parameters<Socket['on']>[1]) {
    const connection = this.connection
    const callbackInfo = this.callbackMap.get(callback)
    if (!callbackInfo) return
    const callbackId = callbackInfo.callbackId

    connection.invoke('off', callbackInfo)
    connection.off(callbackId)
    this.callbackMap.delete(callback)
  }
  /** 重接次数 */
  startCount = 0
  /**
   * 启动服务
   * @returns
   */
  async start() {
    if (this.startCount) return
    let resolve: Function
    const promise = new Promise((r) => (resolve = r))

    const self = this
    const singleToast = createSingleToast()
    const connection = this.connection

    const toast = function (...args: Parameters<typeof singleToast>) {
      if (args[2] !== -1) {
        singleToast(...args)
      }
      const methodMap = {
        warning: 'warn',
        error: 'error',
      }
      const method = methodMap[args[1]] || 'log'
      // eslint-disable-next-line no-console
      console[method]('[Socket]', ...args)
    }

    // 启动
    const start = async () => {
      if (connection.state !== 'Disconnected') return
      if (this.startCount)
        toast(
          `${Language._t(self.name)}：${Language._t(
            '连接已断开，重新连接中'
          )}...`,
          'warning',
          0
        )
      self.startCount += 1
      const first = this.startCount === 1

      // start
      connection
        .start()
        .then(() => {
          // 首次连接成功
          if (first) {
            toast(
              `${Language._t(self.name)}：${Language._t('连接成功')}`,
              'success',
              -1
            )
            resolve()
          }
          // 重新连接成功
          else {
            // 为什么会两次
            toast(
              `${Language._t(self.name)}：${Language._t('重新连接成功')}`,
              'success'
            )

            // 重新注册事件
            for (const [, callbackInfo] of this.callbackMap) {
              connection.invoke('on', callbackInfo)
            }
          }
        })
        .catch(() => {
          const delay = Math.min(this.startCount * 1000, 10_000)
          toast(
            `${Language._t(self.name)}：${Language._t('连接失败')}，${
              delay / 1000
            }${Language._t('s后重试')}`,
            'error',
            0
          )
          setTimeout(start, delay)
        })
    }

    connection.onclose(async () => {
      toast(
        `${Language._t(self.name)}：${Language._t('连接已断开')}`,
        'error',
        0
      )

      await start()
    })

    // 首次启动
    await start()

    return promise
  }
  static lockWS() {
    navigator.locks?.request('ws', { mode: 'shared' }, function () {
      // console.log('[locks]', ...arguments)
      return new Promise(() => {})
    })
  }
  static createConnection(url: string) {
    // 创建 socket
    // https://learn.microsoft.com/en-us/aspnet/core/signalr/javascript-client?view=aspnetcore-3.1&tabs=visual-studio
    const connection = new signalR.HubConnectionBuilder()
      // .withUrl(`http://127.0.0.1:18800/hubs/v1/variables`)
      .withUrl(`${baseURL}${url}`)
      .configureLogging(signalR.LogLevel.Information)
      .build()
    return connection
  }
}
