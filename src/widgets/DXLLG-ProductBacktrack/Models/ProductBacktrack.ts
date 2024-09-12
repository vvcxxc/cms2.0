import { Base } from '@/libs/Base/Base'
import {
  getProductTrace,
  exportProductTrace,
  exportbarcode,
  importbarcode,
  exportinspectionreport,
  getField,
} from './Service/Service'

export class ProductBacktrack extends Base<{ [key: string]: any }> {
  constructor() {
    super({})
  }
  getProductTrace(data: any) {
    return getProductTrace(data)
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
  exportinspectionreport(data: any) {
    return exportinspectionreport(data)
  }
  getField(key: string) {
    return getField(key)
  }
}
