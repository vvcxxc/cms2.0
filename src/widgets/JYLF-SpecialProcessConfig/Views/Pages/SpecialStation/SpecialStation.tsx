import { ref, defineComponent } from 'vue'
import BaseTable from '@/components/Table/Table'
import styles from './SpecialStation.module.scss'
import { useSpecialStation } from '../../../Controllers/SpecialStation'
import { columns } from './Config'
import IconButton from '@/components/IconButton/IconButton'
import TableFilter from '@/components/TableFilter/TableFilter'

import PrintDialog from '../Dialog/PrintDialog/PrintDialog'
import LeakageDialog from '../Dialog/LeakageDialog/LeakageDialog'
import LaserDialog from '../Dialog/LaserDialog/LaserDialog'

import { vPermission } from '@/libs/Permission/Permission'
export default defineComponent({
  name: '特殊工位',
  directives: {
    permission: vPermission,
  },
  setup(props, ctx) {
    const {
      dataSource,
      tableRef,
      dialogConfig,
      onRowClick,
      onClickDetailConfig,
      curSectionData,
      onSearch,
      filterColums,
    } = useSpecialStation(props, ctx)

    const RenderBaseTable = () => {
      return (
        <div class={styles.list}>
          <BaseTable
            ref={tableRef}
            url="/api/v1/jieyunlangfang/workstation2special/list"
            pageSize={999}
            v-model:dataSource={dataSource.value}
            columns={columns}
            autoHeight={true}
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
                onClick={() => onClickDetailConfig('LeakageVisible')}
                v-permission="specialWorkStation-leakage"
              >
                试漏仪设备配置
              </el-button>
              <el-button
                onClick={() => onClickDetailConfig('PrintVisible')}
                v-permission="specialWorkStation-print"
              >
                标签打印配置
              </el-button>
              <el-button
                onClick={() => onClickDetailConfig('LaserVisible')}
                v-permission="specialWorkStation-laser"
              >
                激光打码配置
              </el-button>
            </div>
          </div>
          <RenderBaseTable />

          <LeakageDialog
            v-model={dialogConfig.LeakageVisible}
            //@ts-ignore
            row={curSectionData.value}
            onConfirm={onSearch}
          />
          <PrintDialog
            v-model={dialogConfig.PrintVisible}
            //@ts-ignore
            row={curSectionData.value}
            onConfirm={onSearch}
          />
          <LaserDialog
            v-model={dialogConfig.LaserVisible}
            //@ts-ignore
            row={curSectionData.value}
            onConfirm={onSearch}
          />
        </div>
      )
    }
  },
})
