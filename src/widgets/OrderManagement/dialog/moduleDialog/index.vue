<template>
  <BaseDialog
    v-model="dialogVisible"
    width="500px"
    :title="'结束工单'"
    @close="onClose"
    @confirm="onSubmit"
  >
    <el-form :model="formList" label-position="left">
      <template v-for="item in formList" :key="item.prop">
        <el-form-item :label="item.label" :prop="item.prop">
          <el-input v-model="item.value" v-bind="{ ...item.attribute }" />
        </el-form-item>
      </template>
    </el-form>
    <!-- 按钮 -->
    <!-- <template #footer>
      <div class="popBtn">
        <div class="myBtn myBtn1" @click="onClose">取消</div>
        <div class="myBtn myBtn2" @click="onSubmit">确定</div>
      </div>
    </template> -->
  </BaseDialog>
</template>
<script lang="ts" setup>
import BaseDialog from '@/components/BaseDialog/index.vue'
import { ref, reactive } from 'vue'
import get from 'lodash/get'
import api from '../../api/product-setting'
import { useVModel } from '@vueuse/core'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ORDER_STATUS } from '../../enum'
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer'

const $props = defineProps<{
  modelValue: boolean
  moduleDialogConfig: object
}>()

const emit = defineEmits(['close'])

const dialogVisible = useVModel($props)
const formList = reactive([
  {
    label: '',
    prop: 'Remark',
    value: '',
    attribute: {
      type: 'textarea',
      rows: '4',
      placeholder: '请填写结束原因',
    },
  },
])

const onSubmit = async () => {
  const obj = formList.reduce((pre, cur) => {
    return { ...pre, [cur.prop]: cur.value }
  }, {})

  // @ts-ignore
  const { Remark } = obj
  if (!Remark) {
    return ElMessage.error('请填写工单结束原因')
  }

  const id = get($props, 'moduleDialogConfig.id', '')
  const status: any = get($props, 'moduleDialogConfig.status', '')
  if (status === ORDER_STATUS.PRODUCTION) {
    await ElMessageBox.confirm(`工单正在生产，是否强制结束？`, '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info',
    })
  }

  await api.putFinish(id, Remark)

  ElMessage.success('操作成功')

  onClose()
}
const onClose = () => emit('close')
</script>

<style lang="scss" scoped>
.popBtn {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  box-sizing: border-box;
  height: 50px;
  font-size: 16px;
  .myBtn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 98px;
    height: 26px;
    border-radius: 3px 3px 3px 3px;
    font-size: 14px;
    font-family: PingFang SC-Regular, PingFang SC;
    color: #666666;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }
  .myBtn1 {
    margin-right: 10px;
    color: #666666;
    background: #efeded;
    border: 1px solid #cccccd;
  }

  .myBtn2 {
    color: #ffffff;
    background: #5a84ff;
  }
}
</style>
