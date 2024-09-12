<template>
  <div class="setting">
    <div class="setting-switch">
      <div
        :class="
          dataObj.switchType == 0 ? 'switch-btn cur-switch' : 'switch-btn'
        "
        @click="changeSwitch(0)"
      >
        {{ _t('业务字段配置') }}
      </div>
      <div
        :class="
          dataObj.switchType == 1 ? 'switch-btn cur-switch' : 'switch-btn'
        "
        @click="changeSwitch(1)"
      >
        {{ _t('展示配置') }}
      </div>
      <div
        :class="
          dataObj.switchType == 2 ? 'switch-btn cur-switch' : 'switch-btn'
        "
        @click="changeSwitch(2)"
      >
        {{ _t('总表配置') }}
      </div>

      <!-- <Tab :data="tabData" type="list" @tab="tabFn" size="small" /> -->
    </div>
    <div class="user_wrap">
      <div class="setting-search">
        <div class="search-left">
          <IconButton
            icon="add-p"
            type="primary"
            @click="openSummaryTable(_t('新建'))"
            v-if="dataObj.switchType == 2"
          >
            {{ _t('添加') }}</IconButton
          >
          <IconButton
            icon="close_x"
            v-if="dataObj.switchType == 2"
            @click="delSumFn"
            >{{ _t('删除') }}</IconButton
          >
        </div>
        <div class="search-right">
          <div v-if="dataObj.switchType == 0">{{ _t('字段名称') }}：</div>
          <Search
            v-if="dataObj.switchType == 0"
            v-model="dataObj.filter1"
            @Confirm="getDataList"
            :style="{ marginLeft: '5px' }"
            :placeholder="_t('请输入')"
          />
          <div v-edition-show="'L'" class="search-right-item">
            <div v-if="dataObj.switchType == 1">{{ _t('产品型号') }}：</div>
            <Search
              v-if="dataObj.switchType == 1"
              v-model="dataObj.filter2"
              @Confirm="getDataList"
              :style="{ marginLeft: '5px' }"
              :placeholder="_t('请输入')"
            />
          </div>

          <Search
            v-if="dataObj.switchType == 2"
            v-model="dataObj.filter3"
            @Confirm="getDataList"
            :style="{ marginLeft: '5px' }"
            :placeholder="_t('请输入')"
          />
        </div>
      </div>

      <div class="pages-table" v-if="dataObj.switchType == 0">
        <BaseTable
          v-model:dataSource="dataListField"
          :isHidePagination="true"
          :isSeq="true"
          :LanguageScopeKey="LanguageScopeKey"
          :is-drag="dataObj.canSort"
          empty-text="暂无数据"
          @drag="saveSettingFn"
          :columns="[
            {
              field: 'seq',
              title: '序号',
              type: 'seq',
            },
            {
              field: 'filedName',
              title: '字段名称',
            },
            // {
            //   field: 'filedAlias',
            //   title: '字段别名',
            // },
            {
              field: 'source',
              title: '数据源',
            },
            // {
            //   field: 'isEnabled',
            //   title: '状态',
            // },
            {
              field: 'remark',
              title: '备注',
            },
            {
              field: 'action',
              title: '操作',
            },
          ]"
        >
          <template #filedAlias="{ row }">
            <el-input v-model="row.filedAlias" @blur="saveSettingFn" />
          </template>

          <template #isEnabled="{ row }">
            {{ row.isEnabled ? _t('已启用') : _t('已禁用') }}
          </template>

          <template #action="{ row }">
            <el-switch
              v-model="row.isEnabled"
              class="ml-2"
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
              :disabled="row.isStatic"
              @change="changeAbleType(row)"
            />
          </template>
        </BaseTable>
      </div>

      <div class="pages-table" v-if="dataObj.switchType == 1">
        <BaseTable
          v-model:dataSource="dataList"
          :isHidePagination="true"
          :LanguageScopeKey="LanguageScopeKey"
          empty-text="暂无数据"
          :isSeq="true"
          :columns="[
            {
              field: 'seq',
              title: '序号',
              type: 'seq',
            },
            {
              field: 'productModel',
              title: '产品型号',
            },
            {
              field: 'recordTime',
              title: '操作时间',
            },
            {
              field: 'operator',
              title: '操作人',
            },
            {
              field: 'action',
              title: '操作',
            },
          ]"
        >
          <template #action="{ row }">
            <div class="table_btns">
              <div
                class="table_btn"
                @click="openSettingTable(_t('查看'), row, true)"
              >
                <img src="../images/icon_check.png" />
                {{ _t('查看') }}
              </div>
              <div class="table_btn" @click="openSettingTable(_t('修改'), row)">
                <img src="../images/icon_pen2.png" />
                {{ _t('修改') }}
              </div>
            </div>
          </template>
        </BaseTable>
      </div>
      <div class="pages-table" v-if="dataObj.switchType == 2">
        <BaseTable
          :LanguageScopeKey="LanguageScopeKey"
          v-model:dataSource="dataList"
          :isChecked="true"
          :isSeq="true"
          empty-text="暂无数据"
          @Check="selectFn1"
          :isHidePagination="true"
          :columns="[
            {
              field: 'seq',
              title: '序号',
              type: 'seq',
            },
            {
              field: 'name',
              title: '总表名称',
            },
            {
              field: 'workSections',
              title: '组合工序',
            },
            {
              field: 'products',
              title: '适用型号',
            },
            {
              field: 'recordTime',
              title: '记录时间',
            },
            {
              field: 'operator',
              title: '操作人',
            },
            {
              field: 'action',
              title: '操作',
            },
          ]"
        >
          <template #action="{ row }">
            <div class="table_btns">
              <div class="table_btn" @click="openSummaryTable(_t('修改'), row)">
                <img src="../images/icon_pen2.png" />
                {{ _t('修改') }}
              </div>
            </div>
          </template>
        </BaseTable>
      </div>
    </div>

    <EditSummaryTablePop
      :visible="dataObj.summaryTableShow"
      :seleItem="seleSumItem"
      :title="dataObj.seleSumTitle"
      @callback="summaryTableCallback"
    />
    <EditSettingPop
      :seleItem="seleSettingItem"
      :title="dataObj.seleSettingTitle"
      :visible="dataObj.editSettingShow"
      :isView="dataObj.isView"
      @callback="editSettingCallback"
    />
  </div>
