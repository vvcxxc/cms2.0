import { defineComponent, SetupContext, PropType } from 'vue'
import styles from './Tab.module.scss'
import { _t } from '@/libs/Language/Language'

export default defineComponent({
  name: 'TabPane',
  props: {
    label: {
      type: String as PropType<string>,
    },
    name: {
      type: String as PropType<string>,
    },
    isHide: {
      type: Boolean as PropType<boolean>,
    },
    lazy: {
      type: Boolean as PropType<boolean>,
    },
    // 添加其他属性
  },
  setup(props: any, ctx: SetupContext) {
    return () =>
      !props.isHide ? (
        <el-tab-pane
          class={styles.pane}
          label={_t(props.label)}
          name={props.name}
          lazy={props.lazy}
        >
          {ctx.slots.default && ctx.slots.default()}
        </el-tab-pane>
      ) : null
  },
})
