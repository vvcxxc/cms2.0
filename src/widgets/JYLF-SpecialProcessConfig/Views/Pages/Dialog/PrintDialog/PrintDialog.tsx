import { defineComponent } from 'vue'
import styles from './PrintDialog.module.scss'
import { usePrintDialog } from '../../../../Controllers/PrintDialog'
import BaseTable from '@/components/Table/Table'
import BaseDialog from '@/components/BaseDialog/index.vue'
import Title from '@/components/Title/Title'

export default defineComponent({
  name: '标签打印配置',
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
    const {
      visible,
      dataObj,
      tableRef,
      columns,
      dataSource,
      onOpen,
      onClose,
      onConfirm,
      delSetting,
      selectVariable,
    } = usePrintDialog(props, ctx)

    const VarInput = (props: any) => {
      return (
        <el-input
          v-model={dataObj[props.val]}
          v-slots={{
            suffix: () => (
              <img
                src={
                  new URL(
                    `../../../../../../assets/svg/more.svg`,
                    import.meta.url
                  ).href
                }
                class={styles.more}
                onClick={() => selectVariable(props.val)}
              />
            ),
          }}
        />
      )
    }

    return () => {
      return (
        <div class={styles.processSetting}>
          <BaseDialog
            width="750px"
            v-model={visible.value}
            title="标签打印配置"
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

            <div class={styles.dataLine}>
              <div class={styles.formLine}>
                <div class={[styles.label, styles.required]}>打印机IP</div>
                <div class={styles.val}>
                  <el-input v-model={dataObj.printIp} />
                </div>
              </div>
              <div class={styles.formLine}>
                <div class={[styles.label, styles.required]}>打印机名称</div>
                <div class={styles.val}>
                  <el-input v-model={dataObj.printName} />
                </div>
              </div>
            </div>
            <div class={styles.dataLine}>
              <div class={styles.formLine}>
                <div class={[styles.label, styles.required]}>标签模板</div>
                <div class={styles.val}>
                  <el-input v-model={dataObj.printTemplate} />
                </div>
              </div>
              <div class={styles.formLine}>
                <div class={[styles.label, styles.required]}>标签打印信号</div>
                <div class={styles.val}>
                  <VarInput val="printSignal" />
                </div>
              </div>
            </div>

            <div class={styles.dataLine}>
              <div class={styles.formLine}>
                <div class={[styles.label, styles.required]}>生成条码</div>
                <div class={styles.val}>
                  <VarInput val="printGenerateCodeVariable" />
                </div>
              </div>
              <div class={styles.formLine}>
                <div class={[styles.label, styles.required]}>标签打印结果</div>
                <div class={styles.val}>
                  <VarInput val="printResultVariable" />
                </div>
              </div>
            </div>

            <Title top={5} bottom={12}>
              打印规则
            </Title>
            <div class={styles.dataLine}>
              <div class={styles.formLine}>
                <div class={[styles.label, styles.required]}>设备编号</div>
                <div class={styles.val}>
                  <el-input v-model={dataObj.printDeviceCode} />
                </div>
              </div>
              <div class={styles.formLine}>
                <div class={[styles.label, styles.required]}>产品数量信号</div>
                <div class={styles.val}>
                  <VarInput val="printNumSignal" />
                </div>
              </div>
            </div>
            <div class={styles.tableLine}>
              <div class={styles.tableLabel}>字段别名</div>
              <div class={styles.table}>
                <BaseTable
                  id="key"
                  ref={tableRef}
                  v-model:dataSource={dataSource.value}
                  columns={columns}
                  isHidePagination={true}
                  v-slots={{
                    aliasName: ({ row }: any) => (
                      <el-input v-model={row.aliasName} />
                    ),
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
