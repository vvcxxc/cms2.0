import { ref, defineComponent } from 'vue'
import type { Ref } from 'vue'
import { ElMessage } from 'element-plus'
import BaseTable from '@/components/Table/Table'
import styles from './SpecialProcess.module.scss'
import { useSpecialProcess } from '../../../Controllers/SpecialProcess'
import { columns } from './Config'
import IconButton from '@/components/IconButton/IconButton'
import TableFilter from '@/components/TableFilter/TableFilter'
import DetailSettingDialog from '../Dialog/DetailSettingDialog/DetailSettingDialog'
import DetailParamsSettingDialog from '../Dialog/DetailSettingDialog/DetailParamsSettingDialog'

import { vPermission } from '@/libs/Permission/Permission'
export default defineComponent({
  name: '特殊工序',
  directives: {
    permission: vPermission,
  },
  setup(props, ctx) {
    const {
      dataSource,
      tableRef,
      dialogConfig,
      onSearch,
      onRowClick,
      onClickConfig,
      onClickConfig2,
      curRow,
      onConfirm,
      filterColums,
    } = useSpecialProcess(props, ctx)

    /**
     * @returns 表格
     */
    const RenderBaseTable = () => {
      return (
        <div class={styles.list}>
          <BaseTable
            ref={tableRef}
            pageSize={999}
            url="/api/v1/jieyunlangfang/worksection2special"
            v-model:dataSource={dataSource.value}
            columns={columns}
            id="workSectionId"
            onRowClick={onRowClick}
            isHidePagination={true}
          ></BaseTable>
        </div>
      )
    }
    return () => {
      return (
        <div class={styles.content}>
          <div class={styles.headerContent}>
            <div class={styles.header}>
              <TableFilter
                tableRef={tableRef}
                text="添加"
                defaultOptions={[
                  {
                    label: '全部',
                  },
                ]}
                columns={filterColums}
              >
                <IconButton icon="f">筛选</IconButton>
              </TableFilter>

              <el-button
                onClick={() => onClickConfig()}
                v-permission="specialWorkSection-detail"
              >
                试漏仪参数配置
              </el-button>
              <el-button
                onClick={() => onClickConfig2()}
                v-permission="specialWorkSection-detail"
              >
                配方值配置
              </el-button>
            </div>
          </div>
          <RenderBaseTable />

          <DetailSettingDialog
            v-model={dialogConfig.detailVisible}
            isProcess={true}
            //@ts-ignore
            row={curRow.value}
            onConfirm={onSearch}
          />
          <DetailParamsSettingDialog
            v-model={dialogConfig.paramsVisible}
            isProcess={true}
            //@ts-ignore
            row={curRow.value}
            onConfirm={onSearch}
          />
        </div>
      )
    }
  },
})
