<!-- 修改色系 -->
<template>
  <BaseDialog
    v-model="$props.visible"
    width="900px"
    top="18vh"
    :title="`${_t('产品判定')}`"
    :show-close="false"
    :append-to-body="true"
    class="ProductJudgmentEdit-el-dialog"
    @close="submit('close')"
    @confirm="submit('confirm')"
  >
    <div class="ProductJudgment-content">
      <Title :top="5" :bottom="12">
        {{ _t('基础信息') }}
      </Title>
      <div class="form-line">
        <div class="form-item">
          <div class="form-key">
            <span class="require">*</span>
            {{ _t('产品码:') }}
          </div>
          <el-input
            style="width: 320px"
            v-model="dataObj.serialNumber"
            @keyup.enter.native="init"
          />
        </div>
        <div class="form-item">
          <div class="form-key">
            {{ _t('产品型号:') }}
          </div>
          <el-input
            style="width: 320px"
            disabled
            :modelValue="dataObj.productModel || '-'"
          />
        </div>
      </div>
      <div class="form-line">
        <div class="form-item">
          <div class="form-key">
            <span class="require">*</span>
            {{ _t('工单号:') }}
          </div>
          <el-input
            style="width: 320px"
            disabled
            :modelValue="dataObj.orderCode || '-'"
          />
        </div>
        <div class="form-item">
          <div class="form-key">
            {{ _t('判定人员:') }}
          </div>
          <el-input
            style="width: 320px"
            disabled
            v-model="dataObj.judgmentPersonnel"
          />
        </div>
      </div>
      <div class="form-nodata" v-if="dataObj.nodata">
        {{ _t('暂无数据') }}
      </div>
      <Title :top="20" :bottom="12" v-if="!dataObj.nodata">
        {{ _t('生产数据') }}
      </Title>
      <div class="process-content" v-if="!dataObj.nodata">
        <div class="process-left">
          <div class="left-title">
            <div class="flex justify-center" style="column-gap: 6px">
              <el-tooltip
                effect="dark"
                :content="_t('展示该产品在加工过的工序，不良工序以红色标记')"
              >
                <img src="../images/icon_exclamation.png" />
              </el-tooltip>
              {{ _t('工序') }}
            </div>
            <img
              src="../images/icon_add2.png"
              :class="{
                disabled: !nextProcessroute,
              }"
              @click="addTraceFn"
              v-if="dataObj.judgmentResult == 2 && dataObj.isSupplement"
            />
          </div>
          <div class="search-bar">
            <el-input v-model="dataObj.filterNameTemp" />
            <img src="../images/icon_search.png" @click="filterNameFn" />
          </div>
          <div class="process-list">
            <div
              class="process-item"
              :class="{
                'process-item': true,
                'cur-item': dataObj.curIdx == idx,
              }"
              v-for="(item, idx) in computedTraceList"
              :key="item.id"
              @click="dataObj.curIdx = idx"
            >
              <el-tooltip effect="dark" :content="item.workSectionName">
                <div
                  :class="{
                    'item-left': 1,
                    'item-noqualified': !item.isQualified,
                  }"
                >
                  {{ item.workSectionName }}
                </div>
              </el-tooltip>
              <img
                src="../images/icon_del.png"
                v-if="item.isAdd"
                @click="delTrace(item)"
              />
            </div>
          </div>
        </div>
        <div class="process-right">
          <el-table
            :data="[
              {
                key: '记录时间',
                value: computedTraceList[dataObj.curIdx]?.finishTime,
              },
              ...paramsList,
            ]"
            class="x_table"
            height="100%"
            style="width: 100%"
            border
            :header-cell-style="{ background: '#DBDFE7', color: '#35363B' }"
            :empty-text="_t('暂无数据')"
          >
            <el-table-column width="55" type="index" :label="_t('序号')" />
            <el-table-column :label="_t('参数名称')">
              <template #default="scope">
                <span>
                  {{ processrouteMaps[scope.row.key]?.name ?? scope.row.key }}
                </span>
              </template>
            </el-table-column>
            <el-table-column width="170" :label="_t('参数值')">
              <template #default="scope">
                <template v-if="scope.row.key === '记录时间'">
                  <span v-if="!scope.row.value" style="color: gray"
                    >以判定时间提交</span
                  >
                  <span v-else>
                    {{ dayjs(scope.row.value).format('YYYY-MM-DD HH:mm:ss') }}
                  </span>
                </template>
                <el-input
                  v-else-if="
                    computedTraceList[dataObj.curIdx].isAdd || enable()
                  "
                  :style="{
                    color:
                      scope.row.value >
                        (processrouteMaps[scope.row.key]?.upper ??
                          Number.MAX_SAFE_INTEGER) ||
                      scope.row.value <
                        (processrouteMaps[scope.row.key]?.lower ??
                          Number.MIN_SAFE_INTEGER)
                        ? 'red'
                        : '',
                  }"
                  v-model="scope.row.value"
                  @focus="
                    scope.row.oldValue === undefined &&
                      (scope.row.oldValue = scope.row.value)
                  "
                  @input="scope.row.newValue = scope.row.value"
                />
                <span
                  v-else
                  :style="{
                    color:
                      scope.row.value >
                        (processrouteMaps[scope.row.key]?.upper ??
                          Number.MAX_SAFE_INTEGER) ||
                      scope.row.value <
                        (processrouteMaps[scope.row.key]?.lower ??
                          Number.MIN_SAFE_INTEGER)
                        ? 'red'
                        : '',
                  }"
                  >{{ scope.row.value }}</span
                >
              </template>
            </el-table-column>
            <el-table-column width="85" :label="_t('参数上限')">
              <template #default="scope">
                {{ processrouteMaps[scope.row.key]?.upper ?? '-' }}
              </template>
            </el-table-column>
            <el-table-column width="85" :label="_t('参数下限')">
              <template #default="scope">
                {{ processrouteMaps[scope.row.key]?.lower ?? '-' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <Title :top="20" :bottom="20" v-if="!dataObj.nodata">
        {{ _t('不良品处理') }}
      </Title>
      <div class="form-line" v-if="!dataObj.nodata">
        <div class="form-item">
          <div class="form-key2">
            <span class="require">*</span>
            {{ _t('判定结果:') }}
          </div>
          <el-select
            class="light-element-ui"
            style="width: 320px"
            v-model="dataObj.judgmentResult"
            @change="TraceList = cloneDeep(cacheTraceList)"
            :teleported="false"
          >
            <el-option
              v-for="item in judgmentresulttypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="form-item">
          <div class="form-key2">
            <span class="require">*</span>
            {{ _t('是否合格:') }}
          </div>
          <el-select
            style="width: 320px"
            v-model="isQualified"
            disabled
            :teleported="false"
          >
            <el-option :label="_t('OK')" :value="true"></el-option>
            <el-option :label="_t('NG')" :value="false"></el-option>
          </el-select>
        </div>
      </div>
      <div
        class="form-line"
        v-if="!dataObj.nodata && dataObj.judgmentResult != 2"
      >
        <!-- <div class="form-item" v-if="dataObj.judgmentResult == 1">
          <div class="form-key2">
            <span class="require">*</span>
            {{ _t('不良工序:') }}
          </div>
          <el-select style="width: 200px" v-model="dataObj.unqualTrace">
            <el-option
              v-for="item in TraceList"
              :key="item.workSectionId"
              :label="item.workSectionName"
              :value="item.workSectionId"
            ></el-option>
          </el-select>
        </div> -->
        <div class="form-item" style="width: 100%">
          <div class="form-key2">
            <span class="require">*</span>
            {{ _t('不良原因:') }}
          </div>
          <el-select
            style="width: 320px"
            v-model="dataObj.unqualifiedReason"
            multiple
            :teleported="false"
          >
            <el-option
              v-for="item in allunqualifiedreasonList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div
        class="form-line"
        v-if="!dataObj.nodata && dataObj.judgmentResult == 2"
      >
        <div class="form-item">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="_t('启用后可添加工序补充对应加工参数')"
            placement="top-start"
          >
            <img src="../images/icon_exclamation.png" />
          </el-tooltip>
          {{ _t('数据补充:') }}
          <el-switch
            style="margin-left: 12px"
            v-model="dataObj.isSupplement"
            :before-change="() => checkIsAddProcess()"
          />
        </div>
      </div>
      <div
        class="form-line"
        v-if="!dataObj.nodata && dataObj.judgmentResult == 3"
      >
        <div class="form-item" style="width: 100%">
          <div class="form-key2">
            <span class="require">*</span>
            {{ _t('返修工序:') }}
          </div>
          <el-select
            style="width: 734px; margin-right: 8px"
            v-model="dataObj.unqualTraceArr"
            multiple
            :teleported="false"
          >
            <el-option
              v-for="item in computedTraceList"
              :key="item.workSectionId"
              :label="item.workSectionName"
              :value="item.workSectionId"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="form-line2" v-if="!dataObj.nodata">
        <div class="form-key3">{{ _t('处理说明:') }}</div>
        <div class="form-textarea">
          <el-input type="textarea" resize="none" v-model="dataObj.remark" />
        </div>
      </div>
    </div>
    <!-- <div class="ProductJudgment-footer">
      <EditButton :text="_t('取消')" type="del" @callback="submit('close')" />
      <EditButton :text="_t('确定')" type="sumbit" @callback="submit('confirm')" />
    </div> -->
  </BaseDialog>
</template>

<script lang="ts">
import { ref, watch, defineComponent, reactive, computed } from 'vue'
import sdk from 'sdk'
import { ElMessage } from 'element-plus'
import EditButton from '../components/EditButton/index.vue'
import dayjs from 'dayjs'
import Title from '@/components/Title/Title'
const { models, userInfo } = sdk
const { Language } = models
const { _t } = Language
import {
  Tracebycode,
  getJudgmentresulttype,
  unqualifiedreasonbysectionid,
  createJudgment,
  getProcessroute,
} from '../api/index'
import { cloneDeep } from 'lodash'
import BaseDialog from '@/components/BaseDialog/index.vue'

export default defineComponent({
  name: 'ProductJudgmentPop',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    selectItem: {
      type: Object,
      required: true,
    },
  },
  components: {
    EditButton,
    BaseDialog,
    Title,
  },
  setup(props, { emit }) {
    const dataObj = reactive({
      productId: '',
      productModel: '',
      serialNumber: '',
      orderCode: '',
      judgmentPersonnel: '',
      curIdx: 0,
      nodata: false,
      /**1 NG品流出 2 人工返修 3 设备返修 4 产品报废*/
      judgmentResult: 3, //默认设备返修
      unqualifiedReason: [],
      filterName: '',
      filterNameTemp: '',
      isSupplement: false, //补充
      unqualTrace: '', //不良工序
      /**返修工序,多选*/
      unqualTraceArr: [],
      remark: '',
      nowIdx: 0,
    })
    const checkIsAddProcess = () => {
      if (
        dataObj.isSupplement &&
        TraceList.value.some((item: any) => item.isAdd)
      ) {
        ElMessage.warning(_t('关闭失败，请先删除已添加工序'))
        return false
      }
      return true
    }
    const isQualified = computed(() => {
      return dataObj.judgmentResult == 2 ? true : false
    })
    const filterNameFn = () => {
      dataObj.filterName = dataObj.filterNameTemp
    }
    const computedTraceList = computed(() => {
      console.log('TraceList.value', TraceList.value)
      return TraceList.value.filter(
        (item) =>
          !dataObj.filterName ||
          item.workSectionName.includes(dataObj.filterName)
      )
    })

    const processrouteMaps = computed(() => {
      console.log('processrouteList.value', processrouteList.value)

      let _list = processrouteList.value?.reduce((p: any, c: any) => {
        // console.log('pp', p, c)
        c.processParameters?.forEach((e: any) => {
          p[e.key] = { name: e.name }
        })
        c.formula2ProcessParameterModels?.forEach((e: any) => {
          if (p[e.parameterId]) {
            p[e.parameterId].lower = e.lower
            p[e.parameterId].upper = e.upper
          }
        })

        return p
      }, {})

      console.log('_list999', _list)
      return _list
    })
    const paramsList = computed(() => {
      if (
        !computedTraceList.value ||
        !computedTraceList.value.length ||
        !computedTraceList.value[dataObj.curIdx]
      ) {
        return []
      }
      console.log('eeeeee', computedTraceList.value[dataObj.curIdx].params)
      console.log('processrouteMaps.value', processrouteMaps.value)
      return computedTraceList.value[dataObj.curIdx].params.filter(
        (e: any) => processrouteMaps.value[e.key]?.name || e.key === '记录时间'
      )
    })

    const TraceList = ref<any[]>([])
    const cacheTraceList = ref<any[]>([])
    const TracebycodeFn = async (prompt = false) => {
      if (dataObj.serialNumber) {
        try {
          const res = await Tracebycode({ serialNumber: dataObj.serialNumber })
          if (res && res.length) {
            TraceList.value = res
            cacheTraceList.value = cloneDeep(TraceList.value)
            console.log('Tracebycode', cacheTraceList.value)
            dataObj.curIdx = 0
            for (
              let index = 0;
              index < computedTraceList.value.length;
              index++
            ) {
              const element = computedTraceList.value[index]
              if (element.isQualified === false) {
                dataObj.curIdx = index
                break
              }
            }
            dataObj.nodata = false
            console.log('1110', res)
            if (res.length) {
              dataObj.orderCode = res[0].orderCode
              dataObj.productModel = res[0].productModel
            }
          } else {
            prompt && ElMessage.warning(_t('产品码不存在'))
            TraceList.value = []
            dataObj.curIdx = 0
            // dataObj.nodata = true
          }
          // if (dataObj.serialNumber) {
          await getProcessrouteFn()
          // } else {
          //   //插个新接口获取processrouteList
          //   processrouteList.value = res.map((item: any) => ({
          //     id: item.workSectionId,
          //     name: item.workSectionName,
          //   }))
          //   TraceList.value = processrouteList.value.reduce(
          //     (p: any, c: any) => {
          //       const target = TraceList.value.find(
          //         (se: any) => se.workSectionId === c.id
          //       )
          //       target && p.unshift(target)
          //       return p
          //     },
          //     []
          //   )
          // }
          await getJudgmentresulttypeFn()
          await allunqualifiedreasonFn()
          // await getSettingFn()
        } catch (error) {
          prompt && ElMessage.warning(_t('产品码不存在'))
        }
      }
    }

    const judgmentresulttypeList = ref<any[]>([])
    const getJudgmentresulttypeFn = () => {
      return getJudgmentresulttype().then((res: any) => {
        judgmentresulttypeList.value = res || []
        // if (judgmentresulttypeList.value.length) {
        //   dataObj.judgmentResult = 2
        // }
      })
    }

    const allunqualifiedreasonList = ref<any[]>([])
    const allunqualifiedreasonFn = () => {
      return unqualifiedreasonbysectionid(
        computedTraceList.value[dataObj.curIdx]?.workSectionId || ''
      ).then((res: any) => {
        allunqualifiedreasonList.value = [
          { name: '原因未知', id: '原因未知' },
          ...res,
        ]
        if (
          allunqualifiedreasonList.value.length &&
          !dataObj.unqualifiedReason.length
        ) {
          dataObj.unqualifiedReason = [
            allunqualifiedreasonList.value[0].name,
          ] as any
        }
      })
    }
    const processrouteList = ref<any[]>([])
    const getProcessrouteFn = () => {
      return getProcessroute(dataObj.productModel || '').then((res: any) => {
        processrouteList.value = res
        TraceList.value = processrouteList.value.reduce((p: any, c: any) => {
          const target = TraceList.value.find(
            (se: any) => se.workSectionId === c.id
          )
          target && p.unshift(target)
          return p
        }, [])
      })
    }
    /**
     * 根据当前产品型号最后一个工序与当前产品型号对应配方内工序，动态给出下一个工序
     * */
    const nextProcessroute = computed<any>(() => {
      const last = computedTraceList.value[0]
      if (computedTraceList.value.length === 0) {
        return processrouteList.value[0]
      }
      const target =
        processrouteList.value[
          processrouteList.value.findIndex(
            (e: any) => e.id === last?.workSectionId
          ) + 1
        ]
      return target
    })
    /**
     * 添加工序
     *
     * 1、判定结果为“人工返修”  judgmentResult == 2
     * 2、启用了“数据补充”  isSupplement == true
     *
     * finishTime  以判定时间提交？先用添加工序时间吧
     * params 需要先找该产品型号对应的配方，配方内确定了工序的数量和顺序，根据当前最后一个工序判断当前添加工序动作是什么
     * */
    const addTraceFn = async () => {
      if (!nextProcessroute.value) {
        return
      }
      TraceList.value.unshift({
        SectionName: nextProcessroute.value.SectionName,
        workSectionId: nextProcessroute.value.id,
        workSectionName: nextProcessroute.value.name,
        isQualified: true,
        isAdd: true, //新加的，只有新加的才可编辑删除
        // finishTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        params: nextProcessroute.value.processParameters || [],
        nowIdx: dataObj.nowIdx,
      })
      dataObj.curIdx = 0
      dataObj.nowIdx += 1
    }
    const delTrace = (row: any) => {
      TraceList.value = TraceList.value.filter(
        (item: any) => item.nowIdx != row.nowIdx
      )
      dataObj.curIdx = 0
    }
    const submit = (state: 'close' | 'confirm') => {
      if (state == 'confirm') {
        if (!dataObj.judgmentResult) {
          ElMessage.error('判定结果不能为空')
          return
        }
        let flag = false
        switch (Number(dataObj.judgmentResult)) {
          case 1:
          case 4:
            if (!dataObj.unqualifiedReason.length) {
              ElMessage.error('不良不能为空')
              flag = true
            }
            break
          case 3:
            if (!dataObj.unqualifiedReason.length) {
              ElMessage.error('不良不能为空')
              flag = true
            }
            if (!dataObj.unqualTraceArr.length) {
              ElMessage.error('返修工序为空')
              flag = true
            }
            break
        }
        if (flag) return
        const judgmentSections = (() => {
          if (computedTraceList.value.some((e) => e.isAdd)) {
            return computedTraceList.value.map((e) => ({
              sectionId: e.workSectionId,
              sectionName: e.workSectionName,
            }))
          }
          switch (Number(dataObj.judgmentResult)) {
            case 1:
              return [1].map(() => {
                const target = computedTraceList.value[0]
                return {
                  sectionId: target.workSectionId,
                  sectionName: target.workSectionName,
                }
              })
            case 2:
              if (!dataObj.isSupplement) {
                return computedTraceList.value.map((e: any) => {
                  return {
                    sectionId: e.workSectionId,
                    sectionName: e.workSectionName,
                  }
                })
              }
              break
            case 3:
              return dataObj.unqualTraceArr.map((e) => {
                const target = processrouteList.value.find((se) => se.id === e)
                return {
                  sectionId: target.id,
                  sectionName: target.name,
                }
              })
          }
          return undefined
        })()
        createJudgment({
          serialNumber: dataObj.serialNumber,
          productId: dataObj.productId,
          productModel: dataObj.productModel || '',
          orderCode: dataObj.orderCode,
          judgmentResult: dataObj.judgmentResult,
          isQualified: isQualified.value,
          unqualifiedReason:
            dataObj.judgmentResult !== 2
              ? dataObj.unqualifiedReason.join(',')
              : '',
          judgmentSections,
          judgmentPersonnel: dataObj.judgmentPersonnel,
          remark: dataObj.remark,
          judgmentDetails:
            dataObj.judgmentResult !== 1
              ? computedTraceList.value.reduce((t, c) => {
                  if (c.params.length) {
                    c.params.forEach((element: any) => {
                      element.newValue !== undefined &&
                        t.push({
                          sectionId: c.workSectionId,
                          sectionName: c.workSectionName,
                          parameterKey: element.key,
                          parameterName:
                            processrouteMaps.value[element.key]?.name,
                          oldValue: element.oldValue,
                          newValue: element.newValue,
                        })
                    })
                  }
                  return t
                }, [])
              : undefined,
          // extraProperties: {
          //   additionalProp1: 'string',
          //   additionalProp2: 'string',
          //   additionalProp3: 'string',
          // },
        }).then(() => {
          ElMessage.success(_t('判定成功'))
          emit('callback', state)
        })
      } else {
        emit('callback', state)
      }
    }

    // const setting = ref<any>({})
    // const getSettingFn = async () => {
    //   const res = await getSetting('SCMS.AppSettings.QualityManagement')
    //   setting.value = res.settings.reduce((p: any, c: any) => {
    //     p[c.name] = c.value
    //     return p
    //   }, {})
    // }
    const enable = () => {
      switch (Number(dataObj.judgmentResult)) {
        case 2:
          return true
        // case 2:
        //   return setting.value['SCMS.AppSettings.QualityManagement.ManualRepair_EditDataEnable']
        // case 3:
        //   return setting.value['SCMS.AppSettings.QualityManagement.EquipmentRepair_EditDataEnabled']
        default:
          return false
      }
    }

    watch(
      () => props.visible,
      async (val) => {
        if (!val) {
          return
        }
        console.log('props.selectItem', props.selectItem)
        dataObj.judgmentPersonnel = (userInfo.user as any)?.name || ''
        if (props.selectItem && props.selectItem.id) {
          dataObj.judgmentResult = 3
          dataObj.serialNumber = props.selectItem.serialNumber
          dataObj.productId = props.selectItem.productId
          dataObj.productModel = props.selectItem.productModel
          dataObj.orderCode = props.selectItem.orderCode
          dataObj.unqualifiedReason =
            props.selectItem.unqualifiedReason?.split(',') || []
          dataObj.unqualTrace = ''
          dataObj.unqualTraceArr = []
          console.log('dataObj.productModel223', dataObj.productModel)
          await init()
        } else {
          dataObj.serialNumber = ''
          dataObj.nodata = true
        }
      },
      {
        deep: true,
      }
    )
    const init = async (prompt = false) => {
      await TracebycodeFn(prompt)
    }

    return {
      dayjs,

      _t,
      dataObj,
      submit,
      TracebycodeFn,
      TraceList,
      cacheTraceList,
      nextProcessroute,
      processrouteMaps,
      paramsList,
      judgmentresulttypeList,
      getJudgmentresulttypeFn,
      allunqualifiedreasonList,
      allunqualifiedreasonFn,
      filterNameFn,
      computedTraceList,
      isQualified,
      checkIsAddProcess,
      addTraceFn,
      delTrace,
      init,
      processrouteList,
      cloneDeep,
      enable,
    }
  },
})
</script>

<style lang="scss">
.ProductJudgmentEdit-el-dialog {
  .cs-dialog__header {
    margin-right: 0;
    padding: 0;
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    padding: 0 20px;
    font-size: 15px !important;
    font-weight: 400;
    color: #35363b;

    .cs-dialog__title {
      color: #333333 !important;
    }

    .cs-dialog__headerbtn {
      top: 0;

      .cs-icon {
        width: 36px;
        height: 36px;
        color: #fff;
        margin-top: 6px;

        svg {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .cs-dialog__body {
    background-color: #fff;
    padding: 0;
  }
}
</style>
<style lang="scss" scoped>
:deep(.--scms-input.cs-input .cs-input__inner) {
  height: 30px;
  line-height: 30px;
  background: transparent;
  color: #787878;
  border-radius: 2px;
  box-shadow: 0px 0px 0px 1px #fff inset;
  border: 1px solid #dde0e4;

  &:focus {
    border: 1px solid #409eff;
  }

  &:hover {
    border: 1px solid #409eff;
  }
}

.ProductJudgmentEdit-el-dialog {
  .ProductJudgment-content {
    padding: 20px 12px;
    width: 100%;
    height: 100%;

    .tltle-label {
      width: 100%;
      height: 30px;
      display: flex;
      align-items: center;
      position: relative;
      padding-left: 30px;
      margin-bottom: 10px;
    }

    .tltle-label::before {
      content: '';
      width: 22px;
      height: 22px;
      background-image: url('../images/icon.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translate(0, -50%);
      font-weight: bold;
    }

    .form-line {
      width: 100%;
      min-height: 50px;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .form-item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 423px;
        margin-left: 17px;

        .form-key,
        .form-key2 {
          width: 75px;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          font-size: 14px;
          color: #35363b;
          text-align: left;
          font-style: normal;
          .require {
            color: #f77070;
          }
        }

        .form-key2 {
          width: 75px;
        }

        img {
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
      }
    }

    .form-line2 {
      width: 100%;
      height: auto;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      margin-top: 10px;
      margin-left: 17px;
      .form-key3 {
        width: 75px;
      }

      .form-textarea {
        width: calc(100% - 90px);
        height: 80px;

        :deep(.cs-textarea__inner) {
          height: 80px;
        }
      }
    }

    .process-content {
      display: flex;
      width: 100%;
      height: 260px;
      margin-bottom: 20px;

      .process-left {
        width: 190px;
        height: 100%;
        margin-right: 5px;
        background: #f9f9f9;
        border-radius: 5px;
        border: 1px solid #dddfe5;

        .left-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px 0 12px;
          height: 32px;
          background: #dbdfe7;

          border-radius: 4px 4px 0 0;
          color: #666666;

          img {
            width: 18px;
            height: 18px;
            cursor: pointer;
          }
        }

        .search-bar {
          width: 100%;
          height: 46px;
          padding: 8px 10px;
          position: relative;

          img {
            width: 16px;
            height: 16px;
            cursor: pointer;
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translate(0, -50%);
          }

          :deep(.cs-input__inner) {
            height: 28px;
          }
        }

        .process-list {
          width: 100%;
          height: calc(100% - 78px);
          overflow-y: auto;
          background: #f9f9f9;

          .process-item {
            width: 100%;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 13px 0 10px;

            .item-left {
              position: relative;
              padding-left: 16px;
              box-sizing: border-box;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .item-left::before {
              content: '';
              width: 6px;
              height: 6px;
              background: #ffffff;
              border: 1px solid #707070;
              border-radius: 3px;
              position: absolute;
              left: 0;
              top: 50%;
              transform: translate(0, -50%);
            }

            .item-noqualified {
              color: #f97171;
            }

            .item-noqualified::before {
              border: 1px solid #f97171;
            }

            img {
              width: 14px;
              height: 16px;
              cursor: pointer;
              display: none;
            }
          }

          .cur-item {
            background: #dce3f0;
          }

          .process-item:hover {
            img {
              display: block;
            }
          }
        }
      }

      .process-right {
        width: calc(100% - 195px);
        height: 100%;
        :deep(.cs-input__inner) {
          color: inherit;
        }
      }
    }

    .form-nodata {
      width: 100%;
      height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 16px;
      color: #636972;
      line-height: 0px;
      text-align: left;
      font-style: normal;
      text-transform: none;
      margin-left: 18px;
      margin-top: -25px;

      img {
        width: 27px;
        height: 27px;
        margin-bottom: 10px;
      }
    }

    .table-item-table {
      width: 100%;
      height: 450px;
    }
    :deep(.cs-popper.is-light) {
      background-color: var(--el-color-white) !important;
      padding: 0 !important;
    }
  }

  .ProductJudgment-footer {
    display: flex;
    justify-content: flex-end;
    padding: 0 20px 16px;
    box-sizing: border-box;
  }
}
.disabled {
  cursor: not-allowed !important;
}
</style>
