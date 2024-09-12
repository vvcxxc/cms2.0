import { defineComponent } from 'vue'
import styles from './Material.module.scss'
import { useMaterial } from '../../../Controllers/Material'
import BaseTable from '@/components/Table/Table'
import { columns } from './Config'
import IconButton from '@/components/IconButton/IconButton'
import MaterialFormDialog from '../../Pages/Dialog/MaterialFormDialog/MaterialFormDialog'
import { useProvideModels } from '@/libs/Provider/app'
import Search from '@/components/Search/Search'
import { vPermission } from '@/libs/Permission/Permission'
import { permissionCodes } from '../../../enum'
import Container from '@/components/Container/Container'
import LoadingSettings from '../../Pages/Dialog/LoadingSettings/LoadingSettings'

export default defineComponent({
  name: '物料管理',
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
      settingDialogConfig,
      onCheck,
      onLoadSettings,
      onExport,
      onImport,
      onAddMaterial,
      onEditMaterial,
      onConfirm,
      searchInner,
      onSearch,
      onRowClick,
    } = useMaterial(props)

    return () => {
      return (
        <Container
          title="物料列表"
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

              <el-upload
                action="#"
                accept=".xlsx"
                show-file-list={false}
                http-request={onImport}
              >
                <IconButton
                  v-permission="material-management-import"
                  icon="import"
                >
                  导入
                </IconButton>
              </el-upload>

              <IconButton
                v-permission="material-management-export"
                icon="export"
                onClick={onExport}
              >
                导出
              </IconButton>
              <IconButton
                v-permission="material-management-load"
                icon="s"
                onClick={onLoadSettings}
              >
                上料配置
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
                params={{
                  Filter: searchInner.value,
                }}
                url="/api/v1/materialmanagement/material"
                sortUrlTpl="/api/v1/materialmanagement/material/{id}/reorder/{sort}"
                v-model:dataSource={dataSource.value}
                columns={columns}
                isDrag={true}
                isChecked={true}
                onCheck={onCheck}
                onClickFooter={onAddMaterial}
                autoFirstClickRow={true}
                onRowClick={onRowClick}
              />
            </div>
          </div>
          <MaterialFormDialog
            v-model={dialogConfig.visible}
            title={dialogConfig.title}
            rowData={dialogConfig.rowData}
            onConfirm={onConfirm}
          />
          <LoadingSettings
            v-model={settingDialogConfig.visible}
            onConfirm={onConfirm}
          />
        </Container>
      )
    }
  },
})
