import { defineComponent } from 'vue'
import styles from './LaserDialog.module.scss'
import { useLaserDialog } from '../../../../Controllers/LaserDialog'
import BaseTable from '@/components/Table/Table'
import BaseDialog from '@/components/BaseDialog/index.vue'

export default defineComponent({
  name: '激光打码配置',
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
    } = useLaserDialog(props, ctx)
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
            width="1000px"
            v-model={visible.value}
            title="激光打码配置"
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
                <div class={[styles.label, styles.required]}>打码模式</div>
                <div class={styles.radioVal}>
                  <el-radio-group v-model={dataObj.laserCodingMode}>
                    <el-radio label="总控控制-条码含流水号" value={0} />
                    <el-radio label="总控控制-条码不含流水号" value={1} />
                  </el-radio-group>
                </div>
              </div>
            </div>
            <div class={styles.dataLine}>
              <div class={styles.formLine}>
                <div class={[styles.label, styles.required]}>IP地址</div>
                <div class={styles.val}>
                  <el-input v-model={dataObj.laserCodingIp} />
                </div>
              </div>
              <div class={styles.formLine}>
                <div class={[styles.label, styles.required]}>端口号</div>
                <div class={styles.val}>
                  <el-input v-model={dataObj.laserCodingPort} type="number" />
                </div>
              </div>
            </div>
            <div class={styles.dataLine}>
              {/* <div class={styles.formLine}>
                <div class={[styles.label, styles.required]}>打码别名</div>
                <div class={styles.val}>
                  <el-input v-model={dataObj.laserCodingAlias} />
                </div>
              </div> */}
              <div class={styles.formLine}>
                <div class={[styles.label, styles.required]}>激光打码信号</div>
                <div class={styles.val}>
                  <VarInput val="laserCodingSignal" />
                </div>
              </div>
              <div class={styles.formLine}>
                <div class={[styles.label, styles.required]}>生成打码内容</div>
                <div class={styles.val}>
                  <VarInput val="laserCodingGenerateCodeVariable" />
                </div>
              </div>
            </div>
            <div class={styles.dataLine}>
              <div class={styles.formLine}>
                <div class={[styles.label, styles.required]}>激光打码结果</div>
                <div class={styles.val}>
                  <VarInput val="laserCodingResultVariable" />
                </div>
              </div>
              <div class={styles.formLine}></div>
            </div>

            <div class={styles.tableLine}>
              <div class={styles.tableLabel}>设备编号</div>
              <div class={styles.table}>
                <BaseTable
                  id="productId"
                  ref={tableRef}
                  v-model:dataSource={dataSource.value}
                  columns={columns}
                  isHidePagination={true}
                  v-slots={{
                    haveSerialTemplate: ({ row }: any) => (
                      <el-input v-model={row.haveSerialTemplate} />
                    ),
                    noSerialTemplate: ({ row }: any) => (
                      <el-input v-model={row.noSerialTemplate} />
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
