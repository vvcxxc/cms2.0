import { defineComponent, SetupContext, ref, provide } from 'vue'
import styles from './ProductionExport.module.scss'
import { useConfigure } from '@/widgets/SystemManagement/Controllers/Configure'
import { _t, LanguageScopeKey } from '../../../../app'
export default defineComponent({
  name: '生产报表导出设置',
  emits: ['save'],
  setup(props, ctx: SetupContext) {
    provide(LanguageScopeKey, LanguageScopeKey)
    const { formData }: any = useConfigure(props, ctx)

    return () => {
      return (
        <div class={styles.box} style="margin-right: 20px;">
          <div class={styles.baseContent}>
            <el-form-item
              class={styles.formItem}
              label-width="105px"
              label={_t('设备编号') + '：'}
              prop="EquipmentNumber"
              rules={[
                {
                  required: true,
                  message: _t(' 请输入设备编号'),
                  trigger: 'blur',
                },
              ]}
            >
              <div>
                <el-input
                  style="width: 200px;"
                  placeholder={_t('请输入设备编号')}
                  v-model={formData.EquipmentNumber}
                />
              </div>
            </el-form-item>
          </div>
        </div>
      )
    }
  },
})
