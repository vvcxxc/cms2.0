import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import { ElMessage } from 'element-plus'
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { Formula } from '../Models/Formula'
import { injectModel } from '@/libs/Provider/Provider'
import { createInjector } from '../store/ManagementStore'
import { createRandomId, hasDuplicates } from '@/utils'
import { debounce } from 'lodash'
export const useVersionManageDialog = (props: any, ctx: any) => {
  const formula = injectModel<Formula>('formula')
  const { currentFormula } = createInjector()
  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })
  const allDataSource = ref<any[]>([])
  const dataSource = ref<any[]>([])
  const checkedList = ref<any[]>([])
  const innerValue = ref('')

  const tableRef = ref()

  const columns = [
    {
      title: '序号',
      type: 'seq',
      width: '60',
    },
    {
      field: 'name',
      title: '版本名称',
    },
    {
      field: 'remark',
      title: '备注',
    },
  ]

  const onClose = () => {
    visible.value = false
    ctx.emit('close')
  }

  const getFormulaversion = async () => {
    const res = await formula.getFormulaversion({
      FormulaIds: props.rowData?.id ?? '',
      IncludeDetails: true,
    })

    allDataSource.value = res.items
    dataSource.value = [...allDataSource.value]
    console.log(dataSource.value)
    // 参数更新的时候自动添加一列
    if (props.openSource === 'Params') {
      onAdd()
    }
  }

  const checkVersion = () => {
    if (allDataSource.value.some((item) => !item.name)) {
      ElMessage.warning('版本名称不能为空!')
      return false
    }

    if (hasDuplicates(allDataSource.value, 'name')) {
      ElMessage.warning('版本名称不能重复!')
      return false
    }
    return true
  }

  const onConfirm = async () => {
    console.log(checkVersion)

    const f = checkVersion()
    console.log(1111, f)

    if (!f) {
      return
    }

    const params = allDataSource.value.map((item, index) => {
      const obj = {
        ...item,
        concurrencyStamp: '',
      }
      if (item.id?.includes('row_')) {
        delete obj.id
      }
      return obj
    })

    console.log(allDataSource.value, params, '--- dataSource.value')

    await formula.saveVersionBatch({
      formulaId: props.rowData.id,
      toSave: params,
    })
    ctx.emit('confirm')
    visible.value = false
  }

  const onSearch = () => {
    getFilterData()
    // tableRef.value?.getList()
    // tableRef.value?.clearSelectEvent()
  }

  const onCheck = (list: any) => {
    console.log(list)
    checkedList.value = list
  }

  const getFilterData = () => {
    dataSource.value = allDataSource.value.filter((item) => {
      if (item.name === '') return true
      return item.name.includes(innerValue.value)
    })
    tableRef.value?.clearSelectEvent()
  }

  const onAdd = () => {
    // dataSource.value = [
    //   ...dataSource.value,
    // {
    //   name: '',
    //   remark: '',
    // },
    // ]
    innerValue.value = ''
    allDataSource.value.push({
      name: '',
      remark: '',
    })
    dataSource.value = [...allDataSource.value]
  }

  const onDelete = () => {
    if (!checkedList.value.length) return

    if (allDataSource.value.length === 1) {
      ElMessage.warning('当前仅有一个配方版本，删除失败！')
      return
    }

    ConfirmBox('是否删除选中的版本').then(() => {
      const isUse = checkedList.value.find((item) => item.isCurrentVersion)

      if (isUse) {
        ElMessage.warning(isUse.name + '版本正在应用，不可删除')
        return
      }

      allDataSource.value = allDataSource.value.filter((item: any) => {
        return !checkedList.value.some((it) => it.id === item.id)
      })
      getFilterData()
    })
  }

  const getNextVersion = (currentVersion: string, versions: string[]) => {
    let copyNumbers = []

    for (let i = 0; i < versions.length; i++) {
      let version = versions[i]

      if (version === currentVersion) {
        copyNumbers.push(0)
      } else if (version.startsWith(currentVersion + '-')) {
        let copyNumber = parseInt(version.substring(currentVersion.length + 1))
        copyNumbers.push(copyNumber)
      }
    }

    if (copyNumbers.length === 0) {
      return currentVersion + '-001'
    } else {
      let maxCopyNumber = Math.max(...copyNumbers)
      let nextCopyNumber = maxCopyNumber + 1
      return currentVersion + '-' + nextCopyNumber.toString().padStart(3, '0')
    }
  }

  const onCopy = () => {
    if (!checkedList.value.length) {
      ElMessage.warning('请选择一个版本')
      return
    }
    if (checkedList.value.length > 1) {
      ElMessage.warning('请勿选择多个版本操作！')
      return
    }

    const currentVersion = checkedList.value[0]
    if (!currentVersion.name) {
      ElMessage.warning('当前版本不可创建副本')
      return
    }

    const versions = allDataSource.value.map((item) => item.name)

    const nextVersion = getNextVersion(currentVersion.name, versions)
    console.log(nextVersion)
    const versionData = {
      ...currentVersion,
      name: nextVersion,
      isCurrentVersion: false,
      sort: allDataSource.value.length,
      id: 'row_' + allDataSource.value.length,
    }
    dataSource.value.push(versionData)

    allDataSource.value.push(versionData)
  }

  const onSetVersion = () => {
    if (!checkedList.value.length) {
      ElMessage.warning('请选择一个版本')
      return
    }
    if (checkedList.value.length > 1) {
      ElMessage.warning('请勿选择多个版本操作！')
      return
    }

    const version = checkedList.value[0]

    ConfirmBox(`是否确认将${version.name}版本设为该配方当前版本？`).then(() => {
      allDataSource.value.forEach((item: any) => {
        if (version.id === item.id) {
          item.isCurrentVersion = true
        } else {
          item.isCurrentVersion = false
        }
      })
    })
  }

  const onBlur = (val: string) => {
    console.log(val)
    console.log(allDataSource.value)
    checkVersion()
  }

  const onOpen = () => {
    getFormulaversion()
  }

  const onDrag = () => {
    // 最新的排序
    allDataSource.value = [...dataSource.value]
  }

  return {
    onDrag,
    onOpen,
    onBlur,
    onSetVersion,
    onAdd,
    onDelete,
    onCopy,
    columns,
    onCheck,
    dataSource,
    tableRef,
    onSearch,
    innerValue,
    visible,
    onClose,
    onConfirm,
  }
}
