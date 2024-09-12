<template>
  <BaseDrawer
    v-model="visible"
    :title="title"
    size="700px"
    @close="onClose"
    @confirm="onSubmit"
    @open="onOpen"
  >
    <!-- form -->
    <span class="without-dialog-barcode">
      <el-form
        ref="formRef"
        :model="form"
        class="without-el-form"
        :rules="BarcodeCheckRules"
        label-width="110px"
      >
        <el-form-item label="规则名称" prop="name" class="row-item">
          <el-input
            v-model="form.name"
            placeholder="请输入"
            class="row-input"
            :disabled="isView"
          />
        </el-form-item>
        <el-form-item label="解析类型" prop="verificationRule">
          <vxe-radio
            v-model="form.verificationRule"
            :label="Number(key)"
            v-for="key in Object.keys(BarcodeCheckType)"
            @change="onRuleChange"
            :disabled="isView"
          >
            {{ BarcodeCheckType[key] }}
          </vxe-radio>
        </el-form-item>
        <template v-if="form.verificationRule == 0">
          <el-form-item label="校验类型" prop="verificationType">
            <vxe-radio
              v-model="form.verificationType"
              :label="0"
              :disabled="isView"
            >
              长度校验
            </vxe-radio>
          </el-form-item>
          <el-form-item label="条码长度" prop="barcodeLength">
            <div
              class="flex justify-center"
              style="width: inherit; column-gap: 6px"
            >
              <el-input
                v-model="form.barcodeLength"
                class="row-input"
                :disabled="isView"
              />
            </div>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="条码解析规则" prop="barcodeAnalysisId">
            <el-select
              style="width: 100%"
              v-model="form.barcodeAnalysisId"
              @change="onChangeAnalysis"
              :disabled="isView"
            >
              <el-option
                v-for="item of barcodeAnalysis"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item required>
            <template #label>
              <div class="label-tip">
                <span>条码段</span>
                <el-tooltip effect="dark" placement="top">
                  <template #content>
                    根据条码解析规则解析出来条码段，选择需要检验的条码段
                  </template>
                  <div class="tip"></div>
                </el-tooltip>
              </div>
            </template>
            <div class="without-el-form-item">
              <BaseTable
                :isHidePagination="true"
                v-model:dataSource="dataSource"
                id="id"
                :columns="columns"
                style="height: 266px"
              >
                <template #verificationType.header>
                  校验类型
                  <el-tooltip placement="bottom">
                    <template #content>
                      <p>1、长度：取校验条码该段进行长度比对</p>
                      <p>2、物料编号：取校验条码的该段与该工序生产所需的物料编号进行比对</p>
                      <p>3、产品型号：取校验条码的该段与该工序生产型号进行比对</p>
                    </template>
                    <Icon icon="tip" :width="16" :height="16" />
                  </el-tooltip>
                </template>
                <template #verificationType="{ row }">
                  <el-form-item>
                    <el-select
                      style="width: 100%"
                      v-model="row.verificationType"
                      :disabled="isView"
                    >
                      <el-option :key="0" label="长度" :value="0"></el-option>
                      <el-option
                        :key="1"
                        label="物料编号"
                        :value="1"
                      ></el-option>
                      <el-option
                        :key="2"
                        label="产品型号"
                        :value="2"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </BaseTable>
            </div>
          </el-form-item>
        </template>
        <el-form-item label="备注" prop="remark">
          <el-input
            :disabled="isView"
            v-model="form.remark"
            :rows="4"
            type="textarea"
            clearable
            class="row-input-remark"
          />
        </el-form-item>
      </el-form>
      <!-- form结束 -->
    </span>
  </BaseDrawer>
</template>
<script lang="ts" setup>
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer'
import { ref, onMounted, reactive } from 'vue'
import { BarcodeCheckRules, verificationTypeMap } from './state'
// import { VxeRadio } from 'vxe-table'
import VxeRadio from 'vxe-table/es/vxe-radio'
import BaseTable from '@/components/Table/Table'
import Icon from '@/components/Icon/Icon'
import {
  BarcodeAnalysisCurrent,
  BarcodeAnalysisRow,
  BarcodeCheckType,
} from '../state'
import {
  setBarcodeAnalysis,
  addBarcodeAnalysis,
  message,
  AnalysisList,
  getBarcodeAnalysis,
  addBarcodeverification,
  setBarcodeverification,
} from '../action'
// import Table from 'components/Table/index.vue'
import { omit, cloneDeep } from 'lodash'

const $props = defineProps<{
  visible: boolean
  title: string
  isView: boolean
}>()

const emit = defineEmits(['close', 'confirm'])

