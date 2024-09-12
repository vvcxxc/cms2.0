<template>
  <Dialog
    title="添加/编辑条码段"
    class="without-relation-dialog"
    width="600px"
    v-bind="attrs"
    @open="onOpen"
    @close="onClose"
    @confirm="onConfirm"
    destroy-on-close
  >
    <div class="dialog-content">
      <el-form
        :model="form"
        class="without-el-form"
        ref="formRef"
        :rules="rules"
      >
        <!-- 固定字段 -->
        <template v-if="form.type === 0">
          <el-form-item label="条码段来源" prop="type" class="row-item">
            <el-input
              style="width: 100%"
              :modelValue="btnMap[form.type || 0]"
              disabled
            />
          </el-form-item>
          <el-form-item label="条码段名称" prop="name" class="row-item">
            <el-input style="width: 100%" v-model="form.name" />
          </el-form-item>
          <el-form-item label="条码段示例 " prop="content" class="row-item">
            <el-input style="width: 100%" v-model="form.content" :maxlength="20" />
          </el-form-item>
        </template>
        <!-- 自增数字 -->
        <template v-if="form.type === 1">
          <el-form-item label="条码段来源" prop="type" class="row-item">
            <el-input
              style="width: 100%"
              :modelValue="btnMap[form.type || 0]"
              disabled
            />
          </el-form-item>
          <el-form-item label="条码段名称" prop="name" class="row-item">
            <el-input style="width: 100%" v-model="form.name" />
          </el-form-item>
          <el-form-item
            label="自增数字规则"
            prop="autoIncrementType"
            class="row-item"
          >
            <vxe-select
              style="width: 100%"
              v-model="form.autoIncrementType"
              placeholder="请选择"
            >
              <vxe-option
                v-for="item in autoIncrementList"
                :key="item.key"
                :value="item.key"
                :label="item.text"
              ></vxe-option>
            </vxe-select>
          </el-form-item>
          <el-form-item
            label="自增数字进制"
            prop="carrySystemType"
            class="row-item"
          >
            <vxe-select
              style="width: 100%"
              v-model="form.carrySystemType"
              placeholder="请选择"
            >
              <vxe-option
                v-for="item in carrySystemType"
                :key="item.key"
                :value="item.key"
                :label="item.text"
              ></vxe-option>
            </vxe-select>
          </el-form-item>
          <el-form-item label="条码段示例 " prop="content" class="row-item">
            <el-input style="width: 100%" v-model="form.content" />
          </el-form-item>
        </template>
        <!-- 关联字段  -->
        <template v-if="[3, 4, 5].includes(Number(form.type))">
          <el-form-item label="字段类型" prop="type" class="row-item">
            <vxe-select
              style="width: 100%"
              v-model="form.type"
              placeholder="请选择"
              @change="onSelectChange"
            >
              <vxe-option
                v-for="item in analysisfieldtype"
                :key="item.key"
                :value="item.key"
                :label="item.text"
              ></vxe-option>
            </vxe-select>
          </el-form-item>
          <!-- 关联字段  系统字段  -->
          <template v-if="form.type == 3">
            <el-form-item label="关联字段" prop="type" class="row-item" required>
              <!-- <el-input
                style="width: 100%"
                :modelValue="dataSource[0]?.name"
                disabled
              /> -->
              <el-input style="width: 100%" modelValue="系统时间" disabled />
            </el-form-item>
            <el-form-item label="时间格式" prop="format" class="row-item" r>
              <el-select
                class="--scms-select"
                popper-class="--scms-select_poper"
                style="width: 100%"
                v-model="form.format"
                placeholder="请选择"
                @change="handleChangeFormat"
              >
                <el-option
                  v-for="item in dateFormat"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="条码段示例" prop="content" class="row-item">
              <el-input style="width: 100%" v-model="form.content" disabled />
            </el-form-item>
          </template>
          <!-- 关联字段  业务字段  -->
          <!-- <template v-if="form.type == 4">
            <el-form-item label="业务字段" prop="bussinessObj">
              <vxe-select
                style="width: 100%"
                placeholder="请选择"
                v-model="form.bussinessObj"
              >
                <vxe-option
                  v-for="item in bussinessOptions"
                  :label="item.text"
                  :value="item.key"
                  :key="item.key"
                ></vxe-option>
              </vxe-select>
            </el-form-item>
          </template> -->
          <!-- 关联字段  解析规则字段  -->
          <el-form-item
            v-if="form.type == 5"
            label="关联规则"
            prop="barcodeAnalysisId"
          >
            <el-select
              style="width: 100%"
              v-model="form.barcodeAnalysisId"
              @change="onChangeAnalysis"
            >
              <el-option
                v-for="item of barcodeAnalysis"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <template v-if="[4, 5].includes(Number(form.type))">
            <div class="title label-tip">
              <span>关联字段</span>
              <el-tooltip effect="dark" placement="top" v-if="form.type == 5">
                <template #content>
                  根据条码解析规则解析出来条码段，选择需要用于生成规则的条码段
                </template>
                <div class="tip"></div>
              </el-tooltip>
            </div>

            <div style="height: 300px; width: 100%; overflow-y: auto">
              <Table
                :isChecked="true"
                :isHidePagination="true"
                :dataSource="dataSource"
                :columns="form.type === 4 ? columns1 : columns2"
                id="id"
                @check="onChangeSelected"
                ref="tableRef"
              >
                <template #codeDemo="{ row }">
                  <el-form-item
                    style="margin: 0"
                    prop="0"
                    :rules="[
                    {
                      validator: (rule: any, value: any, callback: any) => {
                        if (form.type == 4 && records.map((e: any) => e.fieldName).includes(row.fieldName) && (isNil(row.content) || row.content === '')) {
                          callback(' ')
                        } else {
                          callback()
                        }
                      }
                    },
                  ]"
                  >
                    <el-input v-if="form.type == 4" v-model="row.content" />
                    <span v-else> {{ row.content }} </span>
                  </el-form-item>
                </template>
              </Table>
            </div>
          </template>
        </template>
        <!-- 关联变量 -->
        <template v-if="form.type === 2">
          <el-form-item label="条码段来源" prop="type" class="row-item">
            <el-input
              style="width: 100%"
              :modelValue="btnMap[form.type || 0]"
              disabled
            />
          </el-form-item>
          <el-form-item label="条码段名称" prop="name" class="row-item">
            <el-input style="width: 100%" v-model="form.name" />
          </el-form-item>
          <el-form-item label="关联变量" prop="varName" class="row-item">
            <el-input style="width: 100%" v-model="form.varName">
              <template #suffix>
                <img
                  src="@/assets/svg/more.svg"
                  class="more"
                  @click="selectVariable"
                />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="条码段示例 " prop="content" class="row-item">
            <el-input style="width: 100%" v-model="form.content" />
          </el-form-item>
        </template>
      </el-form>
    </div>
  </Dialog>
