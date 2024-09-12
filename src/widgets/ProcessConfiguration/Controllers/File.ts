import { importFileToService, exportFileToClient } from '@/api/file'
import { ElMessage } from 'element-plus'

export const useFile = () => {
  /**
   * 导入文件
   * @param url
   */
  const importFile = async (url: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    await importFileToService(url, formData)
    ElMessage('导入成功')
  }
  /**
   * 导出文件
   * @param url
   */
  const exportFile = async (url: string, params: any) => {
    const str = new URLSearchParams(
      params as unknown as URLSearchParams
    ).toString()
    window.open(url + '?' + str)
  }

  return {
    importFile,
    exportFile,
  }
}
