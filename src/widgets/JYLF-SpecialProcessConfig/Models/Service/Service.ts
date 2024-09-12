import { Base } from '@/libs/Base/Base'
const request = Base.request

export const getWorkSectionSpecial = (id: number) => {
  return request.get(
    `/api/v1/jieyunlangfang/worksection2special/get?workSectionId=${id}`
  )
}

/**
 * 更新特殊工序
 * @returns
 */
export const updateWorkSectionSpecial = (id: number, data: any) => {
  return request.put(`/api/v1/jieyunlangfang/worksection2special/${id}`, data)
}
export const updateByFormula = (data: any) => {
  return request.put(
    `/api/v1/jieyunlangfang/worksection2special/update/by/formula`,
    data
  )
}

export const deleteSectionSpecial = (id: number) => {
  return request.delete(
    `/api/v1/jieyunlangfang/worksection2special/by/section/delete?workSectionId=${id}`
  )
}
export const deleteSectionSpecialParams = (id: number) => {
  return request.delete(
    `/api/v1/jieyunlangfang/worksection2special/by/formula/delete?workSectionId=${id}`
  )
}

/**
 * 更新特殊工位
 * @returns
 */
export const updateWorkStationSpecial = (id: number, data: any) => {
  return request.put(`/api/v1/jieyunlangfang/workstation2special/${id}`, data)
}

export const getSectionSpecial = (id: string) => {
  return request.get(
    `/api/v1/jieyunlangfang/workstation2special/get?workStationId=${id}`
  )
}

export const putLeakagetester = (data: any) => {
  return request.put(
    `/api/v1/jieyunlangfang/workstation2special/edit/leakagetester`,
    data
  )
}
export const deleteLeakagetester = (id: number) => {
  return request.delete(
    `/api/v1/jieyunlangfang/workstation2special/delete/leakagetester?workStationId=${id}`
  )
}

export const putPrint = (data: any) => {
  return request.put(
    `/api/v1/jieyunlangfang/workstation2special/edit/print`,
    data
  )
}
export const deletePrint = (id: number) => {
  return request.delete(
    `/api/v1/jieyunlangfang/workstation2special/delete/print?workStationId=${id}`
  )
}

export const putLasercoding = (data: any) => {
  return request.put(
    `/api/v1/jieyunlangfang/workstation2special/edit/lasercoding`,
    data
  )
}
export const deleteLasercoding = (id: number) => {
  return request.delete(
    `/api/v1/jieyunlangfang/workstation2special/delete/lasercoding?workStationId=${id}`
  )
}
