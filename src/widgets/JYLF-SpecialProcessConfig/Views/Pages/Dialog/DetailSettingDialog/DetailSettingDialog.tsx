import { defineComponent } from 'vue'
import styles from './DetailSettingDialog.module.scss'
import { useProcessSettingDialog } from '../../../../Controllers/DetailSettingDialog'
import CommonTable from '../../../Components/CommonTable/CommonTable'
import BaseDialog from '@/components/BaseDialog/index.vue'

export default defineComponent({
  name: '详细过程参数配置',
  props: {
    // 控制弹窗显示隐藏
    modelValue: {
      type: Boolean,
      default: false,
    },
    isProcess: {
      type: Boolean,
      default: true,
    },
    row: {
      type: Object,
      default: {},
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx) {
    const {
      visible,
      onOpen,
      onClose,
      onConfirm,
      delSetting,
      tableRef,
      dataList,
      columns,
      contextMenu,
    } = useProcessSettingDialog(props, ctx)
    return () => {
      return (
        <div class={styles.processSetting}>
          <BaseDialog
            width="700px"
            v-model={visible.value}
            title="试漏仪参数配置"
            onClose={onClose}
            onConfirm={onConfirm}
            onOpen={onOpen}
            destroy-on-close
          >
            <div class={styles.labelLine}>
              <div class={styles.label}>
                当前工序：
                {props.row?.workSectionName}
              </div>
              <div class={styles.delete} onClick={delSetting}>
                删除配置
              </div>
            </div>
            <CommonTable
              ref={tableRef}
              v-model:dataSource={dataList.value}
              columns={columns}
              isDrag={true}
              isChecked={false}
              contextMenu={contextMenu}
              isFooter={true}
              height="400px"
            />
          </BaseDialog>
        </div>
      )
    }
  },
})
