import { PropType, computed, defineComponent, ref } from 'vue'
import Dialog from '@/components/BaseDialog/index.vue'
const BaseDialog: any = Dialog
import { useSampleDataInput } from '../../Controllers/sampleDataInput'
import BaseTable from '@/components/Table/Table'
import styles from './SampleDataDetails.module.scss'

export default defineComponent({
  name: '样本数据录入',
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
  },
  emits: ['update:modelValue', 'close'],
  setup(props, ctx) {
    const {
      tableRef,
      dataSource,
      column,
      visible,
      sampleNum,
      inputVal,
      onOpen,
      onClose,
      onConfirm,
      onClear,
    } = useSampleDataInput(props, ctx)

    return () => (
      <BaseDialog
        width="830px"
        height="600px"
        title="样本数据录入"
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
            <div class={styles.label}>
              取样方式：
              <el-input style="width: 220px;" v-model={inputVal.value} />
            </div>
          </div>
          <div class={styles.searchRight}>
            <div class={styles.clearBtn} onClick={onClear}>
              清除
            </div>
            <div class={styles.submitBtn} onClick={onConfirm}>
              保存
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
            v-slots={column.value.reduce((acc: any, curr: any) => {
              acc[curr.field] = ({ row }: any) => (
                <el-input
                  v-model={row[curr.field]}
                  disabled={curr.field == '子组'}
                />
              )
              return acc
            }, {})}
          />
        </div>
      </BaseDialog>
    )
  },
})
