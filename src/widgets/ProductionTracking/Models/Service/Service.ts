import { Base } from '@/libs/Base/Base'
const request = Base.request

const getQuery = (data: Record<string, any>) => {
  let query = new URLSearchParams(data).toString()
  return query ? `?${query}` : ''
}

/**
 * 获取追溯报表的布局信息
 * @param params
 */
export const getTableLayout = (params: {
  productId: string
  tableId: string
}) => {
  if (params.productId === 'all') {
    params.productId = ''
  }
  const query = getQuery(params)
  return request.get(`/api/v1/tracemanagement/trace/tablelayout${query}`)
}

/**
 * 获取产品列表
 */
export const getProductList = () => {
  return request.get(`/api/v1/messuite/query/product`)
}

/**
 * 获取工序列表
 */
export const getSectionList = (id: string) => {
  const query = id === 'all' ? '' : `?productId=${id}`
  return request.get(`/api/v1/tracemanagement/trace/tableheader${query}`)
}
