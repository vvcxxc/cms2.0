<!-- 修改色系 -->

<template>
  <span>
    <BaseDialog
      v-model="$props.visible"
      width="1200px"
      :title="`${$props.seleItem.productModel}`"
      class="EditSettingEdit-el-dialog"
      @open="onOpenDialog"
      @close="submit('close')"
      @confirm="submit('confirm')"
      :submitDisabled="$props.isView"
    >
      <div class="EditSetting-content">
        <div class="EditSetting-table">
          <div class="EditSetting-table-item">
            <div class="table-item-tltle">
              {{ _t('工序') }}
              <div class="table-pro-icon-content">
                <Icon
                  icon="p"
                  class="icon-box p"
                  v-if="stateConfig.mode == 1"
                  :width="19"
                  :height="20"
                  :title="_t('工序选择')"
                  @click="onSelectSection"
                ></Icon>
                <Icon
                  v-edition-show="'T'"
                  @click="onClickSelect"
                  icon="processIcon"
                  class="icon-box"
                  :title="_t('工序来源切换')"
                  :width="24"
                  :height="18"
                ></Icon>
              </div>
            </div>

            <div class="table-item-table">
              <el-table
                :data="dataList"
                class="x_table"
                height="100%"
                style="width: 100%"
                border
                @row-click="rowClickFn"
                highlight-current-row
                :header-cell-style="{ background: '#DBDFE7', color: '#35363B' }"
                :empty-text="_t('暂无数据')"
              >
                <el-table-column prop="segment" :label="_t('产线段名称')">
                  <template #default="scope">
                    {{ scope.row.segment?.name }}
                  </template>
                </el-table-column>
                <el-table-column prop="code" :label="_t('工序编号')" />
                <el-table-column prop="name" :label="_t('工序名称')" />
              </el-table>
            </div>
          </div>
          <div class="EditSetting-table-item">
            <div class="table-item-tltle">{{ _t('工序参数类型') }}</div>
            <div class="table-item-table">
              <el-table
                ref="table2"
                :data="table2List"
                class="x_table drag-table1"
                height="100%"
                style="width: 100%"
                border
                @row-click="rowClickFn2"
                highlight-current-row
                :header-cell-style="{ background: '#DBDFE7', color: '#35363B' }"
                :empty-text="_t('暂无数据')"
              >
                <el-table-column prop="name" :label="_t('参数类型')" />
              </el-table>
            </div>
          </div>
          <div class="EditSetting-table-item process">
            <div class="table-item-tltle">
              {{ _t('工序参数') }}
            </div>
            <div class="table-item-table">
              <el-table
                ref="table3"
                :data="table3List"
                class="x_table drag-table2"
                height="100%"
                style="width: 100%"
                border
                @select="selectFn3"
                @select-all="selectFn3"
                highlight-current-row
                :header-cell-style="{ background: '#DBDFE7', color: '#35363B' }"
                :empty-text="_t('暂无数据')"
              >
                <el-table-column width="40px" type="index">
                  <template #default="scope">
                    <img
                      src="../images/icon_move.png"
                      class="btn-move"
                      style="cursor: move"
                    />
                  </template>
                </el-table-column>
                <el-table-column width="40px" type="selection" />
                <el-table-column
                  width="60px"
                  type="index"
                  :label="_t('序号')"
                />
                <el-table-column prop="name" :label="_t('参数名称')" />
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <ProcessRouteDialog
        :data="dataList"
        v-model="sectionConfig.visible"
        @confirm="onConfirmSection"
        :isView="isView"
      />
      <SectionDialog
        v-model="stateConfig.visible"
        v-model:mode="stateConfig.mode"
        @confirm="onConfirmSelectState"
        :isView="isView"
      />
    </BaseDialog>
  </span>
</template>

