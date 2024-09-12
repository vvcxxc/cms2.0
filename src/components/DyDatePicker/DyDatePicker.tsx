import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DyDatePicker',
  setup(props: any, { attrs }) {
    return () => (
      <el-date-picker
        {...props}
        {...attrs}
        value-format="YYYY-MM-DD HH:mm:ss"
      />
    )
  },
})
