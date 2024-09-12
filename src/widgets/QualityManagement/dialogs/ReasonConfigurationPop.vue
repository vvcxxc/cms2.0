<!-- 修改色系 -->
<template>
  <BaseDialog
    v-model="$props.visible"
    width="600px"
    top="18vh"
    :title="`${_t('不良原因配置')}`"
    :show-close="false"
    :append-to-body="true"
    class="ReasonConfigurationEdit-el-dialog"
    @close="submit('close')"
    @confirm="submit('confirm')"
  >
    <div class="ReasonConfiguration-content">
      <div class="search-content">
        <IconButton icon="add-p" type="primary" @click="addItem" :status="true"
          >添加</IconButton
        >
        <IconButton icon="del" @click="delItem">删除</IconButton>
      </div>
      <div class="ReasonConfiguration-list">
        <BaseTable
          ref="table1"
          v-model:dataSource="dataList"
          class="x_table drag-table1"
          height="96%"
          style="width: 100%"
          :isHidePagination="true"
          :rowClassName="tableRowClassName"
          :isSeq="false"
          :isChecked="checkoutRowStatus"
          :isDrag="true"
          :columns="[
            {
              field: 'name',
              title: _t('不良原因'),
            },
          ]"
          @check="selectFn1"
          @row-click="rowClickFn"
        >
          <template #name="scope">
            <span v-if="scope.row.id === '原因未知'">{{ scope.row.name }}</span>
            <el-input
              v-else
              v-model="scope.row.name"
              :ref="(el:any) => !scope.row.name && el?.focus()"
            />
          </template>
        </BaseTable>
      </div>
    </div>
    <!-- <template #footer>
      <div class="ReasonConfiguration-footer">
        <EditButton :text="_t('取消')" type="del" @callback="submit('close')" />
        <EditButton :text="_t('保存')" type="sumbit" @callback="submit('confirm')" />
      </div>
    </template> -->
    <tip-pop
      v-if="isTipShow"
      :tipText="tipText"
      :noCancel="noCancel"
      @tipCallBack="tipCallBack"
    ></tip-pop>
  </BaseDialog>
</template>

<script lang="ts">
import { ref, defineComponent, reactive, watch, nextTick } from 'vue'
import sdk from 'sdk'
import { ElMessage } from 'element-plus'
import EditButton from '../components/EditButton/index.vue'
import TipPop from '../components/tipPop.vue'
import Sortable from 'sortablejs'
const { models } = sdk
const { Language } = models
const { _t } = Language
import { getallunqualifiedreason, submitunqualifiedreason } from '../api/index'
import BaseDialog from '@/components/BaseDialog/index.vue'
import IconButton from '@/components/IconButton/IconButton'
import BaseTable from '@/components/Table/Table'
import { title } from 'process'

