<template>
  <BaseDialog
    :title="_t('查看')"
    v-model="visible"
    width="50%"
    :append-to-body="true"
    @close="visible = false"
    @confirm="onConfirm"
  >
    <embed
      type="application/pdf"
      style="width: 100%; height: 750px"
      :src="pdfSrc"
    />
  </BaseDialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import BaseDialog from '@/components/BaseDialog/index.vue'
import { _t } from '@/libs/Language/Language'

const props = defineProps<{
  modelValue: boolean
  pdfSrc: string
}>()

const emit = defineEmits(['update:modelValue'])

const pdfSrc = computed(() => {
  return props.pdfSrc + '#navpanes=0&toolbar=0&statusbar=0&view=Fit'
})

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
}

onMounted(async () => {})
</script>

<style lang="scss" scoped></style>
