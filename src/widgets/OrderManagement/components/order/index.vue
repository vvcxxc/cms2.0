<template>
  <BaseDialog :title="_t('获取工单')" v-model="visible" width="440px" destroy-on-close @open="onOpen" @close="onClose"
    @confirm="onConfirm">
    <div class="order-content">
      <el-input :placeholder="_t('输入订单号或产品LOT ID')" v-model="order"></el-input>
    </div>

  </BaseDialog>
</template>

<script setup lang="ts">
import sdk from 'sdk'
const { models } = sdk
const { Language } = models
const { _t } = Language

import BaseDialog from '@/components/BaseDialog/index.vue'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import api from '../../api/product-setting'
import { Warning } from 'postcss'

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue', 'order'])

const order = ref('')

const visible = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    emit('update:modelValue', v)
  },
})

const onOpen = () => {
  order.value = ''
}

const onClose = () => {
  visible.value = false
}

const onConfirm = async () => {
  // 获取工单
  if (!order.value) return ElMessage.warning('请输入订单号或产品LOT ID')
  emit('order', order.value)
  onClose()
}
</script>

<style lang="scss">
.order-content {
  padding: 20px 0;
}
</style>
