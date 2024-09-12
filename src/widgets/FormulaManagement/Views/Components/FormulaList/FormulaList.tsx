import { Fragment, defineComponent, ref } from 'vue'
import styles from './FormulaList.module.scss'
import Container from '@/components/Container/Container'
import IconButton from '@/components/IconButton/IconButton'
import TableFilter from '@/components/TableFilter/TableFilter'
import { useFormula } from '@/widgets/FormulaManagement/Controllers/Formula'
import Icon from '@/components/Icon/Icon'
import BaseTable from '@/components/Table/Table'
import FormulaFormDialog from '../../Pages/Dialog/FormulaFormDialog/FormulaFormDialog'
import VersionManageDialog from '../../Pages/Dialog/VersionManageDialog/VersionManageDialog'
import { vPermission } from '@/libs/Permission/Permission'

export default defineComponent({
  name: '配方列表',
  emits: ['confirm'],
  directives: {
    permission: vPermission,
  },
  setup(props, ctx) {
    const {
      addFormula,
      tableRef,
      columns,
      dialogConfig,
      onConfirm,
      onSearch,
      params,
      onExport,
      onImport,
      onDelete,
      onCopy,
      onVersion,
      onEditFormula,
      onCheck,
      dataSource,
      onConfirmVersin,
      innerValue,
      onRowClick,
      filterColumns,
    } = useFormula(props, ctx)
    return () => {
      return (
        <Container
          title="配方列表"
          placeholder="请输入配方名称"
          onConfirm={onSearch}
          v-model={innerValue.value}
        >
          <div class={styles.tools}>
            <IconButton
              v-permission="formula-management-add"
              icon="add-p"
              onClick={addFormula}
              type="primary"
            >
              添加
            </IconButton>
            <TableFilter
              // fieldMap={fieldMap.value}
              tableRef={tableRef}
              text="添加条件"
              columns={filterColumns.value}
            >
              <IconButton icon="f" class={styles.toolSpace}>
                筛选
              </IconButton>
            </TableFilter>

            <IconButton
              icon="edit"
              v-permission="formula-management-edit"
              onClick={onEditFormula}
              class={styles.toolSpace}
            >
              编辑
            </IconButton>

            <IconButton
              v-permission="formula-management-delete"
              icon="delete"
              onClick={onDelete}
            >
              删除
            </IconButton>
            <IconButton
              v-permission="formula-management-create-copy"
              icon="fb"
              onClick={onCopy}
            >
              创建副本
            </IconButton>
            <IconButton
              v-permission="formula-management-version"
              icon="banben"
              onClick={onVersion}
            >
              版本管理
            </IconButton>
            <el-upload
              action="#"
              accept=".xlsx"
              show-file-list={false}
              http-request={onImport}
            >
              <IconButton
                v-permission="formula-management-import"
                class={styles.toolSpace}
                icon="import"
              >
                导入
              </IconButton>
            </el-upload>

            <IconButton
              class={styles.toolSpace}
              icon="export"
              onClick={onExport}
              v-permission="formula-management-export"
            >
              导出
            </IconButton>
          </div>
          <div class={styles.mainTable}>
            <BaseTable
              params={params}
              ref={tableRef}
              pageSize={999}
              url="/api/v1/formulamanagement/formula"
              sortUrlTpl="/api/v1/formulamanagement/formula/{id}/adjustsort/{sort}"
              v-model:dataSource={dataSource.value}
              columns={columns}
              isDrag={true}
              isChecked={true}
              // isFooter={true}
              onRowClick={onRowClick}
              isHidePagination={true}
              onCheck={onCheck}
              autoFirstClickRow={true}
              // onClickFooter={onAddProduct}
              v-slots={{
                formula2WorkSections: ({ row }: any) => {
                  return (
                    <el-popover
                      placement="bottom"
                      width={1072}
                      vSlots={{
                        reference: () => (
                          <Icon icon="icon_process" width={64} height={10} />
                        ),
                        default: () => (
                          <div class={styles.processStep}>
                            {row.formula2WorkSections?.map(
                              (item: any, index: number) => (
                                <Fragment>
                                  <div class={styles.stepItem}>
                                    <el-tooltip
                                      effect="dark"
                                      content={item.workSectionName}
                                      placement="top"
                                      show-after={200}
                                    >
                                      <span class={styles.stepName}>
                                        {item.workSectionName}
                                      </span>
                                    </el-tooltip>
                                  </div>
                                  <Icon
                                    icon={`processStep${(index % 4) + 1}`}
                                    width={19}
                                    height={10}
                                    class={styles.stepIcon}
                                  />
                                </Fragment>
                              )
                            )}
                          </div>
                        ),
                      }}
                    ></el-popover>
                  )
                },
                // process: (row: any) => {
                //   return <Tag>{row.process || 'test'}</Tag>
                // },
              }}
            />
          </div>

          <FormulaFormDialog
            v-model={dialogConfig.visibleFormulaForm}
            title={dialogConfig.formulaFormTitle}
            rowData={dialogConfig.rowData}
            onConfirm={onConfirm}
            isCopy={dialogConfig.isCopy}
          />
          <VersionManageDialog
            v-model={dialogConfig.visibleVersionManagement}
            title={dialogConfig.formulaFormTitle}
            onConfirm={onConfirmVersin}
            rowData={dialogConfig.rowData}
          />
        </Container>
      )
    }
  },
})
