<template>
  <div class="container light-element-ui">
    <div class="head">
      <div class="head-left">
        <IconButton icon="add-p" @click="onAdd" type="primary">
          新建工单
        </IconButton>

        <TableFilter
          text="添加条件"
          :formData="ProductModel"
          @data="updateFn"
          :columns="columnsFilter"
        >
          <IconButton icon="f">筛选</IconButton>
        </TableFilter>

        <IconButton icon="export" :onClick="onExport"> 导出 </IconButton>
      </div>
      <div class="head-right">
        时间范围：
        <DatePicker
          v-model="timeRange"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          :default-time="[
            new Date(2000, 1, 1, 0, 0, 0),
            new Date(2000, 2, 1, 23, 59, 59),
          ]"
          @change="onChangeDate"
        />
        <Search
          v-model="condition.Filter"
          @Confirm="initAllTableData"
          :style="{ marginLeft: '5px' }"
        />
      </div>
    </div>
    <template v-for="item in collapseList" :key="collapseOptions[item].key">
      <CollapseTable
        :table-head="currentTableHead(collapseOptions[item].key)"
        v-model="collapseOptions[item].tableData"
        v-bind="collapseOptions[item].attrsProp"
        :status="collapseOptions[item].key"
        @onAction="onActions"
        @Page="onPage"
      />
    </template>

    <TipPop
      v-if="tipParams.tipVisible"
      :tipText="tipParams.tipText"
      :tipTextIcon="tipParams.tipTextIcon"
      :noCancel="tipParams.noCancel"
      @tipCallBack="tipConfirm"
    />
    <ProductFormDialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :dialogConfig="dialogConfig"
      :status="dialogStatus"
      @callback="callback"
    />
    <ModuleDialog
      v-if="moduleDialogVisible"
      v-model="moduleDialogVisible"
      :moduleDialogConfig="moduleDialogConfig"
      @close="onCloseDialog"
    />
    <PrepareFormDialog
      v-if="prepareFormVisible"
      v-model="prepareFormVisible"
      :dialogConfig="prepareDialogConfig"
      @callback="prepareCallback"
    />
    <SegmentDialog
      :id="segmentConfig.row?.id"
      v-model="segmentConfig.visible"
      @confirm="onDeliverThen"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
  PropType,
  onMounted,
  watch,
  nextTick,
} from 'vue'
import get from 'lodash/get'
import head from 'lodash/head'
import isNull from 'lodash/isNull'
import cloneDeep from 'lodash/cloneDeep'
import { useGlobalState } from '@/libs/Store/Store'

import dayjs from 'dayjs'
import sdk from 'sdk'
const { models } = sdk
const { Language } = models
const { _t } = Language
import api from '../../api/product-setting'
import { ElMessage, ElMessageBox } from 'element-plus'
import type {
  IProductTableItem,
  IProductParamsRequest,
} from '../../api/product'
import {
  DIALOG_STATUS,
  ORDER_STATUS,
  ORDER_STATUS_MAP,
  ORDER_ACTIONS_STATUS,
} from '../../enum'
import CustomFormItem from '../../components/customFormItem/index.vue'
import ProductFormDialog from '../../dialog/productForm.vue'
import PrepareFormDialog from '../../dialog/prepareForm.vue'
import Pagination from '../../components/pagination/index.vue'
import TipPop from '../../components/TipPop/index.vue'
import StatusComponent from '../../components/status/index.vue'
import ModuleDialog from '../../dialog/moduleDialog/index.vue'
import CollapseTable from '../../components/collapse-table/index.vue'
import IconButton from '@/components/IconButton/IconButton'
import Search from '@/components/Search/Search'
import DatePicker from '@/components/DatePicker/index.vue'
import TableFilter from '@/components/TableFilter/TableFilter'
import { createInjector } from '../../hooks/use-permission'
import SegmentDialog from '../../dialog/segment/segment'

