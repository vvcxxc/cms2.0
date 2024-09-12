import { computed, defineComponent } from 'vue'
import BaseDialog from '@/components/BaseDialog/index.vue'
import { useLoadingSettings } from '../../../../Controllers/LoadingSettings'
import BaseTable from '@/components/Table/Table'
import styles from './LoadingSettings.module.scss'
import ChooseMaterial from './ChooseMaterial'

export default defineComponent({
  name: '上料配置',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx) {
    const {
      onClose,
      onConfirm,
      onOpen,
      openChooseMaterial,
      chooseMaterialCallback,
      selectVariable,
      onCheck,
      onDelete,
      dataObj,
      visible,
      tableRef,
      dataSource,
      materialTypeMap,
      columns,
    } = useLoadingSettings(props, ctx)
    return () => (
      <div>
        <BaseDialog
          destroy-on-close
          title="上料配置"
          class={styles.drawer}
          style="background: #fff"
          width="500px"
          v-model={visible.value}
          onClose={onClose}
          onConfirm={onConfirm}
          onOpen={onOpen}
        >
          <div class={styles.container}>
            <div class={styles.line}>
              <div class={styles.label}>
                <span class={styles.required}>*</span>
                料仓信号
              </div>
              <div class={styles.value}>
                <el-input
                  style="width: calc(100% - 80px)"
                  placeholder="请选择料仓信号"
                  v-model={dataObj.warehouseSignal}
                />
                <div class={styles.btn} onClick={selectVariable}>
                  选择
                </div>
              </div>
            </div>
            <div class={styles.line}>
              <div class={styles.label}>
                <span class={styles.required}>*</span>手动上料物料
              </div>
              <div class={styles.value}>
                <div
                  class={styles.btn}
                  style={{ marginRight: '10px' }}
                  onClick={openChooseMaterial}
                >
                  选择
                </div>
                <div class={styles.btn} onClick={onDelete}>
                  删除
                </div>
              </div>
            </div>
            <div class={styles.table}>
              <BaseTable
                ref={tableRef}
                id="materialId"
                v-model:dataSource={dataSource.value}
                columns={columns}
                isHidePagination={true}
                isChecked={true}
                onCheck={onCheck}
                v-slots={{
                  materialType: ({ row }: any) => {
                    return materialTypeMap[row.materialType]
                  },
                  signal: ({ row }: any) => {
                    return <el-input v-model={row.signal} />
                  },
                }}
              />
            </div>
          </div>
        </BaseDialog>
        <ChooseMaterial
          v-model={dataObj.chooseMaterialVisible}
          selectedList={dataSource.value}
          onConfirm={chooseMaterialCallback}
        />
      </div>
    )
  },
})
