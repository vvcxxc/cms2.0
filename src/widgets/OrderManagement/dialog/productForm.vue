<template>
  <div class="dialog-container">
    <BaseDrawer
      v-model="dialogVisible"
      :title="title"
      width="689px"
      @close="onClose"
      @confirm="onConfirm"
      :before-close="beforeClose"
    >
      <div class="dialog-content">
        <HeadTitle :title="'基础信息'" />
        <div
          class="customFormItem-container"
          v-for="item in form"
          :key="item.prop"
        >
          <CustomFormItem
            v-model="item.value"
            :label="item.label"
            :component-name="item.componentName"
            label-width="120px"
            source="productForm"
            inputWidth="480px"
            v-bind="{ ...item.attrProps }"
            @change="onChange($event, item)"
          >
            <template v-if="item.componentName === 'el-select'">
              <el-option
                v-for="o in item.nodeOptions"
                :key="o.id"
                :label="o.model"
                :value="o.id"
              />
            </template>
          </CustomFormItem>
        </div>
      </div>
      <!-- 
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="dialogVisible = false"
            class="baseCss"
            style="background: #efeded"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            @click="onConfirm"
            class="baseCss"
            style="background: #5a84ff"
          >
            确定
          </el-button>
        </span>
      </template> -->
    </BaseDrawer>
  </div>
</template>

<script lang="ts">
import {
  PropType,
  defineComponent,
  computed,
  ref,
  provide,
  reactive,
} from 'vue'
import { useVModel } from '@vueuse/core'
import api from '../api/product-setting'
import type { IProductParamsRequest } from '../api/product'
import { get, head, set } from 'lodash'
import { ElMessage } from 'element-plus'
import { DIALOG_STATUS, DIALOG_STATUS_OPTIONS } from '../enum'
import CustomFormItem from '../components/customFormItem/index.vue'
import HeadTitle from '../components/head-title/index.vue'
import Dialog from '../../../components/Dialog/index.vue'
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'

