import { defineComponent, SetupContext, ref, provide } from 'vue'
import styles from './Process.module.scss'
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
            <Box title={_t('过程设置')} space="30px" hideBorder={true}>
              <div class={styles.baseContent}>
                <el-form-item
                  class={styles.formItemBase}
                  label-width="145px"
                  label={_t('检测时间范围') + '：'}
                >
                  {_t('近')}&nbsp;
                  <el-input-number
                    min={0}
                    max={366}
                    step={1}
                    size="small"
                    controls-position="right"
                    style={{ margin: '0 5px' }}
                    v-model={formData.TimeRangeForDetection}
                    value-on-clear={0}
                    controls={false}
                  />
                  {_t('天')}
                  <div style="width:100%">
                    <Text fontSize="12px" color="#99999A">
                      (
                      {_t(
                        '配置产品状态检测、漏工序、重码及产品码更新相关业务在追溯报表的数据查询范围'
                      )}
                      .)
                    </Text>
                  </div>
                </el-form-item>
              </div>
            </Box>
            <Box
              title={_t('过程参数')}
              space="30px"
              hideBorder={true}
              width="500px"
            >
              <div class={styles.baseContent}>
                <el-form-item
                  class={styles.formItemBase}
                  label-width="145px"
                  label={_t('返修数据展示') + '：'}
                >
                  <el-radio-group
                    v-model={formData.ShowTraceDataWithLatestData}
                  >
                    <el-radio value="0">{_t('展示所有数据')}</el-radio>
                    <el-radio value="1">{_t('展示最新数据')}</el-radio>
                  </el-radio-group>
                  <div style="width:100%">
                    <Text fontSize="12px" color="#99999A">
                      ({_t('选择返修产品的过程参数展示方式')}.)
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
