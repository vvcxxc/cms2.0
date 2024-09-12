<template>
  <BaseDrawer
    v-model="visible"
    :title="title"
    size="582px"
    @open="onOpen"
    @close="onClose"
    @confirm="onSubmit"
  >
    <!-- form -->
    <span class="without-dialog-barcode" @click="btnShow = false">
      <el-form
        ref="formRef"
        :model="form"
        class="without-el-form"
        :rules="rules"
      >
        <el-form-item label="条码规则名称" prop="name" class="row-item">
          <el-input
            :disabled="isView"
            v-model="form.name"
            placeholder="请输入"
            class="row-input"
          />
        </el-form-item>
        <el-form-item
          prop="barcodeGenerationDetails"
          class="without-el-form-item"
        >
          <template #label>
            <div class="flex justify-between" style="width: 100%">
              <span>自定义条码段</span>
              <div class="btns" v-if="!isView">
                <div class="without-bar-btn">
                  <el-popover
                    trigger="click"
                    popper-class="without-add"
                    width="100px"
                    :visible="btnShow"
                    :teleported="false"
                    :hideAfter="0"
                  >
                    <template #reference>
                      <el-button size="small" @click.stop="onClickBar">
                        <img src="@/assets/svg/add1.svg" />添加
                      </el-button>
                    </template>
                    <div class="bar-btn-ul" :class="{ show: btnShow }">
                      <div
                        v-for="item in btnListOptions"
                        @click.stop="
                          () => handlerFn(btnMap[item.key], item.key)
                        "
                        :key="item.key"
                        class="bar-btn-li"
                      >
                        {{ item.text }}
                      </div>
                    </div>
                  </el-popover>
                </div>
                <el-button @click.stop="onDelete">
                  <img src="@/assets/svg/del1.svg" />删除
                </el-button>
              </div>
            </div>
          </template>
          <div class="with-code-content">
            <!-- 表头 -->
            <header class="code-header">
              <div class="code-index row">
                <el-checkbox
                  v-model="checkAll"
                  :indeterminate="isIndeterminate"
                  @change="handleCheckAllChange"
                  :disabled="isView"
                ></el-checkbox>
              </div>
              <div class="code-type row">条码段来源</div>
              <div class="code-name row">条码段名称</div>
              <div class="code-content row code-content-flex">条码段示例</div>
              <div class="code-number row">位数</div>
            </header>
            <!-- 表身 -->
            <el-checkbox-group
              v-model="checked"
              @change="handleCheckedChange"
              :disabled="isView"
            >
              <div class="code-container">
                <div
                  class="code-item"
                  v-for="(item, index) in dataSource"
                  :key="index"
                >
                  <div class="move code-index">
                    <div class="bg" :class="{ isDisabled: isView }"></div>
                    <el-checkbox :label="index">
                      <template></template>
                    </el-checkbox>
                  </div>
                  <div class="code-type">{{ barCodeMap[item.type] }}</div>
                  <div class="code-name">
                    <span :title="item.name">{{ item.name }}</span>
                  </div>
                  <div class="code-content">
                    <span>
                      <!-- 日期 -->
                      <!-- <span v-if="isShowContentSelect(item, 10)">
                        {{ item.format }}
                      </span> -->
                      <!-- 数字 -->
                      <!-- <span v-if="isShowContentSelect(item, 3)">
                        {{ item.buildType }}
                      </span> -->
                    </span>
                    {{ item.content }}
                  </div>
                  <div class="code-number flex justify-between">
                    <span>
                      {{ currentDight(item) }}
                    </span>
                    <div
                      @click="onEdit(index)"
                      class="del"
                      :class="{ isDisabled: isView }"
                    ></div>
                  </div>
                </div>
              </div>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item label="生成条码效果" prop="currentCodeDemo">
          <div class="bar-content">
            <el-input
              :disabled="true"
              :modelValue="currentCodeDemo"
              resize="none"
              class="bar-input"
              clearable
            />
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="margin-right: 0">
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
    <RelationDialog
      v-model="relationVisible"
      :dataSource="dataSource"
      :row="relationRow"
      @confirm="onSelectVariable"
      @close="relationVisible = false"
    />
  </BaseDrawer>
