import { Fragment, defineComponent, ref } from 'vue'
import styles from './BOMDetails.module.scss'
import Container from '@/components/Container/Container'
import IconButton from '@/components/IconButton/IconButton'
import BaseTable from '@/components/Table/Table'
import { BOMDetails } from '@/widgets/BOMManagement/Controllers/BOMDetails'
import TableFilter from '@/components/TableFilter/TableFilter'
import BOMFormDialog from '../../Pages/Dialog/BOMFormDialog/BOMFormDialog'
import { vPermission } from '@/libs/Permission/Permission'

export default defineComponent({
  name: 'BOM详情',
  emits: ['confirm'],
  directives: {
    permission: vPermission,
  },
  setup(props, ctx) {
    const {
      dataSource,
      tableRef,
      columns,
      dialogConfig,
      onConfirm,
      onSearch,
      onAdd,
      onEdit,
      onDelete,
      onCheck,
      params,
      innerValue,
      filterColumns,
      onFilterChange,
      curRowData,
    } = BOMDetails(props, ctx)
    return () => {
      return (
        <Container
          title={curRowData.value?.bomName}
          onConfirm={onSearch}
          v-model={innerValue.value}
        >
          <div class={styles.tools}>
            <IconButton
              v-permission="bom-management-add"
              icon="add-p"
              type="primary"
              onClick={onAdd}
            >
              添加
            </IconButton>
            <TableFilter
              ref={tableRef}
              columns={filterColumns.value}
              onChange={onFilterChange}
              defaultOptions={[
                {
                  label: '全部',
                },
              ]}
            >
              <IconButton icon="gongyiduan" class={styles.toolSpace}>
                筛选
              </IconButton>
            </TableFilter>

            <IconButton
              v-permission="bom-management-edit"
              icon="edit"
              onClick={onEdit}
              class={styles.toolSpace}
            >
              编辑
            </IconButton>

            <IconButton
              v-permission="bom-management-delete"
              icon="delete"
              onClick={onDelete}
            >
              删除
            </IconButton>
          </div>
          <div class={styles.mainTable}>
            <BaseTable
              params={params}
              ref={tableRef}
              isDrag={true}
              sortUrlTpl={`/api/v1/materialmanagement/billofmaterial/${curRowData.value?.productId}/{id}/reorder/{sort}`}
              v-model:dataSource={dataSource.value}
              columns={columns}
              isChecked={true}
              onCheck={onCheck}
              isHidePagination={true}
            />
          </div>

          <BOMFormDialog
            v-model={dialogConfig.visible}
            title={dialogConfig.title}
            rowData={dialogConfig.rowData}
            onConfirm={onConfirm}
          />
        </Container>
      )
    }
  },
})
