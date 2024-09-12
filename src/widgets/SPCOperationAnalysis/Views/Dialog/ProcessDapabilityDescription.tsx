import { computed, defineComponent } from 'vue'
import Dialog from '@/components/BaseDialog/index.vue'
const BaseDialog: any = Dialog

export default defineComponent({
  name: '过程能力说明',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const visible = computed({
      get() {
        return props.modelValue
      },
      set(val) {
        ctx.emit('update:modelValue', val)
      },
    })
    return () => (
      <BaseDialog
        width="966px"
        title="过程能力说明"
        destroy-on-close
        v-model={visible.value}
        onClose={() => (visible.value = false)}
        v-slots={{
          footer: () => <div></div>,
        }}
      >
        <img
          style={{ width: '100%', objectFit: 'contain' }}
          src={
            new URL(
              `../../../../assets/imgs/processDapabilityDescription.png`,
              import.meta.url
            ).href
          }
        />
      </BaseDialog>
    )
  },
})
