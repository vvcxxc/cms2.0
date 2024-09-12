import { defineComponent, SetupContext } from 'vue'
import IconButton from '@/components/IconButton/IconButton'
import { CaretBottom } from '@element-plus/icons-vue'
import { useVModel } from '@vueuse/core'
import Option from './Option'
import { has } from 'lodash'

interface SelectProps {
  [key: string]: any
}

export default defineComponent<SelectProps, any>({
  //@ts-ignore
  props: ['disabled'],
  setup(props: SelectProps, { attrs, slots, emit }: any) {
    const options = attrs.optionData?.value || (attrs.optionData as Array<any>)

    return () => {
      const disabled =
        typeof props.disabled?.value === 'boolean'
          ? props.disabled?.value
          : (props.disabled as boolean)
      return (
        <el-select
          {...attrs}
          disabled={disabled}
          suffix-icon={
            <span style={{ marginRight: '-3px' }}>
              <el-icon>
                <CaretBottom />
              </el-icon>
            </span>
          }
        >
          {options
            ? options.map((item: any) => {
                return <Option {...item} />
              })
            : slots.default?.()}
        </el-select>
      )
    }
  },
})
