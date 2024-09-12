import { defineComponent } from 'vue'
import styles from './ViewDetail.module.scss'
import { useViewDetail } from '../../Controllers/ViewDetail'
import BaseDialog from '@/components/BaseDialog/index.vue'
import BaseTable from '@/components/Table/Table'
import { ViewDetailColumnsStatusMap } from '../../enum'

export default defineComponent({
  name: '点检详情',
  props: {
    // 控制弹窗显示隐藏
    modelValue: {
      type: Boolean,
      default: false,
    },
    row: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx) {
    const {
      visible,
      tableRef,
      dataObj,
      dataSource,
      ViewDetailColumns,
      onOpen,
      onClose,
      onConfirm,
      getVariableValue,
      sendPass,
    } = useViewDetail(props, ctx)
    return () => {
      return (
        <div class={styles.ViewDetail}>
          <BaseDialog
            width="600px"
            height="452px"
            v-model={visible.value}
            title="点检详情"
            onClose={onClose}
            onConfirm={onConfirm}
            onOpen={onOpen}
            destroy-on-close
          >
            <div class={styles.labelLine}>
              <div class={styles.label}>任务名称：</div>
              <div class={styles.value}>{dataObj.name}</div>
            </div>
            <div class={styles.labelLine}>
              <div class={styles.label}>点检型号：</div>
              <div class={styles.value}>{dataObj.productModel}</div>
            </div>
            <div class={styles.labelLine}>
              <div class={styles.label}>测试方式：</div>
              <div class={styles.value}>{dataObj.checkModesDesc}</div>
            </div>
            <div class={styles.labelLine}>
              <div class={styles.label}>备注说明：</div>
              <div class={styles.value}>{dataObj.remark}</div>
            </div>
            <div class={styles.labelLine}>
              <div class={styles.label}>点检详情：</div>
              <div class={styles.table}>
                <BaseTable
                  ref={tableRef}
                  v-model:dataSource={dataSource.value}
                  columns={ViewDetailColumns.value}
                  isHidePagination={true}
                  v-slots={{
                    status: ({ row }: any) => {
                      return (
                        <div class={styles.status}>
                          {props.title == '点检任务'
                            ? ViewDetailColumnsStatusMap[row.status]
                            : row.status}
                        </div>
                      )
                    },
                    action: ({ row }: any) => {
                      return (
                        <div
                          class={
                            row.status == 0 &&
                            getVariableValue(row.blockTag) != 1
                              ? styles.checkBtn
                              : styles.disabledBtn
                          }
                          onClick={() => sendPass(row)}
                        >
                          pass
                        </div>
                      )
                    },
                  }}
                ></BaseTable>
              </div>
            </div>
          </BaseDialog>
        </div>
      )
    }
  },
})
