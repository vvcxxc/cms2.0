import { defineComponent } from 'vue'
import styles from './LeakageDialog.module.scss'
import { useLeakageDialog } from '../../../../Controllers/LeakageDialog'
import BaseDialog from '@/components/BaseDialog/index.vue'

export default defineComponent({
  name: '试漏仪设备配置',
  props: {
    // 控制弹窗显示隐藏
    modelValue: {
      type: Boolean,
      default: false,
    },

    row: {
      type: Object,
      default: {},
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx) {
    const { visible, onOpen, onClose, onConfirm, delSetting, dataObj } =
      useLeakageDialog(props, ctx)
    return () => {
      return (
        <div class={styles.processSetting}>
          <BaseDialog
            width="600px"
            height="150px"
            v-model={visible.value}
            title="试漏仪设备配置"
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

              <div class={styles.label}>
                当前工位：{props.row?.workStationName}
              </div>
              <div class={styles.delete} onClick={delSetting}>
                删除配置
              </div>
            </div>

            <div class={styles.formLine}>
              <div class={[styles.label, styles.required]}>IP地址</div>
              <div class={styles.val}>
                <el-input v-model={dataObj.ip} />
              </div>
            </div>
            <div class={styles.formLine}>
              <div class={[styles.label, styles.required]}>端口号</div>
              <div class={styles.val}>
                <el-input v-model={dataObj.port} type="number" />
              </div>
            </div>
          </BaseDialog>
        </div>
      )
    }
  },
})