</template>
<script lang="ts" setup>
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer'
// import Dialog from 'components/BaseDialog/index.vue'
import { ref, onMounted, reactive, computed, nextTick } from 'vue'
import { rules, barCodeMap, btnMap, btnListOptions } from './state'
import RelationDialog from './RelationDialog.vue'
import { current, Row } from '../state'
import Sortable from 'sortablejs'
import {
  getAutoIncrementList,
  getBarList,
  setData,
  addData,
  message,
  getBarDetail,
} from '../action'
import isNil from 'lodash/isNil'
import sortBy from 'lodash/sortBy'
import { cloneDeep } from 'lodash'

const $props = defineProps<{
  visible: boolean
  title: string
  isView: boolean
}>()

const emit = defineEmits(['close', 'submit'])

const numbOptions: any = ref([])
const dataSource: any = ref([])
const form: any = reactive({ barcodeGenerationDetails: dataSource })
const btnShow = ref(false)
const isAdd = ref(false)
const relationVisible = ref(false)
const relationRow = ref<any>()
const btnList: any = ref([]) //条码规则
const formRef = ref()
let dropR: any = null
const onOpen = async () => {
  console.log(current.value, '---dd')

  formRef.value?.clearValidate()
  if (current.value) {
    // const res = await getBarDetail(current.value)
    // current.value = res
    // if (current.value) {
    form.name = current.value.name
    form.remark = current.value.remark
    form.codeDemo = current.value.codeDemo
    dataSource.value = current.value.barcodeGenerationDetails.map(
      (item: any) => {
        return {
          ...item,
          type: item.generationType,
          content: item.demo,
        }
      }
    )
    // dataSource.value = sortBy(current.value.barcodeGenerationDetails || [], [
    //   'sort',
    // ])
    // }
  } else {
    delete form.name
    delete form.remark
    delete form.codeDemo
    dataSource.value = []
  }
  if (!$props.isView) {
    nextTick(sortableInit)
  } else {
    dropR?.destroy()
  }
}

const checkAll = ref(false)
const isIndeterminate = ref(false)
const checked = ref([])

const handleCheckAllChange = (val: boolean) => {
  checked.value = val ? dataSource.value.map((e: any, i: number) => i) : []
  isIndeterminate.value = false
}
const handleCheckedChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value =
    checkedCount === dataSource.value.map((e: any, i: number) => i).length
  isIndeterminate.value =
    checkedCount > 0 &&
    checkedCount < dataSource.value.map((e: any, i: number) => i).length
}

const onClickBar = () => {
  const t = setTimeout(() => {
    isAdd.value = true
    btnShow.value = true
    clearTimeout(t)
  }, 0)
}

const handlerFn = (type: string, key: number) => {
  const data: any = { type: key }
  relationRow.value = data
  relationVisible.value = true
  btnShow.value = false
}
const onSelectVariable = (data = {}) => {
  console.log('confirm', data)
  relationVisible.value = false
  handlerRelationKey(data)
}

// 处理关联字段key
const handlerRelationKey = (relationData: any) => {
  switch (relationData.type) {
    case 0:
    case 1:
    case 2:
    case 3:
      isAdd.value
        ? dataSource.value.push(relationData)
        : Object.assign(relationRow.value, relationData)
      break
    case 4:
      relationData.records.forEach((item: any) => {
        const oldItem = dataSource.value.find(
          (it: any) => it.name === item.fieldName
        )
        if (oldItem) {
          oldItem.content = item.content
        } else {
          dataSource.value.push({
            type: 4,
            name: item.fieldName,
            content: item.content,
            businessFieldCode: item.fieldCode,
          })
        }
      })
      break
    case 5:
      console.log(dataSource.value, '--dd')
      // 查询之前是否已有条码解析规则，不能同时使用两个条码规则
      // const oldRule = dataSource.value.find(item => item.type === 5)
      dataSource.value = dataSource.value.filter((item) => {
        if (
          item.type === 5 &&
          item.barcodeAnalysisId != relationData.barcodeAnalysisId
        ) {
          return false
        }
        return true
      })
      relationData.records.forEach((item: any) => {
        const oldItem = dataSource.value.find(
          (it: any) => it.name === item.name
        )
        if (!oldItem) {
          dataSource.value.push({
            type: 5,
            name: item.name,
            content: item.content,
            barcodeAnalysisId: relationData.barcodeAnalysisId,
            barcodeAnalysisName: relationData.barcodeAnalysisName,
          })
        }
      })
      break
  }
}

