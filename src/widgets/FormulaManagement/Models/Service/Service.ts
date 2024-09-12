import { Base } from '@/libs/Base/Base'
const request = Base.request

/**
 * 创建配方
 * @returns
 */
export const createFormula = (data: any) => {
  return request.post('/api/v1/formulamanagement/formula', data)
}

// 获取配方列表
export const getFormulaList = (data: any) => {
  const str = new URLSearchParams(data).toString()
  return request.get('/api/v1/formulamanagement/formula?' + str)
}

// 创建副本
export const copyFormula = (data: any) => {
  return request.post('/api/v1/formulamanagement/formula/copy', data)
}

// 更新
export const updateFormula = (id: string, formData: any) => {
  return request.put(`/api/v1/formulamanagement/formula/${id}`, formData)
}

// 删除
export const deleteFormula = (data: string[]) => {
  console.log(data)
  const url = `/api/v1/formulamanagement/formula`
  const method = 'DELETE'
  return request({ url, method, data })
}

// 是否可以删除
export const candeleteFormula = (data: string[]) => {
  console.log(data)
  const ids = data.map((item)=>{
    return `ids=${item}`
  }).join('&')
  const url = `/api/v1/formulamanagement/formula/candelete?${ids}`
  const method = 'GET'
  return request({ url, method })
}

// 获取副本的信息
export const nextCopyInfo = (formulaId: string) => {
  const url = `/api/v1/formulamanagement/formula/nextcopy?formulaId=${formulaId}`
  const method = 'GET'
  return request({ url, method })
}

// 批量保存配方版本
export const saveVersionBatch = (data: any) => {
  const url = `/api/v1/formulamanagement/formulaversion/save`
  const method = 'POST'
  return request({ url, method, data })
}

// 批量保存配方版本
export const saveVersion = (id: string, data: any) => {
  const url = `/api/v1/formulamanagement/formulaversion/${id}`
  const method = 'PUT'
  return request({ url, method, data })
}

// 工序的信息
export const getWorksectionInfo = (
  worksectionId: string,
  includeDetails: boolean
) => {
  const url = `/api/v1/messuite/query/worksection/${worksectionId}?includeDetails=${includeDetails}`
  const method = 'GET'
  return request({ url, method })
}

// 获取版本列表，包括参数等
export const getFormulaversion = (filter: any) => {
  const str = new URLSearchParams(filter).toString()
  const url = `/api/v1/formulamanagement/formulaversion?${str}`
  const method = 'GET'
  return request({ url, method })
}

// 导入配方
export const importFormula = (data: FormData) => {
  const url = `/api/v1/formulamanagement/formula/import`
  const method = 'POST'
  return request({ url, method, data })
}

// 导出配方
export const exportFormula = () => {
  return request.get(`/api/v1/formulamanagement/formula/export`, {
    responseType: 'blob',
  })
}

// 导出日志
export const exportLog = (data: any) => {
  const str = new URLSearchParams(data).toString()
  return request.get(`/api/v1/formulamanagement/formulalog/export?${str}`, {
    responseType: 'blob',
  })
}

export const createApply = (data: any) => {
  const url = `/api/v1/formulamanagement/formula/apply`
  const method = 'PUT'
  return request({ url, method, data })
}

// 获取产品列表
export const getProductList = (filter: any)=> {
  const str = new URLSearchParams(filter as unknown as URLSearchParams).toString()  
  return request.get(`/api/v1/productmanagement/product?`+ str,)
}
