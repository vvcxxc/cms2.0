import { computed, defineComponent, ref, nextTick } from 'vue'
import BaseDialog from '@/components/BaseDialog/index.vue'
import { ElMessage } from 'element-plus'
import BaseTable from '@/components/Table/Table'
import styles from './LoadingSettings.module.scss'

export default defineComponent({
  name: '选择物料',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    selectedList: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx) {
    const visible = computed({
      get() {
        return props.modelValue
      },
      set(val) {
        ctx.emit('update:modelValue', val)
      },
    })

    const tableRef = ref()
    const dataSource = ref<any[]>([])
    const columns = [
      {
        field: 'name',
        title: '物料名称',
      },
      {
        field: 'materialTypeDisplay',
        title: '物料类型',
      },
      {
        field: 'unit',
        title: '单位',
      },
      {
        field: 'remark',
        title: '备注说明',
      },
    ]
    const onClose = () => {
      visible.value = false
    }

    const onOpen = () => {
      console.log('onOpen', props.selectedList)
      onCheck(props.selectedList || [])
      nextTick(() => {
        tableRef.value?.setSelectRow(
          props.selectedList.map((item: any) => item.materialId)
        )
      })
    }
    const checkedList = ref<any[]>([])
    const onCheck = (records: any) => {
      checkedList.value = records
    }

    const onConfirm = async () => {
      console.log('onConfirm', checkedList.value)
      // return
      visible.value = false
      ctx.emit('confirm', checkedList.value)
    }

    return () => (
      <BaseDialog
        destroy-on-close
        title="上料配置"
        class={styles.drawer}
        style="background: #fff"
        width="700px"
        v-model={visible.value}
        onClose={onClose}
        onConfirm={onConfirm}
        onOpen={onOpen}
      >
        <div class={styles.container}>
          <div class={styles.table}>
            <BaseTable
              id="materialId"
              ref={tableRef}
              pageSize={999}
              url={`/api/v1/messuite/query/material`}
              v-model:dataSource={dataSource.value}
              columns={columns}
              isHidePagination={true}
              isChecked={true}
              onCheck={onCheck}
            />
          </div>
        </div>
      </BaseDialog>
    )
  },
})
