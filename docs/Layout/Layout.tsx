import { defineComponent } from 'vue'
import './Layout.scss'
import 'vxe-table/lib/style.css'

export default defineComponent({
  name: 'layout',
  setup(props, { slots, attrs }) {
    return () => {
      return (
        <el-config-provider {...attrs} namespace="cs">
          <ClientOnly>{slots.default?.()}</ClientOnly>
        </el-config-provider>
      )
    }
  },
})
