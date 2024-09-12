import { ref, SetupContext } from 'vue'
import { dayjs, ElDatePicker } from 'element-plus'
import { useFile } from './File'

export const useConsoleRecord = (props: any, ctx: SetupContext) => {
  const { exportFile } = useFile()

  const data = ref([])
  const formRef = ref()
  const formData = ref<{
    time?: [string, string]
    Filter?: string
  }>({})
  const tableRef = ref()
  const formItemProps = [
    {
      label: '时间',
      prop: 'time',
      rangeSeparator: '至',
      type: 'datetimerange',
      width: '400px',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      style: { marginRight: '20px' },
      el: 'datePicker',
      valueFormat: 'YYYY-MM-dd HH:mm:ss',
    },
    {
      label: '查询',
      prop: 'Filter',
      placeholder: '请输入查询内容',
      el: 'input',
      width: '200px',
    },
  ]

  const onExportLog = () => {
    const params = tableRef.value?.getParams()

    exportFile('/api/v1/flowmanagement/flowlog/export', params, '控制记录')
  }

  const onSearch = () => {
    const StartTime = formData.value?.time?.[0] || ''
    const EndTime = formData.value?.time?.[1] || ''
    const Filter = formData.value?.Filter || ''
    const data = {
      StartTime,
      EndTime,
      Filter,
    }
    tableRef.value?.getList(data)
  }

  ctx.expose({
    onSearch,
  })

  return {
    data,
    formRef,
    formItemProps,
    formData,
    tableRef,
    onSearch,
    onExportLog,
  }
}
