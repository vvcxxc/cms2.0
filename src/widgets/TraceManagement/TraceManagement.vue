<template>
  <div class="TraceManagement">
    <div class="TraceManagement_wrap">
      <Tab :data="tabData" type="list" :permissions="permissionBtns" />
      <!-- <div class="page">
        <component :is="components[currentTab]" :permissions="permissionBtns" />
      </div> -->
    </div>
    <!-- <div v-else class="permission-btn">
      {{ _t('无权限查看') }}
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onUnmounted } from 'vue'
import TraceBack from './pages/TraceBack.vue'
import Setting from './pages/Setting.vue'
import editButton from './components/editButton.vue'
import Tab from '@/components/Tab/Tab'
import { useEditionFeature } from '@/libs/Permission/Permission'

export default defineComponent({
  name: 'TraceManagement',
  components: {
    TraceBack,
    Setting,
    editButton,
    Tab,
  },
  props: {
    node: {
      type: Object,
      require: true,
    },
  },
  setup(props) {
    useEditionFeature()
    const tabData: any = [
      {
        label: '追溯报表',
        name: 'trace-tab-TraceBack',
        hidden: false,
        component: TraceBack,
      },
      {
        label: '报表配置',
        name: 'trace-tab-Setting',
        hidden: false,
        component: Setting,
      },
    ]

    let node: any = reactive(props.node || {})
    let permissionBtns = reactive<string[]>([])
    let currentTab = ref('TraceBack')
    const showTabs: any = ref([])
    const allTabs = ['trace-tab-TraceBack', 'trace-tab-Setting']

    if (showTabs.value.length !== 0) {
      let tab = showTabs.value[0]
      currentTab.value = tab.substring(tab.lastIndexOf('-') + 1, tab.length)
    }
    const components: any = {
      TraceBack,
      Setting,
    }
    const changeTab = (name: string) => {
      currentTab.value = name
    }

    return {
      _t,
      t,
      components,
      // collect,
      currentTab,
      showTabs,
      permissionBtns,
      changeTab,
      tabData,
    }
  },
})
</script>
<style lang="scss" scoped>
.TraceManagement {
  background-color: #fff;
  border-radius: 5px 5px 0 0;
  width: 100%;
  height: 100%;
  border: 1px solid #dbdbdb;

  .TraceManagement_wrap {
    width: 100%;
    height: 100%;

    .TraceManagement_tab {
      display: flex;
      align-items: center;
      padding: 10px 22px;
      box-sizing: border-box;

      .TraceManagement_tab_item {
        width: 120px;
        height: 40px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        font-size: 16px;
        color: #787878;
        background-color: #f4f8fe;
        border: 1px solid #dbdfe7;
        cursor: pointer;
      }

      .current_tab_item {
        color: #fff;
        background-color: #5a84ff;
        border: none;
      }
    }

    .baseMenu {
      border-bottom: none;
    }

    .page {
      width: 100%;
      height: calc(100% - 72px);
    }
  }
}
</style>
