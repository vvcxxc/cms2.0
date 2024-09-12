import { computed, defineComponent, ref } from 'vue'
import Title from '@/components/Title/Title'
import styles from './WorkRoute.module.scss'
import { CaretBottom, Search } from '@element-plus/icons-vue'
import BaseTable from '@/components/Table/Table'
import { EnumListItemType } from '@/libs/Store/Store.d'
import { useWorkRoute } from '@/widgets/FormulaManagement/Controllers/WorkRoute'
export default defineComponent({
  name: '工序',
  setup() {
    const {
      columns,
      state,
      dataSource,
      filterForm,
      onChange,
      tableRef,
      onCheck,
    } = useWorkRoute()

    return () => (
      <div class={styles.workSection}>
        <Title>工艺路线</Title>
        <el-form inline class={styles.searchTool} onSubmit={(e: Event) => e.preventDefault()}>
          <el-form-item label="工序段" class={styles.formItem}>
            <el-select
              onChange={onChange}
              v-model={filterForm.Segment}
              style="width: 80px"
              size="small"
              suffix-icon={
                <el-icon>
                  <CaretBottom />
                </el-icon>
              }
              placeholder="请选择工序段"
            >
              <el-option label="全部" value={null} key="全部" />
              {state.value.map((item: EnumListItemType) => {
                // 后端返回的是名称
                return <el-option label={item.name} value={item.name} key={item.id} />
              })}
            </el-select>
          </el-form-item>
          <el-form-item label="工序名称" class={styles.formItem}>
            <el-input
              onChange={onChange}
              v-model={filterForm.Filter}
              size="small"
              prefix-icon={Search}
              placeholder="请输入工序名称"
            />
          </el-form-item>
        </el-form>
        <div class={styles.sectionTable}>
          <BaseTable
            params={{
              Filter: filterForm.Filter,
              Segment: filterForm.Segment,
            }}
            key="worksection"
            ref={tableRef}
            style="margin-top:10px"
            v-model:dataSource={dataSource.value}
            columns={columns}
            isHidePagination={true}
            onCheck={onCheck}
            isChecked={true}
          />
        </div>
      </div>
    )
  },
})
