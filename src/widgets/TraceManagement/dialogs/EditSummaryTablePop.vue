<!-- 修改色系 -->

<template>
  <span>
    <BaseDrawer
      v-model="$props.visible"
      width="1000px"
      :title="`${title == '新建' ? _t('新建总表') : _t('修改总表')}`"
      :show-close="false"
      :append-to-body="true"
      class="summaryTableEdit-el-dialog"
      @close="submit('close')"
      @confirm="submit('confirm')"
    >
      <div class="summaryTable-content">
        <div class="summaryTable-search">
          <div class="form-line">
            <div class="form-key">{{ _t('总表名称') }}：</div>
            <el-input style="width: 600px" v-model="dataObj.name" />
          </div>
          <div v-edition-show="'L'" class="form-line">
            <div class="form-key">{{ _t('适用型号') }}：</div>
            <el-input
              style="width: 600px"
              :title="dataObj.ApplicableModelStr"
              disabled
              v-model="dataObj.ApplicableModelStr"
            />
            <el-button
              type="primary"
              class="search-btn"
              @click="dataObj.ApplicableModelShow = true"
            >
              {{ _t('选择') }}
            </el-button>
          </div>
        </div>
        <div class="process-line" v-if="!hasStructure">
          <div class="form-key">{{ _t('工序段') }}：</div>
          <el-select
            class="--scms-select"
            popper-class="--scms-select_poper"
            style="width: 150px"
            v-model="dataObj.segment"
            :placeholder="_t('请选择')"
          >
            <el-option
              v-for="item in segmentList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </div>
        <div
          class="summaryTable-table"
          :style="hasStructure ? 'margin-top: -1px;' : ''"
        >
          <el-table
            ref="table1"
            :data="displayWorksectionList"
            class="x_table drag-table1"
            height="100%"
            style="width: 100%"
            border
            @select="selectFn1"
            @select-all="selectFn1"
            :row-class-name="tableRowClassName"
            :header-cell-style="{ background: '#DBDFE7', color: '#35363B' }"
            :empty-text="_t('暂无数据')"
          >
            <!-- <el-table-column width="80px" type="index">
              <template #default="scope">
                <img src="../images/icon_move.png" class="btn-move" />
              </template>
            </el-table-column> -->
            <el-table-column width="60px" type="selection" />
            <el-table-column
              prop="segment"
              :label="_t('工序段')"
              v-if="!hasStructure"
            >
              <template #default="{ row }">
                {{ row?.segment?.name }}
              </template>
            </el-table-column>
            <el-table-column prop="name" :label="_t('工序名称')" />
          </el-table>
        </div>
      </div>
      <tip-pop
        v-if="isTipShow"
        :tipText="tipText"
        :noCancel="noCancel"
        @tipCallBack="tipCallBack"
      ></tip-pop>
    </BaseDrawer>
    <ApplicableModelPop
      :visible="dataObj.ApplicableModelShow"
      @callback="ApplicableModelCallback"
    />
  </span>
</template>

