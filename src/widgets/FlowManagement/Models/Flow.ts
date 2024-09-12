import { Base } from '@/libs/Base/Base'
import { onMounted } from 'vue'
import {} from './Service/Service'

export class Flow extends Base<{ [key: string]: any }> {
  constructor() {
    super({
      data: [],
    })
  }
  onMounted() {}
}
