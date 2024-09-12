import { defineComponent, SetupContext, ref, provide } from 'vue'
import styles from './Advanced.module.scss'
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
            <el-form-item
              class={styles.formItemBase}
              label-width="145px"
              label={_t('调试模式') + '：'}
            >
              <el-switch
                active-value="1"
                inactive-value="0"
                active-text={_t('开')}
                inactive-text={_t('关')}
                class={styles.switch}
                v-model={formData.EnableDebugMode}
              ></el-switch>
              <div style="width:100%">
                <Text fontSize="12px" color="#99999A">
                  ({_t('启用后支持工单下发后修改工序配置、工艺配方要求')}
                  .)
                </Text>
              </div>
            </el-form-item>
          </div>
        </div>
      )
    }
  },
})
