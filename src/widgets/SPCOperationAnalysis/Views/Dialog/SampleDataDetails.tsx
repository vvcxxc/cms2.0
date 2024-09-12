import { PropType, computed, defineComponent, ref } from 'vue'
import Dialog from '@/components/BaseDialog/index.vue'
const BaseDialog: any = Dialog
import { useSampleDataDetails } from '../../Controllers/sampleDataDetails'
import BaseTable from '@/components/Table/Table'
import styles from './SampleDataDetails.module.scss'

export default defineComponent({
  name: '样本数据详情',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },

    checkItemConfigId: {
      type: String,
      default: '',
    },
    checkItemConfigName: {
      type: String,
      default: '',
    },
    runModes: {
      type: Number,
      default: 1,
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx) {
    const {
      tableRef,
      dataSource,
      column,
      visible,
      sampleNum,
      onOpen,
      onClose,
      onExport,
    } = useSampleDataDetails(props, ctx)

    return () => (
      <BaseDialog
        width="830px"
        height="600px"
        title="样本数据详情"
        destroy-on-close
        v-model={visible.value}
        onClose={onClose}
        onOpen={onOpen}
        v-slots={{
          footer: () => <div></div>,
        }}
      >
        <div class={styles.sampleDataDetailsSearch}>
          <div class={styles.searchLeft}>
            <div class={styles.label}>样本数： {sampleNum.value}</div>
          </div>
          <div class={styles.searchRight}>
            <div class={styles.submitBtn} onClick={onExport}>
              导出
            </div>
          </div>
        </div>
        <div class={styles.sampleDataDetailsTable}>
          <BaseTable
            autoFirstClickRow
            ref={tableRef}
            v-model:dataSource={dataSource.value}
            columns={column.value}
            isHidePagination={true}
          />
        </div>
      </BaseDialog>
    )
  },
})
