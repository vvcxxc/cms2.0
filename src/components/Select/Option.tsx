import { defineComponent } from 'vue'
import IconButton from '@/components/IconButton/IconButton'
import { CaretBottom } from '@element-plus/icons-vue'

export default defineComponent<{ [key: string]: any }>({
  name: 'Option',

  setup(props, { attrs, slots, emit }) {
    return () => {
      return <el-option {...attrs}>{slots.default?.()}</el-option>
    }
  },
})
