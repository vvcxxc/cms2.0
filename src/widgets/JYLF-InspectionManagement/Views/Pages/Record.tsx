import { ref, defineComponent } from 'vue'
import BaseTable from '@/components/Table/Table'
import styles from './Inspection.module.scss'
import { useRecord } from '../../Controllers/Record'
import IconButton from '@/components/IconButton/IconButton'
import TableFilter from '@/components/TableFilter/TableFilter'
import Search from '@/components/Search/Search'
import ViewDetail from '../Components/ViewDetail'
import dayjs from 'dayjs'

export default defineComponent({
  setup(props, ctx) {
    const {
      searchData,
      dataObj,
      dataSource,
      tableRef,
      RecordColumns,
      onSearch,
      openViewDetailDialog,
    } = useRecord(props, ctx)

    //#region 渲染表头
    const RenderHeader = () => {
      return (
        <div class={styles.headers}>
          <div class={styles.left}>
            <div class={styles.label}> 结束时间范围：</div>
            <el-date-picker
              type="datetime"
              style="width: 198px"
              format="YYYY-MM-DD HH:mm:ss"
              popper-class="light-datetime-picker"
              class="light-datetime-picker"
              clearable={false}
              v-model={searchData.startTime}
              onChange={onSearch}
            ></el-date-picker>
            <div class={styles.label}>-</div>
            <el-date-picker
              type="datetime"
              style="width: 198px"
              format="YYYY-MM-DD HH:mm:ss"
              popper-class="light-datetime-picker"
              class="light-datetime-picker"
              clearable={false}
              v-model={searchData.endTime}
              onChange={onSearch}
            ></el-date-picker>

            <TableFilter
              tableRef={tableRef}
              text="筛选"
              columns={RecordColumns.value}
            >
              <IconButton icon="f">筛选</IconButton>
            </TableFilter>
          </div>
          <div class={styles.box}>
            <Search
              placeholder="请输入任务名称、备注说明、操作人"
              style={{ width: '280px' }}
              v-model={searchData.keyword}
              onConfirm={onSearch}
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
            url="/api/v1/jieyunlangfang/spotcheckrecord"
            v-model:dataSource={dataSource.value}
            columns={RecordColumns.value}
            params={{
              Filter: searchData.keyword,
              FromEndTime: dayjs(searchData.startTime).format(
                'YYYY-MM-DD HH:mm:ss'
              ),
              ToEndTime: dayjs(searchData.endTime).format(
                'YYYY-MM-DD HH:mm:ss'
              ),
            }}
            v-slots={{
              detail: ({ row }: any) => {
                return (
                  <div
                    class={styles.checkBtn}
                    onClick={() => openViewDetailDialog(row)}
                  >
                    查看
                  </div>
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
          <ViewDetail
            v-model={dataObj.viewDialogShow}
            row={dataObj.viewRow}
            onConfirm={onSearch}
            title="点检记录"
          />
        </div>
      )
    }
  },
})
