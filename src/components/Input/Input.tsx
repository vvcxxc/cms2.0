import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DyFormInput',
  setup(props, { attrs }) {
    return () => <el-input {...props} {...attrs} />
  },
})
