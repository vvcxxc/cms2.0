import { Base } from '@/libs/Base/Base'
import { onMounted } from 'vue'
import { updateSetting } from './Service/Service'
import { ConfigureCodeMap } from '@/widgets/SystemManagement/enum'
import { ConfigureCodeType } from '@/widgets/SystemManagement/type/Configure'

export class ProcessSetting extends Base<{ [key: string]: any }> {
  constructor() {
    super({})
  }
  /**
   * 保存工序设置
   * @param data
   */
  saveWorkSection(data: {
    AbnormalCauseConfig: any[]
    EntryResultConfig: any[]
    MaterialAssociationConfig: any[]
  }) {
    const settings: any = {
      settings: [
        {
          name: ConfigureCodeMap.MaterialAssociationConfig,
          value: JSON.stringify(data.MaterialAssociationConfig),
        },
        {
          name: ConfigureCodeMap.AbnormalCauseConfig,
          value: JSON.stringify(data.AbnormalCauseConfig),
        },
        {
          name: ConfigureCodeMap.EntryResultConfig,
          value: JSON.stringify(data.EntryResultConfig),
        },
      ],
    }
    return updateSetting(settings)
  }
}
