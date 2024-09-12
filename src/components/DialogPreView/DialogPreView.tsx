import { PropType, SetupContext, computed, defineComponent, useSlots } from 'vue'
import BaseDialog from '@/components/BaseDialog/index.vue'
import styles from './DialogPreView.module.scss'
import { useVModel } from '@vueuse/core'
import Chart from './Chart'
import Picture from './Picture'
export default defineComponent({
  name: 'DialogPreView',
  props: {
    title: {
      type: String,
      default: '预览',
    },
    isChart: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    chartOptions: {
      type: Object,
      default: () => ({}),
    },
    picList: {
      type: Object as PropType<string[]>,
      default: () => [],
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, { emit, attrs }: SetupContext) {
    const visible = useVModel(props)
    const slots = useSlots()
    const onClose = () => {
      visible.value = false
      emit('close')
    }
    const onConfirm = () => {
      emit('confirm')
    }

    const height = computed(() => {
      return (attrs.height as string) || '578px'
    })

    return () => (
      <BaseDialog
        destroy-on-close
        class={styles.drawer}
        style="background: #fff"
        width="900px"
        height="578px"
        title={props.title}
        v-model={visible.value}
        onClose={onClose}
        onConfirm={onConfirm}
        v-slots={{
          footer: () => {
            slots.footer ? slots.footer : null
          },
        }}
      >
        <div class={styles.container}>
          {props.isChart ? (
            <Chart chartOptions={props.chartOptions} />
          ) : (
            <Picture height={height.value} picList={props.picList} />
          )}
        </div>
      </BaseDialog>
    )
  },
})