export default defineComponent({
  name: 'EditSummaryTablePop',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    TipPop,
    EditButton,
    BaseDialog,
    IconButton,
    BaseTable,
  },
  setup(props, { emit }) {
    const isTipShow = ref<boolean>(false)
    const noCancel = ref<boolean>(true)
    const tipText = ref<string>('')
    const tipCallBack = (str: string) => {
      if (str == 'yes') {
      }
      noCancel.value = true
      isTipShow.value = false
    }

    const dataObj = reactive({
      list: [],
      sortable: [],
      nowIndex: 1,
      curIdx: 0,
    })

    const dataList = ref<any[]>([{ name: '原因未知', id: '原因未知' }])
    const getallunqualifiedreasonFn = () => {
      getallunqualifiedreason({ Filter: '' }).then((res: any) => {
        dataList.value = [{ name: '原因未知', id: '原因未知' }, ...res]
          .map((item: any) => ({
            ...item,
            checked: false,
          }))
          .sort((a, b) => (a.sort || 0) - (b.sort || 0))
      })
    }
    const addItem = () => {
      dataObj.nowIndex += 1
      const target = {
        name: '',
        id: new Date().getTime() + dataObj.nowIndex,
        checked: true,
      }
      dataList.value.push(target)
      table1.value.doLayout()
    }
    const delItem = () => {
      dataList.value = dataList.value.filter(
        (item: any) => item.id === '原因未知' || !item.check
      )
      table1.value?.clearSelectEvent()
    }
    //第一步选择
    const selectFn1 = (arr: Object[]) => {
      dataList.value.forEach((_: any) => {
        if (arr.some((item: any) => item.id == _.id)) {
          _.check = true
        } else {
          _.check = false
        }
      })
    }

    const table1 = ref<any>()
    const rowClickFn = (row: any) => {
      dataObj.curIdx = row.index
      nextTick(() => {
        if (dataList.value.length) {
          dataList.value.forEach((item: any) => {
            if (item.check) {
              setTimeout(() => {
                table1.value.toggleRowSelection(item, true)
              })
            } else {
              setTimeout(() => {
                table1.value.toggleRowSelection(item, false)
              })
            }
          })
        }
      })
    }
    const checkoutRowStatus = ({ row, rowIndex }: any) => {
      return rowIndex !== 0
    }
    const tableRowClassName = ({ row, rowIndex }: any) => {
      row.index = rowIndex
      if (rowIndex !== 0) {
        return 'able'
      }
    }

    const initSortable = (className: any) => {
      // 获取表格row的父节点
      const tables = document.querySelector(
        '.' +
          className +
          ' .cs-table__inner-wrapper .cs-table__body-wrapper tbody'
      )
      console.log('tables', tables)
      // 创建拖拽实例
      Sortable.create(tables as HTMLElement, {
        animation: 150, //动画
        disabled: false, // 拖拽不可用? false 启用（刚刚渲染表格的时候起作用，后面不起作用）
        handle: '.btn-move', //指定拖拽目标，点击此目标才可拖拽元素(此例中设置操作按钮拖拽)
        // filter: '.disabled', //指定不可拖动的类名（el-table中可通过row-class-name设置行的class）
        draggable: '.able',
        dragClass: 'dragClass', //设置拖拽样式类名
        ghostClass: 'ghostClass', //设置拖拽停靠样式类名
        chosenClass: 'chosenClass', //设置选中样式类名
        // 结束拖动事件
        onEnd: ({
          newIndex,
          oldIndex,
        }: {
          newIndex: number
          oldIndex: number
        }) => {
          const temp = dataList.value
          const currRow = temp.splice(oldIndex, 1)[0]
          temp.splice(newIndex, 0, currRow)

          dataList.value = []
          nextTick(() => {
            dataList.value = JSON.parse(JSON.stringify(temp))
          })
        },
      })
    }

    watch(
      () => props.visible,
      (val) => {
        if (!val) {
          return
        }
        getallunqualifiedreasonFn()

        // nextTick(() => initSortable('drag-table1'))
      },
      {
        deep: true,
      }
    )

    const submit = (state: 'close' | 'confirm') => {
      if (state == 'confirm') {
        if (dataList.value.some((e) => e.name === '')) {
          ElMessage.error(_t('不良原因不能为空'))
          return
        }
        submitunqualifiedreason(
          dataList.value.filter((e) => {
            return e.id !== '原因未知'
          })
        )
          .then((res: any) => {
            ElMessage.success(_t('保存成功！'))
            emit('callback', state)
          })
          .catch((err: any) => {
            ElMessage.error(_t('保存失败！'))
          })
      } else {
        emit('callback', state)
      }
    }

    return {
      _t,
      dataObj,
      dataList,
      isTipShow,
      tipText,
      noCancel,
      tipCallBack,
      submit,
      table1,
      checkoutRowStatus,
      rowClickFn,
      tableRowClassName,
      initSortable,
      addItem,
      delItem,
      selectFn1,
    }
  },
})
</script>

<style lang="scss">
.ReasonConfigurationEdit-el-dialog {
  .cs-dialog__footer {
    padding-bottom: 0 !important;
  }
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

.ReasonConfigurationEdit-el-dialog {
  .ReasonConfiguration-content {
    padding: 0 15px;
    box-sizing: border-box;

    .search-content {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .search-btn {
        width: 68px;
        height: 34px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #ebebeb;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 10px;
        cursor: pointer;

        img {
          width: 18px;
          height: 18px;
          margin-right: 8px;
        }
      }

      .search-btn:active {
        box-shadow: 0px 2px 0px 1px rgba(0, 0, 0, 0.16);
      }
    }

    .ReasonConfiguration-list {
      width: 100%;
      height: 300px;
      overflow: auto;

      .able-list {
        width: 100%;
        height: 92px;
        margin-bottom: 10px;
      }

      .ReasonConfiguration-item {
        width: 100%;
        height: 42px;
        border-radius: 2px;
        display: flex;
        align-items: center;
        margin-bottom: 4px;
        border: 1px solid #e9e9e9;

        .item-select {
          width: 80px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        .item-label {
          width: calc(100% - 80px);
          height: 100%;
          display: flex;
          align-items: center;
          padding: 13px 6px;
          box-sizing: border-box;

          .require {
            color: #f77070;
          }
        }
      }

      .itemTitle {
        background: #e2e5eb;
      }

      .disabled {
        background: #e9e9e9;
      }
    }
  }

  .ReasonConfiguration-footer {
    display: flex;
    justify-content: flex-end;
    padding: 0 20px 16px;
    box-sizing: border-box;
  }
  .btn-move {
    margin: 0 auto;
    display: block;
  }
}
</style>
