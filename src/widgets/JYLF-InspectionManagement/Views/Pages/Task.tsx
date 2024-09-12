import { ref, defineComponent } from 'vue'
import BaseTable from '@/components/Table/Table'
import styles from './Inspection.module.scss'
import { useTask } from '../../Controllers/Task'
import IconButton from '@/components/IconButton/IconButton'
import TableFilter from '@/components/TableFilter/TableFilter'
import { ElMessage, ElMessageBox } from 'element-plus'
import Search from '@/components/Search/Search'
import EditDetailDialog from '../Components/EditDetailDialog'
import ViewDetail from '../Components/ViewDetail'
import VariableSettingDialog from '../Components/VariableSettingDialog'
import { statusMap } from '../../enum'
export default defineComponent({
  setup(props, ctx) {
    const {
      TaskColumns,
      dataSource,
      tableRef,
      checkedList,
      dataObj,
      search,
      onCheck,
      onSort,
      onSearch,
      onStart,
      onDelete,
      openEditDialog,
      openViewDetailDialog,
      openVariableDialog,
    } = useTask(props, ctx)

    //#region 渲染表头
    const RenderHeader = () => {
      return (
        <div class={styles.headers}>
          <div class={styles.left}>
            <TableFilter
              tableRef={tableRef}
              text="筛选"
              columns={TaskColumns.value}
            >
              <IconButton icon="f">筛选</IconButton>
            </TableFilter>
            <IconButton icon="add-p" onClick={() => openEditDialog('新增任务')}>
              新增
            </IconButton>
            <IconButton icon="s" onClick={() => onStart()}>
              开始
            </IconButton>
            <IconButton icon="edit" onClick={() => openEditDialog('编辑任务')}>
              编辑
            </IconButton>
            <IconButton icon="fb" onClick={() => openVariableDialog()}>
              变量配置
            </IconButton>
            <IconButton icon="delete" onClick={() => onDelete()}>
              删除
            </IconButton>
          </div>
          <div class={styles.box}>
            <Search
              onConfirm={() => onSearch()}
              v-model={search.value}
              placeholder="请输入任务名称、备注说明"
              style={{ width: '280px' }}
            />
          </div>
        </div>
      )
    }
    //#endregion

    //#region 渲染表格
    const RenderBaseTable = () => {
      return (
        <div class={styles.list}>
          <BaseTable
            ref={tableRef}
            url="/api/v1/jieyunlangfang/spotcheck"
            v-model:dataSource={dataSource.value}
            columns={TaskColumns.value}
            isChecked={true}
            onCheck={onCheck}
            isDrag={true}
            onDrag={onSort}
            v-slots={{
              status: ({ row }: any) => {
                return statusMap[row.status]
              },
              detail: ({ row }: any) => {
                return row.status == 1 ? (
                  <div
                    class={styles.checkBtn}
                    onClick={() => openViewDetailDialog(row)}
                  >
                    查看
                  </div>
                ) : (
                  '-'
                )
              },
            }}
          ></BaseTable>
        </div>
      )
    }
    //#endregion
    return () => {
      return (
        <div class={styles.content}>
          <RenderHeader />
          <RenderBaseTable />
          <EditDetailDialog
            v-model={dataObj.editDialogShow}
            title={dataObj.editTitle}
            row={checkedList.value.length ? checkedList.value[0] : null}
            onConfirm={onSearch}
          />
          <VariableSettingDialog
            v-model={dataObj.variableDialogShow}
            onConfirm={onSearch}
          />
          <ViewDetail
            v-model={dataObj.viewDialogShow}
            row={dataObj.viewRow}
            onConfirm={onSearch}
            title="点检任务"
          />
        </div>
      )
    }
  },
})
