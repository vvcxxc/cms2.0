<template>
  <BaseDialog
    :title="_t('工序选择')"
    v-model="visible"
    width="400px"
    destroy-on-close
    :submitDisabled="isView"
    @Open="onOpen"
    @close="onClose"
    @confirm="onConfirm"
  >
    <div class="section-select">
      <el-radio-group v-model="mode">
        <el-radio :value="0">{{ _t('同步工艺路线') }}</el-radio>
        <el-radio :value="1">{{ _t('自定义选择') }}</el-radio>
      </el-radio-group>
    </div>
  </BaseDialog>
</template>

<script lang="ts" setup>
import BaseDialog from '@/components/BaseDialog/index.vue'
import { computed, ref } from 'vue'
import { _t, LanguageScopeKey } from '../app'

const emit = defineEmits(['update:mode', 'update:modelValue', 'confirm'])
const props = defineProps<{
  mode: number
  modelValue: boolean
  isView: boolean
}>()

const mode = ref(0)

const visible = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    emit('update:modelValue', v)
  },
})
const onConfirm = () => {
  visible.value = false
  emit('update:mode', mode.value)
  emit('confirm')
}

const onClose = () => {
  visible.value = false
}

const onOpen = () => {
  mode.value = props.mode
}
</script>

<style lang="scss" scoped>
.section-select {
  width: 100%;
  margin: 20px;
  height: 45px;
  padding-left: 20px;
}
</style>
