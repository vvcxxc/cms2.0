import { Base } from '@/libs/Base/Base'
export class Dialog extends Base<{ [key: string]: any }> {
  constructor() {
    super({
      data: [],
    })
  }
  onMounted() {
    this.getRelationFLow()
  }
  async getRelationFLow() {}
}
