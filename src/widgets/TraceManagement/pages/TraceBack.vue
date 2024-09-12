<!-- eslint-disable vue/no-mutating-props -->

<template>
  <div class="TraceBack" :i="Language.triggerRenderData.i">
    <div class="TraceBack-content">
      <div class="TraceBack-body">
        <div class="TraceBack-left">
          <div v-edition-show="'L'" class="prodType-filter">
            <div class="form-key ellipsis" :title="_t('产品型号')">
              {{ _t('产品型号') }}
            </div>
            <div class="form-value">
              <Radio
                v-model:modelValue="dataObj.ProductModel"
                :options="productList"
                labelWidth="100px"
                @change="updateCurProduct"
                trigger="click"
              ></Radio>
            </div>
          </div>
          <div class="TraceBack-list">
            <el-tree
              highlight-current
              :data="worksectionShowList"
              :props="defaultProps"
              @node-click="handleNodeClick"
              :default-expand-all="true"
            >
              <template #default="{ node, data }">
                <div
                  :class="{
                    'item-true2':
                      dataObj.showQualified &&
                      findWorksection(data).isQualified == true,
                    'item-false2':
                      dataObj.showQualified &&
                      findWorksection(data).isQualified == false,
                    'item-tooltip': true,
                  }"
                  :title="data.header"
                >
                  {{ data.header }}
                </div>
              </template>
            </el-tree>
          </div>
        </div>
        <div class="TraceBack-right">
          <div class="TraceBack-searchBar">
            <div class="searchBar-left">
              <div class="overflow ellipsis" :title="_t('时间范围')">
                {{ _t('时间范围') }}
              </div>
              <el-date-picker
                type="datetime"
                style="width: 180px"
                :clearable="false"
                format="YYYY-MM-DD HH:mm:ss"
                v-model="dataObj.From"
                popper-class="light-datetime-picker"
                class="light-datetime-picker"
              >
              </el-date-picker>
              <div class="search-key" style="margin: 0 5px">-</div>
              <el-date-picker
                type="datetime"
                style="width: 180px"
                :clearable="false"
                format="YYYY-MM-DD HH:mm:ss"
                v-model="dataObj.To"
                popper-class="light-datetime-picker"
                class="light-datetime-picker"
              ></el-date-picker>
              <el-select
                class="--scms-select"
                popper-class="--scms-select_poper"
                style="width: 100px; margin-left: 10px"
                v-model="dataObj.codeType"
              >
                <el-option :label="_t('产品ID')" :value="1"></el-option>
                <el-option :label="_t('更新码')" :value="2"></el-option>
                <!-- <el-option :label="_t('物料条码')" :value="3"></el-option> -->
              </el-select>
              <el-select
                class="--scms-select"
                popper-class="--scms-select_poper"
                style="width: 100px; margin-left: 10px"
                v-model="dataObj.ProductType"
              >
                <el-option :label="_t('模糊查询')" :value="0"></el-option>
                <el-option :label="_t('精确查询')" :value="1"></el-option>
              </el-select>
              <el-input
                style="width: 120px; margin-left: 10px"
                v-model="dataObj.ProductModelFilter"
                @keyup.enter.native="($event: any) => $event.target.blur()"
                class="light-element-ui"
                :placeholder="_t('请输入')"
              />
              <div class="form-key ellipsis" :title="_t('是否合格')">
                {{ _t('是否合格') }}
              </div>
              <el-select
                class="--scms-select"
                popper-class="--scms-select_poper"
                style="width: 80px"
                v-model="dataObj.isQualified"
              >
                <el-option :label="_t('全部')" value=""></el-option>
                <el-option :label="_t('OK')" :value="true"></el-option>
                <el-option :label="_t('NG')" :value="false"></el-option>
              </el-select>
              <div
                class="form-key ellipsis"
                style="width: 80px"
                :title="_t('物料识别码')"
              >
                {{ _t('物料识别码') }}
              </div>
              <el-input
                style="width: 100px"
                v-model="dataObj.MaterialCode"
                class="light-element-ui"
                @keyup.enter.native="($event: any) => $event.target.blur()"
                :placeholder="_t('请输入')"
              />
              <div
                v-edition-show="'E'"
                class="form-key ellipsis"
                :title="_t('工单号')"
              >
                {{ _t('工单号') }}
              </div>
              <el-input
                v-edition-show="'E'"
                style="width: 100px"
                v-model="dataObj.OrderCode"
                class="light-element-ui"
                @keyup.enter.native="($event: any) => $event.target.blur()"
                :placeholder="_t('请输入')"
              />
              <el-button
                type="primary"
                @click="queryReportData"
                style="margin-left: 10px; height: 28px; width: 80px"
                >{{ _t('查询') }}</el-button
              >
            </div>
            <div class="searchBar-right">
              <IconButton
                :title="_t('过程参数曲线')"
                icon="chart"
                type="primary"
                @click="cureData"
              ></IconButton>
              <IconButton
                :title="_t('导出')"
                icon="export"
                type="primary"
                @click="exportData"
              >
              </IconButton>
            </div>
          </div>

          <!-- 中车屏蔽过程参数曲线 -->
          <div class="table-searchBar">
            <div class="bar-left">
              <div class="form-key">{{ _t('加工数') }}：</div>
              <div class="form-val">{{ dataObj.total }}</div>
              <div class="form-key">{{ _t('合格数') }}：</div>
              <div class="form-val">{{ dataObj.qualified }}</div>
              <div class="form-key">{{ _t('合格率') }}：</div>
              <div class="form-val">{{ dataObj.qualifiedPercentage }}</div>
              <div class="form-key">{{ _t('不合格数') }}：</div>
              <div class="form-val red">{{ dataObj.unQualified }}</div>
              <div class="form-key">{{ _t('不合格率') }}：</div>
              <div class="form-val red">
                {{ dataObj.unQualifiedPercentage }}
              </div>
            </div>
            <div class="bar-right">
              <div class="form-key">{{ _t('冻结列数') }}</div>
              <el-input
                type="number"
                style="width: 100px; margin-left: 10px"
                v-model="dataObj.fixedColumnTemp"
                @keyup.enter.native="($event: any) => $event.target.blur()"
                @blur="fixChange"
                class="light-element-ui"
                :placeholder="_t('请输入')"
              />
            </div>
          </div>

          <div class="table-content-padding">
            <div class="table-contentFlex" ref="contentFlex" @scroll="scrollFn">
              <div
                class="table-contentFixed"
                :style="{
                  width: `fix-content`,
                }"
              >
                <!-- 固定表格头 -->
                <div
                  class="table-title"
                  :style="{
                    height: multTitle
                      ? `${tableStyle.itemTitleHeight * 2}px`
                      : `${tableStyle.itemTitleHeight}px`,
                    width: `fix-content`,
                  }"
                >
                  <div
                    class="title"
                    v-for="(item, index) in tableHeader.slice(
                      0,
                      dataObj.fixedColumn
                    )"
                    style="background: #dbdfe7"
                    :key="item.key"
                  >
                    <div
                      class="title-move"
                      :style="`left: ${tableStyleMap[item.key]?.width - 2}px`"
                      @mousedown="
                        (...arg) =>
                          onMousedown(
                            ...arg,
                            index - 1,
                            item.key,
                            'fixed-body-line'
                          )
                      "
                    ></div>
                    <div
                      class="title-item title-no-scroll"
                      v-if="item.childs && item.childs.length"
                      :style="{
                        height: multTitle
                          ? `${tableStyle.itemTitleHeight * 2}px`
                          : `${tableStyle.itemTitleHeight}px`,
                      }"
                    >
                      <div class="title-half-up">
                        {{ item.name }}
                      </div>
                      <div class="title-half">
                        <!-- :style="{
                            width: `${tableStyle.itemWidth}px`,
                          }" -->
                        <!-- 没有虚拟滚动 -->
                        <div
                          class="project-title"
                          v-for="sedItem in item.childs"
                          :key="sedItem.key"
                        >
                          {{ sedItem.name }}
                        </div>
                      </div>
                    </div>
                    <div
                      class="title-item-single"
                      v-else
                      :style="{
                        height: multTitle
                          ? `${tableStyle.itemTitleHeight * 2}px`
                          : `${tableStyle.itemTitleHeight}px`,
                        width: `${
                          tableStyleMap[item.key]?.width || tableStyle.itemWidth
                        }px`,
                      }"
                    >
                      {{ item.name }}
                      <div v-if="item.key == 'OnlineTime'" class="exclamation">
                        <img
                          src="../images/icon_exclamation.png"
                          :title="_t('上线时间为工艺路线首工序的记录时间')"
                        />
                      </div>
                      <div
                        v-if="item.key == 'LatestProcessingTime'"
                        class="exclamation"
                      >
                        <img
                          src="../images/icon_exclamation.png"
                          :title="_t('最新加工时间为产品最近加工时间')"
                        />
                      </div>

                      <div class="sort-Btn-ul" v-if="item.key == 'FinishTime'">
                        <div
                          :class="
                            dataObj.sortType == 'up' &&
                            dataObj.sortKey == item.key
                              ? 'sort-up cur-up'
                              : 'sort-up'
                          "
                          @click="onSortChange('asc')"
                          :title="_t('升序：最低到最高')"
                        ></div>

                        <div
                          :class="
                            dataObj.sortType == 'down' &&
                            dataObj.sortKey == item.key
                              ? 'sort-down cur-down'
                              : 'sort-down'
                          "
                          @click="onSortChange('desc')"
                          :title="_t('降序：最高到最低')"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 固定表格body -->

                <div class="table-body">
                  <div
                    class="body-line fixed-body-line"
                    v-for="(item, idx) in dataList"
                    :key="idx"
                  >
                    <div
                      v-for="(item2, idx2) in totalTitleList.slice(
                        0,
                        dataObj.fixedColumn
                      )"
                      :class="`body-item ${item2.name}`"
                      :key="item2.key"
                      :style="{
                        height: `${tableStyle.itemHeight}px`,
                        lineHeight: `${tableStyle.itemHeight}px`,
                        // width: `${tableStyle.itemWidth}px`,
                        width: `${
                          tableStyleMap[item2.key]?.width ||
                          tableStyle.itemWidth
                        }px`,
                        color:
                          item2.key == 'IsQualified' &&
                          item[item2.key] != _t('OK')
                            ? 'red'
                            : '#333333',
                      }"
                      :title="item[item2.key]"
                    >
                      <!-- 用title不用el-tooltip，tooltip会导致渲染好慢 -->
                      {{ item[item2.key] }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="table-contentScroll">
                <div
                  class="table-title"
                  :style="{
                    height: multTitle
                      ? `${tableStyle.itemTitleHeight * 2}px`
                      : `${tableStyle.itemTitleHeight}px`,
                  }"
                >
                  <div
                    class="title"
                    v-for="(item, index) in tableHeader.slice(
                      dataObj.fixedColumn,
                      tableHeader.length
                    )"
                    :key="item.key"
                  >
                    <div
                      class="title-move"
                      v-if="!(item.childs && item.childs.length)"
                      :style="`left: ${tableStyleMap[item.key]?.width - 2}px`"
                      @mousedown="
                        (...arg) => onMousedown(...arg, index, item.key)
                      "
                    ></div>
                    <div
                      class="title-item title-child-item"
                      v-if="item.childs && item.childs.length"
                      :style="{
                        height: multTitle
                          ? `${tableStyle.itemTitleHeight * 2}px`
                          : `${tableStyle.itemTitleHeight}px`,
                      }"
                    >
                      <div class="title-half-up">
                        {{ item.name }}
                      </div>
                      <div class="title-half">
                        <!-- 虚拟滚动 -->

                        <!-- :style="{
                            width: `${tableStyle.itemWidth}px`,
                          }" -->
                        <div
                          class="project-title td-scroll"
                          v-for="sedItem in item.childs"
                          :key="sedItem.key"
                          :style="{
                            width: `${
                              tableStyleMap[sedItem.key]?.width ||
                              tableStyle.itemWidth
                            }px`,
                          }"
                        >
                          <div
                            class="title-move"
                            :style="`left: ${
                              tableStyleMap[item.key]?.width - 2
                            }px`"
                            @mousedown="
                              (...arg) =>
                                onMousedown(...arg, index, sedItem.key)
                            "
                          ></div>
                          {{ sedItem.name }}
                        </div>
                      </div>
                      <div class="title-right-border"></div>
                    </div>
                    <div
                      class="title-item-single td-scroll"
                      v-else
                      :style="{
                        height: multTitle
                          ? `${tableStyle.itemTitleHeight * 2}px`
                          : `${tableStyle.itemTitleHeight}px`,
                        width: `${
                          tableStyleMap[item.key]?.width || tableStyle.itemWidth
                        }px`,
                      }"
                    >
                      {{ item.name }}
                      <div v-if="item.key == 'OnlineTime'" class="exclamation">
                        <img
                          src="../images/icon_exclamation.png"
                          title="上线时间为工艺路线首工序的记录时间"
                        />
                      </div>
                      <div
                        v-if="item.key == 'LatestProcessingTime'"
                        class="exclamation"
                      >
                        <img
                          src="../images/icon_exclamation.png"
                          title="最新加工时间为产品最近加工时间"
                        />
                      </div>

                      <div class="sort-Btn-ul" v-if="item.key == 'FinishTime'">
                        <div
                          :class="
                            dataObj.sortType == 'up' &&
                            dataObj.sortKey == item.key
                              ? 'sort-up cur-up'
                              : 'sort-up'
                          "
                          @click="onSortChange('asc')"
                          :title="_t('升序：最低到最高')"
                        ></div>

                        <div
                          :class="
                            dataObj.sortType == 'down' &&
                            dataObj.sortKey == item.key
                              ? 'sort-down cur-down'
                              : 'sort-down'
                          "
                          @click="onSortChange('desc')"
                          :title="_t('降序：最高到最低')"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 虚拟body -->
                <div class="table-body">
                  <div
                    class="body-line"
                    v-for="(item, idx) in dataList"
                    :key="idx"
                  >
                    <div
                      :style="{
                        height: `${tableStyle.itemHeight}px`,
                        borderRight: '1px solid #e7e9ee',
                        width: `${currentScrollWidth()}px`,
                      }"
                    ></div>

                    <div
                      v-for="(item2, idx2) in CurTableShowTitle"
                      :class="`body-item ${item2.name}`"
                      :data-index="item2.rowIndex"
                      :data-key="item2.key"
                      :key="item2.key"
                      :style="{
                        height: `${tableStyle.itemHeight}px`,
                        lineHeight: `${tableStyle.itemHeight}px`,
                        // width: `${tableStyle.itemWidth}px`,
                        width: `${
                          tableStyleMap[item2.key]?.width ||
                          tableStyle.itemWidth
                        }px`,
                        color:
                          item2.key == 'IsQualified' &&
                          item[item2.key] != _t('OK')
                            ? 'red'
                            : '#333333',
                      }"
                      :title="item[item2.key]"
                    >
                      <!-- 用title不用el-tooltip，tooltip会导致渲染好慢 -->
                      {{ item[item2.key] }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pages-content">
            <MyPages
              :total="dataObj.totalCount"
              :curPage="dataObj.curPage"
              @req="(curPage: number, flag: any) => getTraceListFn(curPage)"
            ></MyPages>
          </div>
        </div>
      </div>
    </div>
    <DialogPreView
      v-model="showImageViewer"
      :picList="srcList"
      :chartOptions="chartOptions"
      :is-chart="isChart"
    />
    <ProcessParameterCurvePop
      :visible="dataObj.processParameterCurveShow"
      :productId="dataObj.ProductModel == 'noLimit' ? '' : dataObj.ProductModel"
      @callback="processParameterCurveCallback"
      :from="dataObj.From"
      :to="dataObj.To"
    />
    <ExportConfirmPop
      v-model:visible="dataObj.exportConfirmShow"
      :productId="dataObj.ProductModel == 'noLimit' ? '' : dataObj.ProductModel"
      :curProcessId="dataObj.curProcessId"
      :IsSummary="dataObj.isSummary"
      @callback="exportConfirmCallback"
      :from="dataObj.From"
      :to="dataObj.To"
      :codeType="dataObj.codeType"
      :ProductType="dataObj.ProductType"
      :ProductModelFilter="dataObj.ProductModelFilter"
      :isQualified="dataObj.isQualified"
      :MaterialCode="dataObj.MaterialCode"
      :OrderCode="dataObj.OrderCode"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  nextTick,
  onMounted,
  computed,
} from 'vue'
import { Language } from '@/libs/Language/Language'
import EditButton from '../components/editButton.vue'
import ProcessParameterCurvePop from '../dialogs/ProcessParameterCurvePop.vue'
import ExportConfirmPop from '../dialogs/ExportConfirmPop.vue'
// import vxeTable from 'vxe-table/es/vxe-table'
// import VC from 'vxe-table/es/vxe-column'
// import vxeColgroup from 'vxe-table/es/vxe-colgroup'
import IconButton from '@/components/IconButton/IconButton'
import { ElMessage } from 'element-plus'
import DialogPreView from '@/components/DialogPreView/DialogPreView'
import {
  getproductList,
  getTableheader,
  getTraceList,
  getTablelayout,
  getStatistics,
  saveSetting,
  getSetting,
} from '@/api/index'
import Radio from '@/components/Radio/Radio'
import { vEditionShow } from '@/libs/Permission/Permission'
import MyPages from '@/components/MyPages/index.vue'
import Text from '@/components/Text/Text'
import { _t } from '../app'
import { useDnd } from '../dnd'
import { throttle, set } from 'lodash'

export default defineComponent({
  name: 'TraceBack',
  directives: {
    editionShow: vEditionShow,
  },
  components: {
    EditButton,
    Text,
    ProcessParameterCurvePop,
    ExportConfirmPop,
    // vxeTable,
    // VC,
    // vxeColgroup,
    IconButton,
    Radio,
    DialogPreView,
  },
  props: {
    permissions: {
      type: Array<string>,
      require: true,
    },
  },
  setup(props) {
    const { local } = Language.useElementPlusI18n()
    const dataList = ref<any[]>([])
    const namespace = import.meta.env.VITE_APP_NAMESPACE
    const titleMoveDom = ref()
    let titleDomList: any = null

    const dataObj = reactive({
      curPage: 1,
      codeType: 1,
      processParameterCurveShow: false,
      exportConfirmShow: false,
      ProductModel: 'noLimit',
      ProductType: 0,
      showQualified: false,
      isQualified: '',
      From: '',
      To: '',
      totalCount: 0,
      curProcessId: '',
      isSummary: false,
      ProductModelFilter: '',
      MaterialCode: '',
      OrderCode: '',
      qualified: 0,
      qualifiedPercentage: '',
      total: 0,
      unQualified: 0,
      unQualifiedPercentage: '',
      fixedColumn: 0,
      fixedColumnTemp: 0,
      sortAsc: 0,
      sortType: 'normal',
      sortKey: '',
    })
    const { onMousedown, tableStyleMap } = useDnd(dataObj)

    const currentScrollWidth = () => {
      if (!titleDomList) {
        titleDomList = document.querySelectorAll('.td-scroll')
      }

      let sumWidth = 0
      titleDomList.forEach((dom: HTMLElement, index: number) => {
        const width = parseFloat(dom.style.width) || tableStyle.itemWidth
        const i = index + 1
        if (i <= tableStyle.scrollLeftNum) {
          sumWidth += width
        }
      })

      return sumWidth
    }

    const excessSpaceWidth = computed(() => {
      let sumWidth = 0
      let sumNum = 0
      let reduceValue = 0
      Object.entries(tableStyleMap.value).forEach(([key, obj]: any[]) => {
        if (!obj) return
        if (obj.width !== tableStyle.itemWidth) {
          sumWidth += obj.width
          if (obj.width < tableStyle.itemWidth) {
            reduceValue += tableStyle.itemWidth - obj.width
          }
          sumNum++
        }
      })
      sumNum = sumNum - Math.floor(reduceValue / tableStyle.itemWidth)
      return { sumWidth, sumNum }
    })
    const totalTitleList = computed(() => {
      if (tableHeader.value.length) {
        let temp = tableHeader.value
          .map((item: any) => {
            return item.childs && item.childs.length ? item.childs : [item]
          })
          .flat()
        return temp || []
      }
      return []
    })

    const sedTitleList = computed(() => {
      if (tableHeader.value.length) {
        let arr = tableHeader.value
          .filter((item: any) => item.childs && item.childs.length)
          .map((item: any) => item.childs)
          .reduce((a, b) => a.concat(b), [])
        return arr || []
      }
      return []
    })

    const productList = ref<any[]>([])
    const updateCurProduct = (val: any) => {
      dataObj.ProductModel = val
      getWorksectionListFn()
    }

    const onSortChange = (order: String) => {
      if (order == 'asc' && dataObj.sortAsc != 1) {
        dataObj.sortAsc = 1
        getTraceListFn(1, true)
      } else if (order == 'desc' && dataObj.sortAsc != 2) {
        dataObj.sortAsc = 2
        getTraceListFn(1)
      } else {
        dataObj.sortAsc = 0
        getTraceListFn(1)
      }
    }

    const getSettingFn = () => {
      return getSetting({
        namePrefix: 'SCMS.TraceManagement.TraceTableFreezingColumnSettings',
      }).then((res: any) => {
        let num = Number(JSON.parse(res.settings[0].value)) || 0
        let _num = num
        for (let i = 0; i < num; i++) {
          if (
            tableHeader.value[i].childs &&
            tableHeader.value[i].childs.length
          ) {
            ElMessage.warning(_t('冻结列数不能包含多级表头，请重新输入'))
            _num = 0
          }
        }
        dataObj.fixedColumn = _num
        dataObj.fixedColumnTemp = _num
      })
    }

    const getproductListFn = () => {
      return getproductList({ filter: '' }, false).then((res: any) => {
        productList.value = res.items.map((item: any) => ({
          value: item.id,
          name: item.model,
        }))
        productList.value.unshift({ value: 'noLimit', name: _t('不限') })
      })
    }

    const processParameterCurveCallback = (state: string, str?: string) => {
      dataObj.processParameterCurveShow = false

      if (state == 'confirm') {
      }
    }
    const getDate = (val: string | number) => {
      if (val) {
        let date = new Date(val)
        let month: any = date.getMonth() + 1
        month = month < 10 ? `0${month}` : month
        let day: any = date.getDate()
        day = day < 10 ? `0${day}` : day
        let hour: any = date.getHours()
        hour = hour < 10 ? `0${hour}` : hour
        let minute: any = date.getMinutes()
        minute = minute < 10 ? `0${minute}` : minute
        let second: any = date.getSeconds()
        second = second < 10 ? `0${second}` : second
        let str = `${date.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`
        return str
      }
      return ''
    }

    const worksectionShowList = ref<any[]>([]) //树级，展示用
    const worksectionList = ref<any[]>([]) //层级，操作数据用
    const getWorksectionListFn = () => {
      return getTableheader({
        productId:
          dataObj.ProductModel == 'noLimit' ? '' : dataObj.ProductModel,
      }).then((res: any) => {
        if (!res.flat?.length) {
          dataList.value = []
        }
        worksectionShowList.value = res.tree
        worksectionList.value = res.flat
        if (worksectionList.value.length) {
          if (
            worksectionList.value[0].childs &&
            worksectionList.value[0].childs.length
          ) {
            changeCurProcessId(worksectionList.value[0].childs[0])
          } else {
            changeCurProcessId(worksectionList.value[0])
          }
        } else {
          dataObj.curProcessId = ''
        }
      })
    }
    interface Tree {
      label: string
      children?: Tree[]
      headerId?: string
      isProductionLineSegment?: boolean
    }
    const defaultProps = {
      children: 'childs',
      label: 'header',
    }
    const handleNodeClick = (data: Tree) => {
      titleDomList = null
      tableStyleMap.value = {}
      if (!data.isProductionLineSegment && data.headerId) {
        changeCurProcessId(data)
      }
    }

    const srcList = ref<string[]>([])
    const chartOptions = ref<any>({})
    const isChart = ref(false)
    const showImageViewer = ref(false)
    const handleShowViewer = async (row: any, key: string) => {
      let url = ''
      chartOptions.value = {}
      srcList.value = []

      if (key.startsWith('SP') || key.startsWith('CP')) {
        isChart.value = false
        if (import.meta.env.MODE === 'development') {
          url = `${
            import.meta.env.VITE_API_URL
          }api/v1/huidingtuopushuibeng/shared/file?productModel=${
            row.SerialNumber
          }&fileUrl=${row[key]}`
        } else {
          url = `/api/v1/huidingtuopushuibeng/shared/file?productModel=${row.SerialNumber}&fileUrl=${row[key]}`
        }
        srcList.value.push(url)
      } else {
        try {
          isChart.value = true
          const { x, y } = JSON.parse(row[key])
          chartOptions.value = {
            xAxis: {
              type: 'category',
              data: x,
            },
            grid: {
              left: 35,
              bottom: 35,
              top: 10,
            },
            yAxis: {
              type: 'value',
            },
            series: [
              {
                data: y,
                type: 'line',
              },
            ],
          }
        } catch (e: any) {
          ElMessage.warning(_t('数据有误'))
        }
      }

      showImageViewer.value = true
    }

    const findWorksection = (_item: any) => {
      let _obj = worksectionList.value.find(
        (item: any) => item.headerId == _item.headerId
      )
      return _obj || {}
    }
    const changeCurProcessId = (item: any) => {
      dataObj.curProcessId = item.headerId
      dataObj.isSummary = item.isSummary
      queryReportData()
    }
    const fixChange = () => {
      if (!/^\d+$/.test(String(dataObj.fixedColumnTemp))) {
        ElMessage.warning(_t('请输入自然数！'))
        dataObj.fixedColumnTemp = 0
        return
      }
      if (Number(dataObj.fixedColumnTemp) > tableHeader.value.length) {
        ElMessage.warning(_t('输入数量大于参数数量，请重新输入'))
        dataObj.fixedColumnTemp = 0
        return
      }

      for (let i = 0; i < Number(dataObj.fixedColumnTemp); i++) {
        if (tableHeader.value[i].childs && tableHeader.value[i].childs.length) {
          ElMessage.warning(_t('冻结列数不能包含多级表头，请重新输入'))
          dataObj.fixedColumn = 0
          // dataObj.fixedColumnTemp = 0
        }
      }

      saveSetting(
        {
          settings: [
            {
              name: `SCMS.TraceManagement.TraceTableFreezingColumnSettings`,
              value: String(dataObj.fixedColumnTemp),
            },
          ],
        },
        `SCMS.TraceManagement.TraceTableFreezingColumnSettings`
      ).then(() => {
        dataObj.fixedColumn = dataObj.fixedColumnTemp
      })
    }
    const searchOne = () => {
      dataObj.ProductType = 1
      queryReportData()
    }
    const tableHeader = ref<any[]>([])
    const queryReportData = () => {
      if (!dataObj.curProcessId) {
        return
      }
      // if()
      const from = new Date(dataObj.From).getTime()
      const to = new Date(dataObj.To).getTime()
      if (to < from) {
        return ElMessage.warning(_t('结束时间不能小于开始时间'))
      }
      tableHeader.value = []
      dataList.value = []
      clearScroll()
      getTablelayout({
        productId:
          dataObj.ProductModel == 'noLimit' ? '' : dataObj.ProductModel,
        tableId: dataObj.curProcessId,
        isSummary: worksectionList.value.find(
          (item: any) => dataObj.curProcessId == item.headerId
        )?.isSummary,
      }).then((res: any) => {
        const columns = res.columns || []
        // set(tableStyleMap.value, `${key}.width`, moveWidth)
        const widthstyleMap = {}
        columns.forEach((column: any) => {
          let width = column.width || 200
          if (width < 50) {
            width = 50
          } else if (width > 2000) {
            width = 2000
          }
          set(widthstyleMap, `${column.key}.width`, width)
        })
        tableStyleMap.value = widthstyleMap
        tableHeader.value = res.trees || []
        getSettingFn()
        dataObj.showQualified =
          dataObj.ProductType == 1 && dataObj.ProductModelFilter ? true : false
        let ProductModel = ''
        if (dataObj.ProductModel && dataObj.ProductModel != 'noLimit') {
          ProductModel = productList.value.find(
            (item: any) => item.value == dataObj.ProductModel
          ).name
        }

        getTraceListFn(1)
        getStatistics({
          ProductModel: ProductModel,
          SerialNumber: dataObj.codeType == 1 ? dataObj.ProductModelFilter : '',
          Updatecode: dataObj.codeType == 2 ? dataObj.ProductModelFilter : '',
          MaterialCode: dataObj.MaterialCode,
          OrderCode: dataObj.OrderCode,
          SearchMode: dataObj.ProductType,
          From: getDate(dataObj.From),
          To: getDate(dataObj.To),
          IsQualified: dataObj.isQualified,
          TableId: dataObj.curProcessId,
          IsSummary: worksectionList.value.find(
            (item: any) => dataObj.curProcessId == item.headerId
          )?.isSummary,
        }).then((res2: any) => {
          dataObj.qualified = res2.qualified
          dataObj.qualifiedPercentage = res2.qualifiedPercentage
          dataObj.total = res2.total
          dataObj.unQualified = res2.unQualified
          dataObj.unQualifiedPercentage = res2.unQualifiedPercentage
          if (
            worksectionList.value.find(
              (item: any) => dataObj.curProcessId == item.headerId
            )?.isSummary
          ) {
            dataObj.totalCount = res2.total
          }
        })
      })
    }

    const getTraceListFn = (pageindex: number, isAsc?: boolean) => {
      let ProductModel = ''
      if (dataObj.ProductModel && dataObj.ProductModel != 'noLimit') {
        ProductModel = productList.value.find(
          (item: any) => item.value == dataObj.ProductModel
        ).name
      }
      getTraceList({
        ProductModel: ProductModel,
        SerialNumber: dataObj.codeType == 1 ? dataObj.ProductModelFilter : '',
        Updatecode: dataObj.codeType == 2 ? dataObj.ProductModelFilter : '',
        MaterialCode: dataObj.MaterialCode,
        OrderCode: dataObj.OrderCode,
        SearchMode: dataObj.ProductType,
        From: getDate(dataObj.From),
        To: getDate(dataObj.To),
        IsQualified: dataObj.isQualified,
        TableId: dataObj.curProcessId,
        IsSummary: worksectionList.value.find(
          (item: any) => dataObj.curProcessId == item.headerId
        )?.isSummary,
        SkipCount: 50 * (Number(pageindex) - 1),
        MaxResultCount: 50,
        IsAsc: isAsc,
      }).then((res2: any) => {
        dataList.value = res2.items || []

        dataObj.curPage = pageindex
        if (
          !worksectionList.value.find(
            (item: any) => dataObj.curProcessId == item.headerId
          )?.isSummary
        ) {
          dataObj.totalCount = res2.totalCount
        }
        if (res2.traceWorkSectionInfos && res2.traceWorkSectionInfos.length) {
          worksectionList.value.forEach((item: any) => {
            if (
              res2.traceWorkSectionInfos.some(
                (item2: any) => item2.workSectionId == item.headerId
              )
            ) {
              item.isQualified = res2.traceWorkSectionInfos.find(
                (item2: any) => item2.workSectionId == item.headerId
              ).isQualified
            }
          })
        }
      })
    }

    const exportConfirmCallback = (state: string, str?: string) => {
      dataObj.exportConfirmShow = false
    }

    const cureData = () => {
      dataObj.processParameterCurveShow = true
    }
    const exportData = () => {
      dataObj.exportConfirmShow = true
    }

    const mytable = ref<any>()
    onMounted(async () => {
      dataObj.From = getDate(
        new Date(new Date().toLocaleDateString()).getTime()
      )
      dataObj.To = getDate(
        new Date(new Date().toLocaleDateString()).getTime() +
          24 * 60 * 60 * 1000 -
          1
      )
      await getproductListFn()
      await getWorksectionListFn()
    })

    Language.useChange(async (lang: typeof Language) => {
      await getproductListFn()
      await getWorksectionListFn()
    })

    const contentFlex = ref()
    const tableStyle = reactive({
      itemTitleHeight: 30, //标题行高（多级表头2倍）
      itemHeight: 30, //表格内容行高
      itemWidth: 200, //表格内容宽度
      scrollLeftNum: 0, //滚动左侧滚过去的个数，补位用
      scrollRightNum: 0, //滚动右侧隐藏个数，因为表头没做虚拟滚动，表头把内容撑开了，右侧暂时不用补位
      showNum: 30, //实际一行dom个数
      limitShowNum: 200, //少于此列数不虚拟滚动
    })

    const multTitle = computed(() =>
      tableHeader.value && tableHeader.value.length
        ? tableHeader.value.some(
            (item: any) => item.childs && item.childs.length
          )
        : false
    )

    const clearScroll = () => {
      tableStyle.scrollLeftNum = 0
      tableStyle.scrollRightNum =
        totalTitleList.value.length -
        tableStyle.showNum -
        tableStyle.scrollLeftNum
      contentFlex.value.scrollLeft = 0
    }

    const scrollFn = throttle((e) => {
      if (totalTitleList.value.length < tableStyle.limitShowNum) {
        return
      }
      let scrollLeft = e.target.scrollLeft
      const { sumWidth, sumNum } = excessSpaceWidth.value
      const numb =
        Math.floor((scrollLeft - sumWidth) / tableStyle.itemWidth) + sumNum
      tableStyle.scrollLeftNum = numb < 0 ? 0 : numb
      tableStyle.scrollRightNum =
        totalTitleList.value.length -
        tableStyle.showNum -
        tableStyle.scrollLeftNum
    }, 100)

    const CurTableShowTitle = computed(() => {
      if (!tableHeader.value.length) {
        return []
      }
      let totalTitleList = tableHeader.value
        .map((item: any) => {
          const list = item.childs && item.childs.length ? item.childs : [item]

          return list
        })
        .flat()
        .map((item, index) => {
          return {
            ...item,
            rowIndex: index,
          }
        })

      if (totalTitleList.length < tableStyle.limitShowNum) {
        return totalTitleList.slice(dataObj.fixedColumn, totalTitleList.length)
      }
      let _list = totalTitleList
        .slice(dataObj.fixedColumn, totalTitleList.length)
        .slice(
          tableStyle.scrollLeftNum,
          tableStyle.scrollLeftNum + tableStyle.showNum
        )
      return _list
    })

    return {
      _t,
      local,
      dataObj,
      dataList,
      productList,
      worksectionShowList,
      worksectionList,
      defaultProps,
      tableHeader,
      mytable,
      tableStyleMap,
      namespace,
      titleMoveDom,
      Language,
      showImageViewer,
      srcList,
      totalTitleList,
      sedTitleList,
      chartOptions,
      isChart,
      multTitle,
      tableStyle,
      CurTableShowTitle,
      contentFlex,
      excessSpaceWidth,
      scrollFn,
      // currentSpaceWidth,
      currentScrollWidth,
      updateCurProduct,
      getSettingFn,
      getproductListFn,
      getWorksectionListFn,
      processParameterCurveCallback,
      exportConfirmCallback,
      handleNodeClick,
      findWorksection,
      changeCurProcessId,
      queryReportData,
      getTraceListFn,
      fixChange,
      searchOne,
      cureData,
      exportData,
      clearScroll,
      onSortChange,
      handleShowViewer,
      onMousedown,
    }
  },
})
</script>

<style lang="scss">
@import url(@/assets/styles/common.scss);
</style>

<style lang="scss">
.TraceManagement {
  .cs-input__inner {
    color: #787878 !important;
  }
}

:deep(.cs-input) {
  height: 28px;

  .cs-input__inner {
    border-radius: 2px;
    background-color: #fff !important;
    background: #fff !important;
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
    background-color: #fff !important;
    padding-right: 0 !important;
  }
}

:deep(.light-datetime-picker) {
  .cs-input__inner {
    padding: 0 0 0 30px !important;
  }
}

.TraceBack {
  .cs-select .cs-input .cs-select__caret {
    transform: rotate(0deg) !important;
  }

  .cs-select .cs-input .cs-select__caret.is-reverse {
    transform: rotate(180deg) !important;
  }

  .caret-up {
    //这段线上有用，线上原本的排序会出不来，本地测试会有重影
    content: '';
    width: 0;
    height: 0;
    border: 8px solid;
    border-color: #635d5d;
    border-top: 5px solid transparent !important;
    border-right: 8px solid transparent !important;
    border-left: 8px solid transparent !important;
    cursor: pointer;
  }

  .caret-down {
    margin-top: 5px;
    content: '';
    width: 0;
    height: 0;
    border: 8px solid;
    border-color: #635d5d;
    border-bottom: 5px solid transparent !important;
    border-right: 8px solid transparent !important;
    border-left: 8px solid transparent !important;
    cursor: pointer;
  }

  .sort--active {
    border-color: #409eff;
  }

  .vxe-table .vxe-sort--asc-btn {
    top: -0.4em;
  }

  .vxe-table .vxe-sort--desc-btn {
    bottom: -0.4em;
  }
}
</style>

<style lang="scss" scoped>
:deep(.vxe-table) {
  height: 100%;
}

.TraceBack {
  width: 100%;
  height: 100%;
  .ellipsis {
    width: 64px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    margin-left: 8px;
  }
  .TraceBack-content {
    width: 100%;
    height: 100%;
    // padding: 0 22px;
    box-sizing: border-box;

    .TraceBack-body {
      display: flex;
      width: 100%;
      height: 100%;
      background: #ffffff;
      border: 1px solid #dbdbdb;

      .TraceBack-left {
        width: 205px;
        height: 100%;
        box-sizing: border-box;
        border-right: 1px solid #dbdbdb;

        .prodType-filter {
          width: 100%;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;

          .form-key {
            margin-right: 10px;
          }
          .ellipsis {
            width: 64px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .form-value {
            width: 100px;
          }
        }

        .TraceBack-list {
          width: 100%;
          height: calc(100% - 50px);
          padding: 14px 10px 0;
          box-sizing: border-box;
          overflow-y: auto;

          :deep(.cs-tree-node__content:hover) {
            background-color: #eef2fd;
          }

          :deep(
              .cs-tree--highlight-current
                .cs-tree-node.is-current
                > .cs-tree-node__content
            ) {
            background-color: #eef2fd;
            color: #5a84ff;
          }

          .TraceBack-list-item {
            width: 100%;
            height: 56px;
            padding: 12px;
            box-sizing: border-box;
            border-radius: 4px;
            color: #666666;
            background-color: #e3ecfb;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            cursor: pointer;
            background-image: url('../images/process.png');
            background-size: 97px 45px;
            background-repeat: no-repeat;
            background-position: bottom right;
          }

          .cur-item {
            position: relative;
          }

          .item-true {
            color: #fff;
            background-color: #32cd83;
          }

          .item-false {
            color: #fff;
            background-color: #f84949;
          }

          .item-true2 {
            color: #32cd83;
          }

          .item-false2 {
            color: #f84949;
          }

          .item-tooltip {
            width: fit-content;
            max-width: 160px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .cur-item::before {
            content: '';
            position: absolute;
            left: -6px;
            top: 50%;
            transform: translate(-100%, -50%);
            width: 12px;
            height: 12px;
            border-radius: 6px;
            background: #326cf3;
            border: 2px solid #d9e5ff;
            box-sizing: border-box;
          }
        }
      }

      .TraceBack-right {
        width: calc(100% - 205px);
        height: 100%;
        // overflow-y: auto;

        .TraceBack-searchBar {
          width: 100%;
          height: 50px;
          display: flex;
          align-items: center;
          background: #ececec;
          justify-content: flex-start;

          .searchBar-left {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-right: 10px;
          }

          .searchBar-right {
            display: flex;
            align-items: end;
            justify-content: flex-start;
            width: 200px;
          }

          .form-key {
            margin: 0 5px;
            word-break: keep-all;
          }

          .form-val {
            margin-right: 30px;
          }

          .red {
            color: #ff2929;
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
        }

        .table-searchBar {
          width: 100%;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #35363b;
          padding: 0 20px;
          box-sizing: border-box;

          .bar-left {
            display: flex;
            align-items: center;
            justify-content: flex-start;
          }

          .bar-right {
            width: fit-content;
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }

          .form-key {
            margin: 0 5px;
            word-break: keep-all;
            color: #000;
          }

          .form-val {
            margin-right: 30px;
          }

          .red {
            color: #ff2929;
          }
        }
        .table-content-padding {
          width: 100%;
          height: calc(100% - 165px);
          padding: 0 20px;
          box-sizing: border-box;

          .table-contentFlex {
            border: 1px solid #eef2fd;
            width: 100%;
            height: 100%;
            display: flex;
            overflow: auto;
            position: relative;
            transform: translate3d(0, 0, 0);
            .table-title {
              position: sticky;
              top: 0%;
              z-index: 2;
              background-color: #dbdfe7;
              color: #35363b;
              display: flex;
              width: fit-content;
              .title {
                display: flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                position: relative;
                &:hover {
                  // display: block;
                  .title-move {
                    display: block;
                  }
                }
                .title-move {
                  width: 2px;
                  height: 100%;
                  position: absolute;
                  left: 198px;
                  top: 0;
                  cursor: col-resize;
                  z-index: 1;
                  display: none;

                  &:hover {
                    background-color: #5a84ff;
                  }
                  // display: none;
                }
                .title-item,
                .title-item-single {
                  width: fit-content;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  box-sizing: border-box;
                  border-right: 1px solid #eef2fd;
                  width: 200px;
                  .title-half-up,
                  .title-half {
                    width: fit-content;
                    height: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-sizing: border-box;
                    .project-title {
                      height: 100%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      box-sizing: border-box;
                      border-top: 1px solid #eef2fd;
                      border-right: 1px solid #eef2fd;
                      box-sizing: border-box;
                      width: 200px;
                      position: relative;
                    }
                    .project-title:last-child {
                      border-right: none;
                    }
                  }
                  .title-half-up {
                    width: 100%;
                  }
                }
                .title-item-single {
                  width: 200px;
                  flex-direction: row;
                }
                .title-child-item {
                  width: fit-content;
                  // border-right: 1px solid #eef2fd;
                  border-right: none;
                  position: relative;
                  .title-right-border {
                    width: 1px;
                    height: 100%;
                    position: absolute;
                    right: 0;
                    top: 0;
                    background-color: #eef2fd;
                  }
                }
              }
            }
            .table-body {
              width: fit-content;
              height: auto;
              background-color: #fff;

              .body-line {
                width: fit-content;
                height: auto;
                display: flex;
                box-sizing: border-box;
                border-bottom: 1px solid #e7e9ee;
                .body-item {
                  border-right: 1px solid #e7e9ee;
                  box-sizing: border-box;
                  text-align: center;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  font-size: 14px;
                  padding: 0 5px;
                  width: 200px;
                }
              }
            }
            .table-contentFixed {
              // width行内计算
              height: fit-content;
              position: sticky;
              left: 0;
              z-index: 3;
              .table-title {
                z-index: 4;
              }
            }
            .table-contentScroll {
              width: fit-content;
              height: fit-content;
              //不能加position
            }
          }
        }
        .table-content {
          width: 100%;
          height: calc(100% - 165px);
          padding: 0 20px;
          box-sizing: border-box;

          .table-box {
            width: 100%;
            height: 100%;
            overflow: auto;
            position: relative;
            // transform: translate3d(0, 0, 0);
          }
          table {
            height: auto;
            width: fit-content;
            table-layout: fixed;
            display: inline-block;

            thead {
              height: 30px;
              color: #606266;
              position: sticky;
              top: 0;
              z-index: 5;
            }

            tr {
              th {
                z-index: 5;
                background-color: #dbdfe7;
                font-weight: bold;
                color: #35363b;
                font-size: 15px;
              }

              td {
                background-color: #fff;
                color: #333333;
                font-weight: normal;
                font-size: 14px;
              }

              th,
              td {
                width: fit-content;
                min-width: 200px;
                min-height: 30px;
                padding: 10px 15px;
                border: 0.5px solid #e4e7ed;
                word-break: break-all;
                text-align: left;
                position: sticky;
              }
            }
          }
        }

        .pages-content {
          width: 100%;
          height: 60px;
        }
      }
    }
  }

  .exclamation {
    display: inline-block;
    vertical-align: middle;
    margin-left: 5px;

    img {
      width: 14px;
      height: 14px;
      cursor: pointer;
    }
  }
  .sort-Btn-ul {
    display: inline-block;
    vertical-align: middle;
    margin-left: 15px;

    .sort-up {
      width: 0;
      height: 0;
      border: 8px solid #808080;
      border-top: none;
      border-right: 8px solid transparent;
      border-left: 8px solid transparent;
      margin-bottom: 3px;
      cursor: pointer;
    }

    .sort-down {
      width: 0;
      height: 0;
      border: 8px solid #808080;
      border-bottom: none;
      border-right: 8px solid transparent;
      border-left: 8px solid transparent;
      cursor: pointer;
    }

    .cur-up {
      border: 8px solid skyblue;
      border-top: none;
      border-right: 8px solid transparent;
      border-left: 8px solid transparent;
    }

    .cur-down {
      border: 8px solid skyblue;
      border-bottom: none;
      border-right: 8px solid transparent;
      border-left: 8px solid transparent;
    }
  }
}

.light-element-ui {
  & > :deep(.cs-input__wrapper) {
    width: 100%;
  }
}
.preview-icon {
  width: 18px;
  cursor: pointer;
}
</style>
