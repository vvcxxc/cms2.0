import sdk from 'sdk'
const { request } = sdk.utils

export const getListData = (params = {}, url: string) => {
  const query = new URLSearchParams(params).toString()
  const str = query ? `?${query}` : ''
  return request.get(url + str)
}

/**
 * 排序模版排序
 * @param body
 * @param urlTpl  /api/v1/processmanagement/worksection/{id}/adjustsort/{sort}
 * @returns
 */
export const adjustSort = (
  body: {
    id: string
    sort: number
  },
  urlTpl: string
) => {
  const url = urlTpl
    .replace('{id}', body.id)
    .replace('{sort}', String(body.sort))
  return request.put(url, body)
}
