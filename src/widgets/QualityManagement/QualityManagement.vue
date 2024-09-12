<template>
  <div class="UnqualifiedManagent">
    <Tab :data="tabData" type="list" @Tab="changeTabFn" />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref, computed, getCurrentInstance } from 'vue'
import JudgmentRecord from './pages/JudgmentRecord.vue'
import ToDoUnqualified from './pages/ToDoUnqualified.vue'
import { useEditionFeature } from '@/libs/Permission/Permission'
import { createProvider } from './hooks/use-permission'

import Tab from '@/components/Tab/Tab'

const props = defineProps<{
  node: any
}>()
useEditionFeature()
const { permissionCodes, showTabs, initPermission, changeTab } =
  createProvider(props)
initPermission()
const tabData = [
  {
    label: '待办不良品',
    name: 'ToDoUnqualified',
    hidden: false,
    component: ToDoUnqualified,
  },
  {
    label: '产品判定记录',
    name: 'JudgmentRecord',
    hidden: false,
    component: JudgmentRecord,
  },
]

const changeTabFn = (type: any) => {
  changeTab(type)
}

// import editButton from './components/editButton.vue'
// import sdk from 'sdk'
// import { message } from './api/index'
// const { models } = sdk
// const { Language } = models
// const { _t } = Language
// import {
//   initPermission,
//   isHasPermission,
//   permissionCodes,
// } from './hooks/permission'

// export default defineComponent({
//   name: 'UnqualifiedManagent',
//   components: {
//     ToDoUnqualified,
//     JudgmentRecord,
//     editButton,
//   },
//   props: {
//     node: Object,
//   },
//   setup(props) {
//     message.init(getCurrentInstance())
//     const components: any = {
//       ToDoUnqualified,
//       JudgmentRecord,
//     }
//     const currentTab = ref('')
//     const changeTab = (name: string) => {
//       currentTab.value = name
//     }
//     initPermission(props)
//     const tabs = computed(() => {
//       const arr = []
//       if (permissionCodes.value.includes('ToDoUnqualified'))
//         arr.push('ToDoUnqualified')
//       if (permissionCodes.value.includes('JudgmentRecord'))
//         arr.push('JudgmentRecord')
//       changeTab(arr[0])
//       return arr
//     })

//     return { _t, components, currentTab, tabs, changeTab, isHasPermission }
//   },
// })
</script>
<style lang="scss" scoped>
.UnqualifiedManagent {
  background-color: #fff;
  border-radius: 5px 5px 0 0;
  width: 100%;
  height: 100%;
  border: 1px solid #dbdbdb;
}
</style>
