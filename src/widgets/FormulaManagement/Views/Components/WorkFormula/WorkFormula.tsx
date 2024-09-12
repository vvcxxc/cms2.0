import { computed, defineComponent, ref } from 'vue'
import Title from '@/components/Title/Title'
import styles from './WorkFormula.module.scss'
import { CaretBottom, Search } from '@element-plus/icons-vue'
import BaseTable from '@/components/Table/Table'
import { useWorkFormula } from '@/widgets/FormulaManagement/Controllers/WorkFormula'
import Icon from '@/components/Icon/Icon'
export default defineComponent({
  name: '工艺配方',
  setup() {
    const {
      columns,
      state,
      dataSource,
      filterForm,
      onChange,
      onRowClick,
      tableRef,
    } = useWorkFormula()

    return () => (
      <div class={styles.workSection}>
        <Title>工艺配方</Title>
        <el-form inline class={styles.searchTool} onSubmit={(e: Event) => e.preventDefault()}>
          <el-form-item label="配方" class={styles.formItem}>
            <el-input
              onChange={onChange}
              v-model={filterForm.Filter}
              size="small"
              prefix-icon={Search}
              placeholder="请输入配方名称"
            />
          </el-form-item>
          <el-form-item label="产品" class={styles.formItem}>
            <el-input
              onChange={onChange}
              v-model={filterForm.ProductFilter}
              size="small"
              prefix-icon={Search}
              placeholder="请输入产品型号"
            />
          </el-form-item>
        </el-form>
        <div class={styles.sectionTable}>
          <BaseTable
            params={{
              Filter: filterForm.Filter,
              ProductFilter: filterForm.ProductFilter,
              IncludeDetails: true,
            }}
            key="formula"
            ref={tableRef}
            id="newId"
            autoFirstClickRow
            style="margin-top:10px"
            v-model:dataSource={dataSource.value}
            columns={columns}
            isHidePagination={true}
            onRowClick={onRowClick}
            vSlots={{
              ['currentVersion.header']: () => (
                <div class={styles.versionTip}>
                  <span class={styles.text}>配方当前版本</span>
                  <el-tooltip
                    placement="bottom"
                    content="当前需要生产的配方版本请在配方管理中设置"
                  >
                    <Icon icon="tip" width={16} height={16} />
                  </el-tooltip>
                </div>
              ),
              currentVersion: ({row}: any)=> {
                return row.currentVersion
              }
            }}
          />
        </div>
      </div>
    )
  },
})
