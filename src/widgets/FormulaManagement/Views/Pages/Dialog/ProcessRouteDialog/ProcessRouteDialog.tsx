import { defineComponent } from 'vue'
import BaseDialog from '@/components/BaseDialog/index.vue'
import { useProcessRouteDialog } from '../../../../Controllers/ProcessRouteDialog'
import styles from './ProcessRouteDialog.module.scss'
import WorkSection from '../../../Components/WorkSection/WorkSection'
import { Right, Back } from '@element-plus/icons-vue'
import { _t } from '@/libs/Language/Language'
export default defineComponent({
  name: '工艺路线设置',
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
      default: () => [],
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx) {
    const {
      onClose,
      onConfirm,
      visible,
      leftSource,
      rightSource,
      leftOnCheck,
      rightOnCheck,
      onMoveRight,
      onMoveLeft,
      leftRef,
      rightRef,
      onOpen,
    } = useProcessRouteDialog(props, ctx)
    return () => (
      <BaseDialog
        class={styles.drawer}
        destroy-on-close
        style="background: #fff"
        width="1096px"
        height="578px"
        title={props.title}
        v-model={visible.value}
        onClose={onClose}
        onConfirm={onConfirm}
        onOpen={onOpen}
      >
        <div class={styles.container}>
          <WorkSection
            ref={leftRef}
            isChecked={true}
            title={_t('工序选择')}
            onCheck={leftOnCheck}
            v-model:dataSource={leftSource.value}
          />
          <div class={styles.moveBtn}>
            <el-button class={styles.btn} onClick={onMoveRight}>
              <el-icon size="18">
                <Right />
              </el-icon>
            </el-button>
            <el-button class={styles.btn} onClick={onMoveLeft}>
              <el-icon size="18">
                <Back />
              </el-icon>
            </el-button>
          </div>
          <WorkSection
            ref={rightRef}
            isChecked={true}
            isDrag={true}
            showSeq={true}
            title={_t('工艺路线')}
            onCheck={rightOnCheck}
            v-model:dataSource={rightSource.value}
          />
        </div>
      </BaseDialog>
    )
  },
})
