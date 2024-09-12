import sdk from 'sdk'
const { request } = sdk.utils

function getUnqualifiedlist(data: any) {
  const url = `api/v1/qualitymanagement/judgment/unqualifiedlist?BeginDate=${data.BeginDate}&EndDate=${data.EndDate}&SerialNumber=${data.SerialNumber}&ProductModel=${data.ProductModel}&OrderCode=${data.OrderCode}&SkipCount=${data.SkipCount}&MaxResultCount=${data.MaxResultCount}`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}

function getJudgmentList(data: any) {
  const url = `api/v1/qualitymanagement/judgment?BeginDate=${data.BeginDate}&EndDate=${data.EndDate}&IsQualified=${data.IsQualified}&ProductModel=${data.ProductModel}&OrderCode=${data.OrderCode}&JudgmentResult=${data.JudgmentResult}&SerialNumber=${data.SerialNumber}&SkipCount=${data.SkipCount}&MaxResultCount=${data.MaxResultCount}`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}
function submitunqualifiedreason(data: any) {
  const url = `api/v1/qualitymanagement/judgment/unqualifiedreason`
  const method = 'put'
  return import.meta.env.PROD
    ? sdk.request({ url, method, data })
    : request({ url, method, data })
}

//产品
function getproductList(data: any) {
  const url = `api/v1/messuite/query/product?filter=${data.filter}&hasFormula=${
    data.hasFormula || false
  }`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}
function getModelOptionsNew() {
  return request({
    url: `/api/v1/messuite/query/enumeration/ProductModel?prependAll=true`,
    method: 'get',
  })
}

/**获取不合格原因的列表.*/
function getallunqualifiedreason(data: any) {
  const url = `api/v1/qualitymanagement/judgment/allunqualifiedreason?Filter=${data.Filter}`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}

/**
 * 查询不合格产品-参数详情
 */
function Tracebycode(data: any) {
  const url = `api/v1/qualitymanagement/judgment/tracebycode?serialNumber=${data.serialNumber}`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}

function getJudgmentresulttype() {
  const url = `api/v1/qualitymanagement/judgment/judgmentresulttype`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}

function allunqualifiedreason(data: any) {
  const url = `api/v1/qualitymanagement/judgment/allunqualifiedreason?Filter=${data.Filter}&Sorting=${data.Sorting}`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}
/**获取判定详情.*/
function getJudgment(data: any) {
  const url = `/api/v1/qualitymanagement/judgment/${data.id}`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}
/**创建判定.*/
function createJudgment(data: any) {
  const url = `/api/v1/qualitymanagement/judgment`
  const method = 'post'
  return import.meta.env.PROD
    ? sdk.request({ url, method, data })
    : request({ url, method, data })
}
/**更新判定.*/
function updateJudgment(data: any) {
  const url = `/api/v1/qualitymanagement/judgment/${data.id}`
  const method = 'put'
  return import.meta.env.PROD
    ? sdk.request({ url, method, data })
    : request({ url, method, data })
}
/**导出判定.*/
function exportJudgment(data: any) {
  const url = `/api/v1/qualitymanagement/judgment/export?BeginDate=${data.BeginDate}&EndDate=${data.EndDate}&IsQualified=${data.IsQualified}&ProductModel=${data.ProductModel}&OrderCode=${data.OrderCode}&JudgmentResult=${data.JudgmentResult}&SerialNumber=${data.SerialNumber}`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method, responseType: 'blob' })
    : request({ url, method, responseType: 'blob' })
}
/**获取工艺路线*/
function getProcessroute(data: any) {
  const url = `/api/v1/messuite/query/processroutebyproductmodel?productModel=${data}&includeDetails=true&includeFormulaDetails=true`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}
/**获取NG工序中配置的不合格原因+设置中的不合格原因*/
function unqualifiedreasonbysectionid(data: any) {
  const url = `/api/v1/qualitymanagement/judgment/unqualifiedreasonbysectionid?sectionId=${data}`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}
/**业务设置*/
function getSetting(name: any) {
  const url = `/api/v1/settingmanagement/setting?namePrefix=${name}`
  const method = 'get'
  return import.meta.env.PROD
    ? sdk.request({ url, method })
    : request({ url, method })
}

export {
  getJudgmentList,
  submitunqualifiedreason,
  getproductList,
  getModelOptionsNew,
  getallunqualifiedreason,
  getUnqualifiedlist,
  Tracebycode,
  getJudgmentresulttype,
  allunqualifiedreason,
  getJudgment,
  createJudgment,
  updateJudgment,
  getProcessroute,
  exportJudgment,
  unqualifiedreasonbysectionid,
  getSetting,
}
