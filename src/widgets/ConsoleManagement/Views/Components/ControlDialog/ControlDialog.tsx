import { computed, defineComponent, ref } from 'vue'
import styles from './ControlDialog.module.scss'
import BaseDialog from '@/components/BaseDialog/index.vue'

export default defineComponent({
  name: '流程控制确认',
  props: ['title', 'modelValue', 'type'],
  emits: ['update:modelValue', 'confirm'],
  setup(props, { slots, emit }) {
    const visible = computed({
      get() {
        return props.modelValue
      },
      set(v) {
        emit('update:modelValue', v)
      },
    })
    const remark = ref('')
    const onClose = () => {
      remark.value = ''
      visible.value = false
    }
    const onConfirm = () => {
      // visible.value = false
      emit('confirm', remark.value)
      remark.value = ''
    }
    return () => (
      <div class={styles.control}>
        <BaseDialog
          title={`${props.title}流程控制确认`}
          v-model={visible.value}
          width="500px"
          onClose={onClose}
          onConfirm={onConfirm}
        >
          <div class={styles.tip}>是否确认执行{props.type}操作</div>
          <div class={styles.box}>
            <label>备注</label>
            <el-input
              v-model={remark.value}
              class={styles.input}
              type="textarea"
              row={3}
              style="100%"
            />
          </div>
        </BaseDialog>
      </div>
    )
  },
})
