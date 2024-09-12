import { Base } from '@/libs/Base/Base'
const request = Base.request

export const getCheckitemconfigAll = (data: any) => {
  return request.get(`/api/v1/checkitemconfig/all?filter=${data.filter}`)
}

export const getProductModels = (data: any) => {
  return request.get(`/api/v1/checkitemconfig/${data.id}/product-model/list`)
}

/**SPC分析配置获取 */
export const getSPCRunAnalysis = (data: any) => {
  return request.get(
    `/api/v1/spcrunanalysis/spc-run-analysis/get?checkItemConfigId=${data.checkItemConfigId}`
  )
}
/**样本数据详情获取 */
export const getSampleDataDetail = (data: any) => {
  return request.get(
    `/api/v1/spcrunanalysis/sample-data-detail/get?CheckItemConfigId=${data.checkItemConfigId}&runModes=${data.runModes}`
  )
}

export const exportSampleDataDetail = (data: any) => {
  return request.get(
    `/api/v1/spcrunanalysis/sample-data-detail/export?checkItemConfigId=${data.checkItemConfigId}&runModes=${data.runModes}`
  )
}

/**样本数据录入数据获取 */
export const getSampleDataEntry = (data: any) => {
  return request.get(
    `/api/v1/spcrunanalysis/sample-data-entry/get?CheckItemConfigId=${data.checkItemConfigId}`
  )
}
/**判异规则选择配置获取 */
export const getAnomalyRuleSelectConfig = (data: any) => {
  return request.get(
    `/api/v1/spcrunanalysis/anomaly-rule-select-config/get?checkItemConfigId=${data.checkItemConfigId}`
  )
}

/**能力分析配置(规则设置)获取 */
export const getAbilityAnalyzeConfig = (data: any) => {
  return request.get(
    `/api/v1/spcrunanalysis/ability-analyze-config/get?checkItemConfigId=${data.checkItemConfigId}`
  )
}

/**过程能力分析结果获取 */
export const getAbilityAnalyzeResult = (data: any) => {
  return request.get(
    `/api/v1/spcrunanalysis/ability-analyze-result/get?checkItemConfigId=${data.checkItemConfigId}`
  )
}

/**控制图分析结果获取 */
export const getControlChartAnalysisResult = (data: any) => {
  return request.get(
    `/api/v1/spcrunanalysis/control-chart-analysis-result/get?checkItemConfigId=${data.checkItemConfigId}`
  )
}
/**SPC分析配置保存 */
export const saveSPCRunAnalysis = (data: any) => {
  return request.post(`/api/v1/spcrunanalysis/spc-run-analysis/save`, data)
}
/**样本数据录入数据保存 */
export const saveSampleDataEntry = (data: any) => {
  return request.post(`/api/v1/spcrunanalysis/sample-data-entry/save`, data)
}
/**判异规则选择配置保存 */
export const saveAnomalyRuleSelectConfig = (data: any) => {
  return request.post(
    `/api/v1/spcrunanalysis/anomaly-rule-select-config/save`,
    data
  )
}
/**能力分析配置(规则设置)保存 */
export const saveAbilityAnalyzeConfig = (data: any) => {
  return request.post(
    `/api/v1/spcrunanalysis/ability-analyze-config/save`,
    data
  )
}

export const getRange = () => {
  return request.get(`/api/v1/basicruleconfig/monitoring-time-range/get`)
}
