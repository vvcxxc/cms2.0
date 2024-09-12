import { ref, SetupContext, reactive, watch, onMounted, onUnmounted } from 'vue'
import {
  getRuleList,
  getRange,
  saveRuleList,
  saveRange,
  recover,
} from '../Models/Service/Service'
import { _t } from '../app'
import { ElMessage } from 'element-plus'

export const useBasicRuleSettings = (props: any, ctx: SetupContext) => {
  const dataObj: any = reactive({
    timeRange: null,
  })
  const tableRef = ref<any>(null)
  const dataSource = ref<any>([])
  const column = ref<any>([
    {
      title: '准则编码',
      field: 'ruleCode',
    },
    {
      title: '标准判异规则',
      field: 'standardAnomalyRule',
      width: 350,
    },
    {
      title: 'N值',
      field: 'nValue',
    },
    {
      title: 'M值',
      field: 'mValue',
    },
    {
      title: '参考范围',
      field: 'referenceRange',
    },
  ])
  const resetData1 = () => {
    recover().then((res: any) => {
      ElMessage.success(_t('恢复成功'))
      getData1()
    })
  }
  const saveData1 = () => {
    if (
      dataSource.value.some((item: any) => !/^[1-9][0-9]*$/.test(item.nValue))
    ) {
      let idx = dataSource.value.findIndex(
        (item: any) => !/^[1-9][0-9]*$/.test(item.nValue)
      )
      ElMessage.warning(
        _t('第') + (Number(idx) + 1) + _t('行') + _t('N值') + _t('请输入正整数')
      )
      return
    }
    if (
      dataSource.value.some(
        (item: any) => item.mValue != null && !/^[1-9][0-9]*$/.test(item.mValue)
      )
    ) {
      let idx = dataSource.value.findIndex(
        (item: any) => !/^[1-9][0-9]*$/.test(item.mValue)
      )
      ElMessage.warning(
        _t('第') + (Number(idx) + 1) + _t('行') + _t('M值') + _t('请输入正整数')
      )
      return
    }
    saveRuleList(dataSource.value).then((res: any) => {
      ElMessage.success(_t('保存成功'))
    })
  }
  const saveData2 = () => {
    if (!/^[1-9][0-9]*$/.test(dataObj.timeRange)) {
      ElMessage.warning(_t('实时监控时间范围') + _t('请输入正整数'))
      return
    }
    saveRange({ timeRange: dataObj.timeRange }).then((res: any) => {
      ElMessage.success(_t('保存成功'))
    })
  }
  const getData1 = () => {
    getRuleList().then((res: any) => {
      dataSource.value =
        res.map((item: any) => ({
          ...item,
          standardAnomalyRuleList: item.standardAnomalyRule.split(''),
        })) || []
    })
  }
  const getData2 = () => {
    getRange().then((res: any) => {
      dataObj.timeRange = res
    })
  }

  onMounted(() => {
    getData1()
    getData2()
  })

  return {
    dataObj,
    tableRef,
    dataSource,
    column,
    getData1,
    getData2,
    saveData1,
    saveData2,
    resetData1,
  }
}