<script lang="ts">
import { ref, nextTick, defineComponent, reactive, watch, computed } from 'vue'
import EditButton from '../components/editButton.vue'
import Sortable from 'sortablejs'
import BaseDialog from '@/components/BaseDialog/index.vue'
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer'
import {
  getProcessroute,
  getTraceproductmodelconfig,
  traceproductmodelconfig,
} from '@/api/index'
import { getWorkSectionApi } from '@/api/common-enum'
import { _t, LanguageScopeKey } from '../app'
import Icon from '@/components/Icon/Icon'
import ProcessRouteDialog from '@/widgets/FormulaManagement/Views/Pages/Dialog/ProcessRouteDialog/ProcessRouteDialog'
import SectionDialog from './SectionDialog.vue'
import { ElMessage } from 'element-plus'
import { vEditionShow } from '@/libs/Permission/Permission'

export default defineComponent({
  name: 'EditSummaryTablePop',
  directives: {
    editionShow: vEditionShow,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    seleItem: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    isView: {
      type: Boolean,
    },
  },
  components: {
    BaseDialog,
    EditButton,
    BaseDrawer,
    Icon,
    ProcessRouteDialog,
    SectionDialog,
  },
  setup(props, { emit }) {
    const stateConfig = reactive({
      visible: false,
      mode: 0,
      change: false,
    })
    const sectionConfig = reactive({
      visible: false,
      // dataList: [],
    })
    const onOpenDialog = () => {
      // stateConfig.mode = !!props.seleItem.isManual ? 1 : 0
    }
    const onConfirmSection = (data: any[]) => {
      dataList.value = []
      setDataList(data, true)
    }
    const onConfirmSelectState = () => {
      stateConfig.change = true
      if (stateConfig.mode === 0) {
        dataObj.curIdx1 = 0
        dataObj.curIdx2 = 0
        getProcessrouteFn()
        nextTick(() => {
          initSortable('drag-table1')
          initSortable('drag-table2')
        })
      }
    }
    /**
     * 工序选择
     */
    const onSelectSection = () => {
      sectionConfig.visible = true
    }
    /**
     * 状态选择
     */
    const onClickSelect = () => {
      stateConfig.visible = true
      if (!stateConfig.change) {
        stateConfig.mode = props.seleItem.isManual ? 1 : 0
      }
    }
    const rowClickFn = (row: any) => {
      const index = dataList.value.findIndex((item: any) => {
        return item === row
      })
      dataObj.curIdx1 = index
      dataObj.curIdx2 = 0

      nextTick(() => {
        setTimeout(() => {
          table2.value.setCurrentRow(table2List.value[0])
        })
      })
      nextTick(() => {
        table3List.value.forEach((item: any) => {
          if (item.check) {
            setTimeout(() => {
              table3.value.toggleRowSelection(item, true)
            })
          } else {
            setTimeout(() => {
              table3.value.toggleRowSelection(item, false)
            })
          }
        })
      })
    }
    const rowClickFn2 = (row: any) => {
      const index = table2List.value.findIndex((item: any) => {
        return item === row
      })
      dataObj.curIdx2 = index
      nextTick(() => {
        table3List.value.forEach((item: any) => {
          if (item.check) {
            setTimeout(() => {
              table3.value.toggleRowSelection(item, true)
            })
          } else {
            setTimeout(() => {
              table3.value.toggleRowSelection(item, false)
            })
          }
        })
      })
    }

    const isPositiveInteger = (s: string) => {
      //是否为正整数
      var re = /^[0-9]+$/
      return re.test(s)
    }
    const submit = (state: 'close' | 'confirm') => {
      if (state == 'confirm') {
        traceproductmodelconfig({
          productId: props.seleItem.productId,
          isManual: !!stateConfig.mode,
          ProductModel2WorkSections: dataList.value.map(
            (item: any, idx: number) => {
              let workSection2Params = []
              if (dataList.value[idx].table2Data[0].key == 'collectParams') {
                workSection2Params.push({
                  paramKind: 0,
                  paramIds: item.processParameters
                    .filter((item2: any) => item2 && item2.check)
                    .map((item2: any) => item2.key),
                })

                workSection2Params.push({
                  paramKind: 1,
                  paramIds: item.formulaParameters
                    .filter((item2: any) => item2 && item2.check)
                    .map((item2: any) => item2.key),
                })
              } else {
                workSection2Params.push({
                  paramKind: 1,
                  paramIds: item.formulaParameters
                    .filter((item2: any) => item2 && item2.check)
                    .map((item2: any) => item2.key),
                })
                workSection2Params.push({
                  paramKind: 0,
                  paramIds: item.processParameters
                    .filter((item2: any) => item2 && item2.check)
                    .map((item2: any) => item2.key),
                })
              }
              return {
                workSectionId: item.id,
                workSection2Params: workSection2Params,
              }
            }
          ),
        }).then(() => {
          emit('callback', state)
          ElMessage.success('保存成功')
        })
      } else {
        emit('callback', state)
      }
    }

    const dataList = ref<any[]>([])
    const dataObj = reactive({
      curIdx1: 0,
      curIdx2: 0,
    })

    const setDataList = (data: any[], isAdd?: boolean) => {
      getTraceproductmodelconfig({
        ProductId: props.seleItem.productId || '',
      }).then(async (res2: any) => {
        let resData =
          res2.items.find(
            (item: any) => item.productId == props.seleItem.productId
          ) || {}

        if (
          resData.productModel2WorkSections &&
          resData.productModel2WorkSections.length
        ) {
          const sections = resData.productModel2WorkSections.map(
            (item: any) => item.workSectionId
          )
          if (!isAdd && stateConfig.mode === 1) {
            dataList.value = data.filter((item) => {
              return sections.includes(item.id)
            })
          } else {
            dataList.value = data
          }

          dataList.value.forEach((item: any) => {
            let _obj = resData.productModel2WorkSections.find(
              (item2: any) => item2.workSectionId == item.id
            )

            let fp: any[] = [],
              pr: any[] = []
            if (_obj) {
              let _fp =
                _obj.workSection2Params.filter(
                  (item2: any) => item2.paramKind == 1
                ) || []
              let _pr =
                _obj.workSection2Params.filter(
                  (item2: any) => item2.paramKind == 0
                ) || []
              if (_fp.length) {
                fp = _fp[0].paramIds || []
              }
              if (_pr.length) {
                pr = _pr[0].paramIds || []
              }
            }
            item.formulaParameters.sort(
              (a: any, b: any) => fp.indexOf(a.key) - fp.indexOf(b.key)
            )
            item.processParameters.sort(
              (a: any, b: any) => pr.indexOf(a.key) - pr.indexOf(b.key)
            )

            item.formulaParameters.forEach((item2: any) => {
              item2.type = 'formulaParameters'
              item2.check = fp.includes(item2.key) ? true : false
            })
            item.processParameters.forEach((item2: any) => {
              item2.type = 'processParameters'
              item2.check = pr.includes(item2.key) ? true : false
            })

            let _1 = {
              name: _t('采集参数'),
              key: 'collectParams',
              check: true,
            }
            let _2 = {
              name: _t('下发参数'),
              key: 'sendParams',
              check: true,
            }

            if (
              _obj &&
              _obj.workSection2Params.length &&
              _obj.workSection2Params[0].paramKind == 0
            ) {
              item.table2Data = [_1, _2]
            } else {
              item.table2Data = [_2, _1]
            }
          })
        } else {
          if (isAdd) {
            dataList.value = data.map((item: any) => {
              let p = {
                name: _t('采集参数'),
                key: 'collectParams',
                check: true,
              }
              let f = {
                name: _t('下发参数'),
                key: 'sendParams',
                check: true,
              }
              return {
                ...item,
                table2Data: [p, f],
                formulaParameters: item.formulaParameters.map((item2: any) => {
                  return { ...item2, type: 'formulaParameters', check: true }
                }),
                processParameters: item.processParameters.map((item2: any) => {
                  return { ...item2, type: 'processParameters', check: true }
                }),
              }
            })
          } else {
            dataList.value.forEach((item: any) => {
              item.formulaParameters.forEach((item2: any) => {
                item2.type = 'formulaParameters'
                item2.check = false
              })
              item.processParameters.forEach((item2: any) => {
                item2.type = 'processParameters'
                item2.check = false
              })
            })
          }
        }

        dataObj.curIdx1 = 0
        dataObj.curIdx2 = 0

        nextTick(() => {
          table3List.value.forEach((item: any) => {
            if (item.check) {
              setTimeout(() => {
                table3.value.toggleRowSelection(item, true)
              })
            } else {
              setTimeout(() => {
                table3.value.toggleRowSelection(item, false)
              })
            }
          })
        })
      })
    }

    const getProcessrouteFn = async () => {
      if (stateConfig.mode === 1) {
        const res = await getWorkSectionApi({
          MaxResultCount: 999,
          includeDetails: true,
        })
        dataList.value = []
        setDataList(res.items)
      } else {
        getProcessroute({
          productId: props.seleItem.productId,
          includeDetails: true,
        }).then((res: any) => {
          dataList.value = []
          setDataList(res)
        })
      }
    }

    const table2 = ref<any>()
    const table3 = ref<any>()
    const table2List = computed(() => {
      if (!dataList.value.length) {
        return []
      }
      return dataList.value[dataObj.curIdx1].table2Data || []
    })

    const table3List = computed(() => {
      if (!dataList.value.length || !table2List.value.length) {
        return []
      }

      if (table2List.value[dataObj.curIdx2].key == 'collectParams') {
        return dataList.value[dataObj.curIdx1].processParameters || []
      } else {
        return dataList.value[dataObj.curIdx1].formulaParameters || []
      }
    })

    const selectFn3 = (arr: Object[]) => {
      table3List.value.forEach((_: any) => {
        if (arr.some((item: any) => item.key == _.key)) {
          _.check = true
        } else {
          _.check = false
        }
      })
    }

    const initSortable = (className: any) => {
      // 获取表格row的父节点
      const tables = document.querySelector(
        '.' + className + ' .cs-table__body-wrapper .cs-table__body tbody'
      )
      // 创建拖拽实例
      Sortable.create(tables as HTMLElement, {
        animation: 150, //动画
        disabled: false, // 拖拽不可用? false 启用（刚刚渲染表格的时候起作用，后面不起作用）
        handle: '.btn-move', //指定拖拽目标，点击此目标才可拖拽元素(此例中设置操作按钮拖拽)
        filter: '.disabled', //指定不可拖动的类名（el-table中可通过row-class-name设置行的class）
        dragClass: 'dragClass', //设置拖拽样式类名
        ghostClass: 'ghostClass', //设置拖拽停靠样式类名
        chosenClass: 'chosenClass', //设置选中样式类名
        // 结束拖动事件
        // @ts-ignore
        onEnd: ({
          newIndex,
          oldIndex,
        }: {
          newIndex: number
          oldIndex: number
        }) => {
          if (className == 'drag-table1') {
            let _t = dataList.value[dataObj.curIdx1].table2Data
            dataList.value[dataObj.curIdx1].table2Data = []
            let currRow = _t.splice(oldIndex, 1)[0]
            _t.splice(newIndex, 0, currRow)
            nextTick(() => {
              dataList.value[dataObj.curIdx1].table2Data = _t

              nextTick(() => {
                table3List.value.forEach((item: any) => {
                  if (item.check) {
                    setTimeout(() => {
                      table3.value.toggleRowSelection(item, true)
                    })
                  } else {
                    setTimeout(() => {
                      table3.value.toggleRowSelection(item, false)
                    })
                  }
                })
              })
            })
          } else if (className == 'drag-table2') {
            if (table2List.value[dataObj.curIdx2].name == 'collectParams') {
              let currRow = dataList.value[
                dataObj.curIdx1
              ].processParameters.splice(oldIndex, 1)[0]
              let temp = JSON.parse(
                JSON.stringify(
                  dataList.value[dataObj.curIdx1].processParameters
                )
              )
              temp.splice(newIndex, 0, currRow)
              dataList.value[dataObj.curIdx1].processParameters = []
              nextTick(() => {
                dataList.value[dataObj.curIdx1].processParameters = temp
                nextTick(() => {
                  table3List.value.forEach((item: any) => {
                    if (item.check) {
                      setTimeout(() => {
                        table3.value.toggleRowSelection(item, true)
                      })
                    } else {
                      setTimeout(() => {
                        table3.value.toggleRowSelection(item, false)
                      })
                    }
                  })
                })
              })
            } else {
              let sortKey = 'formulaParameters'
              if (table2List.value[dataObj.curIdx2].key === 'collectParams') {
                sortKey = 'processParameters'
              }
              let currRow = dataList.value[dataObj.curIdx1][sortKey].splice(
                oldIndex,
                1
              )[0]
              let temp = dataList.value[dataObj.curIdx1][sortKey]
              temp.splice(newIndex, 0, currRow)
              dataList.value[dataObj.curIdx1][sortKey] = []
              nextTick(() => {
                dataList.value[dataObj.curIdx1][sortKey] = temp
                nextTick(() => {
                  table3List.value.forEach((item: any) => {
                    if (item.check) {
                      setTimeout(() => {
                        table3.value.toggleRowSelection(item, true)
                      })
                    } else {
                      setTimeout(() => {
                        table3.value.toggleRowSelection(item, false)
                      })
                    }
                  })
                })
              })
            }
          }
        },
      })
    }

    watch(
      () => props.visible,
      async (val) => {
        if (!val) {
          return
        }
        dataObj.curIdx1 = 0
        dataObj.curIdx2 = 0
        stateConfig.mode = !!props.seleItem.isManual ? 1 : 0
        getProcessrouteFn()
        nextTick(() => {
          initSortable('drag-table1')
          initSortable('drag-table2')
        })
      },
      {
        deep: true,
      }
    )

    return {
      _t,
      stateConfig,
      sectionConfig,
      table2List,
      table2,
      table3,
      dataList,
      table3List,
      dataObj,
      onOpenDialog,
      rowClickFn,
      rowClickFn2,
      submit,
      onClickSelect,
      onSelectSection,
      getProcessrouteFn,
      selectFn3,
      initSortable,
      isPositiveInteger,
      onConfirmSection,
      onConfirmSelectState,
    }
  },
})
</script>

