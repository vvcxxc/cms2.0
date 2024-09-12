import { defineComponent } from 'vue'
import styles from './Log.module.scss'
import BaseTable from '@/components/Table/Table'
import IconButton from '@/components/IconButton/IconButton'
import { useLog } from '@/widgets/FormulaManagement/Controllers/Log'
import DateTimePickRange from '@/components/DateTimePickRange/DateTimePickRange'
import TableFilter from '@/components/TableFilter/TableFilter'
import { vPermission } from '@/libs/Permission/Permission'

export default defineComponent({
  name: '物料管理',
  directives: {
    permission: vPermission,
  },
  setup(props, ctx) {
    const {
      tableRef,
      dataSource,
      filterForm,
      columns,
      filterColumns,
      onExport,
      onChangeTime,
      onSort,
    } = useLog(props)

    return () => {
      return (
        <div class={styles.Log}>
          <div class={styles.header}>
            <DateTimePickRange
              To={filterForm.To}
              From={filterForm.From}
              onChange={onChangeTime}
              clearable={false}
            />
            <TableFilter
              tableRef={tableRef}
              v-model={filterForm}
              columns={filterColumns.value}
              text="添加条件"
              style={{ marginLeft: '10px' }}
            >
              <IconButton icon="gongyiduan" class={styles.toolSpace}>
                筛选
              </IconButton>
            </TableFilter>
            <IconButton
              v-permission="formula-management-log-export"
              icon="export"
              onClick={onExport}
            >
              导出
            </IconButton>
          </div>
          <div class={styles.mainTable}>
            <BaseTable
              onSort={onSort}
              params={filterForm}
              ref={tableRef}
              url="/api/v1/formulamanagement/formulalog"
              v-model:dataSource={dataSource.value}
              columns={columns}
            />
          </div>
        </div>
      )
    }
  },
})