<script lang="ts">
import {
  ref,
  Ref,
  nextTick,
  defineComponent,
  reactive,
  watch,
  computed,
} from 'vue'
import { ElMessage } from 'element-plus'
import EditButton from '../components/editButton.vue'
import TipPop from '../components/tipPop.vue'
import ApplicableModelPop from './ApplicableModelPop.vue'
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer'
import Sortable from 'sortablejs'
import { _t, LanguageScopeKey } from '../app'
import {
  getWorksectionList,
  creatTracesummarytable,
  updateTracesummarytable,
} from '@/api/index'
import { useGlobalState } from '@/libs/Store/Store'
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
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
  },
  components: {
    TipPop,
    EditButton,
    ApplicableModelPop,
    BaseDrawer,
  },
  emits: ['callback'],
  setup(props, { emit }) {
    const isTipShow = ref<boolean>(false)
    const noCancel = ref<boolean>(true)
    const tipText = ref<string>('')
    const { systemConfig } = useGlobalState()
    const tipCallBack = (str: string) => {
      if (str == 'yes') {
      }
      noCancel.value = true
      isTipShow.value = false
    }

    const table1 = ref<any>()
    const dataObj = reactive({
      ApplicableModelShow: false,
      name: '',
      ApplicableModelStr: '',
      segment: '',
    })

    const hasStructure = computed(() => {
      const state: Ref<any> = systemConfig.state
      const structure = state.value.ProductionLineStructure
      return structure == 0
    })

    const ApplicableModelSeleList = ref<any[]>([])
    const ApplicableModelCallback = (state: string, arr?: any[]) => {
      dataObj.ApplicableModelShow = false
      if (state == 'confirm' && arr && arr.length) {
        ApplicableModelSeleList.value = arr
        dataObj.ApplicableModelStr = ApplicableModelSeleList.value
          .map((item) => item.model)
          .join('、')
      }
    }
    const segmentList = ref<any[]>([])
    const worksectionList = ref<any[]>([])
    const getWorksectionListFn = () => {
      return getWorksectionList({
        filter: '',
        abilityType: '',
        includeDetails: false,
      }).then((res: any) => {
        worksectionList.value = res.items
        let temp: any = [
          {
            label: _t('全部'),
            value: '',
          },
        ]
        res.items.forEach((item: any) => {
          if (
            item.segment &&
            !temp.some((_: any) => _.value == item.segment.id)
          ) {
            temp.push({
              label: item.segment.name,
              value: item.segment.id,
            })
          }
        })
        segmentList.value = temp
        dataObj.segment = ''
      })
    }

    const displayWorksectionList = computed(() => {
      return worksectionList.value.filter(
        (item: any) => !dataObj.segment || item.segment.id == dataObj.segment
      )
    })
    watch(
      () => dataObj.segment,
      (val) => {
        seleList.value = []
      }
    )

    const seleList = ref<any[]>([])
    const selectFn1 = (arr: Object[]) => {
      seleList.value = arr
    }

    const tableRowClassName = ({ row, rowIndex }: any) => {
      row.index = rowIndex
    }

    const submit = (state: 'close' | 'confirm') => {
      if (state == 'confirm') {
        if (seleList.value.length < 2) {
          ElMessage.warning(_t('请勾选两个或两个以上的工序！'))
          return
        }
        if (props.title == '修改' && props.seleItem) {
          updateTracesummarytable({
            id: props.seleItem.id,
            name: dataObj.name,
            traceSummaryTable2Products: ApplicableModelSeleList.value.map(
              (item: any) => ({
                productId: item.id,
              })
            ),
            traceSummaryTable2WorkSections: seleList.value.map(
              (item: any, idx: number) => ({
                workSectionId: item.id,
                sort: idx,
              })
            ),
            ConcurrencyStamp: props.seleItem.concurrencyStamp,
          })
            .then((res: any) => {
              ElMessage.success(_t('修改成功！'))
              emit('callback', state)
            })
            .catch((err: any) => {
              ElMessage.error(_t('修改失败！'))
            })
        } else {
          creatTracesummarytable({
            name: dataObj.name,
            traceSummaryTable2Products: ApplicableModelSeleList.value.map(
              (item: any) => ({
                productId: item.id,
              })
            ),
            traceSummaryTable2WorkSections: seleList.value.map(
              (item: any, idx: number) => ({
                workSectionId: item.id,
                sort: idx,
              })
            ),
          }).then((res: any) => {
            ElMessage.success(_t('创建成功！'))
            emit('callback', state)
          })
        }
      } else {
        emit('callback', state)
      }
    }

    const initSortable = (className: any) => {
      // 获取表格row的父节点
      const tables = document.querySelector(
        '.summaryTable-content .' +
          className +
          ' .cs-table__body-wrapper .cs-table__body tbody'
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
          const temp = worksectionList.value
          const currRow = temp.splice(oldIndex, 1)[0]
          temp.splice(newIndex, 0, currRow)

          worksectionList.value = []
          nextTick(() => {
            worksectionList.value = JSON.parse(JSON.stringify(temp))
          })
        },
      })
    }

    watch(
      () => props.visible,
      async (val) => {
        if (!val) {
          return
        }
        dataObj.name = ''
        ApplicableModelSeleList.value = []
        seleList.value = []
        dataObj.ApplicableModelStr = ''
        await getWorksectionListFn()
        if (props.title == '修改' && props.seleItem) {
          dataObj.name = props.seleItem.name
          ApplicableModelSeleList.value =
            props.seleItem.traceSummaryTable2Products.map((item: any) => ({
              ...item,
              id: item.productId,
            })) || []
          seleList.value =
            props.seleItem.traceSummaryTable2WorkSections.map((item: any) => ({
              ...item,
              id: item.workSectionId,
            })) || []

          if (seleList.value && seleList.value.length) {
            worksectionList.value.forEach((item: any) => {
              if (
                seleList.value.some(
                  (item2: any) => item.id == item2.workSectionId
                )
              ) {
                setTimeout(() => {
                  table1.value.toggleRowSelection(item, true)
                })
              }
            })
          }
          dataObj.ApplicableModelStr = props.seleItem.products
        }
        // nextTick(() => {
        //   initSortable('drag-table1')
        // })
      },
      {
        deep: true,
      }
    )

    return {
      _t,
      isTipShow,
      tipText,
      noCancel,
      hasStructure,
      dataObj,
      ApplicableModelSeleList,
      worksectionList,
      displayWorksectionList,
      segmentList,
      seleList,
      table1,
      LanguageScopeKey,
      tipCallBack,
      submit,
      ApplicableModelCallback,
      getWorksectionListFn,
      selectFn1,
      tableRowClassName,
      initSortable,
    }
  },
})
</script>

<style lang="scss">
.summaryTableEdit-el-dialog {
  .cs-dialog__header {
    background: #e4e4e6;
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

.summaryTableEdit-el-dialog {
  .summaryTable-content {
    box-sizing: border-box;

    .summaryTable-search {
      width: 100%;
      height: auto;
      border-bottom: 1px solid #dde0e4;

      .form-line {
        height: 50px;
        display: flex;
        align-items: center;
      }

      .form-key {
        margin: 0 5px;
        word-break: keep-all;
        width: 120px;
      }

      .search-btn {
        padding: 0 16px;
        height: 26px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        margin-left: 10px;
        word-break: keep-all;
        cursor: pointer;
      }
    }

    .process-line {
      height: 50px;
      display: flex;
      align-items: center;
    }

    .summaryTable-table {
      width: 100%;
      height: 500px;
      margin-bottom: 16px;
    }
  }

  .summaryTable-footer {
    display: flex;
    justify-content: flex-end;
    padding: 0 20px 16px;
    box-sizing: border-box;
  }
}
</style>