const onClose = () => {
  btnShow.value = false
  emit('close')
}

const checkDetails = () => {
  const check = dataSource.value.every((item: any) => {
    return item.content && item.name && !isNil(item.digit)
  })
  return check
}

const checkName = () => {
  const names = dataSource.value.map((item: any) => item.name)
  if (new Set(names).size != names.length) return false
  return true
}

const checkFormat = () => {
  const formatMap = {
    YYMMDDHHMMSS:
      /^(?:\d{2})(?:0[1-9]|1[0-2])(?:0[1-9]|[1-2]\d|3[01])(?:[01]\d|2[0-3])(?:[0-5]\d){2}$/,
    YYMMDD: /^(?:\d{2})(?:0[1-9]|1[0-2])(?:0[1-9]|[1-2]\d|3[01])$/,
    YYYYMMDD: /^(?:\d{4})(?:0[1-9]|1[0-2])(?:0[1-9]|[1-2]\d|3[01])$/,
  }
  const check = dataSource.value.every((item: any) => {
    const regx = formatMap[item.format]
    if (item.type == 10 && regx) {
      return regx.test(item.content)
    }
    return true
  })
  return check
}

const onSubmit = async () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (!checkFormat())
        return message('时间格式校验不正确，请重新输入', 'warning')
      if (!checkName()) return message('条码段名称重复', 'warning')
      if (!checkDetails()) return message('请输入必填项', 'warning')
      if (!$props.isView) {
        if (current.value) {
          await setData(current.value, form, dataSource.value)
          message('条码编辑成功，软件重启后生效')
        } else {
          await addData(form, dataSource.value)
          message('保存成功')
        }
      }
      emit('submit')
    }
  })
}

const currentCodeDemo = computed(() => {
  form.codeDemo = dataSource.value.map((item: any) => item.content).join('')
  return form.codeDemo
})

const currentDight = computed(() => {
  return (item: any) => {
    item.digit = item.content?.length || 0
    return item.digit
  }
})

const onDelete = () => {
  if ($props.isView) return
  checked.value
    .sort((a, b) => b - a)
    .forEach((i) => {
      dataSource.value.splice(i, 1)
    })
  checked.value = []
}
const onEdit = (index: number) => {
  if ($props.isView) return
  isAdd.value = false
  relationRow.value = dataSource.value[index]
  relationVisible.value = true
}

const getAutoList = async () => {
  const res = await getAutoIncrementList()
  numbOptions.value = res.data.map((item: any) => ({
    label: item.text,
    value: item.key,
  }))
}

// const getBarCodeList = async () => {
//   const res = await getBarList()
//   btnList.value = res.data
// }

const updateRows = []
let moveable = true
const sortableInit = () => {
  const moveDom = document.querySelector('.code-container') as HTMLElement
  if (moveDom) {
    dropR = new Sortable(moveDom, {
      handle: '.bg',
      chosenClass: 'sortable-chosen',
      swapThreshold: 1,
      animation: 150,
      onEnd: (sortableEvent: any) => {
        if (!moveable) return message('error', '移动失败')
        const newIndex = sortableEvent.newIndex as number
        const oldIndex = sortableEvent.oldIndex as number
        const currRow = dataSource.value.splice(oldIndex, 1)[0]
        const data = [...dataSource.value]
        data.splice(newIndex, 0, currRow)
        dataSource.value = []
        nextTick(() => {
          dataSource.value = data
        })
      },
      onMove: function () {
        moveable = true
        const addRows = dataSource.value.filter((level: any) => level.is_new)
        if (addRows.length || updateRows.length) {
          moveable = false
          return false
        }
        return true // 允许拖拽排序
      },
    })
  }
}

