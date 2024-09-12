<template>
  <div class="OrderManagement">
    <Tab :data="headOptions" type="list" @Tab="changeTabFn" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, markRaw, shallowRef, computed } from 'vue'
import head from 'lodash/head'
import sdk from 'sdk'
const { models } = sdk
const { CanvasNode } = models
import OrderManagement from './views/order-management/index.vue'
import OrderRecords from './views/order-records/index.vue'
import { createProvider } from './hooks/use-permission'
import Tab from '@/components/Tab/Tab'
import { useEditionFeature } from '@/libs/Permission/Permission'

export default defineComponent({
  name: '工序管理',
  components: {
    OrderManagement,
    OrderRecords,
    Tab,
  },
  props: {
    node: CanvasNode,
  },
  setup(props) {
    useEditionFeature()
    const changeTabFn = (type: any) => {
      changeTab(type)
    }

    const { permissionCodes, showTabs, initPermission, changeTab } =
      createProvider(props)
    initPermission()
    const headOptions = shallowRef([
      {
        label: '工单管理',
        name: 'OrderManagement',
        component: markRaw(OrderManagement),
      },
      {
        label: '工单记录',
        name: 'OrderRecords',
        component: markRaw(OrderRecords),
      },
    ])

    const headActive = ref(head(headOptions.value)?.name)

    const headMap = headOptions.value.reduce((acc, item) => {
      // @ts-ignore
      acc[item.name] = item.component
      return acc
    }, {})
    // @ts-ignore
    const activeComponent = computed(() => headMap[headActive.value])

    // @ts-ignore
    const removeComponentsFromHeadOptions = (showTabs, headOptions) => {
      // @ts-ignore
      return headOptions.filter((option) => {
        if (option.name === 'OrderManagement')
          return showTabs.includes('Order-tabs-management')
        else if (option.name === 'OrderRecords')
          return showTabs.includes('Order-tabs-records')
        else return false
      })
    }

    headOptions.value = removeComponentsFromHeadOptions(
      showTabs.value,
      headOptions.value
    )

    return {
      headOptions,
      headActive,
      activeComponent,
      permissionCodes,
      showTabs,
      changeTabFn,
    }
  },
})
</script>
<style lang="scss" scoped>
$borderRadius: 4px;

.OrderManagement {
  background-color: #fff;
  border-radius: 5px 5px 0 0;
  width: 100%;
  height: 100%;
  border: 1px solid #dbdbdb;
}

.head {
  width: 100%;
  height: 46px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background-color: #e8e8e8;

  &-item {
    width: 128px;
    height: 34px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666666;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 16px;
  }

  &-active {
    color: #5a84ff;
    background-color: #fff;
    border: 1px solid #cfcfcf;
    border-radius: 4px;
    transition: all 0.3s;
  }
}

.container-box {
  height: auto;
  box-sizing: border-box;
  padding: 20px;
  overflow-y: scroll;
  background-color: #fff;
}

.permission-btn {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
