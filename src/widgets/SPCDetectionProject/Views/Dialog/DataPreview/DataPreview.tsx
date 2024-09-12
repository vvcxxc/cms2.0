import { PropType, computed, defineComponent, ref } from 'vue'
import Dialog from '@/components/BaseDialog/index.vue'
const BaseDialog: any = Dialog
import { useDataPreview } from '../../../Controllers/DataPreview'
import BaseTable from '@/components/Table/Table'
import styles from './DataPreview.module.scss'

export default defineComponent({
  name: '数据预览',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },

    rowData: {
      type: Object as PropType<Object | null>,
      default: null,
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx) {
    const {
      tableRef,
      dataSource,
      column,
      visible,
      filter,
      onRowClick,
      onOpen,
      onClose,
      onConfirm,
      getData,
    } = useDataPreview(props, ctx)

    return () => (
      <BaseDialog
        width="830px"
        height="680px"
        title="数据预览"
        destroy-on-close
        v-model={visible.value}
        onClose={onClose}
        onConfirm={onConfirm}
        onOpen={onOpen}
        v-slots={{
          footer: () => <div></div>,
        }}
      >
        <div class={styles.dataPreviewSearch}>
          <div>预览行数：</div>
          <el-input
            style="width: 100px"
            type="number"
            v-model={filter.value}
            onBlur={getData}
          />
        </div>
        <div class={styles.dataPreviewTable}>
          <BaseTable
            autoFirstClickRow
            ref={tableRef}
            v-model:dataSource={dataSource.value}
            columns={column.value}
            isHidePagination={true}
            onRowClick={onRowClick}
          />
        </div>
      </BaseDialog>
    )
  },
})
