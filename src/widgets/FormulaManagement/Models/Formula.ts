import { Base } from '@/libs/Base/Base'
import {
  createFormula,
  copyFormula,
  nextCopyInfo,
  updateFormula,
  saveVersionBatch,
  getFormulaversion,
  getWorksectionInfo,
  saveVersion,
  exportLog,
  exportFormula,
  deleteFormula,
  candeleteFormula,
  importFormula,
  getProductList,
} from './Service/Service'

export class Formula extends Base<{ [key: string]: any }> {
  constructor() {
    super({
      tableRef: null,
    })
  }

  /**
   * 删除工序
   * @param id
   * @returns
   */
  createFormula(data: any) {
    return createFormula(data)
  }

  copyFormula(data: any) {
    return copyFormula(data)
  }

  updateFormula(id: string, formData: any) {
    return updateFormula(id, formData)
  }

  getCopyInfo(formulaId: string) {
    return nextCopyInfo(formulaId)
  }

  saveVersionBatch(data: any) {
    return saveVersionBatch(data)
  }

  saveVersion(id: string, data: any) {
    return saveVersion(id, data)
  }

  getFormulaversion(filter: any) {
    return getFormulaversion(filter)
  }

  getWorksectionInfo(worksectionId: string, includeDetails: boolean) {
    return getWorksectionInfo(worksectionId, includeDetails)
  }

  importFormula(formData: FormData) {
    return importFormula(formData)
  }

  exportLog(data: any) {
    return exportLog(data)
  }

  deleteFormula(ids: string[]) {
    return deleteFormula(ids)
  }

  candeleteFormula(ids: string[]) {
    return candeleteFormula(ids)
  }

  exportFormula() {
    return exportFormula()
  }

  getProductList(parmas: any) {
    return getProductList(parmas)
  }

  //  getRelationList() {}
}