export default defineComponent({
  name: 'ProductFormDialog',
  components: { Dialog, CustomFormItem, HeadTitle, BaseDrawer },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: DIALOG_STATUS.ADD,
    },
    dialogConfig: {
      type: Object as PropType<IProductParamsRequest>,
    },
  },

  setup(props, ctx) {
    const dialogVisible = useVModel(props)
    const dialogTableVisible = ref(false)
    const isEdit = computed(() => props.status === DIALOG_STATUS.EDIT)
    const title = computed(
      () =>
        DIALOG_STATUS_OPTIONS.find((item) => item.value === props.status)?.label
    )

    const form = reactive([
      {
        label: '工单号:',
        prop: 'code',
        value: '',
        attrProps: { placeholder: '请输入', disabled: isEdit.value },
        componentName: 'el-input',
      },
      {
        label: '产品型号:',
        prop: 'productId',
        value: '',
        attrProps: { placeholder: '请输入', disabled: isEdit.value },
        nodeOptions: [] as { id: string; model: string }[],
        componentName: 'el-select',
      },
      {
        label: '工艺配方:',
        prop: 'formulaId',
        value: '',
        attrProps: { placeholder: '请输入', disabled: true },
        nodeOptions: [] as { id: string; model: string }[],
        componentName: 'el-select',
      },
      {
        label: '计划数量:',
        prop: 'planQty',
        value: '',
        attrProps: {
          placeholder: '请输入',
          maxlength: '15',
          'show-word-limit': true,
        },
        componentName: 'el-input',

        formatter: (value: string) => {
          return Number(value)
        },
      },
      {
        label: '计划开始时间:',
        prop: 'planStartTime',
        value: '',
        attrProps: {
          placeholder: '请输入',
          type: 'datetime',
          valueFormat: 'YYYY-MM-DD HH:mm',
        },
        componentName: 'el-date-picker',
      },
      {
        label: '计划结束时间:',
        prop: 'planFinishTime',
        value: '',
        attrProps: {
          placeholder: '请输入',
          type: 'datetime',
          valueFormat: 'YYYY-MM-DD HH:mm',
        },
        componentName: 'el-date-picker',
      },
    ])
    const prodList = ref([])
    const formList = ref([])
    const onChange = async (value: unknown, item: unknown) => {
      console.log(value, item)
      // TO-DO 修改key 值
      const prop = get(item, 'prop')
      if (prop === 'productId') {
        const formulaIndex = form.findIndex((item) => item.prop === 'formulaId')
        const versionIndex = form.findIndex(
          (item) => item.prop === 'formulaVersionId'
        )

        // 先将值清空
        set(form[formulaIndex], 'value', '')
        set(form[versionIndex], 'value', '')

        // 根据型号获取的工艺配方 只有一个配方；多个版本
        const list = await api.getFormula(value as string)
        formList.value = list
        let result = list.map((item) => ({
          ...item,
          model: item.name,
          value: item.id,
        }))
        const completeFormula = head(result)
        console.log('completeFormula', completeFormula)
        // 给工艺配方赋值
        set(form[formulaIndex], 'nodeOptions', result)
        // @ts-ignore
        set(form[formulaIndex], 'value', completeFormula.id)
      }
    }
    const initiateData = ref<any>({})

    async function init() {
      const result: any = await api.getModelOptions()
      prodList.value = result.items
      const key = 'productId'
      const index = form.findIndex((item) => item.prop === key)
      set(
        form[index],
        'nodeOptions',
        result.items.map((item: any) => ({
          ...item,
          label: item.model,
          value: item.id,
        }))
      )
      console.log(result, 'result')
      if (isEdit.value) {
        form.forEach((item) => {
          console.log('result222', props.dialogConfig, item.prop)
          if (item.prop == 'productId') {
            // @ts-ignore
            item.value = props.dialogConfig.product.id
            // @ts-ignore
            onChange(props.dialogConfig.product.id, item)
          } else if (item.prop == 'formulaId') {
            // @ts-ignore
            item.value = props.dialogConfig.formula.id
          } else {
            // @ts-ignore
            item.value = props.dialogConfig[item.prop]
          }
        })
      }

      initiateData.value = cloneDeep(form)
    }

    init()

    const onConfirm = async () => {
      const emptyList = form.filter((item) => !item.value)
      if (emptyList.length) {
        const item = head(emptyList)!.label
        const msg = item.replace(/:$/, '')

        ElMessage.error(`${msg}字段不能为空`)
        return
      }

      const params = form.reduce(
        (obj, item) => ({
          ...obj,
          [item.prop]: item.formatter ? item.formatter(item.value) : item.value,
        }),
        {}
      )

      if (!/^[1-9][0-9]*$/.test(params.planQty)) {
        ElMessage.error(`计划数量请输入正整数`)
        return
      }

      // 额外处理- 携带版本号名称

      // @ts-ignore
      if (isEdit.value) {
        // @ts-ignore
        params['concurrencyStamp'] = get(
          props,
          'dialogConfig.concurrencyStamp',
          ''
        )
      }
      // @ts-ignore
      console.log(prodList.value, formList.value)
      // @ts-ignore
      params.product = prodList.value.find((_: any) => _.id == params.productId)
      // @ts-ignore
      params.formula = formList.value.find((_: any) => _.id == params.formulaId)

      console.log('params', params)
      const methodApi = isEdit.value ? api.updateOrder : api.addOrder
      const id = get(props, 'dialogConfig.id', '')
      // await api.addOrder(params)
      //   @ts-ignore
      const result = await methodApi(params, id)
      const msg = isEdit.value ? '更新' : '新增'
      ElMessage.success(`${msg}成功`)

      ctx.emit('callback')
    }

    const checkIsEqualObject = () => {
      const check = isEqual(initiateData.value, form)
      console.log(initiateData.value, form, check)
      return check
    }

    const beforeClose = (done: () => void) => {
      console.log('beforeClose')
      if (dialogVisible.value) {
        if (checkIsEqualObject()) {
          dialogVisible.value = false
          done && done()
        } else {
          ConfirmBox('是否保存工单设置？')
            .then(() => {
              onConfirm()
            })
            .catch(() => {
              dialogVisible.value = false
              done && done()
            })
        }
      }
    }
    const onClose = () => {
      console.log('onClose')
      dialogVisible.value = false
    }

    return {
      dialogVisible,
      dialogTableVisible,
      title,
      isEdit,
      form,
      isEqual,
      onChange,
      onConfirm,
      checkIsEqualObject,
      beforeClose,
      onClose,
      ConfirmBox,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../styles/input.scss';

.dialog-content {
  overflow-y: scroll;
  overflow-x: hidden;
}

.baseCss {
  width: 98px;
  height: 26px;
}

.customFormItem-container {
  width: 100%;
  margin-top: 10px;
  .customFormItem {
    .label-content {
      color: #666;
    }
  }

  :deep(.cs-input__wrapper) {
    display: flex;
  }
}
</style>

<style lang="scss">
@import url('../styles/common.scss');
</style>
