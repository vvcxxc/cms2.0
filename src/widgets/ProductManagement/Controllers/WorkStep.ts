import { ref } from 'vue'
import { createInjector } from '../store/SOPStore'
import { ElMessage } from 'element-plus'
import { _t, LanguageScopeKey } from '../app'

export const useWorkStep = () => {
  const { curProcessStep, curProcessId, files, curProductId, allStepList } =
    createInjector()
  const columns = ref([
    {
      type: 'seq',
      width: 60,
      title: _t('序号'),
    },
    {
      field: 'name',
      width: 109,
      title: _t('工步'),
    },
    {
      field: 'description',
      title: _t('操作描述'),
    },
    {
      field: 'annex',
      title: _t('附件'),
      width: 70,
    },
  ])

  const checkedList = ref<any[]>([])

  const addStep = () => {
    if (!curProcessId.value) {
      ElMessage.warning(_t('请选择工序'))
      return
    }

    curProcessStep.value.sopSteps.push({
      name: '',
      description: '',
    })
  }

  const handleChangeFile = (file: any, row: any, index: number) => {
    curProcessStep.value.sopSteps[index].annexName = file.name
    curProcessStep.value.sopSteps[index].hasAnnex = true
    curProcessStep.value.sopSteps[index].file = file
    files.value.push(file.raw)
  }

  const onCheck = (records: any[]) => {
    checkedList.value = records
  }

  const onDelete = () => {
    if (!checkedList.value.length) {
      ElMessage.warning(_t('请选择需要删除的工步'))
      return
    }
    curProcessStep.value.sopSteps = curProcessStep.value.sopSteps.filter(
      (item: any) => {
        return !checkedList.value.find((it) => it.id === item.id)
      }
    )
  }

  return {
    allStepList,
    onCheck,
    onDelete,
    curProductId,
    curProcessId,
    curProcessStep,
    columns,
    handleChangeFile,
    addStep,
  }
}