</template>

<script lang="ts">
import {
  ref,
  onMounted,
  defineComponent,
  reactive,
  nextTick,
  computed,
} from 'vue'
import { _t, LanguageScopeKey } from '../app'
import { Language } from '@/libs/Language/Language'
import EditButton from '../components/editButton.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import EditSummaryTablePop from '../dialogs/EditSummaryTablePop.vue'
import EditSettingPop from '../dialogs/EditSettingPop.vue'
import Tab from '@/components/Tab/Tab'
import Search from '@/components/Search/Search'
import BaseTable from '@/components/Table/Table'
import IconButton from '@/components/IconButton/IconButton'
import { vEditionShow, isEdition } from '@/libs/Permission/Permission'

import {
  getSetting,
  saveSetting,
  getTraceproductmodelconfig,
  getTracesummarytable,
  delTracesummarytable,
} from '@/api/index'
import Sortable from 'sortablejs'
import { cloneDeep } from 'lodash'

export default defineComponent({
  name: 'Setting',
  directives: {
    editionShow: vEditionShow,
  },
  components: {
    EditButton,
    EditSummaryTablePop,
    EditSettingPop,
    Tab,
    Search,
    BaseTable,
    IconButton,
  },
  props: {
    permissions: {
      type: Array<string>,
      require: true,
    },
  },
  setup(props) {
    const tabData: any = [
      {
        label: '业务字段配置',
        name: 0,
        hidden: true,
      },
      {
        label: '展示配置',
        name: 1,
        hidden: true,
      },
      {
        label: '总表配置',
        name: 2,
        hidden: true,
      },
    ]
    const tabFn = (item: any) => {
      changeSwitch(item)
    }
    const dataObj = reactive({
      switchType: 0,
      summaryTableShow: false,
      editSettingShow: false,
      editSettingTitle: '',
      filter1: '',
      filter2: '',
      filter3: '',
      seleSumTitle: '',
      seleSettingTitle: '',
      canSort: true,
      isView: false,
    })
    const changeSwitch = (type: number) => {
      dataObj.switchType = type
      getDataList()
    }

    const summaryTableCallback = (state: string, str?: string) => {
      dataObj.summaryTableShow = false
      if (state == 'confirm') {
        getDataList()
      }
    }

    const seleSettingItem = ref<any>({})
    const openSettingTable = (
      type: string,
      item: any,
      isView: boolean = false
    ) => {
      dataObj.editSettingShow = true
      dataObj.editSettingTitle = type
      dataObj.isView = isView
      seleSettingItem.value = item
    }

    const editSettingCallback = (state: string, str?: string) => {
      dataObj.editSettingShow = false
      if (state == 'confirm') {
        getDataList()
      }
    }

    const genListFilter = () => {
      return dataList.value.filter(
        (item: any) =>
          !dataObj.filter1 || item.filedName.indexOf(dataObj.filter1) >= 0
      )
    }

    const dataList = ref<any[]>([])
    const dataListField = ref<any[]>([])
    const dataListFilter = computed(genListFilter)

    const getDataList = () => {
      dataList.value = []
      if (dataObj.switchType == 0) {
        getSetting({
          namePrefix: 'SCMS.TraceManagement.TableBusinessFieldSettings',
        })
          .then((res: any) => {
            dataObj.canSort = dataObj.filter1 ? false : true
            dataList.value = JSON.parse(res.settings[0].value).sort(
              (a: any, b: any) => a.sort - b.sort
            )
            dataListField.value = genListFilter()
          })
          .catch((err: any) => {
            dataList.value = []
          })
      }
      if (dataObj.switchType == 1) {
        getTraceproductmodelconfig({ ProductId: '', GetIfEmppty: true })
          .then((res: any) => {
            dataList.value = res.items.filter(
              (item: any) =>
                !dataObj.filter2 ||
                item.productModel.indexOf(dataObj.filter2) >= 0
            )
          })
          .catch((err: any) => {
            dataList.value = []
          })
      }
      if (dataObj.switchType == 2) {
        getTracesummarytable({
          ProductId: '',
          Filter: '',
        })
          .then((res: any) => {
            dataList.value = res.items || []

            dataList.value = res.items.filter(
              (item: any) =>
                !dataObj.filter3 || item.name.indexOf(dataObj.filter3) >= 0
            )
          })
          .catch((err: any) => {
            dataList.value = []
          })
      }
    }
    const changeAbleType = (item: any) => {
      if (item.isStatic) {
        item.isEnabled = !item.isEnabled
        return
      }
      saveSettingFn()
    }
    const saveSettingFn = () => {
      if (dataObj.switchType == 0 && dataList.value && dataList.value.length) {
        let value = ''
        if (!dataObj.canSort) {
          value = JSON.stringify(
            dataList.value.map((item: any, idx: number) => ({
              ...item,
              sort: idx,
            }))
          )
        } else {
          value = JSON.stringify(
            dataListField.value.map((item: any, idx: number) => ({
              ...item,
              sort: idx,
            }))
          )
        }
        return saveSetting({
          settings: [
            {
              name: 'SCMS.TraceManagement.TableBusinessFieldSettings',
              value,
            },
          ],
        })
          .then((res: any) => {
            ElMessage.success(_t('保存成功！'))
            getDataList()
          })
          .catch((err: any) => {
            ElMessage.error(_t('保存失败！'))
            getDataList()
          })
      }
    }

    const seleSumItem = ref<any>({})
    const openSummaryTable = (type: string, item?: any) => {
      dataObj.summaryTableShow = true
      dataObj.seleSumTitle = type
      if (type == _t('修改') && item) {
        seleSumItem.value = item
      }
    }

    const tableRowClassName = ({ row, rowIndex }: any) => {
      row.index = rowIndex
    }
    const seleList = ref<any[]>([])
    const selectFn1 = (arr: Object[]) => {
      seleList.value = arr
    }
    const delSumFn = () => {
      ElMessageBox.confirm(
        _t('是否删除') + seleList.value.map((item: any) => item.name).join(','),
        _t('提示'),
        {
          confirmButtonText: _t('是'),
          cancelButtonText: _t('否'),
          type: 'warning',
        }
      ).then(() => {
        delTracesummarytable(seleList.value.map((item: any) => item.id)).then(
          (res: any) => {
            getDataList()
          }
        )
      })
    }

    const initSortable = (className: any) => {
      // 获取表格row的父节点
      const tables = document.querySelector(
        '.setting .' +
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
          if (dataObj.filter1 || dataObj.switchType != 0) {
            return
          }
          let currRow = dataList.value.splice(oldIndex, 1)[0]
          dataList.value.splice(newIndex, 0, currRow)
          saveSettingFn()
        },
      })
    }
    Language.useChange((lang: typeof Language) => {
      getDataList()
    })
    onMounted(async () => {
      getDataList()
    })
    return {
      _t,
      LanguageScopeKey,
      getDataList,
      isEdition,
      dataList,
      dataListField,
      dataListFilter,
      dataObj,
      summaryTableCallback,
      editSettingCallback,
      seleSettingItem,
      openSettingTable,
      changeAbleType,
      changeSwitch,
      saveSettingFn,
      seleList,
      selectFn1,
      tableRowClassName,
      delSumFn,
      openSummaryTable,
      seleSumItem,
      initSortable,
      tabData,
      tabFn,
    }
  },
})
</script>

