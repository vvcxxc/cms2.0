import { Fragment, defineComponent, ref } from 'vue'
import styles from './ProcessRoute.module.scss'
import Container from '@/components/Container/Container'
import IconButton from '@/components/IconButton/IconButton'
import TableFilter from '@/components/TableFilter/TableFilter'
import { useProcessRoute } from '@/widgets/FormulaManagement/Controllers/ProcessRoute'
import Icon from '@/components/Icon/Icon'
import BaseTable from '@/components/Table/Table'
export default defineComponent({
  emits: ['confirm'],
  setup(props, ctx) {
    const {
      tableRef,
      columns,
      filterColumns,
      onChange,
      onFilterChange,
      filterForm,
      dataSource,
      showLineStructure,
      onRowClick,
    } = useProcessRoute(props, ctx)
    return () => {
      return (
        <Container
          title="工艺路线"
          placeholder="请输入工序名称"
          onConfirm={onChange}
          v-model={filterForm.Filter}
        >
          {showLineStructure.value && (
            <div class={styles.tools}>
              <TableFilter
                v-model={filterForm}
                onChange={onFilterChange}
                columns={filterColumns.value}
                text="添加条件"
              >
                <IconButton icon="gongyiduan">工序段</IconButton>
              </TableFilter>
            </div>
          )}

          <div class={styles.mainTable}>
            <BaseTable
              ref={tableRef}
              pageSize={10}
              v-model:dataSource={dataSource.value}
              columns={columns.value}
              isHidePagination={true}
              autoFirstClickRow={true}
              onRowClick={onRowClick}
              // onCheck={onCheck}
              // onClickFooter={onAddProduct}
            />
          </div>
        </Container>
      )
    }
  },
})
