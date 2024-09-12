import { defineComponent, SetupContext, ref, provide } from 'vue'
import styles from './System.module.scss'
import Box from '../../../Components/Box/Box'
import { useConfigure } from '@/widgets/SystemManagement/Controllers/Configure'
import Text from '@/components/Text/Text'
import CommonTable from '@/widgets/ProcessManagement/Views/Components/CommonTable/CommonTable'
import { columns } from '../../../../enum'
import { _t, LanguageScopeKey } from '../../../../app'

export default defineComponent({
  name: '系统设置',
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
              label={_t('SOP配置') + '：'}
            >
              <el-radio-group v-model={formData.Sop_Enabled}>
                <el-radio value="0">{_t('禁用')}</el-radio>
                <el-radio value="1">{_t('启用')}</el-radio>
              </el-radio-group>
              <div style="width:100%">
                <Text fontSize="12px" color="#99999A">
                  (
                  {_t(
                    '开启后，“产品管理”模块，提供SOP管理按钮，可上传维护SOP文件'
                  )}
                  .)
                </Text>
              </div>
            </el-form-item>
          </div>
          {/* </Box> */}
          {/* <Box
                title={_t('功能模块')}
                space="40px"
                height="80px"
                padding="5px"
              > */}
          <div class={styles.baseContent}>
            <el-form-item
              class={styles.formItemBase}
              label-width="145px"
              label={_t('工单管理模块') + '：'}
            >
              <el-switch
                active-value="1"
                inactive-value="0"
                active-text={_t('开')}
                inactive-text={_t('关')}
                class={styles.switch}
                v-model={formData.PluginState}
              ></el-switch>
              <div style="width:100%">
                <Text fontSize="12px" color="#99999A">
                  ({_t('关闭后，工单模块不可用，所有生产流程不再涉及工单功能')}
                  .)
                </Text>
              </div>
            </el-form-item>
          </div>
          {/* </Box> */}
        </div>
      )
    }
  },
})
