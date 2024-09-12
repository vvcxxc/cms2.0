<template>
  <BaseDrawer
    v-model="visible"
    :title="title"
    size="582px"
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
        :rules="BarcodeAnalysisRules"
      >
        <el-form-item label="规则名称" prop="name" class="row-item">
          <el-input
            :disabled="isView"
            v-model="form.name"
            placeholder="请输入"
            class="row-input"
          />
        </el-form-item>
        <el-form-item label="条码示例" prop="codeDemo">
          <el-input
            v-model="form.codeDemo"
            :disabled="isView"
            class="row-input"
          />
        </el-form-item>
        <el-form-item label="解析类型" prop="type">
          <vxe-radio
            :disabled="isView"
            v-model="form.type"
            :label="Number(key)"
            v-for="key in Object.keys(BarcodeAnalysisType)"
          >
            {{ BarcodeAnalysisType[key] }}
          </vxe-radio>
          <el-tooltip effect="dark" placement="top">
            <template #content>
              输入数字和英文逗号，以&quot;,&quot;号分割，<br />例如：2,12,1
            </template>
            <div class="tip"></div>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="分隔符号" prop="symbol" v-if="form.type == 0">
          <div
            class="flex justify-center"
            style="width: inherit; column-gap: 6px"
          >
            <el-input
              v-model="form.symbol"
              class="row-input"
              :disabled="isView"
            />
            <el-button
              v-if="!isView"
              class="search-btn"
              color="#8b9ca4"
              @click="verify"
            >
              解析
            </el-button>
          </div>
        </el-form-item>
        <div
          class="flex justify-center content-center"
          style="width: inherit; gap: 6px"
          v-if="form.type == 1"
        >
          <el-form-item label="起始符号" prop="startSymbol">
            <el-input v-model="form.startSymbol" :disabled="isView" />
          </el-form-item>
          <el-form-item label="终止符号" prop="endSymbol">
            <el-input v-model="form.endSymbol" :disabled="isView" />
          </el-form-item>
          <el-button
            class="search-btn"
            color="#8b9ca4"
            style="margin-bottom: 18px"
            @click="verify"
            v-if="!isView"
          >
            解析
          </el-button>
        </div>
        <el-form-item label="固定长度" prop="fixedLength" v-if="form.type == 2">
          <div class="flex justify-center" style="width: inherit">
            <el-input
              v-model="form.fixedLength"
              :disabled="isView"
              class="row-input"
            />
            <el-button
              class="search-btn"
              color="#8b9ca4"
              @click="verify"
              v-if="!isView"
              >解析</el-button
            >
          </div>
        </el-form-item>
        <!-- 解析结果 -->
        <el-form-item class="without-el-form-item" prop="0">
          <BaseTable
            :isHidePagination="true"
            :dataSource="dataSource"
            id="id_key"
            :columns="[
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
            ]"
          >
            <template #name="{ row }">
              <el-form-item
                style="margin: 0"
                prop="0"
                :rules="[
                {
                  validator: (rule: any, value: any, callback: any) => {
                    if (!isVerify && (isNil(row.name) || !row.name?.trim()?.length)) {
                      callback(' ')
                    } else {
                      callback()
                    }
                  }
                },
              ]"
              >
                <el-input :disabled="isView" v-model="row.name"></el-input>
              </el-form-item>
            </template>
          </BaseTable>
        </el-form-item>
        <!-- <el-form-item label="校验类型" prop="verificationType">
          <vxe-select
            style="width: 100%"
            placeholder="请选择"
            v-model="form.verificationType"
          >
            <vxe-option
              v-for="key in Object.keys(verificationTypeMap)"
              :label="verificationTypeMap[key]"
              :value="Number(key)"
              :key="key"
            ></vxe-option>
          </vxe-select>
        </el-form-item>
        <el-form-item
          label="校验条码段"
          prop="verifyBarcode"
          v-if="form.verificationType !== 1"
        >
          <vxe-select
            style="width: 100%"
            placeholder="请选择"
            v-model="form.verifyBarcode"
          >
            <vxe-option
              v-for="item in dataSource"
              :label="item.name"
              :value="item.name"
              :key="item.name"
            ></vxe-option>
          </vxe-select>
        </el-form-item> -->
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
import { BarcodeAnalysisRules, verificationTypeMap } from './state'
import VxeRadio from 'vxe-table/es/vxe-radio'
import BaseTable from '@/components/Table/Table'
import {
  BarcodeAnalysisCurrent,
  BarcodeAnalysisRow,
  BarcodeAnalysisType,
} from '../state'
import {
  setBarcodeAnalysis,
  addBarcodeAnalysis,
  message,
  AnalysisList,
  getBarcodeAnalysis,
} from '../action'
// import Table from 'components/Table/index.vue'
import isNil from 'lodash/isNil'

const $props = defineProps<{
  visible: boolean
  title: string
  isView: boolean
}>()

const emit = defineEmits(['close', 'confirm'])

const form = ref<BarcodeAnalysisRow>({
  type: 0,
})
const dataSource = ref<any[]>([])
const formRef = ref()

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
  form.value = { type: 0 }
  dataSource.value = []
  formRef.value?.resetFields()
  Object.assign(form.value, BarcodeAnalysisCurrent.value)
  if (BarcodeAnalysisCurrent.value?.barcodeAnalysisDetails) {
    dataSource.value = BarcodeAnalysisCurrent.value?.barcodeAnalysisDetails
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
      if (dataSource.value.length) {
        const map = dataSource.value.reduce((p, c) => {
          p[c.name] = (p[c.name] || 0) + 1
          return p
        }, {})
        if (Object.keys(map).length !== dataSource.value.length) {
          message('存在重复的条码段名字', 'error')
          return
        }
      }

      if (BarcodeAnalysisCurrent.value) {
        await setBarcodeAnalysis(
          BarcodeAnalysisCurrent.value,
          form.value,
          dataSource.value
        )
        message('条码编辑成功，软件重启后生效')
      } else {
        await addBarcodeAnalysis(form.value, dataSource.value)
        message('保存成功')
      }

      emit('confirm')
    }
  })
}

onMounted(() => {})
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
</style>
