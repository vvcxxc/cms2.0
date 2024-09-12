import { defineComponent } from 'vue'
import styles from './MaterialCode.module.scss'
import { useMaterialCode } from '../../../Controllers/MaterialCode'
import BaseTable from '@/components/Table/Table'
import { columns } from './Config'
import IconButton from '@/components/IconButton/IconButton'
import MaterialCodeFormDialog from '../../Pages/Dialog/MaterialCodeFormDialog/MaterialCodeFormDialog'
import { useProvideModels } from '@/libs/Provider/app'
import { vPermission } from '@/libs/Permission/Permission'
import { permissionCodes } from '../../../enum'
import Container from '@/components/Container/Container'
export default defineComponent({
  name: '物料编号列表',
  directives: {
    permission: vPermission,
  },
  setup(props, ctx) {
    useProvideModels()
    const {
      tableRef,
      dataSource,
      onDelete,
      dialogConfig,
      onCheck,
      onAddMaterial,
      onEditMaterial,
      onConfirm,
      searchInner,
      onSearch,
      sortUrl,
    } = useMaterialCode(props)

    return () => {
      return (
        <Container
          title="物料编号列表"
          onConfirm={onSearch}
          v-model={searchInner.value}
        >
          <div class={styles.content}>
            <div class={styles.header}>
              <IconButton
                v-permission="material-management-add"
                icon="add-p"
                type="primary"
                onClick={onAddMaterial}
              >
                添加
              </IconButton>
              <el-divider direction="vertical" />
              <IconButton
                v-permission="material-management-edit"
                icon="edit"
                onClick={onEditMaterial}
              >
                编辑
              </IconButton>
              <IconButton
                v-permission="material-management-delete"
                icon="delete"
                onClick={onDelete}
              >
                删除
              </IconButton>
            </div>
            <div class={styles.materialTable}>
              <BaseTable
                ref={tableRef}
                sortUrlTpl={sortUrl.value}
                v-model:dataSource={dataSource.value}
                columns={columns}
                isDrag={true}
                isChecked={true}
                onCheck={onCheck}
                onClickFooter={onAddMaterial}
              />
            </div>
          </div>
          <MaterialCodeFormDialog
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
