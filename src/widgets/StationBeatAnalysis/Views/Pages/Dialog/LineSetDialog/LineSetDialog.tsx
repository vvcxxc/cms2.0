import Dialog from '@/components/BaseDialog/index.vue'
const BaseDialog: any = Dialog
import { defineComponent, SetupContext } from 'vue'
import styles from './LineSetDialog.module.scss'
import { useLineSetDialog } from '../../../../Controllers/LineSetDialog'
import BaseTable from '@/components/Table/index.vue' //这里用Table.ts会导致setAllCheckboxRow失效
import { _t, LanguageScopeKey } from '../../../../app'

export default defineComponent({
  name: '产线设置',
  props: {
    visible: {
      type: Boolean,
      default: null,
    },
    date: {
      type: String,
      default: '',
    },
    segmentId: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx: SetupContext) {
    const {
      visible,
      tableRef,
      columns,
      dataSource,
      dataObj,
      onOpen,
      onClose,
      onConfirm,
      saveProcessingcycle,
      saveTargetproduction,
    } = useLineSetDialog(props, ctx)
    return () => {
      return (
        <div class={styles.LineSetDialog}>
          <div class={styles.DialogBtn} onClick={onOpen}>
            {_t('产线设置')}
          </div>
          <BaseDialog
            width="536px"
            height="450px"
            v-model={visible.value}
            title={_t('产线设置')}
            destroy-on-close
            onClose={onClose}
            onConfirm={onConfirm}
            v-slots={{
              footer: () => <div class={styles.footer}></div>,
            }}
          >
            <div class={styles.container}>
              <div class={styles.baseInfo}>
                <div class={styles.label}>{_t('生产日期')}： </div>
                <div class={styles.value}> {dataObj.productionDateStr} </div>
              </div>
              <div class={styles.baseInfo}>
                <div class={styles.label}>{_t('目标产量')}： </div>
                <el-input
                  style={{ width: '100px' }}
                  type="number"
                  v-model={dataObj.targetProduction}
                  placeholder={_t('请输入')}
                />
                <div class={styles.btn} onClick={saveTargetproduction}>
                  <img
                    class={styles.btnIcon}
                    src={
                      new URL(
                        `../../../../../../assets/images/ok.png`,
                        import.meta.url
                      ).href
                    }
                  />
                  {_t('保存')}
                </div>
              </div>
              <div class={styles.baseInfo}>
                <div class={styles.label2}>{_t('工位理论加工周期')}： </div>
                <div class={styles.btn} onClick={saveProcessingcycle}>
                  <img
                    class={styles.btnIcon}
                    src={
                      new URL(
                        `../../../../../../assets/images/ok.png`,
                        import.meta.url
                      ).href
                    }
                  />
                  {_t('保存')}
                </div>
              </div>

              <div class={styles.mainTable}>
                <BaseTable
                  ref={tableRef}
                  v-model:dataSource={dataSource.value}
                  columns={columns.value}
                  isChecked={false}
                  isDrag={false}
                  isHidePagination={true}
                  LanguageScopeKey={LanguageScopeKey}
                  v-slots={{
                    theoreticalProcessingCycle: ({ row }: any) => {
                      return (
                        <el-input
                          type="number"
                          v-model={row.theoreticalProcessingCycle}
                          placeholder={_t('请输入')}
                        />
                      )
                    },
                  }}
                />
              </div>
            </div>
          </BaseDialog>
        </div>
      )
    }
  },
})
