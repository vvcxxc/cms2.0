import { defineComponent, SetupContext, ref, provide } from 'vue'
import styles from './Login.module.scss'
import { useConfigure } from '@/widgets/SystemManagement/Controllers/Configure'
import { _t, LanguageScopeKey } from '../../../../app'
import sdk from 'sdk'
const { openVariableDialog } = sdk.utils
export default defineComponent({
  name: '登录设置',
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
            <el-form-item
              class={styles.formItem}
              label-width="140px"
              label={_t('登录设备名称') + '：'}
              prop="DeviceName"
              rules={[
                {
                  required: true,
                  message: _t(' 请输入登录设备名称'),
                  trigger: 'blur',
                },
              ]}
            >
              <div>
                <el-input
                  type="number"
                  style="width: 300px;"
                  placeholder={_t('请输入登录设备名称')}
                  v-model={formData.DeviceName}
                />
              </div>
            </el-form-item>
            <el-form-item
              class={styles.formItem}
              label-width="140px"
              label={_t('登录触发信号') + '：'}
              prop="LoginSigal"
              rules={[
                {
                  required: true,
                  message: _t('请选择登录触发信号'),
                },
              ]}
            >
              <div>
                <VarInput val="LoginSigal" />
              </div>
            </el-form-item>
            <el-form-item
              class={styles.formItem}
              label-width="140px"
              label={_t('登录凭证') + '：'}
              prop="CredentialTag"
              rules={[
                {
                  required: true,
                  message: _t('请选择登录凭证'),
                },
              ]}
            >
              <div>
                <VarInput val="CredentialTag" />
              </div>
            </el-form-item>
          </div>
        </div>
      )
    }
  },
})
