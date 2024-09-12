/**
 * 禁止在非Setting配置下使用
 */
import { defineComponent, SetupContext } from 'vue'
import IconButton from '@/components/IconButton/IconButton'
import { CaretBottom } from '@element-plus/icons-vue'
import { useVModel } from '@vueuse/core'
import Option from './ElOption'
import { has } from 'lodash'
import './index.scss'

interface SelectProps {
  [key: string]: any
}

export default defineComponent<SelectProps, any>({
  //@ts-ignore
  props: ['disabled'],
  setup(props: SelectProps, { attrs, slots, emit }: any) {
    const namespace = import.meta.env.VITE_APP_NAMESPACE

    const options = attrs.optionData?.value || (attrs.optionData as Array<any>)

    return () => {
      const disabled =
        typeof props.disabled?.value === 'boolean'
          ? props.disabled?.value
          : (props.disabled as boolean)
      return (
        <el-config-provider namespace={namespace} z-index={500}>
          <el-select
            {...attrs}
            disabled={disabled}
            class="cs-setting-select_custom_style"
            popper-class="settings-cs-select_check"
            suffix-icon={
              <el-icon>
                <CaretBottom />
              </el-icon>
            }
          >
            {options
              ? options.map((item: any) => {
                  return <Option {...item} />
                })
              : slots.default?.()}
          </el-select>
        </el-config-provider>
      )
    }
  },
})
