<!-- 修改色系 -->

<template>
  <BaseDialog
    v-model="visible"
    width="680px"
    top="18vh"
    :title="`${_t('导出确认')}`"
    class="ExportConfirmEdit-el-dialog"
    @close="submit('close')"
    @confirm="submit('confirm')"
  >
    <div class="ExportConfirm-content">
      <div class="ExportConfirm-search">
        <div>{{ _t('导出时间范围') }}：</div>
        <el-date-picker
          type="datetime"
          style="width: 230px"
          format="YYYY-MM-DD HH:mm:ss"
          v-model="dataObj.From"
          popper-class="light-datetime-picker"
          class="light-datetime-picker"
        >
        </el-date-picker>
        <div class="search-key">-</div>
        <el-date-picker
          type="datetime"
          style="width: 230px"
          format="YYYY-MM-DD HH:mm:ss"
          v-model="dataObj.To"
          popper-class="light-datetime-picker"
          class="light-datetime-picker"
        ></el-date-picker>
      </div>
      <div class="ExportConfirm-search">
        <el-select
          style="width: 100px; margin-right: 10px"
          v-model="dataObj.codeType"
        >
          <el-option :label="_t('产品ID')" :value="1"></el-option>
          <el-option :label="_t('更新码')" :value="2"></el-option>
          <!-- <el-option :label="_t('物料条码')" :value="3"></el-option> -->
        </el-select>
        <el-select style="width: 120px" v-model="dataObj.ProductType">
          <el-option :label="_t('模糊查询')" :value="0"></el-option>
          <el-option :label="_t('精确查询')" :value="1"></el-option>
        </el-select>
        <el-input
          style="width: 180px; margin: 0 10px"
          v-model="dataObj.ProductModelFilter"
        />
      </div>
      <div class="ExportConfirm-search">
        <div>{{ _t('是否合格') }}：</div>
        <el-select
          :style="{ width: '120px', marginRight: '10px' }"
          v-model="dataObj.isQualified"
        >
          <el-option :label="_t('全部')" value=""></el-option>
          <el-option :label="_t('OK')" :value="true"></el-option>
          <el-option :label="_t('NG')" :value="false"></el-option>
        </el-select>
        <div>{{ _t('物料识别码') }}：</div>
        <el-input
          style="width: 180px; margin: 0 10px"
          v-model="dataObj.MaterialCode"
        />
        <div>{{ _t('工单号') }}：</div>
        <el-input
          style="width: 180px; margin: 0 10px"
          v-model="dataObj.OrderCode"
        />
      </div>
    </div>
  </BaseDialog>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent, reactive, watch, computed } from 'vue'
import EditButton from '../components/editButton.vue'
import BaseDialog from '@/components/BaseDialog/index.vue'
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer'
import { Language } from '@/libs/Language/Language'
import { getproductList, exportTrace } from '@/api/index'
import { _t, LanguageScopeKey } from '../app'