export default defineComponent({
  name: 'OrderManagement',
  components: {
    SegmentDialog,
    ProductFormDialog,
    PrepareFormDialog,
    Pagination,
    TipPop,
    StatusComponent,
    ModuleDialog,
    CollapseTable,
    CustomFormItem,
    IconButton,
    Search,
    DatePicker,
    TableFilter,
  },
  setup() {
    const { curTab } = createInjector()

    watch(curTab, (val: any) => {
      if (val == 'OrderManagement') {
        initProdCode()
      }
    })

    const segmentConfig = ref<{
      visible: boolean
      row: {
        id?: string
        tableSelectList?: any[]
      }
    }>({
      visible: false,
      row: {},
    })
    const ProductModel = ref<Record<string, any>>({})
    const prodCodeList = ref<any[]>([])
    const columnsFilter = ref<any[]>([
      {
        field: 'ProductModel',
        title: '产品型号',
        el: 'select',
        // 搜索时所用的字段
        prop: 'ProductModel',
        options: prodCodeList,
        placeholder: '请选择',
      },
    ])

    const { isHasPermission } = createInjector()
    // const timeRange: any = ref([
    //   dayjs().subtract(7, 'day').startOf('day').format('YYYY-MM-DD 00:00:00'),
    //   dayjs().startOf('day').format('YYYY-MM-DD 23:59:59'),
    // ])
    const timeRange: any = ref(['', '']) //bug-15153 默认去掉时间范围限制，展示全量数据
    const condition = ref({
      Filter: '',
      Status: '',
      currentPage: 1,
      pageSize: 10,
      page: {},
    })
    const collapseOptions = ref({
      [ORDER_STATUS.PRODUCTION]: {
        // 生产中
        key: ORDER_STATUS.PRODUCTION,
        tableData: [],
        attrsProp: {
          title: ORDER_STATUS_MAP[ORDER_STATUS.PRODUCTION],
          total: 0,
          hiddenSort: true,
          buttons: [
            ORDER_ACTIONS_STATUS.PAUSE,
            ORDER_ACTIONS_STATUS.COMPLTE,
            ORDER_ACTIONS_STATUS.FINISHED,
          ],
        },
        sort: 0,
      },
      [ORDER_STATUS.PRODUCED]: {
        // 待生产
        key: ORDER_STATUS.PRODUCED,
        tableData: [],
        attrsProp: {
          title: ORDER_STATUS_MAP[ORDER_STATUS.PRODUCED],
          total: 0,
          buttons: [
            ORDER_ACTIONS_STATUS.DELIVER,
            ORDER_ACTIONS_STATUS.REVOKE,
            ORDER_ACTIONS_STATUS.FINISHED,
          ],
        },
        sort: 1,
      },
      [ORDER_STATUS.PAUSED]: {
        // 已暂停
        key: ORDER_STATUS.PAUSED,
        tableData: [],
        attrsProp: {
          title: ORDER_STATUS_MAP[ORDER_STATUS.PAUSED],
          total: 0,
          buttons: [
            ORDER_ACTIONS_STATUS.DELIVER,
            ORDER_ACTIONS_STATUS.FINISHED,
          ],
        },
        sort: 2,
      },
      [ORDER_STATUS.NOT_ACTIVE]: {
        // 未激活
        key: ORDER_STATUS.NOT_ACTIVE,
        tableData: [],
        attrsProp: {
          title: ORDER_STATUS_MAP[ORDER_STATUS.NOT_ACTIVE],
          total: 0,
          buttons: [
            ORDER_ACTIONS_STATUS.ACTIVATION,
            ORDER_ACTIONS_STATUS.EDIT,
            ORDER_ACTIONS_STATUS.FINISHED,
            ORDER_ACTIONS_STATUS.DELETE,
            ORDER_ACTIONS_STATUS.UPLOAD,
            ORDER_ACTIONS_STATUS.DOWNLOADTEMPLATE,
          ],
        },
        sort: 3,
      },
    })
    const collapseList = computed(() =>
      Object.keys(collapseOptions.value).sort((a, b) => {
        return collapseOptions.value[a].sort - collapseOptions.value[b].sort
      })
    )

    const dialogVisible = ref(false)
    const dialogConfig = ref<IProductParamsRequest>()
    const dialogStatus = ref(DIALOG_STATUS.ADD)

    const moduleDialogVisible = ref(false)
    const moduleDialogConfig = ref({})

    const prepareFormVisible = ref(false)
    const prepareDialogConfig = ref({})

    const tableData = ref<IProductTableItem[]>([])
    const tableSelectList = ref<IProductTableItem[]>([])

    const ORDER_STATUS_REF = reactive(ORDER_STATUS)

    const hasProduction = computed(() =>
      tableData.value.find((item) => item.status === ORDER_STATUS.PRODUCTION)
    )
    const { systemConfig } = useGlobalState()

    const hasProductionLineStructure = computed(() => {
      const { ProductionLineStructure } = systemConfig.state.value
      return ProductionLineStructure == 1
    })
    const callbackStack = ref([])
    const callbackStatus = ref(false)

    const tipParams = ref({
      tipVisible: false,
      tipText: '',
      tipTextIcon: '',
      noCancel: false,
    })

    const tableHead = ref([
      {
        prop: 'code',
        label: '工单号',
      },
      {
        prop: 'source',
        label: '工单来源',
      },
      {
        prop: 'productModel',
        label: '产品型号',
      },
      {
        prop: 'formulaName',
        label: '工艺配方',
      },
      {
        prop: 'segments',
        label: '产线段',
      },
      {
        prop: 'planQty',
        label: '计划数量',
      },
      {
        prop: 'produceQty',
        label: '投产数量',
      },
      {
        prop: 'qualifiedQty',
        label: '合格数',
      },
      {
        prop: 'progress',
        label: '工单生产进度',
      },
      {
        prop: 'shift',
        label: '班次',
      },
      {
        prop: 'planStartTime',
        label: '计划开始时间',
        width: 180,
      },
      {
        prop: 'planFinishTime',
        label: '计划结束时间',
        width: 180,
      },
      {
        prop: 'statusName',
        label: '工单状态',
      },
    ])

    const currentTableHead = computed(() => {
      return (status: number) => {
        if (hasProductionLineStructure.value) {
          if ([1, -1].includes(status)) {
            return tableHead.value
          } else {
            return tableHead.value.filter((item) => {
              return item.prop !== 'segments'
            })
          }
        } else {
          return tableHead.value.filter((item) => item.prop !== 'segments')
        }
      }
    })

    const onChangeDate = () => {
      const startTime = timeRange.value?.[0]
      const endTime = timeRange.value?.[1]
      console.log('onChangeDate', startTime, endTime)
      initAllTableData()
    }

    const onAdd = () => {
      if (!isHasPermission('OrderManagement-actions-add')) {
        ElMessage.error('用户没有该权限！')
        return
      }
      dialogStatus.value = DIALOG_STATUS.ADD
      dialogVisible.value = true
    }

    const onEdit = async (tableSelectList: IProductTableItem[] = []) => {
      if (!isHasPermission('OrderManagement-actions-update')) {
        ElMessage.error('用户没有该权限！')
        return
      }
      if (tableSelectList.length !== 1) {
        ElMessage.warning('请选择一个工单进行操作')
        return
      }

      const id = get(head(tableSelectList), 'id', '')

      const result = await api.getOrder(id)

      dialogConfig.value = result
      console.log('result', result)
      dialogStatus.value = DIALOG_STATUS.EDIT
      dialogVisible.value = true
    }

    const onDelete = async (tableSelectList: IProductTableItem[] = []) => {
      if (!isHasPermission('OrderManagement-actions-delete')) {
        ElMessage.error('用户没有该权限！')
        return
      }
      if (!tableSelectList.length) {
        ElMessage.warning('请至少选择一个工单进行操作')
        return
      }
      // // 是否存在 待生产 以外的状态
      // const onlyProduced = tableSelectList.every(
      //   (item) => item.status === ORDER_STATUS.PRODUCED
      // )

      // 检测是否工单来源‘本地创建’ 以外
      const isLocalSource = tableSelectList.every(
        (item) => item.source === '工单来源'
      )

      if (isLocalSource) {
        return ElMessage.error('删除失败！工单来源非本地创建，不支持删除')
      }

      // if (!onlyProduced) {
      //   setTipParams(true, '操作失败！仅支持删除工单状态为待生产的工单，请检查后重试', 'cuowutishi')
      //   return
      // }

      const func = async () => {
        const ids = tableSelectList.map((item) => item.id)
        await api.delOrder(ids)
        ElMessage.success(`删除成功`)
        initAllTableData()
      }

      setTipParams(true, '工单删除后不可恢复，是否确认删除', '')

      // @ts-ignore
      callbackStack.value.push(() => {
        return callbackStatus.value ? func() : Promise.resolve
      })
    }

    const onDeliver = async (
      tableSelectList: IProductTableItem[] = [],
      status?: string | number
    ) => {
      if (!isHasPermission('OrderManagement-actions-deliver')) {
        ElMessage.error('用户没有该权限！')
        return
      }

      if (tableSelectList.length !== 1) {
        ElMessage.warning('请选择一个工单进行操作')
        return
      }

      const id = get(head(tableSelectList), 'id', '')
      // const len = get(
      //   collapseOptions.value,
      //   `${[ORDER_STATUS.PRODUCTION]}.attrsProp.total`,
      //   0
      // )
      // if (len) {
      //   setTipParams(true, '工单下发失败!存在正在生产中的工单', '', true)
      //   return
      // }
      segmentConfig.value.row = {
        id,
        tableSelectList,
      }
      if (hasProductionLineStructure.value) {
        if (status == 0) {
          segmentConfig.value.visible = true
        } else {
          onDeliverThen({
            segments: tableSelectList[0].segments,
          })
        }
      } else {
        const data = status == 0 ? [] : tableSelectList[0].segments || []
        onDeliverThen({
          segments: data,
        })
      }
    }
    // const onSegmentConfirm = (segments: string[]) => {
    //   onDeliverThen()
    // }
    const onDeliverThen = (segments?: Record<string, any>) => {
      const { row }: any = segmentConfig.value
      const func = async () => {
        await api.putDeliver(row.id, segments)

        ElMessage.success('操作成功')

        initAllTableData()
      }

      // setTipParams(true, '下发工单前请确保完成清线操作，是否确认下发工单？', '')

      // @ts-ignore
      callbackStack.value.push(() => {
        return callbackStatus.value ? func() : Promise.resolve
      })

      nextTick(() => tipConfirm('confirm'))
    }
    const onPause = async (tableSelectList: IProductTableItem[] = []) => {
      if (!isHasPermission('OrderManagement-actions-pause')) {
        ElMessage.error('用户没有该权限！')
        return
      }

      if (tableSelectList.length !== 1) {
        ElMessage.warning('请选择一个工单进行操作')
        return
      }

      const id = get(head(tableSelectList), 'id', '')

      const func = async () => {
        await api.putPause(id)

        ElMessage.success('操作成功')

        initAllTableData()
      }

      setTipParams(
        true,
        '工单暂停后，已上线产品会继续生产，是否确认暂停工单？',
        ''
      )

      // @ts-ignore
      callbackStack.value.push(() => {
        return callbackStatus.value ? func() : Promise.resolve
      })
    }
    const onFinished = async (
      tableSelectList: IProductTableItem[] = [],
      s?: string | number
    ) => {
      if (!isHasPermission('OrderManagement-actions-finish')) {
        ElMessage.error('用户没有该权限！')
        return
      }

      if (tableSelectList.length !== 1) {
        ElMessage.warning('请选择一个工单进行操作')
        return
      }

      const id = get(head(tableSelectList), 'id', '')
      const status = get(head(tableSelectList), 'status', '')

      if (status === ORDER_STATUS.PRODUCTION) {
        await ElMessageBox.confirm(`工单正在生产，是否强制结束？`, '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'info',
        })
      }

      moduleDialogConfig.value = { id }
      moduleDialogVisible.value = true
    }
    const onRevoke = async (
      tableSelectList: IProductTableItem[] = [],
      status?: string | number
    ) => {
      if (!tableSelectList.length) {
        ElMessage.warning('请选择一个工单进行操作')
        return
      }

      const func = async () => {
        const id = get(head(tableSelectList), 'id', '')
        await api.putRevoke(id)
        ElMessage.success(`撤销成功`)
        initAllTableData()
      }

      setTipParams(
        true,
        '工单撤销后，状态变为初始待激活状态;是否确认撤销工单？',
        ''
      )

      // @ts-ignore
      callbackStack.value.push(() => {
        return callbackStatus.value ? func() : Promise.resolve
      })
    }
    const onActivation = async (
      tableSelectList: IProductTableItem[] = [],
      status?: string | number
    ) => {
      if (tableSelectList.length !== 1) {
        ElMessage.warning('请选择一个工单进行操作')
        return
      }

      const targetOrder = head(tableSelectList)
      const id = get(targetOrder, 'id', '')

      const result = await api.putPrepareActive(id)
      ElMessage.success(`激活成功`)
      initAllTableData()

      if (result.length) {
        prepareFormVisible.value = true
        prepareDialogConfig.value = {
          ...head(tableSelectList),
          tableData: result,
        }
      }
    }
    const onComplete = async (
      tableSelectList: IProductTableItem[] = [],
      status?: string | number
    ) => {
      if (tableSelectList.length !== 1) {
        ElMessage.warning('请选择一个工单进行操作')
        return
      }
      const func = async () => {
        const targetOrder = head(tableSelectList)
        const id = get(targetOrder, 'id', '')
        await api.putComplete(id)
        ElMessage.success(`完成成功`)
        initAllTableData()
      }
      setTipParams(true, '是否确认完成工单？', '')
      // @ts-ignore
      callbackStack.value.push(() => {
        return callbackStatus.value ? func() : Promise.resolve
      })
    }
    const onActions = async (data: any) => {
      console.log('onActions', data)
      const ACTION_MAP = {
        [ORDER_ACTIONS_STATUS.DELIVER]: onDeliver,
        [ORDER_ACTIONS_STATUS.PAUSE]: onPause,
        [ORDER_ACTIONS_STATUS.FINISHED]: onFinished,
        [ORDER_ACTIONS_STATUS.REVOKE]: onRevoke,
        [ORDER_ACTIONS_STATUS.EDIT]: onEdit,
        [ORDER_ACTIONS_STATUS.DELETE]: onDelete,
        [ORDER_ACTIONS_STATUS.ACTIVATION]: onActivation,
        [ORDER_ACTIONS_STATUS.COMPLTE]: onComplete,
        [ORDER_ACTIONS_STATUS.UPLOAD]: onImport,
        [ORDER_ACTIONS_STATUS.DOWNLOADTEMPLATE]: onDownloadTemplate,
      }
      if (data.type == ORDER_ACTIONS_STATUS.UPLOAD) {
        onImport(data.data)
        return
      }
      const type = get(data, 'type')
      const func = ACTION_MAP[type]

      if (!func) return

      const params = get(data, 'data.tableSelectList', [])
      func(params, get(data, 'status'))
    }
    // 分页配置
    const paginationConfig = reactive<{
      pageSize: number
      currentPage: number
      total: number
    }>({
      pageSize: 50, // X条/页
      currentPage: 1, // 当前第X页
      total: 0, // 总共X页
    })

    const handleSelectionChange = (val: IProductTableItem[]) => {
      tableSelectList.value = val
    }

    const onExport = async () => {
      if (!isHasPermission('OrderManagement-actions-export')) {
        ElMessage.error('用户没有该权限！')
        return
      }
      const params = {
        Filter: '',
        StartTime: '',
        FinishTime: '',
        Status: '',
        Sorting: '',
        SkipCount:
          (paginationConfig.currentPage - 1) * paginationConfig.pageSize + '',
        MaxResultCount: paginationConfig.pageSize + '',
      }
      const result = await api.exportOrder(params)

      downloadFile(
        result,
        `工单${
          '' +
          new Date().getFullYear() +
          Number(new Date().getMonth() + 1) +
          new Date().getDate() +
          new Date().getTime()
        }.xlsx`
      )
    }

    const onDownloadTemplate = async () => {
      if (!isHasPermission('OrderManagement-actions-download')) {
        ElMessage.error('用户没有该权限！')
        return
      }
      const result = await api.downloadTemplate()
      downloadFile(
        result,
        `工单模版${
          '' +
          new Date().getFullYear() +
          Number(new Date().getMonth() + 1) +
          new Date().getDate() +
          new Date().getTime()
        }.xlsx`
      )
    }
    // @ts-ignore
    const onImport = async (file) => {
      if (!isHasPermission('OrderManagement-actions-import')) {
        ElMessage.error('用户没有该权限！')
        return
      }
      let formData = new FormData()
      formData.append('file', file.file)

      try {
        await api.postImport(formData)
        ElMessage.success('操作成功')
      } catch (error) {
        console.log(error)
      } finally {
        initAllTableData()
      }
    }

    // @ts-ignore
    function downloadFile(file, fileName) {
      const blob = new Blob([file])
      // 兼容不同浏览器的URL对象
      // const url:any = window.URL || window.webkitURL || window.moxURL
      const url = window.URL || window.webkitURL
      // 创建下载链接
      const downloadHref = url.createObjectURL(blob)
      // 创建a标签并为其添加属性
      let downloadLink = document.createElement('a')
      downloadLink.href = downloadHref
      downloadLink.download = fileName
      // 触发点击事件执行下载
      downloadLink.click()
      // @ts-ignore
      window.URL.revokeObjectURL(url)
    }

    const updateFn = (data: any) => {
      ProductModel.value = data
      console.log('ProductModel', ProductModel.value)

      initAllTableData()
    }

    const onPage = (config: any) => {
      condition.value.page[config.status] = config.currentPage
      initTableData(config.status)
    }

    async function initTableData(Status = '') {
      const skipCount =
        condition.value.page[Status] || condition.value.currentPage

      const StartTime = timeRange.value?.[0] || ''
      const FinishTime = timeRange.value?.[1] || ''
      const params = {
        Filter: condition.value.Filter,
        StartTime,
        FinishTime,
        Status,
        Sorting: '',
        Product: ProductModel.value.ProductModel,
        SkipCount: (skipCount - 1) * condition.value.pageSize + '',
        MaxResultCount: condition.value.pageSize + '',
      }

      const result = await api.getTable(params)
      const data = get(result, 'items', []).map((item, index) => {
        // @ts-ignore
        const { sort } = item
        return {
          ...item,
          formulaName: item.formula?.name,
          statusName: item.status?.description,
          sort: isNull(sort) ? index : sort,
        }
      })

      if (collapseOptions.value[Status]) {
        collapseOptions.value[Status].tableData = cloneDeep(data)
        collapseOptions.value[Status].attrsProp.total = paginationConfig.total =
          get(result, 'totalCount', 0)
      }
    }
    async function initTableHead() {
      // const result = await api.getTableHead()
      // const data = get(result, 'settings', [])
      // let head = []
      // try {
      //   // @ts-ignore
      //   head = JSON.parse(head(data).value || '')
      // } catch (error) {
      //   console.log(error, 'error >>>')
      // }
      // const backupsHead = cloneDeep(tableHead.value)
      // tableHead.value = []
      // // @ts-ignore
      // const isEnabledHead = head.filter((item) => item.isEnabled)
      // // @ts-ignore
      // isEnabledHead.forEach((fe) => {
      //   const originProp = fe.filedCode.charAt(0).toLowerCase() + fe.filedCode.slice(1)
      //   const originLabel = fe.filedName
      //   const item = backupsHead.find((f) => f.prop === originProp)
      //   if (item) {
      //     tableHead.value.push(item)
      //   } else {
      //     tableHead.value.push({
      //       prop: originProp,
      //       label: originLabel,
      //     })
      //   }
      // })
      // tableHead.value = tableHead.value.filter(item => !item?.isHidden)
    }
    const initProdCode = async () => {
      const result = await api.getModelOptionsNew()
      result.unshift({
        name: '不限',
        value: '',
        description: '不限',
      })
      prodCodeList.value = result
      initAllTableData()
    }
    function initAllTableData() {
      Object.keys(collapseOptions.value).forEach((item) => {
        initTableData(item)
      })
    }
    onMounted(() => {
      initProdCode()
    })

    const tipConfirm = async (action: 'cancel' | 'confirm') => {
      if (!callbackStack.value.length) {
        setTipParams()
        return
      }

      callbackStatus.value = action === 'confirm'

      const ajaxFunc = callbackStack.value.pop()
      if (!ajaxFunc) return

      try {
        // @ts-ignore
        await ajaxFunc()
      } catch (error) {
        console.log(' callbackStack list error', error)
      } finally {
        callbackStack.value = []
      }

      setTipParams()
    }

    const onCloseDialog = () => {
      moduleDialogVisible.value = false
      initAllTableData()
    }
    function setTipParams(
      tipVisible = false,
      tipText = '',
      tipTextIcon = '',
      noCancel?: boolean
    ) {
      tipParams.value = {
        tipVisible,
        tipText,
        tipTextIcon,
        noCancel: noCancel || false,
      }
    }

    function init() {
      initTableHead()
    }

    init()

    const callback = () => {
      dialogVisible.value = false
      initAllTableData()
    }

    const prepareCallback = () => {
      prepareFormVisible.value = false
      prepareDialogConfig.value = {}
      initAllTableData()
    }

    // @ts-ignore
    function downloadFile(file, fileName) {
      const blob = new Blob([file])
      // 兼容不同浏览器的URL对象
      // const url:any = window.URL || window.webkitURL || window.moxURL
      const url = window.URL || window.webkitURL
      // 创建下载链接
      const downloadHref = url.createObjectURL(blob)
      // 创建a标签并为其添加属性
      let downloadLink = document.createElement('a')
      downloadLink.href = downloadHref
      downloadLink.download = fileName
      // 触发点击事件执行下载
      downloadLink.click()
      // @ts-ignore
      window.URL.revokeObjectURL(url)
    }

    return {
      condition,
      collapseOptions,
      collapseList,
      tableHead,
      tableData,
      paginationConfig,
      dialogVisible,
      dialogConfig,
      dialogStatus,
      moduleDialogVisible,
      moduleDialogConfig,
      prepareFormVisible,
      prepareDialogConfig,
      hasProduction,
      tipParams,
      columnsFilter,
      timeRange,
      prodCodeList,
      ProductModel,
      ORDER_STATUS_REF,
      currentTableHead,
      segmentConfig,
      onDeliverThen,
      onAdd,
      onEdit,
      onDelete,
      onDeliver,
      onPause,
      onFinished,
      onActions,
      callback,
      prepareCallback,
      handleSelectionChange,
      onExport,
      onImport,
      onDownloadTemplate,
      tipConfirm,
      onCloseDialog,
      initAllTableData,
      initProdCode,
      onChangeDate,
      updateFn,
      onPage,
    }
  },
})
</script>
<style lang="scss" scoped>
@import '@/assets/styles/common.scss';

.container {
  height: 100%;
  overflow: auto;
}

.head {
  display: flex;
  justify-content: space-between;

  .head-left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  :deep(.cs-input__wrapper) {
    height: 32px;
  }
}

.right-btn {
  color: #484f53;
  background-color: #fff;
}

.sortClass {
  border-radius: 50%;
  color: #fff;
  border: 1px solid #c7c9cc;
  background-color: #c7c9cc;
  padding: 3px;
  font-size: 8px;
  cursor: pointer;

  &:last-child {
    margin-left: 8px;
  }

  &:hover {
    background-color: #5a84ff;
    border-color: #5a84ff;
  }
}

.head-right {
  display: flex;
  align-items: center;
}

.prohibit {
  cursor: no-drop;

  &:hover {
    border: 1px solid #c7c9cc;
    background-color: #c7c9cc;
  }
}
</style>
<style lang="scss">
@import url(../../../../assets/styles/common.scss);
</style>
