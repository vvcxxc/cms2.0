import { defineComponent, SetupContext, ref, provide } from 'vue'
import styles from './Defective.module.scss'
import Box from '../../../Components/Box/Box'
import { useConfigure } from '@/widgets/SystemManagement/Controllers/Configure'
import Text from '@/components/Text/Text'
import CommonTable from '@/widgets/ProcessManagement/Views/Components/CommonTable/CommonTable'
import { columns } from '../../../../enum'
import { _t, LanguageScopeKey } from '../../../../app'

export default defineComponent({
  name: '高级设置',
  emits: ['save'],
  setup(props, ctx: SetupContext) {
    provide(LanguageScopeKey, LanguageScopeKey)
    const { formData } = useConfigure(props, ctx)
    return () => {
      return (
        <div class={styles.box} style="margin-right: 20px;">
          <div class={styles.baseContent}>
            <Box
              title={_t('不良品管理')}
              space="30px"
              height="90px"
              hideBorder={true}
            >
              <div class={styles.baseContent}>
                <el-form-item
                  class={styles.formItemBase}
                  label-width="145px"
                  label={_t('判定结果选择项') + '：'}
                >
                  <el-checkbox
                    v-model={formData.EquipmentRepair_Enabled}
                    true-value="1"
                    false-value="0"
                    disabled={true}
                  >
                    {_t('设备返修')}
                  </el-checkbox>
                  <el-checkbox
                    v-model={formData.ManualRepair_Enabled}
                    true-value="1"
                    false-value="0"
                  >
                    {_t('人工返修')}
                  </el-checkbox>
                  <el-checkbox
                    v-model={formData.Scrap_Enabled}
                    true-value="1"
                    false-value="0"
                  >
                    {_t('产品报废')}
                  </el-checkbox>
                  <el-checkbox
                    v-model={formData.NgProductOutflow_Enabled}
                    true-value="1"
                    false-value="0"
                  >
                    {_t('NG品流出')}
                  </el-checkbox>

                  <div style="width:100%">
                    <Text fontSize="12px" color="#99999A">
                      ({_t('选择不合格品处理的判定结果选项')}.)
                    </Text>
                  </div>
                </el-form-item>
              </div>
            </Box>
          </div>
        </div>
      )
    }
  },
})
