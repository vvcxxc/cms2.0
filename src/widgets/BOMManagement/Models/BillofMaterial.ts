import { Base } from '@/libs/Base/Base'
import {
  createBillofMaterial,
  deleteBillofMaterial,
  exportBillofMaterial,
  getBillofMaterial,
  getMaterialList,
  importBillofMaterial,
  queryProcessroutes,
  updateBillofMaterial,
  updateBillofName,
} from './Service/Service'
export class BillofMaterial extends Base {
  constructor(props: any, state = {}) {
    super(state)
  }

  getMaterialList(params: any) {
    return getMaterialList(params)
  }

  getBillofMaterial(productId: string, params: any) {
    return getBillofMaterial(productId, params)
  }

  createBillofMaterial(productId: string, formData: any) {
    return createBillofMaterial(productId, formData)
  }

  updateBillofMaterial(productId: string, materialId: string, formData: any) {
    return updateBillofMaterial(productId, materialId, formData)
  }

  updateBillofName(productId: string, formData: any) {
    return updateBillofName(productId, formData)
  }

  deleteBillofMaterial(productId: string, ids: string[]) {
    return deleteBillofMaterial(productId, ids)
  }

  importBillofMaterial(formData: FormData) {
    return importBillofMaterial(formData)
  }


  queryProcessroutes(productId: string) {
    return queryProcessroutes(productId)
  }

  exportBillofMaterial() {
    return exportBillofMaterial()
  }
}
