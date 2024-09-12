import { defineComponent } from 'vue'

export default defineComponent({
  setup(props, { attrs, slots }) {
    const namespace = import.meta.env.VITE_APP_NAMESPACE

    return () => {
      return (
        <el-config-provider {...attrs} namespace={namespace}>
          {slots.default?.()}
        </el-config-provider>
      )
    }
  },
})
