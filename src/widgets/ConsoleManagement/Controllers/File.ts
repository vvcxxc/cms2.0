import { importFileToService, exportFileToClient } from '@/api/file'
import { ElMessage } from 'element-plus'
import { downloadFile } from '@/utils'
import dayjs from 'dayjs'
import { _t } from '../app'

export const useFile = () => {
  /**
   * 导入文件
   * @param url
   */
  const importFile = async (url: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    await importFileToService(url, formData)
    ElMessage(_t('导入成功'))
  }
  /**
   * 导出文件
   * @param url
   */
  const exportFile = async (url: string, params: any, name: string) => {
    const res = await exportFileToClient(url, params)
    const cname = name.includes('.')
      ? name
      : `${name}_${dayjs().format('YYYYMMDDHHMMss')}.xlsx`
    downloadFile(res, cname)
    ElMessage.success(_t('导出成功'))
  }

  return {
    importFile,
    exportFile,
  }
}
