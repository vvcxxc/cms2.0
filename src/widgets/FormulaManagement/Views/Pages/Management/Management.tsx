import { defineComponent } from 'vue'
import styles from './Management.module.scss'
import FormulaList from '../../Components/FormulaList/FormulaList'
import ProcessRoute from '../../Components/ProcessRoute/ProcessRoute'
import ProcessParams from '../../Components/ProcessParams/ProcessParams'
import { createProvider } from '@/widgets/FormulaManagement/store/ManagementStore'
export default defineComponent({
  name: '配方管理',
  setup(props, ctx) {
    const store = createProvider(props, ctx)
    return () => {
      return (
        <div class={styles.mamagement}>
          <div class={styles.FormulaList}>
            <FormulaList />
          </div>

          <div class={styles.ProcessRoute}>
            <ProcessRoute />
          </div>
          <div class={styles.ProcessParams}>
            <ProcessParams />
          </div>
        </div>
      )
    }
  },
})
