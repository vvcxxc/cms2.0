import { defineComponent } from 'vue'
import styles from './ExportDialog.module.scss'
import { useExportPop } from '../../../Controllers/ExportDialog'
import CommonTable from '../../Components/CommonTable/CommonTable'
import BaseDialog from '@/components/BaseDialog/index.vue'

export default defineComponent({
  name: '批量导出',
  props: {
    // 控制弹窗显示隐藏
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx) {
    const {
      visible,
      onOpen,
      onClose,
      onConfirm,
      tableRef,
      dataList,
      columns,
      contextMenu,
      importFn,
      exportFn,
    } = useExportPop(props, ctx)
    return () => {
      return (
        <div class={styles.processSetting}>
          <BaseDialog
            width="900px"
            height="452px"
            v-model={visible.value}
            title="批量导出确认"
            onClose={onClose}
            onConfirm={onConfirm}
            onOpen={onOpen}
            confirmText="进行批量导出"
            destroy-on-close
          >
            <div class={styles.labelLine}>
              <div class={styles.label}> 说明：</div>
              <div class={styles.value}>
                1、下述输入条码：需是正确的总成码、执行器码、阀体码、
                电机码，PCBA码等（产品码或物料码）；
                <br />
                2、导入文件格式要求为.xlsx/.xls；
                <br />
                3、系统会根据输入条码查询相关的加工信息进行导出。
              </div>
            </div>
            <div class={styles.labelLine}> 输入条码数据：</div>
            <div class={styles.labelLine}>
              <el-upload
                action="#"
                accept=".xlsx"
                show-file-list={false}
                http-request={importFn}
                style={{ marginRight: '10px' }}
              >
                <el-button type="primary" class="cs-base-btn">
                  导入
                </el-button>
              </el-upload>
              <el-button type="primary" class="cs-base-btn" onClick={exportFn}>
                导出
              </el-button>
            </div>
            <CommonTable
              ref={tableRef}
              v-model:dataSource={dataList.value}
              columns={columns}
              isDrag={false}
              isChecked={false}
              contextMenu={contextMenu}
              isFooter={true}
              maxHeight="300px"
              style={{ width: '250px' }}
            />
          </BaseDialog>
        </div>
      )
    }
  },
})
