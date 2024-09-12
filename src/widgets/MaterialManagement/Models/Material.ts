import { Base } from '@/libs/Base/Base'
import {
  createMaterial,
  createMaterialDetail,
  deleteMaterial,
  deleteMaterialDetail,
  exportMaterial,
  getMaterialById,
  getMaterialDetail,
  getMaterialTypes,
  importMaterial,
  updateMaterial,
  updateMaterialDetail,
  getFeeding,
  putFeeding,
  setvalues,
} from './Service/Service'
export class Material extends Base {
  constructor(props: any, state = {}) {
    super(state)
  }

  createMaterial(formData: any) {
    return createMaterial(formData)
  }

  updateMaterial(id: string, formData: any) {
    return updateMaterial(id, formData)
  }

  deleteMaterial(ids: string[]) {
    return deleteMaterial(ids)
  }

  importMaterial(formData: FormData) {
    return importMaterial(formData)
  }

  getMaterialTypes() {
    return getMaterialTypes()
  }

  exportMaterial() {
    return exportMaterial()
  }

  getMaterialDetail(materialId: string, params: any) {
    return getMaterialDetail(materialId, params)
  }

  createMaterialDetail(materialId: string, formData: any) {
    return createMaterialDetail(materialId, formData)
  }

  updateMaterialDetail(
    materialId: string,
    materialDetailId: string,
    formData: any
  ) {
    return updateMaterialDetail(materialId, materialDetailId, formData)
  }
  deleteMaterialDetail(materialId: string, ids: string[]) {
    return deleteMaterialDetail(materialId, ids)
  }
  getMaterialById(id: string) {
    return getMaterialById(id)
  }
  getFeeding() {
    return getFeeding()
  }
  putFeeding(data: any) {
    return putFeeding(data)
  }
  setvalues(data: any) {
    return setvalues(data)
  }
}
