import { ref, reactive, Ref, nextTick, computed } from 'vue'
import { injectModel } from '@/libs/Provider/Provider'
import { groupType } from '../enum'
import { Process } from '../Models/Process'
import { ElMessage } from 'element-plus'
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import { useFile } from './File'
import { useGlobalState } from '@/libs/Store/Store'
import { Language } from '@/libs/Language/Language'
import { _t } from '../app'

interface CurrentType {
  row: any
  index: number
}
export const useProcess = (props: any, ctx?: any) => {
  const process = injectModel<Process>('process')
  const { exportFile } = useFile()
  /**
   * 产线
   */
  const { productionLineList, getWorkSectionList } = useGlobalState()

  /**
   * 工序动态列配置
   */
  const processColumns = ref<Record<string, any>>([])
  /**
   * 搜索值
   */
  const search = ref('')

  /**
   * 排序
   */
  const sort = ref(0)
  /**
   * 选择项
   */
  const selection = ref([])
  /**
   * 当前选中的行
   */
  const current = ref(null)
  /**
   * 数据源
   */
  const dataSource: Ref<any[]> = ref([])
  /**
   * 分组数据
   */
  const dataSourceMap: Ref<Record<string, Ref<any[]>>> = ref({})

  /**
   * 分组KeyMap
   */
  const groupKeyMap = reactive<Record<string, any>>({})

  /**
   * 表格
   */
  const tableRef = ref()
  /**
   * 分组
   */
  const headData = reactive({
    production: '',
    group: '',
    search: '',
  })
  const dialogConfig = reactive({
    visible: false,
    title: '',
    isAdd: false,
  })

  const dialogSettingConfig = reactive({
    visible: false,
    title: '',
  })

  /**
   * 分页数据
   */
  const paginationParams = ref({})

  /**
   * 打开详情
   * @param row
   */
  const openDetail = (row: any) => {
    current.value = row
    dialogConfig.visible = true
    dialogConfig.title = row.name
    dialogConfig.isAdd = false
  }

  const isGroup = computed(() => {
    return Object.keys(groupKeyMap).length
  })

  /**
   * 头部配置
   */
  const headers = computed(() => {
    return {
      Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
      'X-Project': sessionStorage.getItem('X-Project'),
      'Accept-Language': Language.getLangReqHeader(),
    }
  })

  const contextMenu = [
    {
      label: _t('展开工序详情'),
      fn: (c: CurrentType) => {
        current.value = null
        nextTick(() => openDetail(c.row))
      },
      divided: true,
      icon: 'o',
    },
    {
      label: _t('向上添加工序'),
      fn: (c: CurrentType, pageNum: number) => {
        current.value = null
        sort.value = c.index + 1 + (pageNum - 1) * 50
        dialogConfig.visible = true
        dialogConfig.title = _t('添加工序')
        dialogConfig.isAdd = false
      },
      divided: true,
      disabled: isGroup,
      icon: 'up',
    },
    {
      label: _t('向下添加工序'),
      fn: (c: CurrentType, pageNum: number) => {
        current.value = null
        sort.value = c.index + 2 + (pageNum - 1) * 50
        dialogConfig.visible = true
        dialogConfig.title = _t('添加工序')
        dialogConfig.isAdd = false
      },
      divided: true,
      disabled: isGroup,
      icon: 'down',
    },
    {
      label: _t('创建工序副本'),
      fn: async ({ row }: CurrentType) => {
        if (!selection.value.length) {
          await process.cloneWorkSection([row.id])
        } else {
          const ids = selection.value.map((item: { id: string }) => item.id)
          await process.cloneWorkSection(ids)
        }
        ElMessage.success(_t('创建副本成功'))
        tableRef.value?.getList()
        getWorkSectionList()
      },
      divided: true,
      icon: 'copy',
    },
    {
      label: _t('删除工序'),
      fn: async (c: CurrentType) => {
        const names = selection.value.map((item: { name: string }) => item.name)
        ConfirmBox(
          `${_t('是否删除')}${names.length ? names.join(',') : c.row.name}`,
          _t('确认')
        ).then(async () => {
          const ids = selection.value.map((item: { id: string }) => item.id)
          await process.deleteWorkSections(ids.length ? ids : [c.row.id])
          ElMessage.success(_t('删除成功'))
          tableRef.value.getList()
          getWorkSectionList()
          tableRef.value.clearSelectEvent()
        })
      },
      icon: 'close',
    },
  ]

  const onCheck = (records: any) => {
    selection.value = records
  }

  const onAddProcess = () => {
    const params = tableRef.value?.getPaginationParams()
    current.value = null
    dialogConfig.visible = true
    dialogConfig.isAdd = true
    dialogConfig.title = _t('添加工序')
    sort.value = params.totalCount + 1
  }

  const onConfirmWorkSection = async () => {
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
  /**
   * 行点击时更新current
   */
  const onRowClick = ({ row }: any) => {
    if (dialogConfig.visible && current.value) {
      current.value = row
    }
  }
  /**
   * 导出
   */
  const onExport = () => {
    const params = tableRef.value?.getParams()
    exportFile(
      '/api/v1/processmanagement/worksection/export',
      params,
      _t('工序')
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
    const isFlowGroup = headData.group !== groupType.productLine
    let data: {
      map: any
      items: any[]
    } = {
      map: {},
      items: [],
    }
    if (isFlowGroup) {
      data = await process.getGroupProcess()
    } else {
      data = await process.getGroupSegment()
    }
    dataSourceMap.value = data.map
    data.items.forEach((item: any) => {
      // @ts-ignore
      if (!isFlowGroup) {
        const key = item?.segment?.name
        if (key) {
          groupKeyMap[key] = {
            name: item?.segment.name,
          }
        }
      } else {
        if (
          Array.isArray(item.flowDefinitions) &&
          item.flowDefinitions.length > 0
        ) {
          const keys = item.flowDefinitions.map((item: any) => item.type)
          const key = keys.sort((a: number, b: number) => a - b).join(',')
          if (key) {
            groupKeyMap[key] = {
              name: item.flowDefinitions
                .map((item: any) => item.description)
                .join(),
            }
          }
        }
      }
    })
  }
  /**
   * 表格加载完成的回调
   */
  const onBeforeLoad = () => {
    // processColumns.value = columns(productionLineStructure)
  }
  /**
   * 重置表格数据
   */
  const reloadList = () => {
    if (!headData.group) {
      tableRef.value?.getList()
    }
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
      ElMessage.error(_t('导入失败'))
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
    contextMenu,
    dialogConfig,
    headData,
    dialogSettingConfig,
    tableRef,
    current,
    search,
    sort,
    processColumns,
    dataSourceMap,
    groupKeyMap,
    paginationParams,
    productionLineList,
    headers,

    onBeforeUpload,
    onError,
    onSuccess,
    openDetail,
    onBeforeLoad,
    onSearch,
    onExport,
    onRowClick,
    onConfirmWorkSection,
    onCheck,
    onAddProcess,
    onGroupChange,
  }
}
