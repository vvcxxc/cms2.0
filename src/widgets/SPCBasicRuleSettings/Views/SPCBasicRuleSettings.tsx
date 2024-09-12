import { defineComponent, ref } from 'vue'
import styles from './SPCBasicRuleSettings.module.scss'
import BasicRuleSettings from './Pages/BasicRuleSettings/BasicRuleSettings'
import { _t } from '../app'

export default defineComponent({
  name: '基础规则设置',
  setup(props, ctx) {
    const rf = ref<{
      [key: string]: any
    }>({})

    return () => {
      return (
        <div class={styles.SPCAnalysis}>
          <BasicRuleSettings />
        </div>
      )
    }
  },
})
