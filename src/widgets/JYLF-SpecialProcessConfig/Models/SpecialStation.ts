import { Base } from '@/libs/Base/Base'
import {
  updateWorkStationSpecial,
  getSectionSpecial,
  putLeakagetester,
  putPrint,
  putLasercoding,
  deleteLasercoding,
  deletePrint,
  deleteLeakagetester,
} from './Service/Service'

export class SpecialStation extends Base<{ [key: string]: any }> {
  constructor() {
    super({
      data: [],
    })
  }
  updateWorkStationSpecial(id: number, data: any) {
    return updateWorkStationSpecial(id, data)
  }

  getSectionSpecial(id: string) {
    return getSectionSpecial(id)
  }

  putLeakagetester(data: any) {
    return putLeakagetester(data)
  }

  putPrint(data: any) {
    return putPrint(data)
  }

  putLasercoding(data: any) {
    return putLasercoding(data)
  }
  deleteLasercoding(id: number) {
    return deleteLasercoding(id)
  }

  deletePrint(id: number) {
    return deletePrint(id)
  }

  deleteLeakagetester(id: number) {
    return deleteLeakagetester(id)
  }
}