const form = ref<any>({
  verificationRule: 0,
  verificationType: 0,
})
const dataSource = ref<any[]>([])
const formRef = ref()
const barcodeAnalysis = ref<any[]>([])
const isVerify = ref(false)
const verify = async () => {
  isVerify.value = true
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      dataSource.value = await AnalysisList(form.value)
    }
    isVerify.value = false
  })
}

const onOpen = async () => {
  form.value = { verificationRule: 0, verificationType: 0 }
  dataSource.value = []
  formRef.value?.resetFields()
  console.log(BarcodeAnalysisCurrent.value, '---BarcodeAnalysisCurrent.value')

  getBarcodeAnalysisList()

  Object.assign(form.value, BarcodeAnalysisCurrent.value)
  if (BarcodeAnalysisCurrent.value?.barcodeAnalysisDetails) {
    dataSource.value = cloneDeep(
      BarcodeAnalysisCurrent.value?.barcodeAnalysisDetails
    )
  }
}
const onClose = () => {
  emit('close')
}
const onSubmit = async () => {
  if ($props.isView) {
    onClose()
    return
  }
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const data = { ...form.value }
      let hasVerificationType = false
      if (form.value.verificationRule === 1) {
        data.barcodeAnalysisDetails = dataSource.value.map((item) => {
          if (item.verificationType !== undefined) {
            hasVerificationType = true
          }
          return omit(item, [
            'id',
            'extraProperties',
            'creationTime',
            'verificationTypeDisplay',
          ])
        })
        if (!hasVerificationType) {
          message('至少有一个条码段选择了校验类型', 'warning')
          return
        }
      }

      if (BarcodeAnalysisCurrent.value) {
        await setBarcodeverification(BarcodeAnalysisCurrent.value.id, data)
        message('条码编辑成功，软件重启后生效')
      } else {
        await addBarcodeverification(data)
        message('保存成功')
      }
      console.log(form, '---')

      emit('confirm')
    }
  })
}

const columns = [
  {
    title: '序号',
    type: 'seq',
    width: '60',
  },
  {
    title: '条码段名称',
    field: 'name',
  },
  {
    title: '条码段内容',
    field: 'content',
  },
  {
    title: '位数',
    field: 'digit',
  },
  {
    title: '校验类型',
    field: 'verificationType',
  },
]

const onRuleChange = (val: any) => {
  console.log(val)
  form.value.verificationType = val.label
}
const getBarcodeAnalysisList = async () => {
  const res = await getBarcodeAnalysis({
    MaxResultCount: 999,
    SkipCount: 0,
  })
  barcodeAnalysis.value = res.items
}

const onChangeAnalysis = (val: string) => {
  console.log(val)
  const cur = barcodeAnalysis.value.find((item) => item.id === val)
  form.value.barcodeAnalysisName = cur.name
  dataSource.value = cur.barcodeAnalysisDetails
}
</script>

<style lang="scss" scoped>
.tip {
  display: inline-block;
  width: 18px;
  height: 18px;
  background-image: url(@/assets/svg/tip.svg);
  background-size: 18px 18px;
  margin-right: 8px;
  margin-left: 5px;
  vertical-align: sub;
}

.search-btn {
  color: #fff;
  height: 26px !important;
}

.without-el-btn {
  width: 98px;
  height: 26px !important;
  line-height: 26px !important;
}
</style>
<style lang="scss" scoped>
.without-el-form {
  :deep(.cs-form-item) {
    margin-right: 0;
    width: 100%;

    .cs-form-item__content {
      width: 100%;
    }

    .cs-form-item__label {
      line-height: 36px;
      font-size: 14px;
      font-weight: bold;
      color: #8b9ca4;
      min-width: 80px;
      text-align: left;
    }

    .bar-content {
      width: 100%;
      background: #f5f5f5;
      border-radius: 2px 2px 2px 2px;
      opacity: 1;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
      font-size: 14px;
      font-weight: bold;
      color: #8b9ca4;

      .bar-input {
        :deep(.cs-textarea__inner) {
          height: 100% !important;
        }
      }
    }
  }

  :deep(.without-el-form-item) {
    height: 266px;
    width: 100%;
  }

  .row-item {
    margin-right: 40px;
    width: 100%;
  }

  .row-input {
    width: 100%;
  }

  :deep(.is--checked.vxe-radio) {
    color: #5a84ff;
  }

  :deep(.is--checked.vxe-radio .vxe-radio--icon) {
    color: #5a84ff;
  }
}
.label-tip {
  display: flex;
  align-items: center;
  .tip {
    display: inline-block;
    width: 18px;
    height: 18px;
    background-image: url(@/assets/svg/tip.svg);
    background-size: 18px 18px;
    margin-right: 8px;
    margin-left: 5px;
    vertical-align: sub;
  }
}
</style>
