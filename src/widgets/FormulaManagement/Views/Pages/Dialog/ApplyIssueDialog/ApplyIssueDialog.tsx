import { computed, defineComponent } from 'vue'
import BaseDialog from '@/components/BaseDialog/index.vue'
import { useApplyIsseuDialog } from '../../../../Controllers/ApplyIsseuDialog'
import styles from './ApplyIssueDialog.module.scss'
import WorkRoute from '../../../Components/WorkRoute/WorkRoute'
import WorkFormula from '../../../Components/WorkFormula/WorkFormula'

export default defineComponent({
  name: '配方下发',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx) {
    const { onClose, onConfirm, visible } = useApplyIsseuDialog(props, ctx)
    return () => (
      <BaseDialog
        destroy-on-close
        class={styles.drawer}
        style="background: #fff"
        width="1060px"
        height="578px"
        title={props.title}
        v-model={visible.value}
        onClose={onClose}
        onConfirm={onConfirm}
      >
        <div class={styles.container}>
          <div class={styles.left}>
            <WorkFormula />
          </div>
          <div class={styles.right}>
            <WorkRoute />
          </div>
        </div>
      </BaseDialog>
    )
  },
})
