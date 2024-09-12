import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { Trace } from '../Models/Trace'
import { injectModel } from '@/libs/Provider/Provider'
import { Socket } from '@/libs/Socket/Socket'
import { OnTraceChanged, SubscribeTraceChanged } from '../enum'
import { lowerCaseFirstChar } from '@/utils'
import { get, has, throttle } from 'lodash'
import { Language } from '@/libs/Language/Language'
import { _t } from '../app'

interface FieldType {
  type: string
  title: string
  key: string
  field: string
  width: string
}

export const useTrace = (props: any, ctx?: any) => {
  const traceModel = injectModel<Trace>('trace')
  const dataSource = ref<Record<string, any>[]>([{}, {}, {}])
  const lastDataSource = ref<Record<string, any>[]>([])
  const productList = ref<any[]>([])
  const workSectionTree = ref<any[]>([])
  const columns = ref<FieldType[] | any[]>([{}, {}, {}])
  const layoutCacheMap: any = {}
  const renderCount = ref(0)
  const isStop = ref<boolean>(false)

  const animationMap: any = {
    trackingTraceAnimation: 'trackingTraceDefaultAnimation',
    trackingTraceDefaultAnimation: 'trackingTraceAnimation',
  }
  let animationKey = animationMap.trackingTraceAnimation

  let socket: any = null
  let socketConnection: any = null
  const dataConfig = computed(() => {
    return props.node.props?.dataConfig || {}
  })
  const productId = ref(dataConfig.value.productId || '')
  const workSectionId = ref(dataConfig.value.workSectionId || '')
  const num = computed(() => {
    return props.node.props?.num
  })

  const isFilter = computed(() => {
    if (props.node.props?.isFilter === undefined) {
      return true
    }
    return props.node.props?.isFilter
  })

  const originProductId = computed(() => {
    return dataConfig.value.productId || ''
  })
  const originSectionId = computed(() => {
    return dataConfig.value.workSectionId || ''
  })
  const productModel = computed(() => {
    return dataConfig.value.productModel || ''
  })
  const getProductList = async () => {
    productList.value = await traceModel.getProductList()
    const pid = dataConfig.value.productId
    productId.value = pid
    if (productId.value) {
      getWorkSectionTree(productId.value)
    }
  }

  const getWorkSectionTree = async (id: string) => {
    workSectionTree.value = await traceModel.getSectionList(id)
  }

  const updateList = (data: any[]) => {
    if (!data) return
    dataSource.value = []
    lastDataSource.value = data
    nextTick(() => {
      let showNumb = num.value || 3
      if (num.value < 1) {
        showNumb = 1
      } else if (num.value > 50) {
        showNumb = 50
      }

      const originData = data.slice(0, showNumb) || [{}, {}, {}]
      dataSource.value = originData.map((item: any, index: number) => {
        const params = item.params || []
        const keyMap: Record<string, any> = {}
        params.forEach((param: any) => {
          keyMap[param.key] = param.value
        })
        return {
          ...item,
          ...keyMap,
          _index: index,
          Seq: item.Seq || index + 1,
        }
      })
      nextTick(() => {
        if (dataSource.value.length) {
          if (renderCount.value >= 999999) {
            renderCount.value = 2
          }
          renderCount.value++
        }
      })
    })
  }

  onUnmounted(() => {
    socketConnection?.off(OnTraceChanged, updateList)
    socketConnection?.stop()
    socketConnection = null
    socket = null
    isStop.value = true
  })

  const initRealTimeList = (wid?: string, pid?: string) => {
    isStop.value = false
    socket = null
    const start = () => {
      if (wid || workSectionId.value) {
        const pModel = getProductModel(pid)
        const ProductModel = pModel || productModel.value

        const data = {
          WorkSectionId: wid || workSectionId.value,
          ProductModel: ProductModel === 'all' ? '' : ProductModel,
          CallbackId: OnTraceChanged,
        }
        const sendParamsFn = () => {
          socketConnection.invoke(SubscribeTraceChanged, data)
        }

        const service = () => {
          renderCount.value = 0
          try {
            socket = new Socket(
              {
                url: '/hubs/v1/trace',
                name: _t('生产追踪数据'),
              },
              true,
              isStop
            )
            socketConnection = socket.connection
            socketConnection.on(OnTraceChanged, updateList)
            socket
              .start(() => {
                !isStop.value && service()
              })
              .then(sendParamsFn)
          } catch (error) {
            console.error(error)
          }
        }
        service()
      }
    }
    if (socketConnection?.stop) {
      isStop.value = true
      socketConnection?.stop().then(() => {
        socketConnection = null
        start()
      })
    } else {
      if (!socketConnection) {
        start()
      }
    }
  }

  const renderRowStyle: any = ({ rowIndex, row }: any) => {
    if (rowIndex === row._index) {
      if (row.IsQualified == 'NG') {
        return {
          color: 'red',
        }
      }

      if (
        rowIndex === 0 &&
        row.Id &&
        renderCount.value > 1 &&
        window.app.mode !== 'editing'
      ) {
        animationKey = animationMap[animationKey]
        return {
          Animation: `${animationKey} 5s`,
        }
      }
    }
    return {}
  }

  const getProductModel = (id?: string) => {
    if (id && id !== 'all') {
      productList.value.find((item) => item.id === id)?.model
    }
    return 'all'
  }

  const onProductChange = () => {
    // socketConnection?.stop()
    renderCount.value = 0
    if (productId.value) {
      getWorkSectionTree(productId.value)
    }
    workSectionId.value = ''
    // columns.value = []
    dataSource.value = []
  }
  const onSectionChange = (id: string) => {
    renderCount.value = 0
    if (workSectionId.value) {
      updateLayout(workSectionId.value, productId.value)
      if (workSectionId.value && productId.value) {
        initRealTimeList(workSectionId.value, productId.value)
      }
    } else {
      workSectionId.value = ''
      columns.value = []
      dataSource.value = []
    }
  }
  const handleFieldItem = (fields: any[], layoutMap?: Record<string, any>) => {
    return fields.map((field: any) => {
      // const fieldKey = field.isBusinessField
      //   ? lowerCaseFirstChar(field.key)
      //   : field.key
      const fieldKey = field.key
      const fieldItem = {
        title: field.name || field.key,
        key: fieldKey,
        field: fieldKey,
        width: `${field.width}px`,
      }
      if (layoutMap) {
        fieldItem.title = layoutMap[field.key]?.name
      }
      return fieldItem
    })
  }
  /**
   * 获取布局数据
   * @param workId 工序ID
   * @param proId 产品型号ID
   * @returns
   */
  const getLayoutData = async (workId: string, proId: string) => {
    const data = {
      productId: proId,
      tableId: workId,
    }

    const key = `${proId}#${workId}`
    if (layoutCacheMap[key]) {
      return layoutCacheMap[key]
    }
    const layoutData: any[] = await traceModel.getTableLayout(data)
    layoutCacheMap[key] = layoutData

    return layoutData || []
  }
  const updateLayout = (workId?: string, proId?: string) => {
    columns.value = []

    nextTick(async () => {
      const wId = workId || workSectionId.value
      const pid = proId || productId.value
      if (pid && wId) {
        const fields = get(dataConfig.value, `${pid}#${wId}`)
        if (Array.isArray(fields) && fields.length) {
          const layoutData: any[] = await getLayoutData(wId, pid)
          const layoutMap = layoutData.reduce((pre: any, cur) => {
            pre[cur.key] = cur
            return pre
          }, {})
          columns.value = handleFieldItem(fields, layoutMap)
        } else {
          if (workId && proId) {
            const layoutData: any[] = await getLayoutData(workId, proId)
            const fields = layoutData.filter((column: any, index) => {
              return column.isBusinessField
            })
            columns.value = handleFieldItem(fields)
          }
        }
      }
      if (!columns.value.length) {
        const defaultColumns = get(dataConfig.value, 'default', [{}, {}, {}])
        columns.value = defaultColumns
      }
    })
  }

  Language.useChange((lang: typeof Language) => {
    updateLayout()
  })

  watch(originProductId, () => {
    productId.value = originProductId.value
    getWorkSectionTree(originProductId.value)
  })

  watch(originSectionId, () => {
    workSectionId.value = originSectionId.value
    getWorkSectionTree(originProductId.value)
  })

  watch(
    () => originSectionId.value + productModel.value,
    () => {
      if (originSectionId.value && productModel.value) {
        workSectionId.value = originSectionId.value
        productId.value = originProductId.value
        initRealTimeList()
      }
    }
  )

  const updateNodeFn = () => {
    const node = props.node
    if (node.props) {
      if (has(node.props, 'dataConfig')) {
        if (originProductId.value && originSectionId.value) {
          updateLayout()
        }
      }
    }
  }

  watch(() => props.node, throttle(updateNodeFn, 500), {
    deep: true,
  })

  watch(num, (n, o) => {
    if (num.value) {
      if (!workSectionId.value) {
        dataSource.value = []
        for (let index = 0; index < num.value; index++) {
          dataSource.value.push({})
        }
      } else {
        updateList(lastDataSource.value)
      }
    }
  })

  watch(dataConfig, () => updateLayout(), {
    deep: true,
  })

  onMounted(() => {
    getProductList()
    updateLayout()
    if (workSectionId.value && productModel.value) {
      initRealTimeList()
    }
  })
  return {
    dataSource,
    columns,
    renderRowStyle,
    isFilter,
    productId,
    workSectionId,
    productList,
    workSectionTree,
    onSectionChange,
    onProductChange,
  }
}
