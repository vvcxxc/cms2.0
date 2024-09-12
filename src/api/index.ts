import sdk from 'sdk'
import { ElMessage } from 'element-plus'
const { request } = sdk.utils

function getProject(tree: any[]) {
  // 方便调试
  const projectId = import.meta.env.VITE_APP_PROJECT_ID
  const target = tree.find((e: any) => e.id == projectId)
  if (target) return target
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i]
    if (item.type == 0) {
      if (item.child && item.child.length) {
        return getProject(item.child)
      }
    } else {
      return item
    }
  }
}

const projectInfo = async (id: string | number = 0) => {
  const info: Record<string, any> = await request.get(
    `/api/v1/project/${id}/info`
  )
  sessionStorage.setItem('X-Project', info.identifier)
  sessionStorage.setItem('X-Project-Name', info.name)
}

export const setXProject = async () => {
  try {
    const tree: any = await request.get('/api/v1/project/node/tree')
    if (tree.length) {
      const project = getProject(tree)
      await projectInfo(project.id)
      return Promise.resolve()
    } else {
      await projectInfo()
      return Promise.resolve()
    }
  } catch (error) {
    console.error(error)
  }
}

export const postImport = (file: FormData) => {
  return request({
    url: `/api/v1/zc/productsop/uploadsop`,
    method: 'post',
    contentType: 'multipart/form-data',
    headers: { accept: '*/*' },
    data: file,
  })
}

//产品
function getproductList(data: any, hasFormula: boolean = true) {
  const url = `api/v1/messuite/query/product?filter=${data.filter}&hasFormula=${hasFormula}`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}

// 工序列表
function getWorksectionList(data: any) {
  const url = `api/v1/messuite/query/worksection?filter=${data.filter}&abilityType=${data.abilityType}&includeDetails=${data.includeDetails}`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}

function getTableheader(data: any) {
  const url = `api/v1/tracemanagement/trace/tableheader?productId=${data.productId}`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}

function getTablelayout(data: any) {
  const url = `api/v1/tracemanagement/trace/tablelayout?productId=${
    data.productId
  }&tableId=${data.tableId}&isSummary=${data.isSummary}&onlyIncludeParameter=${
    data.onlyIncludeParameter || false
  }`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}

function getTraceList(data: any) {
  const url = `api/v1/tracemanagement/trace?SerialNumber=${
    data.SerialNumber
  }&SearchMode=${data.SearchMode}&From=${data.From}&To=${data.To}&IsQualified=${
    data.IsQualified
  }&TableId=${data.TableId}&IsSummary=${data.IsSummary}&SkipCount=${
    data.SkipCount
  }&MaxResultCount=${data.MaxResultCount}&ProductModel=${
    data.ProductModel
  }&Updatecode=${data.Updatecode}&MaterialCode=${data.MaterialCode}&OrderCode=${
    data.OrderCode
  }&IsAsc=${data.IsAsc || false}`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}

function getCurve(data: any) {
  const url = `api/v1/tracemanagement/trace/curve?WorkSectionId=${data.WorkSectionId}&ParamId=${data.ParamId}&From=${data.From}&To=${data.To}&ProductModel=${data.ProductModel}`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}

function getStatistics(data: any) {
  const url = `api/v1/tracemanagement/trace/statistics?SerialNumber=${data.SerialNumber}&SearchMode=${data.SearchMode}&From=${data.From}&To=${data.To}&IsQualified=${data.IsQualified}&TableId=${data.TableId}&IsSummary=${data.IsSummary}&ProductModel=${data.ProductModel}&Updatecode=${data.Updatecode}&MaterialCode=${data.MaterialCode}&OrderCode=${data.OrderCode}`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}

function getSetting(data: any) {
  // const url = `api/v1/settingmanagement/setting?namePrefix=${data.namePrefix}`
  const url = `api/v1/settingmanagement/setting/G?namePrefix=${data.namePrefix}`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}
function saveSetting(data: any, providerKey?: string) {
  // const url = `api/v1/settingmanagement/setting`
  let _providerKey = providerKey ? `?providerKey=${providerKey}` : ''
  const url = `api/v1/settingmanagement/setting/G${_providerKey}`
  const method = 'post'
  return import.meta.env.PROD
    ? sdk.request({ url, method, data })
    : request({ url, method, data })
}

function getTraceproductmodelconfig(data: any) {
  const url = `api/v1/tracemanagement/traceproductmodelconfig?ProductId=${
    data.ProductId
  }&GetIfEmppty=${data.GetIfEmppty || false}&Filter=${data.Filter || ''}`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}

function getTracesummarytable(data: any) {
  const url = `api/v1/tracemanagement/tracesummarytable?Filter=${data.Filter}&ProductId=${data.ProductId}&includeAll=true`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}

function creatTracesummarytable(data: any) {
  const url = `api/v1/tracemanagement/tracesummarytable`
  const method = 'post'
  return import.meta.env.PROD
    ? sdk.request({ url, method, data })
    : request({ url, method, data })
}

function updateTracesummarytable(data: any) {
  const url = `api/v1/tracemanagement/tracesummarytable/${data.id}`
  const method = 'put'
  return import.meta.env.PROD
    ? sdk.request({ url, method, data })
    : request({ url, method, data })
}

function delTracesummarytable(data: any) {
  const url = `api/v1/tracemanagement/tracesummarytable`
  const method = 'delete'
  return import.meta.env.PROD
    ? sdk.request({ url, method, data })
    : request({ url, method, data })
}

function getProcessroutebyproductmodel(data: any) {
  const url = `api/v1/messuite/query/processroutebyproductmodel?productModel=${
    data.productModel || ''
  }&includeDetails=${data.includeDetails || true}&includeFormulaDetails=${
    data.includeFormulaDetails || true
  }`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}

function getProcessroute(data: any) {
  const url = `api/v1/messuite/query/processroutes?productId=${
    data.productId || ''
  }&includeDetails=${data.includeDetails || true}&includeFormulaDetails=${
    data.includeFormulaDetails || true
  }`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}

function traceproductmodelconfig(data: any) {
  const url = `api/v1/tracemanagement/traceproductmodelconfig`
  const method = 'put'
  return import.meta.env.PROD
    ? sdk.request({ url, method, data })
    : request({ url, method, data })
}

function exportTrace(data: any) {
  const url = `api/v1/tracemanagement/trace/export?SerialNumber=${data.SerialNumber}&SearchMode=${data.SearchMode}&ProductModel=${data.ProductModel}&From=${data.From}&To=${data.To}&IsQualified=${data.IsQualified}&TableId=${data.TableId}&IsSummary=${data.IsSummary}&Updatecode=${data.Updatecode}&MaterialCode=${data.MaterialCode}&OrderCode=${data.OrderCode}`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method, data, responseType: 'blob' })
    : request({ url, method, data, responseType: 'blob' })
}

function saveTraceBackFieldWidth(data: any, tableName: string) {
  const url = `/api/v1/messuite/setting/SCMS.TraceManagement.TraceTableSettings/${tableName}`
  const method = 'post'
  return sdk.request({ url, method, data })
}

export {
  getproductList,
  getWorksectionList,
  getTraceList,
  getSetting,
  getTraceproductmodelconfig,
  saveSetting,
  getTracesummarytable,
  delTracesummarytable,
  creatTracesummarytable,
  getProcessroutebyproductmodel,
  getProcessroute,
  updateTracesummarytable,
  getTableheader,
  getTablelayout,
  getCurve,
  getStatistics,
  traceproductmodelconfig,
  exportTrace,
  saveTraceBackFieldWidth,
}
