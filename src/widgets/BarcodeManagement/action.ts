import sdk from 'sdk'
import { entity } from './components/state'
const { request } = sdk.utils
import { ElMessage } from 'element-plus'

export function message(msg: string, type = 'success') {
  ElMessage[type](msg)
}

/**
 * 获取条码数据
 */
export const getBarCodeList = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  const str = query ? `?${query}` : ''
  return request.get('/api/v1/barcodemanagement/barcode' + str)
}

/**
 * 获取关联字段列表
 */
export const getRelationList = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  const str = query ? `?${query}` : ''
  return request.get(
    '/api/v1/barcodemanagement/barcode/GetAssociatedFieldsList' + str
  )
}
// 条码规则
export const getBarList = () => {
  return request.get('/api/v1/barcodemanagement/barcode/GetBarcodeRule')
}

export const getBarDetail = (current: any) => {
  return request.get(`/api/v1/barcodemanagement/barcode/${current.id}`)
}
// 字段类型
export const getFieldList = () => {
  return request.get('/api/v1/barcodemanagement/barcode/GetFieldType')
}

// 自增数字类型
export const getAutoIncrementList = () => {
  return request.get('/api/v1/barcodemanagement/barcode/GetAutoincrementType')
}

// 获取关联数据及业务对象
export const getBarcodeManagement = (params: any) => {
  const query = new URLSearchParams(params).toString()
  const str = query ? `?${query}` : ''
  return request.get(
    '/api/v1/barcodemanagement/barcode/GetFieldTypeDetail/' + str
  )
}

// 修改数据
export const setData = (current: any, form: any, details: any) => {

  const data = {
    ...current,
    ...form,
  }

  
  delete data._X_ROW_KEY
  data.barcodeGenerationDetails = details.map((item: any, index: number) => ({
    id: item.id,
    variableId: item.varId ?? item.variableId ??  undefined,
    variableName: item.varName ?? item.variableName ?? undefined,
    barcodeAnalysisId: item.barcodeAnalysisId ?? undefined,
    barcodeAnalysisName: item.barcodeAnalysisName ?? undefined,
    businessFieldId: item.businessFieldId ?? undefined,
    timeFormatType: item.format ?? undefined,
    generationType: item.type,
    businessFieldCode:item.businessFieldCode,
    autoIncrementType: item.autoIncrementType ?? undefined, // 默认值为null，传null后端报错
    carrySystemType: item.carrySystemType ?? undefined,
    demo: item.content,
    name: item.name,
    sort: index + 1,
  }))
  return request.put(`/api/v1/barcodemanagement/barcodegeneration/${current.id}`, data)
}

// 新增数据
export const addData = (form: any, details: any) => {
  console.log(form , details, '--11' );
  
  const data = {
    ...form,
  }

  data.barcodeGenerationDetails = details.map((item: any, index: number) => ({
    // ...entity,
    // ...item,
    variableId: item.varId ?? undefined,
    variableName: item.varName ?? undefined,
    barcodeAnalysisId: item.barcodeAnalysisId ?? undefined,
    barcodeAnalysisName: item.barcodeAnalysisName ?? undefined,
    businessFieldId: item.businessFieldId ?? undefined,
    timeFormatType: item.format ?? undefined,
    generationType: item.type,
    businessFieldCode:item.businessFieldCode,
    autoIncrementType: item.autoIncrementType ?? undefined,
    carrySystemType: item.carrySystemType ?? undefined,
    demo: item.content,
    name: item.name,
    sort: index + 1,
  }))
  return request.post('/api/v1/barcodemanagement/barcodegeneration', data)
}

// 删除
export const deleteData = (ids: string[]) => {
  const url = '/api/v1/barcodemanagement/barcodegeneration'
  const method = 'DELETE'
  return request({ url, method, data:ids })
}

// begin--------------条码解析--------------
/**
 * 条码解析-条码解析接口
 * @param CodeDemo
 * @param BarcodeAnalysisId
 * */
export const AnalysisList = (data: any) => {
  console.log(data, '----data');
  
  let url = `/api/v1/barcodemanagement/barcodeanalysis/analysis?CodeDemo=${data.codeDemo}&Type=${data.type}`
  switch (data.type) {
    case 0:
      url += `&Symbol=${data.symbol}`
      break
    case 1:
      url += `&StartSymbol=${data.startSymbol}&EndSymbol=${data.endSymbol}`
      break
    case 2:
      url += `&FixedLength=${data.fixedLength}`
      break
  }
  return request.get(url)
}

/**
 * 条码解析-修改接口
 * */
export const setBarcodeAnalysis = (current: any, form: any, details: any) => {
  const data = {
    ...current,
    ...form,
  }
  delete data._X_ROW_KEY
  data.barcodeAnalysisDetails = details.map((item: any, index: number) => ({
    ...entity,
    ...item,
    sort: index,
  }))
  return request.put(
    `/api/v1/barcodemanagement/barcodeanalysis/${current.id}`,
    data
  )
}
/**
 * 条码解析-新增接口
 * */
export const addBarcodeAnalysis = (form: any, details: any) => {
  const data = {
    ...form,
  }

  data.barcodeAnalysisDetails = details.map((item: any, index: number) => ({
    ...entity,
    ...item,
    sort: index,
  }))
  return request.post('/api/v1/barcodemanagement/barcodeanalysis', data)
}
/**
 * 删除
 * */
export const deleteBarcodeAnalysis = (ids: string[]) => {
  const url = '/api/v1/barcodemanagement/barcodeanalysis'
  const method = 'DELETE'
  return request({ url, method, data:ids })
}
/**
 * 获取
 */
export const getBarcodeAnalysis = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  const str = query ? `?${query}` : ''
  return request.get('/api/v1/barcodemanagement/barcodeanalysis' + str)
}
/**
 * 自增数字下拉框接口
 * */
export const GetDecimalSystem = () => {
  return request.get(`/api/v1/barcodemanagement/barcode/GetDecimalSystem`)
}
/**
 * 字段类型含规则解析接口
 * */
export const getanalysisfieldtype = () => {
  return request.get(`/api/v1/barcodemanagement/barcode/getanalysisfieldtype`)
}
// end  --------------条码解析--------------

// 获取业务配置
export const getField = () => {
  return request.get(
    `/api/v1/settingmanagement/setting/G?namePrefix=SCMS.AppSettings.BusinessFiled`
  )
}

// 新建条码校验规则
export const addBarcodeverification= (data: any) => {
  return request.post('/api/v1/barcodemanagement/barcodeverification', data)
}

// 修改条码校验规则
export const setBarcodeverification= (id: string, data: any) => {
  return request.put('/api/v1/barcodemanagement/barcodeverification/' + id, data)
}


// 删除条码校验规则
export const deleteBarcodeverification = (ids: string[]) => {
  const url = '/api/v1/barcodemanagement/barcodeverification'
  const method = 'DELETE'
  return request({ url, method, data:ids })
}
