import { computed, defineComponent, ref } from 'vue'
import styles from './FlowFunctionDialog.module.scss'
import BaseDialog from '@/components/BaseDialog/index.vue'
import BaseTable from '@/components/Table/Table'
import Tag from '@/components/Tag/Tag'

export default defineComponent({
  name: '流程控制确认',
  props: ['title', 'modelValue', 'type', 'data'],
  emits: ['update:modelValue', 'confirm', 'update:data'],
  setup(props, { slots, emit }) {
    const visible = computed({
      get() {
        return props.modelValue
      },
      set(v) {
        emit('update:modelValue', v)
      },
    })
    const data = computed(() => {
      return props.data.map((item: any) => {
        return {
          ...item,
          options: item?.options?.map((option: any) => {
            return {
              ...option,
              value: String(option.value),
            }
          }),
        }
      })
    })
    const dataSource = computed({
      get() {
        return data.value
      },
      set(v) {
        emit('update:data', v)
      },
    })
    const onClose = () => {
      visible.value = false
    }
    const onConfirm = () => {
      // visible.value = false
      emit('confirm', dataSource.value)
    }
    return () => (
      <div class={styles.control}>
        <BaseDialog
          title="流程功能设置"
          v-model={visible.value}
          width="700px"
          onClose={onClose}
          onConfirm={onConfirm}
        >
          <div class={styles.table}>
            <BaseTable
              v-model:dataSource={dataSource.value}
              isHidePagination={true}
              isSeq={false}
              isCheck={false}
              isDrag={false}
              autoHight
              v-slots={{
                action({ row }: any) {
                  row.value = row.value || row.defaultValue
                  return (
                    <Tag
                      v-model={row.value}
                      options={row.options || []}
                      labelKey="description"
                    ></Tag>
                  )
                },
              }}
              columns={[
                {
                  field: 'name',
                  title: '功能名称',
                },
                {
                  field: 'description',
                  title: '功能描述',
                },
                {
                  field: 'action',
                  title: '操作',
                },
              ]}
            />
          </div>
        </BaseDialog>
      </div>
    )
  },
})
