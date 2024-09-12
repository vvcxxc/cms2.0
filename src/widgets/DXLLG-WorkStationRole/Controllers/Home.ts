import { SetupContext, ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { setWorkStationRole } from '../Models/Service/Service'
import { cloneDeep } from 'lodash'

export const useHome = (props: any, { emit }: SetupContext) => {
  const dataSource = ref<Record<string, any>[]>([])
  /***
   * tableRef
   */
  const tableRef = ref()
  const search = ref('')
  const checked = ref<any>()

  const onCheck = (record: any) => {
    checked.value = cloneDeep(record.row)
  }
  const onSearch = async () => {
    tableRef.value?.getList({
      Filter: search.value,
    })
  }
  const onSave = async (roleId: string, data: any = {}) => {
    await setWorkStationRole(roleId, data)
    ElMessage.success('保存成功')
    onSearch()
  }

  return {
    dataSource,
    tableRef,
    search,
    checked,
    onCheck,
    onSearch,
    onSave,
  }
}
