import { defineComponent } from 'vue'
import styles from './Apply.module.scss'
import BaseTable from '@/components/Table/Table'
import IconButton from '@/components/IconButton/IconButton'
import { useApply } from '@/widgets/FormulaManagement/Controllers/Apply'
import ApplyIssueDialog from '../Dialog/ApplyIssueDialog/ApplyIssueDialog'
import { usePermission, vPermission } from '@/libs/Permission/Permission'
export default defineComponent({
  name: '物料管理',
  directives: {
    permission: vPermission,
  },
  setup(props, ctx) {
    const {
      tableRef,
      dataSource,
      columns,
      dialogConfig,
      onClickIssue,
      onConfirm,
      showDistribute,
    } = useApply(props)

    return () => {
      return (
        <div class={styles.Apply}>
          <div class={styles.header}>
            {showDistribute.value && (
              <el-button
                v-permission="formula-management-distribute"
                type="primary"
                size="small"
                onClick={onClickIssue}
              >
                配方下发
              </el-button>
            )}
          </div>
          <div class={styles.mainTable}>
            <BaseTable
              ref={tableRef}
              url="/api/v1/formulamanagement/formulaapply"
              v-model:dataSource={dataSource.value}
              columns={columns}
            />
          </div>
          <ApplyIssueDialog
            v-model={dialogConfig.visible}
            title={dialogConfig.title}
            onConfirm={onConfirm}
          />
        </div>
      )
    }
  },
})
