import { computed, defineComponent, ref } from 'vue'
import Title from '@/components/Title/Title'
import styles from './WorkSection.module.scss'
import { CaretBottom, Search } from '@element-plus/icons-vue'
import BaseTable from '@/components/Table/Table'
import { useWorkSection } from '@/widgets/ProductManagement/Controllers/WorkSection'
import { EnumListItemType } from '@/libs/Store/Store.d'
import { _t, LanguageScopeKey } from '../../../app'

export default defineComponent({
  name: '工序',
  setup() {
    const {
      columns,
      state,
      dataSource,
      filterForm,
      onChange,
      onRowClick,
      tableRef,
      showLineStructure,
    } = useWorkSection()

    return () => (
      <div class={styles.workSection}>
        <Title>{_t('工序')}</Title>
        <el-form
          inline
          class={styles.searchTool}
          onSubmit={(e: Event) => e.preventDefault()}
        >
          {showLineStructure.value && (
            <el-form-item label={_t('工序段')} class={styles.formItem}>
              <el-select
                onChange={onChange}
                v-model={filterForm.Segment}
                style="width: 110px"
                size="small"
                suffix-icon={
                  <el-icon>
                    <CaretBottom />
                  </el-icon>
                }
                placeholder={_t('请选择工序段')}
              >
                <el-option label={_t('全部')} value="" />
                {state.value.map((item: EnumListItemType) => {
                  return <el-option label={item.name} value={item.value} />
                })}
              </el-select>
            </el-form-item>
          )}

          <el-form-item label={_t('工序')} class={styles.formItem}>
            <el-input
              style="width: 140px"
              onChange={onChange}
              v-model={filterForm.Filter}
              size="small"
              prefix-icon={Search}
              placeholder={_t('请输入工序名称')}
            />
          </el-form-item>
        </el-form>
        <div class={styles.sectionTable}>
          <BaseTable
            autoFirstClickRow
            ref={tableRef}
            params={filterForm}
            url="/api/v1/messuite/query/worksection"
            style="margin-top:10px"
            pageSize={999}
            v-model:dataSource={dataSource.value}
            columns={columns.value}
            isHidePagination={true}
            onRowClick={onRowClick}
            LanguageScopeKey={LanguageScopeKey}
            vSlots={{
              segment: ({ row }: any) => {
                return row.segment?.name ?? '-'
              },
            }}
          />
        </div>
      </div>
    )
  },
})
