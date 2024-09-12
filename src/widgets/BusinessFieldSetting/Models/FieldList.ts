import { Base } from '@/libs/Base/Base'
import { getField, updateField } from './Service/Service'

export class FieldList extends Base<{ [key: string]: any }> {
  constructor() {
    super({
      dataSource: [],
      key: 'SCMS.AppSettings.BusinessFiled',
    })
  }

  /**
   * 获取初始化字段列表
   */
  async getList() {
    const res = await getField()
    try {
      const data = res.settings.find((item: any) => {
        return item.name === this.key.value
      })?.value
      this.dataSource.value = JSON.parse(data)
    } catch (error) {
      this.dataSource.value = []
    }
    return this.dataSource.value
  }
  /**
   * 更新业务字段
   */
  async updateFields(fieldData?: any[]) {
    const data = {
      settings: [
        {
          name: this.key.value,
          value: JSON.stringify(fieldData ? fieldData : this.dataSource.value),
        },
      ],
    }
    await updateField(data)
  }
}
