<template>
  <Dialog
    v-model="visible"
    :append-to-body="true"
    :width="1200"
    :show-close="true"
  >
    <template #title>
      <div class="preview-dialog__header">
        <span>预览</span>
        <div class="preview-dialog__header--close" @click="handleClose">
          <span class="iconfont icon-guanbi"></span>
        </div>
      </div>
    </template>
    <div class="preview-dialog">
      <div class="preview-dialog__content">
        <iframe :src="url" frameborder="0" width="100%" height="100%"></iframe>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from '@/components/Dialog/index.vue'
import { useVModel } from '@vueuse/core'
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
    default: false,
  },
  url: {
    type: String,
    required: true,
    default: 'http://www.baidu.com',
  },
})
const emit = defineEmits(['update:modelValue'])
const visible = useVModel(props, 'modelValue', emit)

const handleClose = () => {
  visible.value = false
}
</script>

<style lang="scss" scoped>
.preview-dialog__header {
  display: flex;
  justify-content: space-between;
  width: 100%;

  .preview-dialog__header--close {
    cursor: pointer;
  }
}
.preview-dialog__content {
  height: 80vh;
  width: 100%;
  iframe {
    height: 100%;
    width: 100%;
  }
}
</style>
