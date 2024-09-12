import { defineComponent, ref } from 'vue'
import styles from './SPCDetectionProject.module.scss'
import SPCDetectionProject from './Pages/DetectionProjectConfiguration/DetectionProjectConfiguration'
import { _t } from '../app'

export default defineComponent({
  name: '检测项目配置',
  setup(props, ctx) {
    const rf = ref<{
      [key: string]: any
    }>({})

    return () => {
      return (
        <div class={styles.SPCDetectionProject}>
          <SPCDetectionProject />
        </div>
      )
    }
  },
})
