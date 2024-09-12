import { defineComponent, ref } from 'vue'
import styles from './SPCOperationAnalysis.module.scss'
import SPCOperationAnalysis from './Pages/SPCOperationAnalysis/SPCOperationAnalysis'
import { _t } from '../app'

export default defineComponent({
  name: 'SPC分析',
  setup(props, ctx) {
    const rf = ref<{
      [key: string]: any
    }>({})

    return () => {
      return (
        <div class={styles.SPCAnalysis}>
          <SPCOperationAnalysis />
        </div>
      )
    }
  },
})
