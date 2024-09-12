import { defineComponent } from 'vue'
import styles from './ExportSettingDialog.module.scss'
import BaseTable from '@/components/Table/Table'
import BaseDialog from '@/components/BaseDialog/index.vue'
import { useExportSettingPop } from '../../../Controllers/ExportSettingDialog'
import Radio from '@/components/Radio/Radio'

export default defineComponent({
  name: '校验报告导出配置',
  props: {
    // 控制弹窗显示隐藏
    modelValue: {
      type: Boolean,
      default: false,
    },
    traceData: {
      type: Object,
      default: {
        productTraceDetails: [], //productTraceDetails没数据不要进来
      },
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx) {
    const {
      visible,
      dataObj,
      dataList1,
      dataList2,
      tableRef1,
      tableRef2,
      columns1,
      columns2,
      onOpen,
      onClose,
      onConfirm,
      onRowClick1,
      onParamsCheck,
    } = useExportSettingPop(props, ctx)
    return () => {
      return (
        <div class={styles.ExportSettingDialog}>
          <BaseDialog
            width="1000px"
            height="800px"
            v-model={visible.value}
            title="校验报告导出配置"
            confirmText="确定导出"
            onClose={onClose}
            onConfirm={onConfirm}
            onOpen={onOpen}
            destroy-on-close
          >
            <div class={styles.container}>
              <div class={styles.currentVersion}>
                基本<div class={styles.info}>信息</div>
              </div>
              <div class={styles.baseInfo}>
                <div class={styles.label}>
                  输入条码：{props.traceData.inputId}
                </div>
                <div class={styles.label}>
                  产品ID：
                  {
                    props.traceData.productTraceDetails[
                      props.traceData.productTraceDetails.length - 1
                    ]?.serialNumber
                  }
                </div>
                <div class={styles.label}>
                  产品名称：
                  {
                    props.traceData.productTraceDetails[
                      props.traceData.productTraceDetails.length - 1
                    ].productName
                  }
                </div>
                <div class={styles.label}>
                  上线时间：
                  {props.traceData.productTraceDetails[0].entryTime}
                </div>
                <div class={styles.label}>
                  最新加工时间：
                  {
                    props.traceData.productTraceDetails[
                      props.traceData.productTraceDetails.length - 1
                    ]?.recordTime
                  }
                </div>
              </div>
              <div class={styles.currentVersion}>
                报告信息<div class={styles.info}>配置</div>
              </div>

              <div class={styles.formInfo}>
                <div class={styles.formLine}>
                  <div class={styles.formItem}>
                    <div class={styles.formLabel}>报告标题：</div>
                    <div class={styles.formTextarea}>
                      <el-input v-model={dataObj.reportTitle} />
                    </div>
                  </div>
                  <div class={styles.formItem}>
                    <div class={styles.formLabel}>报告编号：</div>
                    <div class={styles.formTextarea}>
                      <el-input v-model={dataObj.reportNum} />
                    </div>
                  </div>
                </div>
                <div class={styles.formLine}>
                  <div class={styles.formLabel}>说明：</div>
                  <div class={styles.formTextarea}>
                    <el-input
                      type="textarea"
                      resize="none"
                      v-model={dataObj.reportRemark}
                    />
                  </div>
                </div>
              </div>
              <div class={styles.currentVersion}>
                选择导出<div class={styles.info}>参数</div>
              </div>
              <div class={styles.mainTable}>
                <div class={styles.tableItem1}>
                  <div class={styles.tableBtnList}>
                    <div class={styles.title}>工序</div>
                  </div>
                  <div class={styles.tableContent}>
                    <BaseTable
                      id="uuid"
                      ref={tableRef1}
                      v-model:dataSource={dataList1.value}
                      onRowClick={onRowClick1}
                      columns={columns1}
                      isHidePagination={true}
                    ></BaseTable>
                  </div>
                </div>
                <div class={styles.tableItem2}>
                  <div class={styles.tableBtnList}>
                    <div class={styles.title}>工序参数</div>
                    选择参数类型：
                    <Radio
                      v-model:modelValue={dataObj.paramsType}
                      options={[{ value: '采集参数', name: '采集参数' }]}
                      labelWidth="80px"
                      trigger="hover"
                    ></Radio>
                  </div>
                  <div class={styles.tableContent}>
                    <BaseTable
                      id="uuid"
                      ref={tableRef2}
                      v-model:dataSource={dataList2.value}
                      isDrag={true}
                      isChecked={true}
                      onCheck={onParamsCheck}
                      columns={columns2}
                      isHidePagination={true}
                      v-slots={{
                        result: ({ row, index }: any) => {
                          return (
                            <el-select v-model={row.result}>
                              <el-option label="合格" value="OK"></el-option>
                              <el-option label="不合格" value="NG"></el-option>
                            </el-select>
                          )
                        },
                      }}
                    ></BaseTable>
                  </div>
                </div>
              </div>
            </div>
          </BaseDialog>
        </div>
      )
    }
  },
})
