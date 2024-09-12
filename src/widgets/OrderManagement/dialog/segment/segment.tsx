import { computed, defineComponent, ref, onMounted, watch } from 'vue'
import BaseDialog from '@/components/BaseDialog/index.vue'
import styles from './segment.module.scss'
import { getSegments } from '../../api/process'
import DyForm from '@/components/DyForm/DyForm'

interface SegmentType {
  segmentId: string
  segmentName: string
}
export default defineComponent({
  name: 'OrderManagementDialogSegment',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'confirm'],
  setup(props, { emit }) {
    const visible = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emit('update:modelValue', value)
      },
    })
    const formRef = ref<any>(null)
    const formData = ref<any>({
      segment: [],
    })
    const segmentList = ref<any[]>([])
    const formItemProps = [
      {
        prop: 'segment',
        el: 'select',
        options: segmentList,
        label: '产线段',
        width: '350px',
        collapseTags: true,
        multiple: true,
        collapseTagsTooltip: true,
        maxCollapseTags: 5,
        clearable: true,
        noDataText: '该工单没有可使用的产线段',
        rules: [
          {
            required: true,
            message: '请选择产线段',
            trigger: 'change',
            type: 'array',
          },
        ],
      },
    ]
    const init = async () => {
      const res = await getSegments(props.id)
      segmentList.value = res.map((item: SegmentType) => ({
        value: item.segmentId,
        name: item.segmentName,
      }))
      formData.value = {
        segment: res.map((item: SegmentType) => item.segmentId),
      }
    }

    const onClose = () => {
      visible.value = false
    }

    const onConfirm = async () => {
      try {
        await formRef.value?.validate()
        visible.value = false
        const segment = formData.value?.segment || []
        const data = segmentList.value
          .map((item: any) => {
            if (segment.includes(item.value)) {
              return {
                segmentId: item.value,
                segmentName: item.name,
              }
            }
            return null
          })
          .filter((v) => v)

        emit('confirm', {
          segments: data,
        })
      } catch (error) {
        console.error(error)
      }
    }

    watch(
      () => props.modelValue,
      (value) => {
        if (value) {
          init()
        }
      }
    )

    return () => (
      <BaseDialog
        v-model={visible.value}
        title="产线段配置"
        onClose={onClose}
        onConfirm={onConfirm}
      >
        <div class={styles.segmentDialog}>
          <DyForm
            ref={formRef}
            v-model:formData={formData.value}
            formItemProps={formItemProps}
          ></DyForm>
        </div>
      </BaseDialog>
    )
  },
})
