import { ref, SetupContext, reactive, watch, onMounted, onUnmounted } from 'vue'
import {
  getCheckitemconfigAll,
  setCheckitemconfig,
  getDataconfigTree,
  getFilingtable,
  getAggregatetable,
} from '../Models/Service/Service'
import { _t } from '../app'
import { Language } from '@/libs/Language/Language'
import sdk from 'sdk'
import { ElMessage } from 'element-plus'
const { openVariableDialog } = sdk.utils
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'

export const useDetectionProjectConfiguration = (
  props: any,
  ctx: SetupContext
) => {
  const dataObj: any = reactive({
    filter1: '',
    filter2: '',
    curRow1: null,
    curRow2: null,
    controlChartSelectVisible: false,
    controlChartSelectType: '',
    controlChartSelectRow: null,
    dataPreviewVisible: false,
    dataPreviewSelectRow: null,
    selectLoading: false,
  })

  const tableRef1 = ref()
  const dataSource1 = ref<any[]>([])
  const checkList1 = ref([])

  const tableRef2 = ref()
  const dataSource2 = ref<any[]>([])
  const checkList2 = ref([])
  const controlchartTypeList: any = reactive({
    1: 'I-MR',
    2: 'Xbar-R',
    3: 'Xbar-S',
  })
  const column1 = ref([
    {
      title: '检测项目名称',
      field: 'name',
      width: 250,
    },
    {
      title: '控制图类型',
      field: 'controlchartType',
      width: 180,
    },
    {
      title: '数据表',
      field: 'dataTableName',
      width: 250,
    },
    {
      title: '检测数据列',
      field: 'checkDataFieldName',
      width: 180,
    },
    {
      title: '记录时间列',
      field: 'recordTimeFieldName',
      width: 180,
    },
    {
      title: '产品型号列',
      field: 'productModelFieldName',
      width: 180,
    },
    {
      title: '产品条码列',
      field: 'productBarCodeFieldName',
      width: 180,
    },
    {
      title: '实时CPK下发',
      field: 'cpkRealtimeDeliveryVariableName',
      width: 190,
    },

    {
      title: '实时判异报警下发',
      field: 'anomalyRealTimeDeliveryVariableName',
      width: 190,
    },
  ])
  const column2 = ref([
    // {
    //   title: '检测项目名称',
    //   field: 'name',
    //   width: 500,
    // },
    // {
    //   title: '控制图类型',
    //   field: 'type',
    // },
    // {
    //   title: '数据表',
    //   field: 'digit',
    // },
    // {
    //   title: '检测数据列',
    //   field: 'dig23it',
    // },
    // {
    //   title: '产品规格列',
    //   field: 'digi4t',
    // },
    // {
    //   title: '记录时间列',
    //   field: 'di5git',
    // },
  ])
  const changeDataTable = (row: any) => {
    row.checkDataFieldId = ''
    row.recordTimeFieldId = ''
    row.productModelFieldId = ''
    row.productBarCodeFieldId = ''
  }
  const onRowClick1 = (data: any) => {
    dataObj.curRow1 = data.row
  }
  const onCheck1 = (data: any) => {
    checkList1.value = data
  }
  const onRowClick2 = (data: any) => {
    dataObj.curRow2 = data.row
  }
  const onCheck2 = (data: any) => {
    checkList2.value = data
  }
  const guid = () => {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`
  }
  const onAdd1 = () => {
    dataSource1.value.push({
      id: guid(),
      isAdd: true,
      name: '',
      controlchartType: '',
      dataTableName: '',
      checkDataFieldName: '',
      recordTimeFieldName: '',
      productModelFieldName: '',
      productBarCodeFieldName: '',
      cpkRealtimeDeliveryVariableName: '',
      anomalyRealTimeDeliveryVariableName: '',
      dataSelectList: [],
    })
  }
  const onDel1 = () => {
    ConfirmBox('是否删除选中的配置').then(() => {
      dataSource1.value = dataSource1.value.filter((item: any) => {
        return !checkList1.value.some((it: any) => it.id === item.id)
      })
    })
  }
  const onOpenControlChartSelect = (row: any, _type: string) => {
    dataObj.controlChartSelectType = _type
    dataObj.controlChartSelectRow = row
    dataObj.controlChartSelectVisible = true
  }
  const controlChartSelectCallBack = (type: number) => {
    dataObj.controlChartSelectRow.controlchartType = type
  }
  const onOpenDataPreview = (row: any) => {
    if (!row.dataTableId) {
      ElMessage.warning(_t('请选择数据表'))
      return
    }
    dataObj.dataPreviewVisible = true
    dataObj.dataPreviewSelectRow = row
  }
  const selectVariable = async (row: any, key: string) => {
    try {
      const varData = await openVariableDialog({
        currentVariable: {},
        isMultiple: false,
        defaultCheckKey: [],
        showConfig: false,
        configData: {},
      })
      row[key] = varData.name
    } catch (error) {
      console.log(error)
    }
  }
  const getData1 = () => {
    getCheckitemconfigAll({ filter: dataObj.filter1 }).then((res: any) => {
      dataSource1.value =
        res.map((item: any) => ({
          ...item,
          dataSelectList: [],
        })) || []
      dataSource1.value.forEach((item: any) => {
        if (item.dataTableNodeType == 2) {
          let map1 = {
            [item.checkDataFieldId]: item.checkDataFieldName,
            [item.recordTimeFieldId]: item.recordTimeFieldName,
            [item.productModelFieldId]: item.productModelFieldName,
            [item.productBarCodeFieldId]: item.productBarCodeFieldName,
          }
          //来点假数据，避免逐行请求下拉数据源浪费性能
          //从假数据切到真数据的变化，产品可以接受
          item.dataSelectList = Object.keys(map1).map((item: any) => ({
            fieldName: map1[item],
            id: item,
          }))
        }
      })
    })
  }
  const saveData1 = () => {
    if (dataSource1.value.some((item: any) => !item.name)) {
      let idx = dataSource1.value.findIndex((item: any) => !item.name)
      ElMessage.warning(
        _t('第') + (Number(idx) + 1) + _t('行') + _t('请输入检测项目名称')
      )
      return
    }
    if (dataSource1.value.some((item: any) => !item.controlchartType)) {
      let idx = dataSource1.value.findIndex(
        (item: any) => !item.controlchartType
      )
      ElMessage.warning(
        _t('第') + (Number(idx) + 1) + _t('行') + _t('请选择控制图类型')
      )
      return
    }
    if (dataSource1.value.some((item: any) => !item.dataTableId)) {
      let idx = dataSource1.value.findIndex((item: any) => !item.dataTableId)
      ElMessage.warning(
        _t('第') + (Number(idx) + 1) + _t('行') + _t('请选择数据表')
      )
      return
    }
    if (dataSource1.value.some((item: any) => !item.checkDataFieldId)) {
      let idx = dataSource1.value.findIndex(
        (item: any) => !item.checkDataFieldId
      )
      ElMessage.warning(
        _t('第') + (Number(idx) + 1) + _t('行') + _t('请选择检测数据列')
      )
      return
    }
    if (dataSource1.value.some((item: any) => !item.recordTimeFieldId)) {
      let idx = dataSource1.value.findIndex(
        (item: any) => !item.recordTimeFieldId
      )
      ElMessage.warning(
        _t('第') + (Number(idx) + 1) + _t('行') + _t('请选择记录时间列')
      )
      return
    }
    setCheckitemconfig(
      dataSource1.value.map((item: any) => {
        let tableObj =
          functionbreadthQuery(tableDataTreeList.value, item.dataTableId) || {}
        let selectList = item.dataSelectList || []

        return {
          id: item.id,
          name: item.name,
          controlchartType: item.controlchartType,
          dataTableId: item.dataTableId,
          dataTableName: tableObj.name,
          dataTableNodeType: tableObj.nodeType,
          checkDataFieldId: item.checkDataFieldId,
          checkDataFieldName: selectList.find(
            (i: any) => i.id == item.checkDataFieldId
          )?.fieldName,
          recordTimeFieldId: item.recordTimeFieldId,
          recordTimeFieldName: selectList.find(
            (i: any) => i.id == item.recordTimeFieldId
          )?.fieldName,
          productModelFieldId: item.productModelFieldId,
          productModelFieldName: selectList.find(
            (i: any) => i.id == item.productModelFieldId
          )?.fieldName,
          productBarCodeFieldId: item.productBarCodeFieldId,
          productBarCodeFieldName: selectList.find(
            (i: any) => i.id == item.productBarCodeFieldId
          )?.fieldName,
          cpkRealtimeDeliveryVariableName: item.cpkRealtimeDeliveryVariableName,
          anomalyRealTimeDeliveryVariableName:
            item.anomalyRealTimeDeliveryVariableName,
        }
      })
    ).then((res: any) => {
      ElMessage.success('保存成功')
    })
  }
  const tableDataTreeList = ref([])
  const getDataconfigTreeFn = () => {
    getDataconfigTree().then((res: any) => {
      tableDataTreeList.value = res
    })
  }
  const functionbreadthQuery = (tree: any[], id: string) => {
    var stark: any[] = []
    stark = stark.concat(tree)
    while (stark.length) {
      var temp = stark.shift()
      if (temp.children) {
        stark = stark.concat(temp.children)
      }
      if (temp.id === id) {
        return temp
      }
    }
  }

  const visibleChange = (row: any) => {
    if (!row.dataTableId) {
      ElMessage.warning(_t('请选择数据表'))
      return
    }
    let tableRow = functionbreadthQuery(
      tableDataTreeList.value,
      row.dataTableId
    )
    dataObj.loading = true
    if (tableRow.nodeType == 2) {
      getFilingtable(row.dataTableId)
        .then((res: any) => {
          row.dataSelectList = res || []
          dataObj.loading = false
        })
        .catch((err: any) => {
          dataObj.loading = false
        })
    } else if (tableRow.nodeType == 3) {
      getAggregatetable(row.dataTableId)
        .then((res: any) => {
          row.dataSelectList = res || []
          dataObj.loading = false
        })
        .catch((err: any) => {
          dataObj.loading = false
        })
    } else {
      row.dataSelectList = []
    }
  }
  onMounted(() => {
    getDataconfigTreeFn()
    getData1()
  })

  return {
    controlchartTypeList,
    dataObj,
    tableRef1,
    dataSource1,
    column1,
    checkList1,
    tableRef2,
    dataSource2,
    column2,
    checkList2,
    tableDataTreeList,
    onCheck1,
    onRowClick1,
    onCheck2,
    onRowClick2,
    getData1,
    saveData1,
    onOpenControlChartSelect,
    onOpenDataPreview,
    selectVariable,
    visibleChange,
    controlChartSelectCallBack,
    onAdd1,
    onDel1,
    changeDataTable,
  }
}
