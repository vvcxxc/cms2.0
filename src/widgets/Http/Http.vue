<!-- eslint-disable vue/no-mutating-props -->
<template>
  <button class="http-btn" @click="handleRequest">{{ text }}</button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import request from 'axios'
import { has } from 'lodash'

const $props = defineProps<{
  node: any
}>()

const text = computed(() => {
  return $props.node?.props?.text || 'Http'
})

const initRequestConfig = () => {
  const data = $props.node?.props || {}
  const p = (v: any) => {
    try {
      return JSON.parse(v)
    } catch (error) {
      return v
    }
  }
  return {
    url: data.url,
    method: data.method,
    data: p(data.body),
    headers: p(data.headers),
    isShowMsg: has(data, 'isShowMsg') ? data.isShowMsg : true,
    msg: data.msg || '调用成功',
  }
}

const handleRequest = async () => {
  // 动态请求，接口自定义，端口自定义，请求方法自定义，包括body等，用request来请求，request是axios的封装，使用方式一样的
  const data = initRequestConfig()
  if (!data.url) return
  try {
    const res = await request(data)
    if (res.status === 200) {
      if (data.isShowMsg) {
        ElMessage.success(data.msg)
      }
    }
  } catch (error: any) {
    const response = error.response
    ElMessage.error(
      response?.data.message || response?.data?.error?.message || error.message
    )
  }
}
</script>

<style scoped lang="scss">
.http-btn {
  --el-button-text-color: var(--el-color-white);
  --el-button-bg-color: var(--el-color-primary);
  --el-button-border-color: var(--el-color-primary);
  --el-button-outline-color: var(--el-color-primary-light-5);
  --el-button-active-color: var(--el-color-primary-dark-2);
  --el-button-hover-text-color: var(--el-color-white);
  --el-button-hover-link-text-color: var(--el-color-primary-light-5);
  --el-button-hover-bg-color: var(--el-color-primary-light-3);
  --el-button-hover-border-color: var(--el-color-primary-light-3);
  --el-button-active-bg-color: var(--el-color-primary-dark-2);
  --el-button-active-border-color: var(--el-color-primary-dark-2);
  --el-button-disabled-text-color: var(--el-color-white);
  --el-button-disabled-bg-color: var(--el-color-primary-light-5);
  --el-button-disabled-border-color: var(--el-color-primary-light-5);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  height: 32px;
  white-space: nowrap;
  cursor: pointer;
  color: #fff;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  transition: 0.1s;
  font-weight: var(--el-button-font-weight);
  user-select: none;
  vertical-align: middle;
  -webkit-appearance: none;
  background-color: var(--el-button-bg-color);
  border: var(--el-border);
  border-color: var(--el-button-border-color);
  padding: 8px 15px;
  font-size: var(--el-font-size-base);
  border-radius: var(--el-border-radius-base);
  opacity: 1;
  &:hover {
    border-color: var(--el-button-hover-border-color);
    background-color: var(--el-button-hover-bg-color);
    outline: none;
  }
  &:focus {
    border-color: var(--el-button-hover-border-color);
    background-color: var(--el-button-hover-bg-color);
    outline: none;
  }
  &:active {
    border-color: var(--el-button-active-border-color);
    background-color: var(--el-button-active-bg-color);
    outline: none;
  }
}
</style>