<style lang="scss">
@import url(@/assets/styles/common.scss);
</style>

<style lang="scss" scoped>
:deep(.cs-input) {
  height: 28px;
}

.setting {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  // padding: 0 22px;
  box-sizing: border-box;

  .setting-switch {
    width: 100%;
    height: 38px;
    display: flex;
    align-items: center;
    background: #ececec;
    border-radius: 4px;
    padding: 10px 22px;
    box-sizing: border-box;

    .switch-btn {
      padding: 0 16px;
      height: 30px;
      font-size: 14px;
      line-height: 1;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666666;
      cursor: pointer;
    }

    .cur-switch {
      color: #5a84ff;
      background-color: #fff;
      border: 1px solid #cfcfcf;
      border-radius: 4px;
    }
  }

  .user_wrap {
    width: 100%;
    height: calc(100% - 46px);

    box-sizing: border-box;

    .setting-search {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;

      .search-left {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }

      .search-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        :deep(.cs-input__wrapper) {
          height: 32px;
        }
        .search-right-item {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
      }

      .search-btn {
        padding: 0 16px;
        height: 26px;
        background: #8b9ca4;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        margin-left: 10px;
        word-break: keep-all;
        cursor: pointer;
      }

      .search-btn2 {
        width: 68px;
        height: 34px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #ebebeb;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        cursor: pointer;

        img {
          width: 18px;
          height: 18px;
          margin-right: 6px;
        }
      }

      .search-btn2:active {
        box-shadow: 0px 2px 0px 1px rgba(0, 0, 0, 0.16);
      }
    }

    .pages-table {
      width: 100%;
      height: calc(100% - 50px);

      .table_btns {
        display: flex;
        align-items: center;
        height: 30px;

        .table_btn {
          font-size: 14px;
          color: #265cfb;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 20px;
          font-weight: bold;
          cursor: pointer;

          img {
            width: 16px;
            height: 16px;
            margin-right: 4px;
          }
        }

        .able {
          background-color: #5a84ff;
          color: #fff;
          border: none;
        }

        .enable {
          background-color: #f67474;
          color: #fff;
          border: none;
        }

        .disable {
          background-color: #cccccc;
          color: #fff;
        }

        .table_btn:hover {
          opacity: 0.8;
        }
      }
    }
  }

  .searh,
  .btns {
    height: 30px;
    display: flex;
    line-height: 30px;
  }

  .searh {
    min-width: 220px;
    width: 20%;
  }

  .btns {
    width: 110px;
    display: flex;
    justify-content: space-around;
    box-sizing: border-box;

    .btns_svg_add {
      cursor: pointer;
      width: 21px;
      height: 21px;
      margin-top: 4px;
    }

    i {
      color: #7e7e7f;
      cursor: pointer;
      background-color: var(--module_background);
      font-size: 20px;
    }
  }
}
</style>