</template>
<script lang="ts" setup>
import Dialog from '@/components/BaseDialog/index.vue'
import {
  columns1,
  columns2,
  dateFormat,
  dateFormatDemo,
  rules,
  btnListOptions,
} from './state'
import { BarcodeDetails, current } from '../state'
import { ref, useAttrs, watch, onMounted, Ref, computed, nextTick } from 'vue'
import Table from '@/components/Table/Table'
import {
  getRelationList,
  getFieldList,
  getBarcodeManagement,
  getBarList,
  getAutoIncrementList,
  GetDecimalSystem,
  getanalysisfieldtype,
  getField,
  getBarcodeAnalysis,
} from '../action'

import { cloneDeep } from 'lodash'
import { isNil } from 'lodash'
import sdk from 'sdk'
const { openVariableDialog } = sdk.utils
const businessFileds = ref<any[]>([])
const formRef = ref()

const attrs = useAttrs()

const props = defineProps<{
  dataSource: any[]
  row: any
}>()

const emit = defineEmits(['confirm', 'close'])

const tableRef = ref()
const oldRecords = ref<any[]>([])
const records = ref<any[]>([])
const dataSource = ref<any[]>([])
let form = $ref<any>({})
const barOptions: Ref = ref([])
const barcodeAnalysis = ref<any[]>([])

const onChangeSelected = (rows: any) => {
  records.value = rows
  console.log(records.value);
  
}

const onSelectChange = async (data: any) => {
  if (form.type === 4) {
    getBusinessFiledList()
  }

  if (form.type === 5) {
    getBarcodeAnalysisList()
  }
}

const onOpen = async () => {
  formRef.value?.resetFields()
  if (props.row){
    form = {
      ...cloneDeep(props.row),
      varName: props.row.varName || props.row.variableName,
      format: props.row.timeFormatType
    }
  }
  

  formRef.value?.clearValidate()
  if (form.type === 4) {
    getBusinessFiledList()
  }
  if (form.type === 5) {
    getBarcodeAnalysisList()
  }
}
const onClose = () => {
  emit('close')
}
const onConfirm = () => {
  formRef.value?.validate(async (valid: boolean) => {
    console.log(valid, '11', form, records.value);
    
    if (valid) {
      const data = {
        records: records.value,
        oldRecords: oldRecords.value,
        ...form,
      }
      if (data.type === 3) {
        data.name = '系统时间'
      }
      emit('confirm', data)
    }
  })
}

