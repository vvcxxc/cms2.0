import { ref, onMounted, reactive, Ref, computed } from 'vue'
import { injectModel } from '@/libs/Provider/Provider'
import { Station } from '../Models/Station'
import { ElMessage } from 'element-plus'
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import { useFile } from './File'
import { Language } from '@/libs/Language/Language'
import { _t } from '../app'
import { getColumns } from '../Views/Pages/Station/Config'

interface CurrentType {
  row: any
  index: number
}
export const useStation = (props: any, ctx?: any) => {
  const station = injectModel<Station>('station')
  const { exportFile } = useFile()
  const tableRef = ref()
  const sort = ref(0)
  const columns = ref<any[]>([])

  const onBeforeLoad = () => {
    columns.value = getColumns()
  }
  Language.useChange((lang: typeof Language) => {
    columns.value = getColumns()
  })
  /**
   * 数据源
   */
  const dataSource: Ref<any[]> = ref([])
  /**
   * 选中的值
   */
  const selection = ref([])
  const search = ref('')
  /**
   * header
   */
  const headData = reactive({
    production: '',
    group: '',
    search: '',
  })
  /**
   * 弹窗
   */
  const dialogConfig = reactive({
    visible: false,
    title: '',
    row: null,
    isAdd: true,
  })
  /**
   * 工序设置
   */
  const dialogSettingConfig = reactive({
    visible: false,
    title: '',
  })
  /**
   * 批量配置
   */
  const dialogBatchConfig = reactive({
    visible: false,
    title: '',
  })

  /**
   * 分组数据
   */
  const dataSourceMap: Ref<Record<string, Ref<any[]>>> = ref({})

  /**
   * 分组KeyMap
   */
  const groupKeyMap = reactive<Record<string, any>>({})
  /**
   * 头部配置
   */
  const headers = computed(() => {
    console.log('Language.getLangReqHeader()', Language.getLangReqHeader())
    return {
      Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
      'X-Project': sessionStorage.getItem('X-Project'),
      'Accept-Language': Language.getLangReqHeader(),
    }
  })

  /**
   * 打开详情
   * @param row
   */
  const openDetail = (row: any) => {
    dialogConfig.row = row
    dialogConfig.visible = true
    dialogConfig.title = row.name
    dialogConfig.isAdd = false
  }

  const isGroup = computed(() => {
    return Object.keys(groupKeyMap).length
  })

  const contextMenu = [
    {
      label: _t('展开工位详情'),
      fn: ({ row }: CurrentType) => openDetail(row),
      divided: true,
      icon: 'o',
    },
    {
      label: _t('向上添加工位'),
      fn: (c: CurrentType, pageNum: number) => {
        dialogConfig.row = null

        sort.value = c.index + 1 + (pageNum - 1) * 50
        dialogConfig.visible = true
        ;(dialogConfig.title = _t('添加工位')), (dialogConfig.isAdd = false)
      },
      divided: true,
      disabled: isGroup,
      icon: 'up',
    },
    {
      label: _t('向下添加工位'),
      fn: (c: CurrentType, pageNum: number) => {
        dialogConfig.row = null
        sort.value = c.index + 2 + (pageNum - 1) * 50
        dialogConfig.visible = true
        ;(dialogConfig.title = _t('添加工位')), (dialogConfig.isAdd = false)
      },
      divided: true,
      disabled: isGroup,
      icon: 'down',
    },
    {
      label: _t('创建工位副本'),
      fn: async ({ row }: CurrentType) => {
        if (!selection.value.length) {
          await station.cloneWorkStation([row.id])
        } else {
          const ids = selection.value.map((item: { id: string }) => item.id)
          await station.cloneWorkStation(ids)
        }
        ElMessage.success(_t('创建工位副本成功'))
        tableRef.value?.getList()
      },
      divided: true,
      icon: 'copy',
    },
    {
      label: _t('批量配置'),
      fn: () => {
        dialogBatchConfig.visible = true
      },
      icon: 'copy',
    },
    {
      label: _t('删除工位'),
      fn: async ({ row, index: number }: CurrentType) => {
        const names = selection.value.map((item: { name: string }) => item.name)
        ConfirmBox(
          `${_t('是否删除')}${names.length ? names.join(',') : row.name}`,
          _t('确认')
        ).then(async () => {
          const ids = selection.value.map((item: { id: string }) => item.id)
          await station.deleteStations(ids.length ? ids : [row.id])
          ElMessage.success(_t('删除成功'))
          tableRef.value.getList()
          tableRef.value.clearSelectEvent()
        })
      },
      icon: 'close',
    },
  ]

  /**
   * 工位弹窗
   */
  const onDrawerConfirm = async () => {
    dialogConfig.visible = false
    if (dialogConfig.isAdd) {
      // 新增的需要定位到那一行去
      tableRef.value?.scrollToRow({
        skip: true,
      })
    } else {
      await tableRef.value?.getList()
    }
  }

  const onCheck = (records: any) => {
    selection.value = records
  }

  const onAddProcess = () => {
    const params = tableRef.value?.getPaginationParams()
    dialogConfig.visible = true
    dialogConfig.title = _t('添加工位')
    dialogConfig.row = null
    dialogConfig.isAdd = true
    sort.value = params.totalCount + 1
  }

  const onBatchConfirm = () => {
    dialogConfig.visible = false
  }
  /**
   * 导出
   */
  const onExport = () => {
    const params = tableRef.value?.getParams()
    exportFile(
      '/api/v1/processmanagement/workstation/export',
      params,
      _t('工位')
    )
  }
  /**
   * 关键字搜索
   */
  const onSearch = () => {
    tableRef.value?.getList({
      Filter: search.value,
    })
  }
  /**
   * 重置表格数据
   */
  const reloadList = () => {
    tableRef.value?.getList()
  }

  //清除对象里所有字段
  const clearObject = (obj: any) => {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        delete obj[key]
      }
    }
  }

  /**
   * 分组
   * @param v
   */
  const onGroupChange = async (v: number) => {
    clearObject(dataSourceMap.value)
    clearObject(groupKeyMap)
    if (!v) return

    const { map, items } = await station.getGroupWorkStation()
    dataSourceMap.value = map
    items.forEach((item: any) => {
      if (v == 1) {
        const key = item?.workSectionId
        if (key) {
          groupKeyMap[key] = {
            name: item?.workSection?.name,
            id: item?.workSectionId,
          }
        }
      }
    })
  }

  /**
   * 上传成功
   */
  const onSuccess = () => {
    tableRef.value?.getList()
    ElMessage.success(_t('导入成功'))
  }

  /**
   * 失败
   * @param err
   */
  const onError = (err: any) => {
    try {
      const message = JSON.parse(err.message)
      ElMessage.error(message.msg)
    } catch (error) {
      ElMessage.success(_t('导入失败'))
    }
  }
  /**
   * 上传钩子
   */
  const onBeforeUpload = (file: File) => {
    const format = ['xlsx', 'xls', 'csv']
    if (!format.includes(file.name.split('.')[1])) {
      ElMessage.error(
        _t('导入文件格式不正确，请导入.xlsx/.xls与.csv格式的文件')
      )
      return false
    }
    return true
  }

  ctx.expose({
    reloadList,
  })

  return {
    dataSource,
    flowData: station.flowData,
    contextMenu,
    dialogConfig,
    headData,
    dialogSettingConfig,
    dialogBatchConfig,
    tableRef,
    search,
    sort,
    dataSourceMap,
    groupKeyMap,
    headers,
    columns,
    onError,
    onBeforeUpload,
    onSuccess,
    onGroupChange,
    openDetail,
    onSearch,
    onExport,
    onDrawerConfirm,
    onCheck,
    onAddProcess,
    onBatchConfirm,
    onBeforeLoad,
  }
}
