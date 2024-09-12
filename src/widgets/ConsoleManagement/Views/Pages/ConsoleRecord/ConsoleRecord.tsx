import { defineComponent, SetupContext } from 'vue'
import BaseTable from '@/components/Table/Table'
import styles from './ConsoleRecord.module.scss'
import { useConsoleRecord } from '@/widgets/ConsoleManagement/Controllers/ConsoleRecord'
import DyForm from '@/components/DyForm/DyForm'
import dayjs from 'dayjs'
import DyDatePicker from '@/components/DyDatePicker/DyDatePicker'
import IconButton from '@/components/IconButton/IconButton'

export default defineComponent({
  name: 'ConsoleManagement',
  setup(props, ctx: SetupContext) {
    const {
      data,
      formRef,
      formItemProps,
      formData,
      tableRef,
      onSearch,
      onExportLog,
    } = useConsoleRecord(props, ctx)
    return () => (
      <div class={styles.content}>
        <div class={styles.dyForm}>
          <div class={styles.headerLeft}>
            <DyForm
              inLine={true}
              labelWidth="50px"
              v-model:formData={formData.value}
              ref={formRef}
              formItemProps={formItemProps}
              customWidgetMap={{ datePicker: DyDatePicker }}
            ></DyForm>
            <el-button onClick={onSearch} type="primary" class={styles.btn}>
              搜索
            </el-button>
          </div>
          <div class={styles.headerBtn}>
            <IconButton class={styles.btnIcon} icon="out" onClick={onExportLog}>
              导出
            </IconButton>
          </div>
        </div>

        <div class={styles.table}>
          <BaseTable
            ref={tableRef}
            v-model:dataSource={data.value}
            url="/api/v1/flowmanagement/flowlog"
            MaxResultCount={50}
            pageSize={50}
            isSeq={false}
            isCheck={false}
            isDrag={false}
            vSlots={{
              creationTime: ({ row }: any) => {
                return dayjs(row.creationTime).format('YYYY-MM-DD HH:mm:ss')
              },
              extraProperties: ({ row }: any) => {
                const text = JSON.stringify(row.extraProperties, null, 2)
                return <span title={text}>{text}</span>
              },
            }}
            columns={[
              {
                field: 'seq',
                title: '序号',
                type: 'seq',
              },
              {
                field: 'userName',
                title: '用户名',
              },

              {
                field: 'creationTime',
                title: '时间',
              },
              {
                field: 'workSectionName',
                title: '工序',
              },
              {
                field: 'workStationName',
                title: '工位名称',
              },
              {
                field: 'flowName',
                title: '流程名称',
              },
              {
                field: 'content',
                title: '操作名称',
              },
              {
                field: 'remark',
                title: '备注',
              },
              // {
              //   field: 'extraProperties',
              //   title: '参数信息',
              // },
            ]}
          />
        </div>
      </div>
    )
  },
})
