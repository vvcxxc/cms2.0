import { ref, defineComponent } from 'vue'
import type { Ref } from 'vue'
import { ElMessage } from 'element-plus'
import BaseTable from '@/components/Table/Table'
import styles from './Configuration.module.scss'
import { useProcessConfiguration } from '../../../Controllers/ProcessConfiguration'
// import { columns } from './Config'
import IconButton from '@/components/IconButton/IconButton'
import Icon from '@/components/Icon/Icon'
import { CaretBottom } from '@element-plus/icons-vue'
import SearchInput from '@/components/SearchInput/SearchInput'
import Tag from '@/components/Tag/Tag'
import MissingProcessDialog from '../Dialog/MissingProcessDialog/MissingProcessDialog'
import TableFilter from '@/components/TableFilter/TableFilter'
import { DataItemType } from '../../../type/Type.d'
import Search from '@/components/Search/Search'

export default defineComponent({
  name: '过程配置',
  setup(props, ctx) {
    const {
      dataSource,
      tableRef,
      search,
      searchLineType,
      onSearch,
      onCheck,
      columns,
      selections,
      missingProcessCallBack,
    } = useProcessConfiguration(props)
    /**
     * @returns 表格
     */
    const RenderBaseTable = () => {
      return (
        <div class={styles.ConfigurationList}>
          <BaseTable
            ref={tableRef}
            params={{
              Filter: search.value,
            }}
            url="/api/v1/tracemanagement/traceprocesssetting"
            v-model:dataSource={dataSource.value}
            columns={columns.value}
            isDrag={true}
             onRowClick={onCheck}
          ></BaseTable>
        </div>
      )
    }
    return () => {
      return (
        <div class={styles.ConfigurationContent}>
          <div class={styles.headerContent}>
            <div class={styles.header}>
              <TableFilter 
                text="添加"
                columns={columns.value}
                tableRef={tableRef}
              >
                <IconButton icon="f">筛选</IconButton>
              </TableFilter>
              <el-divider direction="vertical" />
              <MissingProcessDialog
                searchLineType={searchLineType.value}
                curselectionList={selections.value}
                onConfirm={missingProcessCallBack}
              />
            </div>
            <Search
              placeholder="请输入关键字"
              v-model={search.value}
              onConfirm={onSearch}
            />
          </div>

          <RenderBaseTable />
        </div>
      )
    }
  },
})
