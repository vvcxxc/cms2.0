import { Base } from '@/libs/Base/Base'
import { onMounted } from 'vue'
import {
  delProduct,
  exportProduct,
  getProductList,
  getUseStatus,
  importProduct,
  postProduct,
  putProduct,
  getProductex,
  saveProductex,
} from './Service/Service'
import { ProductFilter, ProductFormType } from '../type/Product'
export class Product extends Base {
  constructor(props: any, state = {}) {
    super(state)
  }

  createProduct(formData: ProductFormType) {
    return postProduct(formData)
  }

  getUseStatus(id: string) {
    return getUseStatus(id)
  }

  updateProduct(id: string, formData: ProductFormType) {
    return putProduct(id, formData)
  }

  deleteProduct(ids: string[]) {
    return delProduct(ids)
  }

  importProduct(formData: FormData) {
    return importProduct(formData)
  }

  exportProduct(filter: string) {
    return exportProduct(filter)
  }
  getProductex() {
    return getProductex()
  }
  saveProductex(data: any) {
    return saveProductex(data)
  }
}
