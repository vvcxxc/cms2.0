import { defineComponent } from 'vue'
import './Pagination.scss'
import { _t } from '../../../app'

export default defineComponent({
  props: ['totalCount', 'pageNum', 'pageSize', 'tableRef', 'MaxResultCount'],
  emits: ['change'],
  setup(props, ctx) {
    return () => {
      const { totalCount, pageNum, pageSize } = props
      // const rf =
      const onCurrentChange = async (current: number) => {
        // pageNum.value = current
        // // @ts-ignore
        // params.value.SkipCount = (current - 1) * params.value.MaxResultCount
        // getTableList()
        // emit('page', current)
        const tableRef = props.tableRef?.value || props.tableRef
        const params = {
          SkipCount: (current - 1) * pageSize,
        }
        if (tableRef) {
          await tableRef?.getList(params)
          ctx.emit('change')
        }
      }

      return (
        <div class="pagination-content">
          <span class="info">
            {_t('共')}
            {totalCount}
            {_t('条记录')} {_t('当前第')}
            {pageNum}
            {_t('页')} {_t('共')}
            {totalCount ? Math.ceil(totalCount / (pageSize || 1)) : 1}
            {_t('页')} {_t('每页')}
            {pageSize} {_t('条记录')}
          </span>
          <div class="pagination">
            <div class="information-pagination">
              <el-pagination
                layout="prev, pager, next"
                total={Number(totalCount)}
                size="small"
                page-size={pageSize}
                onCurrentChange={onCurrentChange}
              />
            </div>
            <div class="numb">
              {_t('th')}
              <el-input-number
                min="1"
                max="max"
                v-model={pageNum}
                onChange={onCurrentChange}
                controls={false}
                controls-position="right"
                style="width: 58px; height: 30px"
              />
              {_t('页')}
            </div>
          </div>
        </div>
      )
    }
  },
})
