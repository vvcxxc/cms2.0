import { defineComponent, SetupContext, ref, provide, nextTick } from 'vue'
import styles from './Formula.module.scss'
import Box from '../../../Components/Box/Box'
import { useConfigure } from '@/widgets/SystemManagement/Controllers/Configure'
import Text from '@/components/Text/Text'

import { _t, LanguageScopeKey } from '../../../../app'
import sdk from 'sdk'
const { openVariableDialog } = sdk.utils
export default defineComponent({
  name: '高级设置',
  emits: ['save'],
  setup(props, ctx: SetupContext) {
    provide(LanguageScopeKey, LanguageScopeKey)
    const { formData }: any = useConfigure(props, ctx)
    const selectVariable = async (type: string) => {
      const data = await openVariableDialog({
        isMultiple: false,
      })
      formData[type] = data?.name
      console.log(formData)
    }

    const VarInput = (props: any) => {
      return (
        <el-input
          v-model={formData[props.val]}
          style="width: 300px"
          v-slots={{
            suffix: () => (
              <img
                src={
                  new URL(
                    `../../../../../../assets/svg/more.svg`,
                    import.meta.url
                  ).href
                }
                class={styles.more}
                onClick={() => selectVariable(props.val)}
              />
            ),
          }}
        />
      )
    }
    return () => {
      return (
        <div class={styles.box} style="margin-right: 20px;">
          <div class={styles.baseContent}>
            <Box
              title={_t('工艺配方')}
              height="110px"
              space="30px"
              hideBorder={true}
            >
              <div class={styles.baseContent}>
                <el-form-item
                  class={styles.formItemBase}
                  label-width="200px"
                  label={_t('下发方式') + '：'}
                >
                  <el-radio-group v-model={formData.FormulaDistributionMode}>
                    <el-radio value="0">{_t('下发工单联动配方下发')}</el-radio>
                    <el-radio value="1">{_t('配方应用页面手动下发')}</el-radio>
                    <el-radio value="2">
                      {_t('工序识别产品时下发配方')}
                    </el-radio>
                  </el-radio-group>
                  <div style="width:100%">
                    <Text fontSize="12px" color="#99999A">
                      ({_t('配置工艺配方的下发方式')}.)
                    </Text>
                  </div>
                </el-form-item>
                <el-form-item
                  class={styles.formItem}
                  label-width="200px"
                  label={_t('配方切换信号') + '：'}
                  prop="FormulaSwitchingSignal"
                  rules={[
                    {
                      required: true,
                      message: _t('请选择配方切换信号'),
                    },
                  ]}
                >
                  <div>
                    <VarInput val="FormulaSwitchingSignal" />
                  </div>
                </el-form-item>
                <el-form-item
                  class={styles.formItem}
                  label-width="200px"
                  label={_t('切换配方号') + '：'}
                  prop="FormulaTag"
                  rules={[
                    {
                      required: true,
                      message: _t('请选择切换配方号'),
                    },
                  ]}
                >
                  <div>
                    <VarInput val="FormulaTag" />
                  </div>
                </el-form-item>

                <el-form-item
                  class={styles.formItem}
                  label-width="200px"
                  label={_t('允许切换信号') + '：'}
                  prop="FormulaAllowSignal"
                  rules={[
                    {
                      required: true,
                      message: _t('请选择允许切换信号'),
                    },
                  ]}
                >
                  <div>
                    <VarInput val="FormulaAllowSignal" />
                  </div>
                </el-form-item>
                <el-form-item
                  class={styles.formItem}
                  label-width="200px"
                  label={_t('最大等待时间') + '：'}
                  prop="FormulaMaximumWaitingTime"
                  rules={[
                    {
                      required: true,
                      message: _t(' 请输入最大等待时间'),
                      trigger: 'blur',
                    },
                  ]}
                >
                  <div>
                    <el-input
                      type="number"
                      style="width: 280px;marginRight: 10px"
                      placeholder={_t('请输入最大等待时间')}
                      v-model={formData.FormulaMaximumWaitingTime}
                    />
                    s
                  </div>
                </el-form-item>
                <el-form-item
                  class={styles.formItem}
                  label-width="200px"
                  label={_t('试漏仪结果最大等待时间') + '：'}
                  prop="LeakDetectorMaximumWaitingTime"
                  rules={[
                    {
                      required: true,
                      message: _t(' 请输入试漏仪结果最大等待时间'),
                      trigger: 'blur',
                    },
                  ]}
                >
                  <div>
                    <el-input
                      type="number"
                      style="width: 280px;marginRight: 10px"
                      placeholder={_t('请输入试漏仪结果最大等待时间')}
                      v-model={formData.LeakDetectorMaximumWaitingTime}
                    />
                    s
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
