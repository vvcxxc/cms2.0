import { computed, defineComponent } from 'vue'
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer'
import BaseDialog from '@/components/BaseDialog/index.vue'
// import styles from './ProcessDialog.module.scss'
import { useSOPConfigDialog } from '../../../../Controllers/SOPConfigDialog'
import WorkSection from '../../../Components/WorkSection/WorkSection'
import WorkStep from '../../../Components/WorkStep/WorkStep'
import styles from './SOPConfig.module.scss'
import { createProvider } from '@/widgets/ProductManagement/store/SOPStore'

export default defineComponent({
  name: 'SOP配置',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    productId: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx) {
    const { onClose, onConfirm, visible, stepRef, sectionRef } =
      useSOPConfigDialog(props, ctx)
    return () => (
      <BaseDialog
        destroy-on-close
        class={styles.drawer}
        style="background: #fff"
        width="950px"
        height="578px"
        title={props.title}
        v-model={visible.value}
        onClose={onClose}
        onConfirm={onConfirm}
      >
        <div class={styles.container}>
          <div class={styles.left}>
            <WorkSection ref={sectionRef} />
          </div>
          <div class={styles.right}>
            <WorkStep ref={stepRef} />
          </div>
        </div>
      </BaseDialog>
    )
  },
})
