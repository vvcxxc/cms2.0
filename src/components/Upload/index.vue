<template>
  <el-upload
    :accept="accept"
    :show-file-list="showFileList || false"
    action="/api/v1/zc/productsop/uploadsop"
    name="fromFile"
    :on-success="handleUploadSuccess"
  >
    <!-- :http-request="onImport" -->
    <template v-if="slots.default"><slot></slot></template>
    <template v-else>
      <i class="iconfont icon-shangchuan upload"></i>
      <span><slot name="text"></slot></span>
    </template>
  </el-upload>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { useSlots } from 'vue'

const slots = useSlots()

const props = defineProps<{
  accept: string
  showFileList?: boolean
  msg?: string
}>()

const emit = defineEmits(['success'])

const handleUploadSuccess = (res: string) => {
  const data = {
    name: res.split('\\')[1],
    url: res,
  }
  emit('success', data)
  ElMessage.success(props.msg || '上传成功')
}
</script>

<style lang="scss" scoped>
.upload {
  font-size: 25px;
  color: #777;
}
</style>
