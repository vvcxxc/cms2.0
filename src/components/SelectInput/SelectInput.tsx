import { defineComponent, ref } from 'vue'
import IconButton from '@/components/IconButton/IconButton'
import { CaretBottom } from '@element-plus/icons-vue'
import Tag from '../Tag/Tag'
import styles from './SelectInput.module.scss'
import { useVModel } from '@vueuse/core'
export default defineComponent({
  name: 'SelectInput',
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['click', 'onUpdate:modelValue'],
  setup(props, { attrs, slots, emit }) {
    const tagValue = useVModel(props)

    const onClick = () => {
      emit('click')
    }

    return () => {
      return (
        <div class={styles.wrap}>
          <div class={styles.tagWrap}>
            <Tag showClose={true} v-model:data={tagValue.value} />
          </div>
          <el-button class={styles.selectBtn} onClick={onClick}>
            选择
          </el-button>
        </div>
      )
    }
  },
})