export default defineComponent({
  name: 'EditSummaryTablePop',
  props: {
    visible: {
      type: Boolean,
      required: false,
    },
    productId: {
      type: String,
      required: true,
    },
    curProcessId: {
      type: String,
      required: true,
    },
    IsSummary: {
      type: Boolean,
      required: true,
    },
    from: {
      type: String,
      required: false,
    },
    to: {
      type: String,
      required: false,
    },
    codeType: {
      type: Number,
      required: false,
    },
    ProductType: {
      type: Number,
      required: false,
    },
    ProductModelFilter: {
      type: String,
      required: false,
    },
    isQualified: {
      required: false,
    },
    MaterialCode: {
      type: String,
      required: false,
    },
    OrderCode: {
      type: String,
      required: false,
    },
  },
  components: {
    BaseDialog,
    EditButton,
    BaseDrawer,
  },
  emits: ['update:visible', 'callback'],
  setup(props, { emit }) {
    const visible = computed({
      get() {
        return props.visible
      },
      set(val) {
        emit('update:visible', val)
      },
    })
    const { local } = Language.useElementPlusI18n()
    const dataObj: any = reactive({
      codeType: 1,
      ProductModel: '',
      ProductType: 0,
      isQualified: '',
      From: '',
      To: '',
      ProductModelFilter: '',
      MaterialCode: '',
      OrderCode: '',
    })

    const downloadFile = (file: any, fileName: string) => {
      const blob = new Blob([file])
      // 兼容不同浏览器的URL对象
      const url: any = window.URL || window.webkitURL
      // 创建下载链接
      const downloadHref = url.createObjectURL(blob)
      // 创建a标签并为其添加属性
      let downloadLink = document.createElement('a')
      downloadLink.href = downloadHref
      downloadLink.download = fileName
      // 触发点击事件执行下载
      downloadLink.click()
      window.URL.revokeObjectURL(url)
    }
    const productList = ref<any[]>([])
    const getproductListFn = () => {
      return getproductList({ filter: '' }).then((res: any) => {
        productList.value = res.items.map((item: any) => ({
          value: item.id,
          name: item.model,
        }))
        productList.value.unshift({ value: '不限', name: '不限' })
      })
    }
    const submit = (state: 'close' | 'confirm') => {
      visible.value = false
      if (state == 'confirm') {
        let ProductModel = ''
        if (props.productId && props.productId != '不限') {
          //&& props.productId != '不限'这半边条件没有用，全部的进来应该已经是空字符了
          ProductModel = productList.value.find(
            (item: any) => item.value == props.productId
          ).name
        }

        exportTrace({
          productId: props.productId,
          ProductModel: ProductModel,
          SerialNumber: dataObj.codeType == 1 ? dataObj.ProductModelFilter : '',
          Updatecode: dataObj.codeType == 2 ? dataObj.ProductModelFilter : '',
          // MaterialCode: dataObj.codeType == 3 ? dataObj.ProductModelFilter : '',
          MaterialCode: dataObj.MaterialCode,
          OrderCode: dataObj.OrderCode,
          SearchMode: dataObj.ProductType,
          From: getDate(dataObj.From),
          To: getDate(dataObj.To),
          IsQualified: dataObj.isQualified,
          TableId: props.curProcessId,
          IsSummary: props.IsSummary,
          OnlyLatest: '',
          IsAsc: '',
        }).then((res: any) => {
          downloadFile(res, '追溯报表.xlsx')
          emit('callback', state)
        })
      } else {
        emit('callback', state)
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

    watch(
      () => props.visible,
      async (val) => {
        if (!val) {
          return
        }
        getproductListFn()
        if (props.from) {
          dataObj.From = props.from
        } else {
          dataObj.From = getDate(
            new Date(new Date().toLocaleDateString()).getTime() -
              24 * 60 * 60 * 1000 * 7
          )
        }

        if (props.to) {
          dataObj.To = props.to
        } else {
          dataObj.To = getDate(
            new Date(new Date().toLocaleDateString()).getTime() +
              24 * 60 * 60 * 1000 -
              1
          )
        }
        dataObj.codeType = props.codeType || 1
        dataObj.ProductType = props.ProductType || 0
        dataObj.isQualified = props.isQualified
        dataObj.ProductModelFilter = props.ProductModelFilter || ''
        dataObj.MaterialCode = props.MaterialCode || ''
        dataObj.OrderCode = props.OrderCode || ''
      },
      {
        deep: true,
      }
    )

    return {
      local,
      LanguageScopeKey,
      _t,
      getDate,
      submit,
      dataObj,
      downloadFile,
      props,
    }
  },
})
</script>

<style lang="scss">
.ExportConfirmEdit-el-dialog {
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

:deep(.light-datetime-picker) {
  .cs-input__inner {
    padding: 0 0 0 30px !important;
  }
}

.ExportConfirmEdit-el-dialog {
  .ExportConfirm-content {
    padding: 0 16px;
    box-sizing: border-box;

    .ExportConfirm-search {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      div {
        word-break: keep-all;
        width: fit-content;
      }
    }
  }

  .ExportConfirm-footer {
    display: flex;
    justify-content: flex-end;
    padding: 0 20px 16px;
    box-sizing: border-box;
  }
}
</style>
