<!-- 修改色系 -->
<template>
  <BaseDialog
    v-model="$props.visible"
    width="800px"
    top="18vh"
    :title="`${_t('适用型号')}`"
    :show-close="false"
    :append-to-body="true"
    destroy-on-close
    @close="submit('close')"
    @confirm="submit('confirm')"
  >
    <div class="ApplicableModel-content">
      <div class="ApplicableModel-search">
        <label class="form-key">{{ _t('产品型号') }}：</label>
        <el-input
          style="width: 100px; margin-right: 16px"
          v-model="productFilter"
        />

        <el-button
          size="small"
          type="primary"
          class="search-btn"
          @click="getproductListFn"
          >{{ _t('查询') }}</el-button
        >
      </div>
      <div class="ApplicableModel-table">
        <BaseTable
          v-model:dataSource="productList"
          height="100%"
          :LanguageScopeKey="LanguageScopeKey"
          :is-hide-pagination="true"
          :is-checked="true"
          :is-seq="true"
          :columns="[
            {
              title: '序号',
              field: 'seq',
              type: 'seq',
            },
            {
              title: '产品名称',
              field: 'name',
            },
            {
              title: '产品型号',
              field: 'model',
            },
            {
              title: '备注',
              field: 'remark',
            },
          ]"
          @check="selectFn1"
          empty-text="暂无数据"
        />
      </div>
    </div>
  </BaseDialog>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent, reactive, watch } from 'vue'
import sdk from 'sdk'
import { ElMessage } from 'element-plus'
import EditButton from '../components/editButton.vue'
import BaseDialog from '../../../components/BaseDialog/index.vue'
import BaseTable from '@/components/Table/Table'
import { _t, LanguageScopeKey } from '../app'
import { getproductList } from '@/api/index'

export default defineComponent({
  name: 'EditSummaryTablePop',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    BaseDialog,
    EditButton,
    BaseTable,
  },
  emits: ['callback'],
  setup(props, { emit }) {
    const productFilter = ref<string>('')
    const productList = ref<any[]>([])
    const getproductListFn = () => {
      return getproductList({ filter: productFilter.value }).then(
        (res: any) => {
          productList.value = res.items
        }
      )
    }

    const seleList = ref<any[]>([])
    const selectFn1 = (arr: Object[]) => {
      seleList.value = arr
    }

    const tableRowClassName = ({ row, rowIndex }: any) => {
      row.index = rowIndex
    }

    const submit = (state: 'close' | 'confirm') => {
      if (state == 'confirm') {
        if (productList.value.length && !seleList.value.length) {
          ElMessage.warning(_t('请勾选复选框！'))
          return
        }
        emit('callback', state, seleList.value)
      } else {
        emit('callback', state)
      }
    }

    watch(
      () => props.visible,
      async (val) => {
        if (!val) {
          return
        }
        productFilter.value = ''
        await getproductListFn()
      },
      {
        deep: true,
      }
    )

    // onMounted(() => {
    //   productFilter.value = ''
    //   getproductListFn()
    // })

    return {
      _t,
      submit,
      LanguageScopeKey,
      productList,
      productFilter,
      getproductListFn,
      seleList,
      selectFn1,
      tableRowClassName,
    }
  },
})
</script>

<style lang="scss">
.ApplicableModelEdit-el-dialog {
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

.ApplicableModel-content {
  padding: 10px 10px;
  box-sizing: border-box;

  .ApplicableModel-search {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 10px;
    .form-key {
      margin: 0 5px;
    }

    .search-btn {
      padding: 0 16px;
      height: 26px;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 10px;
      word-break: keep-all;
      cursor: pointer;
    }
  }

  .ApplicableModel-table {
    width: 100%;
    margin-bottom: 16px;
    height: 300px;
  }
}

.ApplicableModel-footer {
  display: flex;
  justify-content: flex-end;
  padding: 0 20px 16px;
  box-sizing: border-box;
}
</style>
