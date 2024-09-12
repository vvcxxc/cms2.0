//@ts-nocheck
export class Client {
  isClient() {
    return !!window.bridge?.electron
  }
  /**
   * 调用客户端主进程
   *
   * @example
   * // 最小化
   * invoke(function({ electron }, a, b){
   *   const { BrowserWindow } = electron
   *   BrowserWindow.getFocusedWindow()?.minimize()
   * }, 'a', 'b')
   *
   * @param fn 上下文独立，不可引用外部变量
   * @returns
   */
  async invoke(
    ...args: Parameters<NonNullable<typeof window.bridge>['invoke']>
  ) {
    if (!window.bridge) {
      throw new Error('!bridge')
    }
    return await window.bridge.invoke(...args)
  }
}
export class Download {
  /**
   * 下载文件
   * @param data
   * @param name
   * @param mediaType
   */
  file(data: any, name: string, mediaType?: string) {
    const client = new Client()
    // 客戶端默认保存类型错误，重新设置
    if (client.isClient()) {
      let arr = name.split('.')
      let fileType = arr[arr.length - 1]
      client.invoke(({ electron }, fileType) => {
        const { BrowserWindow, downloadItem } = electron
        const win = BrowserWindow.getFocusedWindow()

        win.webContents.session.on(
          'will-download',
          (event: Event, item: typeof downloadItem) => {
            item.setSaveDialogOptions({
              filters: [{ name: `${fileType} File`, extensions: [fileType] }],
            })
            //...
          }
        )
      }, fileType)
    }

    const blob = new Blob([data], { type: mediaType })
    // 创建下载链接
    const downloadHref = URL.createObjectURL(blob)
    // 创建a标签并为其添加属性
    const downloadLink = document.createElement('a')
    downloadLink.href = downloadHref
    downloadLink.download = name
    // 触发点击事件执行下载
    downloadLink.click()
    URL.revokeObjectURL(downloadHref)
  }
}
