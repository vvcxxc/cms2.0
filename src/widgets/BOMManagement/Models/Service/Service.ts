import { Base } from '@/libs/Base/Base'
const request = Base.request


export const getBillofMaterial = (productId: string, params: any)=> {  
  const str = new URLSearchParams(params).toString()
  return request.get(`/api/v1/materialmanagement/billofmaterial/${productId}?${str}`)
}


// 添加
export const createBillofMaterial = (productId: string, formData: any)=> {  
  return request.post(`/api/v1/materialmanagement/billofmaterial/${productId}`,formData)
}


// 更新详情
export const updateBillofMaterial = (productId: string, materialId: string, formData: any)=> {
  return request.put(`/api/v1/materialmanagement/billofmaterial/${productId}/${materialId}`,formData)
}

// 更新BOM名称
export const updateBillofName = (productId: string, formData: any)=> {
  return request.put(`/api/v1/materialmanagement/billofmaterial/${productId}`,formData)
}

// 获取物料列表
export const getMaterialList = (params: any)=> {
  const str = new URLSearchParams(params).toString()
  const url = `/api/v1/materialmanagement/material?`+ str
  const method = 'GET'
  return request({ url, method })
}


export const queryProcessroutes = (productId: string) => {
  return request.get(
    `/api/v1/messuite/query/processroutes?SkipCount=0&MaxResultCount=999&productId=${productId}&includeDetails=false`
  )
}

// 删除
export const deleteBillofMaterial = (productId: string, data: string[])=> {
  console.log(data);
  const url = `/api/v1/materialmanagement/billofmaterial/${productId}`
  const method = 'DELETE'
  return request({ url, method, data })
}




// 导入
export const importBillofMaterial = (data:FormData)=> {  
  const url = `/api/v1/materialmanagement/billofmaterial/import`
  const method = 'PUT'
  return request({ url, method, data })
}



// 导出
export const exportBillofMaterial = ()=> {  
  return request.get(`/api/v1/materialmanagement/billofmaterial/export`, {
    responseType: 'blob'
  })
}

