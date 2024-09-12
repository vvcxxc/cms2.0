<template>
  <div class="bar-code">
    <Tab :data="tabData" type="list" active="BarcodeAnalysis" />
  </div>
</template>

<script lang="ts" setup>
import BarcodeGenerativeRule from './views/BarcodeGenerativeRule.vue'
import BarcodeCheckRule from './views/BarcodeCheckRule.vue'
import BarcodeAnalysis from './views/BarcodeAnalysis.vue'
import Tab from '@/components/Tab/Tab'
import { usePermission } from '@/libs/Permission/Permission'
import { permissionCodes } from './enum'
import { useEditionFeature } from '@/libs/Permission/Permission'
// import {
//   initPermission,
// } from './permission'
const props = defineProps<{
  node: any
}>()
// initPermission(props)
useEditionFeature()
usePermission(props, permissionCodes)

const tabData = [
  {
    label: '条码解析规则',
    name: 'BarcodeAnalysis',
    hidden: false,
    component: BarcodeAnalysis,
  },
  {
    label: '条码生成规则',
    name: 'BarcodeGenerativeRule',
    hidden: false,
    component: BarcodeGenerativeRule,
  },
  {
    label: '条码校验规则',
    name: 'BarcodeCheckRule',
    hidden: false,
    component: BarcodeCheckRule,
  },
]
</script>
<style lang="scss" scoped>
.bar-code {
  background-color: #fff;
  border-radius: 5px 5px 0 0;
  width: 100%;
  height: 100%;
  border: 1px solid #dbdbdb;
}
</style>
