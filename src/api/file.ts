import sdk from 'sdk'
const { utils } = sdk
const { request } = utils
/**
 * 导入文件
 * @param filter 筛选
 * @returns
 */
export const importFileToService = (
  url: string,
  formData?: FormData
): Promise<{ items: any[]; totalCount: number }> => {
  return request.post(url, formData)
}

/**
 * 导出文件
 * @param filter 筛选
 * @returns
 */
/**
 * 导出
 * @param data
 * @returns
 */
export const exportFileToClient = (
  url: string,
  params: Record<string, any>
) => {
  const str = new URLSearchParams(
    params as unknown as URLSearchParams
  ).toString()
  const p = str ? `?${str}` : ''
  return request.get(url + p, {
    responseType: 'blob',
  })
}
