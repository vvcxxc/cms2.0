<template>
  <div class="container">
    <span v-for="(item, index) in 3" :key="index" :class="['radius', colorName]"></span>
    <div class="text">{{ text }}</div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { ORDER_STATUS } from '../../enum'
const $props = defineProps<{
  color: number
  text: string
}>()
const COLOR_MAP = {
  [ORDER_STATUS.PAUSED]: 'PAUSED',
  [ORDER_STATUS.PRODUCED]: 'PRODUCED',
  [ORDER_STATUS.PRODUCTION]: 'PRODUCTION',
  [ORDER_STATUS.FINISHED]: 'FINISHED',
  [ORDER_STATUS.ENDED]: 'ENDED',
}
// @ts-ignore
const colorName = computed(() => COLOR_MAP[$props.color])
</script>
  
<style lang="scss" scoped>
.container {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
}
.radius {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 10px;
  border: 1px solid #c9cbca;
  margin-right: 4px;
}
// 暂停
.PAUSED {
  background-color: #f77070;
  border-color: #f77070;
}
// 待生产
.PRODUCED {
  background-color: #5aa7ff;
  border-color: #5aa7ff;
}
// 生产中
.PRODUCTION {
  background-color: #ffd358;
  border-color: #ffd358;
}
// 已完成
.FINISHED {
  background-color: #27b190;
  border-color: #27b190;
}
// 已结束
.ENDED {
  background-color: #c5c5c5;
  border-color: #c5c5c5;
}
.text {
  color: #787878;
  font-size: 14px;
  font-weight: bold;
  margin-left: 6px;
}

.radius:last-of-type {
  background-color: #fff;
  border-color: #c9cbca;
}
</style>
  