//下载
export const download = (file: any, fileName: string) => {
  const blob = new Blob([file])
  // 兼容不同浏览器的URL对象
  const url: any = window.URL || window.webkitURL
  // 创建下载链接
  const downloadHref = url.createObjectURL(blob)
  // 创建a标签并为其添加属性
  const downloadLink = document.createElement('a')
  downloadLink.href = downloadHref
  downloadLink.download = fileName
  // 触发点击事件执行下载
  downloadLink.click()
  window.URL.revokeObjectURL(url)
}
