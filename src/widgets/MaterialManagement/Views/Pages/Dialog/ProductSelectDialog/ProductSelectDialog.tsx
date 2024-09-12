import { defineComponent } from 'vue'
import BaseDialog from '@/components/BaseDialog/index.vue'
import { useProductSelectDialog } from '../../../../Controllers/ProductSelectDialog'
import styles from './ProductSelectDialog.module.scss'
import Search from '@/components/Search/Search'
import BaseTable from '@/components/Table/Table'
export default defineComponent({
  name: '选择产品型号',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    data: {
      type: Array,
      default: ()=>[]
    }
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx) {
    const {
      onClose,
      onConfirm,
      visible,
      innerValue,
      onSearch,
      tableRef,
      dataSource,
      onCheck,
      columns,
      onOpen,
      selections
    } = useProductSelectDialog(props, ctx)
    return () => (
      <BaseDialog
        destroy-on-close
        class={styles.drawer}
        style="background: #fff"
        width="664px"
        height="578px"
        title="选择产品型号"
        v-model={visible.value}
        onClose={onClose}
        onConfirm={onConfirm}
        onOpen={onOpen}
      >
        <div class={styles.container}>
          <div class={styles.tools}>
            <span class={styles.name}>产品</span>
            <Search v-model={innerValue.value} onConfirm={onSearch} />
          </div>
          <div class={styles.mainTable}>
            <BaseTable
              params={{
                Filter: innerValue.value,
              }}
              selections={selections.value}
              pageSize={999}
              ref={tableRef}
              url="/api/v1/productmanagement/product"
              style="margin-top:10px"
              v-model:dataSource={dataSource.value}
              columns={columns}
              isChecked={true}
              isHidePagination={true}
              onCheck={onCheck}
            />
          </div>
        </div>
      </BaseDialog>
    )
  },
})
