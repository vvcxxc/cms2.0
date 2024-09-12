import { computed, defineComponent } from 'vue'
import BaseDialog from '@/components/BaseDialog/index.vue'
import { useHeaderFieldSettings } from '../../../../Controllers/HeaderFieldSettings'
import BaseTable from '@/components/Table/Table'
import styles from './HeaderFieldSettings.module.scss'

export default defineComponent({
  name: '表头字段配置',
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
    const { onClose, onConfirm, visible, tableRef, dataSource, columns } =
      useHeaderFieldSettings(props, ctx)
    return () => (
      <BaseDialog
        destroy-on-close
        title="表头字段配置"
        class={styles.drawer}
        style="background: #fff"
        width="950px"
        height="408px"
        v-model={visible.value}
        onClose={onClose}
        onConfirm={onConfirm}
      >
        <div class={styles.container}>
          <BaseTable
            ref={tableRef}
            // url={``}
            v-model:dataSource={dataSource.value}
            columns={columns}
            isHidePagination={true}
            v-slots={{
              aqhYlUpper: ({ row }: any) => {
                return <el-input v-model={row.aqhYlUpper} type="number" />
              },
              aqhYlLower: ({ row }: any) => {
                return <el-input v-model={row.aqhYlLower} type="number" />
              },
              aqhYrxcUpper: ({ row }: any) => {
                return <el-input v-model={row.aqhYrxcUpper} type="number" />
              },
              aqhYrxcLower: ({ row }: any) => {
                return <el-input v-model={row.aqhYrxcLower} type="number" />
              },
              mfqWzUpper: ({ row }: any) => {
                return <el-input v-model={row.mfqWzUpper} type="number" />
              },
              mfqWzLower: ({ row }: any) => {
                return <el-input v-model={row.mfqWzLower} type="number" />
              },
              mfCheckYl: ({ row }: any) => {
                return <el-input v-model={row.mfCheckYl} type="number" />
              },
              mfCheckMaxXll: ({ row }: any) => {
                return <el-input v-model={row.mfCheckMaxXll} type="number" />
              },
              shdlCheckUpper: ({ row }: any) => {
                return <el-input v-model={row.shdlCheckUpper} type="number" />
              },
            }}
          />
        </div>
      </BaseDialog>
    )
  },
})
