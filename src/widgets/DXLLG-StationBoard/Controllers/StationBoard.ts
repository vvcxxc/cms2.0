import { SetupContext, ref, onMounted, computed, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getWorksectionList,
  getWorkstationList,
  login,
  getData,
  setValue,
  getWorkstation,
  getSerialnumber,
  finish,
} from '../Models/Service/Service'
import dayjs from 'dayjs'
import sdk from 'sdk'
const { Variable } = sdk.models
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import { Base } from '@/libs/Base/Base'
const request = Base.request

export const useStationBoard = (props: any, { emit }: SetupContext) => {
  const carouselRef = ref()
  const myCarousel = ref()
  const materialTableRef = ref<any>()
  const paramsTableRef = ref<any>()
  const prodCodeInputsRef = ref<any>()
  const materialInputsRef = ref<any>({})
  const paramsInputsRef = ref<any>({})
  const unqualifiedReasonMap = ref<Record<string, any>>({})

  const dataObj = reactive<any>({
    nowTime: {},
    prodCode: '',
    batchMaterialFeedingShow: false,
    loginWorksection: '', //登录显示用
    loginWorkstation: '', //登录显示用
    loginName: '', //登录显示用
    loginPass: '', //登录显示用
    curWorkSection: '', //登录后当前的
    curWorkStation: '', //登录后当前的
    curName: '', //登录后当前的

    workStationName: '',
    orderNumber: '',
    productModel: '',
    productId: '',
    productName: '',
    serialNumberVariable: '',
    inbound_WorkTypeVariable: '',
    inbound_EntrySignal: '',
    inbound_ResultVariable: 2,
    inbound_Description: '',
    materialDto: [],
    parameterDto: [],

    ////
    processingResults: 0,
    ngReason: '',
    repairSection: '',
    entryTime: '',
  })
  const workType = computed(() => {
    return (
      ({ 0: '复位', 1: '正常加工', 2: '返修加工' } as any)[
        getVariableValue(dataObj.inbound_WorkTypeVariable) || 0
      ] ?? '#262626'
    )
  })
  const dateTimer = ref<any>(null)
  const materialColumns = [
    {
      title: '物料名称',
      field: 'name',
    },
    {
      title: '物料类型',
      field: 'materialType',
    },
    {
      title: '物料条码',
      field: 'barcodeVariable',
      width: 150,
    },
    {
      title: '校验结果',
      field: 'verificationResultSignal',
    },
  ]
  const paramsColumns = [
    {
      title: '参数名称',
      field: 'name',
    },
    {
      title: '参数描述',
      field: 'description',
    },
    {
      title: '下限',
      field: 'lower',
      width: 60,
    },
    {
      title: '上限',
      field: 'upper',
      width: 60,
    },
    {
      title: '标准值',
      field: 'targetValue',
      width: 65,
    },
    {
      title: '检验结果',
      field: 'variable',
      width: 150,
    },
    {
      title: '单项判定',
      field: 'judge',
      width: 90,
    },
  ]

  const dateMap = {
    0: '星期日',
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六',
  }

  const getNowTime = () => {
    const timeObj = dayjs()
    dataObj.nowTime = {
      date: timeObj.format('YYYY-MM-DD'),
      time: timeObj.format('HH:mm:ss'),
      weekday: dateMap[timeObj.day()],
    }
  }

  const worksectionList = ref<any[]>([])
  const getWorksectionListFn = () => {
    return getWorksectionList({
      filter: '',
      abilityType: 0,
      includeDetails: true,
    }).then((res: any) => {
      worksectionList.value = res.items || []
      // if (worksectionList.value.length) {
      //   dataObj.loginWorksection = worksectionList.value[0].id
      //   getWorkstationListFn()
      // }
    })
  }

  const workstationList = ref<any[]>([])
  const getWorkstationListFn = () => {
    dataObj.loginWorkstation = ''
    if (!dataObj.loginWorksection) {
      workstationList.value = []
      return
    }
    return getWorkstationList({
      filter: '',
      WorkSection: dataObj.loginWorksection,
    }).then((res: any) => {
      workstationList.value = res.items || []
      // if (workstationList.value.length) {
      //   dataObj.loginWorkstation = workstationList.value[0].id
      // }
    })
  }

  const getStationkanbanFn = () => {
    materialInputsRef.value = {}
    paramsInputsRef.value = {}
    getData({
      stationId: dataObj.curWorkStation,
    }).then((res: any) => {
      dataObj.workStationName = res.workStationName
      dataObj.orderNumber = res.orderNumber
      dataObj.productModel = res.productModel
      dataObj.productId = res.productId
      dataObj.productName = res.productName
      dataObj.serialNumberVariable = res.serialNumberVariable
      dataObj.inbound_WorkTypeVariable = res.inbound_WorkTypeVariable
      dataObj.inbound_EntrySignal = res.inbound_EntrySignal
      dataObj.inbound_ResultVariable = res.inbound_ResultVariable
      dataObj.inbound_Description = res.inbound_Description
      dataObj.materialDto = res.materialDto || []
      dataObj.parameterDto = res.parameterDto || []

      dataObj.materialDto.forEach((item: any) => {
        item.code = getVariableValue(item.barcodeVariable) || ''
      })
      //采集参数提交产品后没复位，有可能当前是上一个产品的，，让他重新输吧
      // dataObj.parameterDto.forEach((item: any) => {
      //   item.code = getVariableValue(item.variable) || ''
      //   judgeValue(item)
      // })

      getWorkstation({ workStationId: dataObj.curWorkStation }).then(
        (res: any) => {
          unqualifiedReasonMap.value = res.unqualifiedReasons.reduce(
            (t: any, c: any) => {
              t[c.judgmentValue] = c.name
              return t
            },
            {}
          )
        }
      )
      initStep()
    })
  }

  watch(
    () => dataObj.parameterDto.map((item: any) => item.judge),
    () => {
      autoChooseResult()
    }
  )

  const exitFn = () => {
    ConfirmBox('退出登录后，需再次登录才能继续生产，是否确认退出?').then(
      async () => {
        window.sessionStorage.removeItem('curWorkStation')
        dataObj.loginWorksection = ''
        dataObj.loginWorkstation = ''
        dataObj.loginName = ''
        dataObj.loginPass = ''
        dataObj.curWorkSection = ''
        dataObj.curWorkStation = ''
        dataObj.curName = ''
        getWorksectionListFn()
      }
    )
  }

  // 登录
  const loginFn = () => {
    if (!dataObj.loginWorkstation) {
      ElMessage.warning('请选择上岗工位！')
      return
    }
    if (!dataObj.loginName) {
      ElMessage.warning('请输入用户名！')
      return
    }
    if (!dataObj.loginPass) {
      ElMessage.warning('请输入密码！')
      return
    }

    login({
      userNo: dataObj.loginName,
      password: dataObj.loginPass,
      workStationId: dataObj.loginWorkstation,
    }).then((res: any) => {
      dataObj.curWorkSection = dataObj.loginWorksection
      dataObj.curWorkStation = dataObj.loginWorkstation
      dataObj.curName = res.userName
      dataObj.curNo = res.userNo
      window.sessionStorage.setItem(
        'curWorkStation',
        JSON.stringify({
          curWorkSection: dataObj.curWorkSection,
          curWorkStation: dataObj.curWorkStation,
          curName: dataObj.curName,
          curNo: dataObj.curNo,
        })
      )
      getStationkanbanFn()
    })
  }

  const getVariableValue = (key: string) => {
    return Variable.store[key]
  }
  const judgeValue = (row: any) => {
    setTimeout(() => {
      if (getVariableValue(row.variable) != undefined) {
        let value = getVariableValue(row.variable)
        if (Number.isFinite(+value)) {
          let num = Number(value)
          if (num < row.lower || num > row.upper) {
            row.judge = 'NG'
          } else {
            row.judge = 'OK'
          }
        } else {
          //文字直接OK
          row.judge = 'OK'
        }
      }
    }, 400)
  }
  onMounted(async () => {
    dateTimer.value = setInterval(() => getNowTime(), 1000)

    let session = window.sessionStorage.getItem('curWorkStation')

    if (session && JSON.parse(session)) {
      let _session = JSON.parse(session)
      dataObj.curWorkSection = _session.curWorkSection
      dataObj.curWorkStation = _session.curWorkStation
      dataObj.curName = _session.curName
      dataObj.curNo = _session.curNo
      getStationkanbanFn()
    } else {
      getWorksectionListFn()
    }
  })
  const keydown = ($event: KeyboardEvent) => {
    if ($event.key === 'Enter' || $event.keyCode === 13) {
      $event.target?.blur()
    }
  }

  const setProdCodeValue = () => {
    setValue({ [dataObj.serialNumberVariable]: String(dataObj.prodCode) }).then(
      (res0: any) => {
        if (res0.allSuccess) {
          //后端触发进站
          dataObj.entryTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
          getSerialnumberFn()
        } else {
          ElMessage.error(res0.items[dataObj.serialNumberVariable]?.errorMsg)
        }
      }
    )
  }
  const setMaterialVal = (row: any, index: number) => {
    if (!row.code) return
    setValue({ [row.barcodeVariable]: String(row.code) }).then((res: any) => {
      if (res.allSuccess) {
        setValue({ [row.verificationSignal]: '1' }).then((res: any) => {
          if (res.allSuccess) {
            materialInputsRef.value[index + 1]?.focus()
          } else {
            ElMessage.error(res.items[row.verificationSignal]?.errorMsg)
          }
        })
      } else {
        ElMessage.error(res.items[row.barcodeVariable]?.errorMsg)
      }
    })
  }
  const setParamsVal = (row: any, index: number) => {
    if (!row.code) return
    setValue({ [row.variable]: String(row.code) }).then((res: any) => {
      if (res.allSuccess) {
        judgeValue(row)
        autoChooseResult(index + 1)
      } else {
        ElMessage.error(res.items[row.variable]?.errorMsg)
      }
    })
  }

  /**
   *
   * @param index 传下一个焦点框index
   * 免得传个0尽量判断为false,不写
   *    */
  const autoChooseResult = (index?: number) => {
    setTimeout(() => {
      const _list = dataObj.parameterDto.map((item: any) => item.judge)
      if (
        _list.reduce((a: any, v: any) => (v == 'OK' ? a + 1 : a), 0) ==
        _list.length
      ) {
        dataObj.processingResults = 1
      }
      if (_list.some((item: any) => item == 'NG')) {
        dataObj.processingResults = 2
      }
      if (index) {
        paramsInputsRef.value[index]?.focus()
      }
    }, 400)
  }

  /**这接口后端会触发进站，不管是不是返修工序都要调他 */
  const getSerialnumberFn = () => {
    getSerialnumber({
      SerialNumber: dataObj.prodCode,
      Inbound_EntrySignal: dataObj.inbound_EntrySignal,
      SerialNumberVariable: dataObj.serialNumberVariable,
    }).then((res: any) => {
      dataObj.repairSection = res.repairSection
      setTimeout(() => {
        materialInputsRef.value[0]?.focus()
      })
    })
  }
  const checkNow = computed(() => {
    const a = getVariableValue(dataObj.serialNumberVariable)
    const b = getVariableValue(dataObj.inbound_ResultVariable) == 1
    const c = !dataObj.materialDto.some(
      (row: any) => getVariableValue(row.verificationResultSignal) != 1
    )
    console.log('dataObj.parameterDto', dataObj.parameterDto)
    const d = !dataObj.parameterDto.some((row: any) => !row.judge)

    if (a && b && c && d) {
      return true
    }
    return false
  })
  const finishFn = () => {
    if (checkNow.value) {
      if (!dataObj.processingResults) {
        ElMessage.warning('请选择加工结果！')
        return
      }
      finish({
        workStationId: dataObj.curWorkStation,
        serialNumber: getVariableValue(dataObj.serialNumberVariable),
        inbound_EntrySignal: dataObj.inbound_EntrySignal,
        entryTime: dataObj.entryTime,
        isQualified:
          dataObj.processingResults == 1
            ? true
            : dataObj.processingResults == 2
            ? false
            : undefined,
        ngReason: dataObj.ngReason,
        userName: dataObj.curName,
        materialParams: dataObj.materialDto.map((item: any) => ({
          key: item.key,
          value: item.code === undefined ? '' : String(item.code),
          checkResult:
            getVariableValue(item.verificationResultSignal) == 1 ? true : false,
        })),
        params: dataObj.parameterDto.map((item: any) => ({
          key: item.key,
          value: item.code === undefined ? '' : String(item.code),
          checkResult: item.judge == 'OK' ? true : false,
        })),
      }).then((res: any) => {
        let _o = dataObj.materialDto
          .filter((item: any) => item.materialType == '唯一料')
          .reduce(
            (t: any, c: any) => ({
              ...t,
              [c.barcodeVariable]: '',
              [c.verificationSignal]: '0',
            }),
            {}
          )
        // let _p = dataObj.parameterDto.reduce(
        //   (t: any, c: any) => ({
        //     ...t,
        //     [c.variable]:采集参数变量点不确定类型，不知道初始值给啥，不复位变量点，只清页面
        //   }),
        //   {}
        // )
        setValue({
          ..._o,
          // ..._p,
          [dataObj.serialNumberVariable]: '',
          // [dataObj.inbound_ResultVariable]:'0',//前端不做复位
          // [dataObj.inbound_Description]: '',//前端不做复位
          [dataObj.inbound_WorkTypeVariable]: '0',
        }).then((res0: any) => {
          if (res0.allSuccess) {
            //后端触发进站
            setTimeout(() => {
              dataObj.prodCode = ''
              dataObj.materialDto.forEach((item: any) => {
                if (item.materialType == '唯一料') {
                  item.code = ''
                }
              })
              dataObj.parameterDto.forEach((item: any) => {
                item.code = ''
                item.judge = ''
              })
              dataObj.ngReason = ''
              dataObj.processingResults = 0
            }, 400)
          } else {
            let msg = res0.items
              .filter((item: any) => item.errorMsg)
              .map((item: any) => item.errorMsg)
              .join(';')
            ElMessage.error(msg)
          }
        })
      })
    }
  }

  const carouselHeight = computed(() => {
    return myCarousel.value?.clientHeight
  })
  const sopMap = ref<Record<string, any>>({})
  const sopUrls = computed(() =>
    Object.keys(sopMap.value)
      .sort()
      .map((e: string) => sopMap.value[e])
  )

  /**此函数迁移自诚亿
   * 据说部分sop文件出现不显示的情况所以先调一次接口康康报不报错，不报错再获取文件流
   */
  const initStep = async () => {
    sopMap.value = {}
    if (!dataObj.productId) return
    const productResult =
      (await request.get(
        `/api/v1/productmanagement/product/${dataObj.productId}/step`
      )) || []
    productResult
      .find((e: any) => e.processId === dataObj.curWorkSection)
      ?.sopSteps.forEach((e: any, i: number) => {
        if (
          e.hasAnnex &&
          !sopMap.value[
            `${i}/${dataObj.productId}/${dataObj.workSectionId}/${e.id}`
          ]
        )
          request
            .get(
              `/api/v1/productmanagement/product/${dataObj.productId}/${dataObj.curWorkSection}/${e.id}/download`
            )
            .then(async (res: any) => {
              request
                .get(
                  `/api/v1/productmanagement/product/${dataObj.productId}/${dataObj.curWorkSection}/${e.id}/download`,
                  { responseType: 'blob' }
                )
                .then(async (res: any) => {
                  sopMap.value[
                    `${i}/${dataObj.productId}/${dataObj.curWorkSection}/${e.id}`
                  ] =
                    URL.createObjectURL(res) +
                    '#scrollbars=0&toolbar=0&statusbar=0'
                })
            })
      })
  }

  const rowStyle1 = ({ row, rowIndex, columnIndex }: any) => {
    if (getVariableValue(row.verificationResultSignal) == 2) {
      return { background: '#f1a2ac' }
    }
    if (columnIndex == 1) {
      if (row.materialType == '唯一料') {
        return { background: '#fdebd4' }
      } else {
        return { background: '#ceeefc' }
      }
    }
  }
  const rowStyle2 = ({ row }: any) => {
    if (row.judge == 'NG') {
      return { background: '#f1a2ac' }
    }
  }

  return {
    carouselRef,
    myCarousel,
    materialTableRef,
    paramsTableRef,
    materialColumns,
    paramsColumns,
    dataObj,
    workType,
    unqualifiedReasonMap,
    worksectionList,
    workstationList,
    prodCodeInputsRef,
    materialInputsRef,
    paramsInputsRef,
    sopUrls,
    carouselHeight,
    checkNow,
    sopMap,
    getWorksectionListFn,
    getWorkstationListFn,
    exitFn,
    loginFn,
    getVariableValue,
    judgeValue,
    keydown,
    setParamsVal,
    setProdCodeValue,
    setMaterialVal,
    finishFn,
    initStep,
    rowStyle1,
    rowStyle2,
  }
}