const btnMap: any = ref({}) //条码规则
const getBarCodeList = async () => {
  btnMap.value = btnListOptions.reduce((p: any, c: any) => {
    p[c.key] = c.text
    return p
  }, {})
}

const autoIncrementList: any = ref([
  {
    key: 0,
    text: '按型号/日期自增',
  },
  {
    key: 1,
    text: '按工单/日期自增',
  },
  {
    key: 2,
    text: '按工单自增',
  },
  {
    key: 3,
    text: '按型号自增',
  },
  {
    key: 4,
    text: '按日期自增',
  },
])

const carrySystemType: any = ref([
  {
    key: 0,
    text: '十进制',
  },
  {
    key: 1,
    text: '二进制',
  },
  {
    key: 2,
    text: '八进制',
  },
  {
    key: 3,
    text: '十六进制',
  },
])

const analysisfieldtype: any = ref([
  {
    key: 3,
    text: '系统字段',
  },
  {
    key: 4,
    text: '业务字段',
  },
  {
    key: 5,
    text: '规则解析字段',
  },
])

const selectVariable = async () => {
  try {
    const varData = await openVariableDialog({
      currentVariable: {},
      isMultiple: false,
      defaultCheckKey: [],
      showConfig: false,
      configData: {},
    })
    console.log(varData, 'varData1')

    const data: any = { type: props.row.type, name: form.name }
    form.varName = varData.name
    form.varId = varData.id
    form.type = props.row.type
    dataSource.value.push(data)
  } catch (error) {
    console.log(error)
  }
}

const getBusinessFiledList = async () => {
  if (!businessFileds.value.length) {
    const res = await getField()
    businessFileds.value = JSON.parse(res.settings[0]?.value ?? [])
  }


  dataSource.value = cloneDeep(businessFileds.value).filter((item: any) => {
    return !item.segment
  })
  
  const checkeds: any[] = []
  dataSource.value.forEach((e: any) => {
    const target = props.dataSource.find((se) => se.name == e.fieldName)
    console.log(target);
    
    if (target) {
      e.content = target.content
      checkeds.push(e)
    }
  })
  await nextTick()
  console.log(checkeds, '--checkeds', dataSource.value, businessFileds.value);
  
  tableRef.value?.setSelectRowByObj(checkeds)
}

const getBarcodeAnalysisList = async () => {
  if (!barcodeAnalysis.value.length) {
    const res = await getBarcodeAnalysis({
      MaxResultCount: 999,
      SkipCount: 0,
    })
    barcodeAnalysis.value = res.items
  }
  onChangeAnalysis(form.barcodeAnalysisId)
}

const onChangeAnalysis = async (val: string) => {
  console.log(val, props.dataSource)
  const cur = barcodeAnalysis.value.find((item) => item.id === val)
  if (!cur){
    dataSource.value = []
    return
  } 
  form.barcodeAnalysisName = cur.name
  dataSource.value = [...cur.barcodeAnalysisDetails]
  const checkeds: any[] = []
  dataSource.value.forEach((e: any) => {
    const target = props.dataSource.find((se) => se.name == e.name)
    if (target) {
      checkeds.push(e)
    }
  })
  await nextTick()
  tableRef.value?.setSelectRowByObj(checkeds)
}

const handleChangeFormat = (val: any) =>{
  const data = dateFormat.find(item => item.value === val)
  if (!data) return
  form.content = dateFormatDemo(data.label)
}

onMounted(async () => {
  getBarCodeList()
})
</script>
<style lang="scss">
.--scms-select_poper.cs-popper {
  max-width: inherit !important;
}
</style>
<style lang="scss" scoped>
.without-relation-dialog {
  .without-el-btn {
    width: 98px;
    height: 26px !important;
    line-height: 26px !important;
  }

  .title {
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 8px;
    background: url(@/assets/svg/title.svg) no-repeat;
    background-size: contain;
    padding-left: 28px;
  }

  .more {
    width: 25px;
    height: 15px;
    background: #bcceff;
    border-radius: 2px 2px 2px 2px;
    align-self: center;
    cursor: pointer;
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