onMounted(() => {
  // getAutoList()
  // getBarCodeList()
})
</script>

<style lang="scss" scoped>
.with-code-content {
  width: 100%;
  max-height: 266px;
  overflow-y: auto;

  .code-container {
    width: 100%;
  }

  .code-header {
    position: sticky;
    z-index: 100;
    top: 0;
    height: 44px;
    background: #dbdfe7;
    border-radius: 2px 2px 0 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 16px;
    font-weight: bold;
    color: #35363b;

    .code-content-flex {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .tip {
      width: 18px;
      height: 18px;
      background-image: url(@/assets/svg/tip.svg);
      background-size: 18px 18px;
      margin-right: 8px;
      margin-left: 5px;
    }
  }

  .code-item {
    height: 44px;
    border-radius: 0px 0px 0px 0px;
    border-top: 1px solid #e3e6ed;
    border-left: 1px solid #e3e6ed;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    color: #333333;

    & > div {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      line-height: 22px;
      padding: 0 8px;
      height: 100%;
      line-height: 44px;

      border-right: 1px solid #e3e6ed;
    }

    &:last-child {
      border-bottom: 1px solid #e3e6ed;
    }

    .del {
      width: 16px;
      height: 24px;
      cursor: pointer;
      background-image: url(@/assets/svg/bianji.svg);
      background-size: 16px 24px;
    }

    .code-content-cell {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-right: 8px;

      .code-select {
        width: 140px;
        margin-right: 5px;
      }
    }

    .code-input {
      color: #787878;
      flex: 1;
    }

    .move {
      width: 55px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      padding-right: 0;

      .bg {
        position: absolute;
        left: 4px;
        display: inline-block;
        width: 14px;
        height: 22px;
        cursor: move;
        background-image: url(@/assets/svg/move.svg);
        background-size: 14px 22px;
      }
    }

    .isDisabled {
      opacity: 0.5;
      cursor: no-drop !important;
    }
  }

  .row {
    height: 44px;
    line-height: 44px;
    text-align: left;
    padding: 0 8px;

    span {
      color: #f97171;
    }
  }

  .code- {
    &index {
      width: 55px;
      text-align: center;
    }

    &type {
      width: 103px;
    }

    &name {
      flex: 150px 1;
    }

    &content {
      width: 130px;
    }

    &number {
      width: 80px;
    }
  }
}

.without-el-btn {
  width: 98px;
  height: 26px !important;
  line-height: 26px !important;
}
</style>
<style lang="scss" scoped>
.without-el-form {
  .without-el-form-item {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;

    .without-bar-btn {
      line-height: 22px;
    }

    :deep(.cs-form-item__label) {
      width: 100%;
      padding-right: 0;
    }

    .btns {
      display: flex;
      align-items: center;
      column-gap: 6px;
      margin-bottom: 8px;
      :deep(.cs-button) {
        height: 26px !important;
        padding: 0 8px !important;

        font-size: 14px;
        color: #464e54;
        font-weight: bold;

        img {
          padding-right: 6px;
        }
      }

      :deep(.without-add) {
        background: transparent !important;
        padding: 0 !important;
        box-shadow: none;
        min-width: 100px !important;

        .cs-popper__arrow {
          display: none;
        }

        .bar-btn-ul {
          margin: 0 auto;

          .bar-btn-li {
            background: #5a84ff;
            border-radius: 4px;
            text-align: center;
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            color: #ffffff;
            cursor: pointer;
            margin-bottom: 6px;

            &:hover {
              background: #93a9fd;
              border-radius: 4px;
              color: #f9faff;
            }
          }
        }
      }
    }
  }

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
      min-width: 100px;
      text-align: left;

      &[for='barcodeGenerationDetails'] {
        padding: 0;
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
      }
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

  .row-item {
    margin-right: 40px;
    width: 100%;
  }

  .row-input {
    width: 100%;
  }

  .row-input-remark {
  }
}
</style>
, find
