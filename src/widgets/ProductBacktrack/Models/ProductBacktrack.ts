import { Base } from '@/libs/Base/Base'
import {
  getProductTrace,
  reupLoadMes,
  exportProductTrace,
  exportbarcode,
  importbarcode,
} from './Service/Service'

export class ProductBacktrack extends Base<{ [key: string]: any }> {
  constructor() {
    super({})
  }
  getProductTrace(data: any) {
    return getProductTrace(data)
  }
  reupLoadMes(data: any) {
    return reupLoadMes(data)
  }
  exportProductTrace(data: any) {
    return exportProductTrace(data)
  }
  exportbarcode(data: any) {
    return exportbarcode(data)
  }
  importbarcode(data: any) {
    return importbarcode(data)
  }
}
