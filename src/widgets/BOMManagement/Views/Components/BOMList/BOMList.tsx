import { Fragment, defineComponent, ref } from 'vue'
import styles from './BOMList.module.scss'
import Container from '@/components/Container/Container'
import IconButton from '@/components/IconButton/IconButton'
import BaseTable from '@/components/Table/Table'
import { BOMList } from '@/widgets/BOMManagement/Controllers/BOMList'
import { vPermission } from '@/libs/Permission/Permission'

export default defineComponent({
  name: 'BOM列表',
  emits: ['confirm'],
  directives: {
    permission: vPermission,
  },
  setup(props, ctx) {
    const {
      dataSource,
      tableRef,
      onImport,
      onExport,
      columns,
      onSearch,
      params,
      innerValue,
      onRowClick,
      onBlur,
      onFocus,
    } = BOMList(props, ctx)
    return () => {
      return (
        <Container
          title="BOM列表"
          onConfirm={onSearch}
          v-model={innerValue.value}
        >
          <div class={styles.tools}>
            <el-upload
              action="#"
              accept=".xlsx"
              show-file-list={false}
              http-request={onImport}
            >
              <IconButton
                v-permission="bom-management-add"
                class={styles.toolSpace}
                icon="import"
              >
                导入
              </IconButton>
            </el-upload>

            <IconButton
              v-permission="bom-management-export"
              class={styles.toolSpace}
              onClick={onExport}
              icon="export"
            >
              导出
            </IconButton>
          </div>
          <div class={styles.mainTable}>
            <BaseTable
              autoFirstClickRow
              params={params}
              onRowClick={onRowClick}
              ref={tableRef}
              url="/api/v1/materialmanagement/billofmaterial"
              v-model:dataSource={dataSource.value}
              columns={columns}
              v-slots={{
                bomName: ({ row }: any) => (
                  <el-input
                    v-model={row.bomName}
                    onBlur={() => onBlur(row)}
                    onFocus={() => onFocus(row.bomName)}
                  />
                ),
              }}
            />
          </div>
        </Container>
      )
    }
  },
})
