import { ref, defineComponent, computed } from 'vue'
import type { Ref } from 'vue'
import { ElMessage } from 'element-plus'
import BaseTable from '@/components/Table/Table'
import styles from './FieldList.module.scss'
import { useField } from '../../../Controllers/FieldList'
import { columns } from './Config'
import Variable from '@/components/Variable/Variable'
import Icon from '@/components/Icon/Icon'
import { useGlobalState } from '@/libs/Store/Store'

export default defineComponent({
  name: '流程',
  setup(props, ctx) {
    const {
      dataSource,
      tableRef,
      productLine,
      productLineList,
      currentDataSource,
      onSave,
      onChange,
      onChangeProductLine,
    } = useField(props, ctx)
    const { systemConfig } = useGlobalState()

    const hasProductionLineStructure = computed(() => {
      const { ProductionLineStructure } = systemConfig.state.value
      return ProductionLineStructure == 1
    })
    /**
     * @returns 表格
     */
    const RenderBaseTable = () => {
      return (
        <div class={styles.list}>
          <BaseTable
            ref={tableRef}
            v-model:dataSource={currentDataSource.value}
            columns={columns}
            isHidePagination={true}
            v-slots={{
              variable: ({ row }: any) => {
                return (
                  <div class={styles.variable}>
                    <Variable v-model={row.variable} onChange={onChange} />
                    <Icon icon="fnV" width={18} height={16} />
                  </div>
                )
              },
            }}
          ></BaseTable>
        </div>
      )
    }
    return () => {
      return (
        <div class={styles.content}>
          <div class={styles.headers}>
            {hasProductionLineStructure.value ? (
              <div class={styles.box}>
                <label>产线段</label>
                <el-select
                  clearable
                  onChange={onChangeProductLine}
                  v-model={productLine.value}
                  class={styles.select}
                >
                  {productLineList.value.map((item) => {
                    return (
                      <el-option
                        label={item.name}
                        value={item.value}
                      ></el-option>
                    )
                  })}
                </el-select>
              </div>
            ) : (
              <span></span>
            )}

            <el-button onClick={onSave} class={styles.save} type="primary">
              保存
            </el-button>
          </div>
          <RenderBaseTable />
        </div>
      )
    }
  },
})
