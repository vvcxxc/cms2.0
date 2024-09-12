import { Fragment, defineComponent, ref } from 'vue'
import styles from './ProcessParams.module.scss'
import Container from '@/components/Container/Container'
import IconButton from '@/components/IconButton/IconButton'

import { useProcessParams } from '@/widgets/FormulaManagement/Controllers/ProcessParams'
import ParamsConifgDialog from '../../Pages/Dialog/ParamsConifgDialog/ParamsConifgDialog'
import BaseTable from '@/components/Table/Table'
import TableFilter from '@/components/TableFilter/TableFilter'
import BaseDialog from '@/components/BaseDialog/index.vue'
import VersionManageDialog from '../../Pages/Dialog/VersionManageDialog/VersionManageDialog'
export default defineComponent({
  emits: ['confirm'],
  setup(props, ctx) {
    const {
      tableRef,
      copllectColumns,
      paramsColumns,
      onSearch,
      params,
      currentTab,
      processParameterChecked,
      formulaParameterChecked,
      onChange,
      dialogConfig,
      onSelectParams,
      onValueChange,
      onRealChange,
      onConfirm,
      filterColumns,
      onFilterChange,
      onUpdateFn,
      onNewVersion,
      onVersionConfirm,
      currentFormula,
      onCloseUpdateDialog,
    } = useProcessParams(props, ctx)
    return () => {
      return (
        <Container
          title="工艺参数"
          placeholder="请输入参数名"
          onConfirm={onSearch}
          v-model={params.Filter}
        >
          <div class={styles.tools}>
            <el-radio-group
              v-model={currentTab.value}
              onChange={onChange}
              size="small"
            >
              <el-radio-button label="process">采集参数</el-radio-button>
              <el-radio-button label="formula">配方参数</el-radio-button>
            </el-radio-group>
            <el-divider direction="vertical" />
            <TableFilter
              v-model={params}
              columns={filterColumns.value}
              text="添加条件"
              onChange={onFilterChange}
            >
              <IconButton icon="banben">版本</IconButton>
            </TableFilter>
            {currentTab.value === 'formula' && (
              <el-button type="primary" size="small" onClick={onRealChange}>
                实时更新
              </el-button>
            )}
            <el-button
              class={styles.paramSelectBtn}
              text
              onClick={onSelectParams}
            >
              参数选择
            </el-button>
          </div>
          <div class={styles.mainTable}>
            {currentTab.value === 'process' ? (
              <BaseTable
                params={params}
                ref={tableRef}
                v-model:dataSource={processParameterChecked.value}
                columns={copllectColumns}
                isHidePagination={true}
                vSlots={{
                  name: ({ row }: any) => {
                    return row.name || row.parameterName
                  },
                  value: ({ row }: any) => {
                    return (
                      <el-input v-model={row.value} onChange={onValueChange} />
                    )
                  },
                  lower: ({ row }: any) => {
                    return (
                      <el-input v-model={row.lower} onChange={onValueChange} />
                    )
                  },
                  upper: ({ row }: any) => {
                    return (
                      <el-input v-model={row.upper} onChange={onValueChange} />
                    )
                  },
                }}
              />
            ) : (
              <BaseTable
                params={params}
                ref={tableRef}
                id="key"
                v-model:dataSource={formulaParameterChecked.value}
                columns={paramsColumns}
                isHidePagination={true}
                vSlots={{
                  name: ({ row }: any) => {
                    return row.name || row.parameterName
                  },
                  value: ({ row }: any) => {
                    return (
                      <el-input v-model={row.value} onChange={onValueChange} />
                    )
                  },
                  // real:({row}:any)=> {
                  //   return getVariableValue(row.parameterName)
                  // }
                }}
              />
            )}
          </div>
          <ParamsConifgDialog
            v-model={dialogConfig.visible}
            onConfirm={onConfirm}
          />
          <BaseDialog
            v-model={dialogConfig.updateVisible}
            onClose={onCloseUpdateDialog}
            v-slots={{
              footer: () => (
                <Fragment>
                  <el-button
                    class="cs-base-btn"
                    onClick={onCloseUpdateDialog}
                    type="info"
                    plain
                  >
                    取消
                  </el-button>
                  <el-button
                    onClick={onUpdateFn}
                    type="primary"
                    class="cs-base-btn"
                  >
                    更新
                  </el-button>
                  <el-button
                    onClick={onNewVersion}
                    type="primary"
                    class="cs-base-btn"
                  >
                    新建版本
                  </el-button>
                </Fragment>
              ),
            }}
          >
            <div class={styles.confirmContent}>
              请选择更新当前版本或新建版本？
            </div>
          </BaseDialog>
          <VersionManageDialog
            v-model={dialogConfig.versionVisible}
            title={currentFormula.value?.name + '-配方版本管理'}
            rowData={currentFormula.value}
            openSource="Params"
            onConfirm={onVersionConfirm}
          />
        </Container>
      )
    }
  },
})