<style lang="scss">
@import url(@/assets/styles/common.scss);
</style>

<style lang="scss">
:deep(.cs-input) {
  height: 28px;

  .cs-input__inner {
    border-radius: 2px;
    background-color: #fff !important;
    height: 100%;
    padding: 0 8px;

    &:focus {
      border: 1px solid #409eff;
    }

    &:hover {
      border: 1px solid #409eff;
    }
  }

  .cs-input__inner:not(el-overwrite-ignore *) {
    padding-right: 0 !important;
  }
}

:deep(.light-datetime-picker) {
  .cs-input__inner {
    padding: 0 0 0 30px !important;
  }
}

.EditSettingEdit-el-dialog {
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
@import '../styles/input.scss';

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

:deep(.cs-input.is-disabled .cs-input__wrapper) {
  padding-right: 0;
}

.EditSettingEdit-el-dialog {
  .EditSetting-content {
    padding: 20px 10px 20px 30px;
    width: 100%;
    height: 100%;

    .EditSetting-table {
      width: 100%;
      height: 500px;
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;

      .EditSetting-table-item {
        width: 29%;
        height: 100%;

        .table-item-tltle {
          width: 100%;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          padding-left: 40px;
          margin-bottom: 10px;
          border: 1px solid #e3e6ed;
          border-radius: 5px;
          .table-pro-icon-content {
            .icon-box {
              margin-right: 5px;
              cursor: pointer;
            }
            .p {
              margin-right: 10px;
            }
          }
          :deep(.cs-input__inner) {
            height: 28px;
          }

          .item-tltle-search {
            display: flex;
            align-items: center;
            padding-right: 20px;
          }
        }

        .table-item-tltle::before {
          content: '';
          width: 22px;
          height: 22px;
          background-image: url('../images/icon.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translate(0, -50%);
          font-weight: bold;
        }

        .table-item-table {
          width: 100%;
          height: calc(100% - 50px);

          :deep(.cs-input__inner) {
            padding-right: 0 !important;
          }
        }
      }

      .process {
        width: 40%;
      }
    }
  }

  .EditSetting-footer {
    display: flex;
    justify-content: flex-end;
    padding: 0 20px 16px;
    box-sizing: border-box;
  }
}
</style>
