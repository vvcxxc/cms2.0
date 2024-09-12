import { defineComponent } from 'vue'
import styles from './ViewDetail.module.scss'
import { useVariableDialog } from '../../Controllers/VariableDialog'
import BaseDialog from '@/components/BaseDialog/index.vue'
import BaseTable from '@/components/Table/Table'
import { VariableSettingColumns } from '../../enum'

export default defineComponent({
  name: '变量配置',
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
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx) {
    const {
      visible,
      tableRef,
      dataObj,
      dataSource,
      onOpen,
      onClose,
      onConfirm,
      selectVariable,
      selectTableVariable,
    } = useVariableDialog(props, ctx)
    return () => {
      return (
        <div class={styles.ViewDetail}>
          <BaseDialog
            width="900px"
            height="452px"
            v-model={visible.value}
            title="变量配置"
            onClose={onClose}
            onConfirm={onConfirm}
            onOpen={onOpen}
            destroy-on-close
          >
            <div class={styles.labelLine}>
              <div class={styles.label}>
                <span class={styles.required}>*</span>点检信号：
              </div>
              <div class={styles.value}>
                <el-input
                  style="width: 100%"
                  v-model={dataObj.spotCheckTag}
                  v-slots={{
                    suffix: () => (
                      <img
                        src={
                          new URL(
                            `../../../../assets/svg/more.svg`,
                            import.meta.url
                          ).href
                        }
                        class={styles.more}
                        onClick={() => selectVariable('spotCheckTag')}
                      />
                    ),
                  }}
                ></el-input>
              </div>
            </div>
            <div class={styles.labelLine}>
              <div class={styles.label}>
                <span class={styles.required}>*</span>点检测试方式：
              </div>
              <div class={styles.value}>
                <el-input
                  style="width: 100%"
                  v-model={dataObj.checkModesTag}
                  v-slots={{
                    suffix: () => (
                      <img
                        src={
                          new URL(
                            `../../../../assets/svg/more.svg`,
                            import.meta.url
                          ).href
                        }
                        class={styles.more}
                        onClick={() => selectVariable('checkModesTag')}
                      />
                    ),
                  }}
                ></el-input>
              </div>
            </div>
            <div class={styles.labelLine}>
              <div class={styles.label}>
                <span class={styles.required}>*</span>点检总合格：
              </div>
              <div class={styles.value}>
                <el-input
                  style="width: 100%"
                  v-model={dataObj.checkResultTag}
                  v-slots={{
                    suffix: () => (
                      <img
                        src={
                          new URL(
                            `../../../../assets/svg/more.svg`,
                            import.meta.url
                          ).href
                        }
                        class={styles.more}
                        onClick={() => selectVariable('checkResultTag')}
                      />
                    ),
                  }}
                ></el-input>
              </div>
            </div>
            <div class={styles.labelLine}>
              <div class={styles.label}>
                <span class={styles.required}>*</span>工位信号：
              </div>
              <div class={styles.table}>
                <BaseTable
                  ref={tableRef}
                  v-model:dataSource={dataSource.value}
                  columns={VariableSettingColumns}
                  isHidePagination={true}
                  v-slots={{
                    checkResultTag: ({ row, index }: any) => {
                      return (
                        <el-input
                          style="width: 100%"
                          v-model={row.checkResultTag}
                          v-slots={{
                            suffix: () => (
                              <img
                                src={
                                  new URL(
                                    `../../../../assets/svg/more.svg`,
                                    import.meta.url
                                  ).href
                                }
                                class={styles.more}
                                onClick={() =>
                                  selectTableVariable('checkResultTag', row)
                                }
                              />
                            ),
                          }}
                        ></el-input>
                      )
                    },
                    blockTag: ({ row, index }: any) => {
                      return (
                        <el-input
                          style="width: 100%"
                          v-model={row.blockTag}
                          v-slots={{
                            suffix: () => (
                              <img
                                src={
                                  new URL(
                                    `../../../../assets/svg/more.svg`,
                                    import.meta.url
                                  ).href
                                }
                                class={styles.more}
                                onClick={() =>
                                  selectTableVariable('blockTag', row)
                                }
                              />
                            ),
                          }}
                        ></el-input>
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
