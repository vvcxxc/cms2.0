<template>
  <div class="cs-main">
    <div class="cs-menu-left" v-if="showMenu">
      <el-config-provider :namespace="namespace" :z-index="500" :locale="local">
        <Menu @change="onChangeMenu" />
      </el-config-provider>
    </div>
    <div
      class="cs-tools-box"
      @click="onClickToolBox"
      :style="{ left: showMenu ? '' : '5px' }"
    >
      <Icon
        :icon="showMenu ? 'left-arrow' : 'right-arrow'"
        :width="18"
        :height="18"
      ></Icon>
    </div>
    <div class="cs-container" :style="!showMenu ? 'width: 100%' : ''">
      <provider :isApp="true">
        <router-view v-bind="currentWidgetProps" />
      </provider>
      <div class="language">
        <LanguageSelect />
      </div>
    </div>
    <div
      class="cs-bar-box"
      @click="onClickBarBox"
      :style="{ right: showBar ? '' : '5px' }"
      v-if="showAction"
    >
      <Icon
        :icon="showBar ? 'right-arrow' : 'left-arrow'"
        :width="18"
        :height="18"
      ></Icon>
    </div>
    <div class="right-bar" v-if="showBar">
      <component
        :is="currentWidgetSettings"
        v-bind="state"
        @update="onUpdate"
      ></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, provide, markRaw } from 'vue'
import provider from './provider/index.vue'
import Menu from '@/components/Menu/index.vue'
import sdk from 'sdk'
import Icon from '@/components/Icon/Icon'
import LanguageSelect from '@/components/Language/Language'
import { useRoute } from 'vue-router'
import { state } from '@/libs/Store/State'

const { models } = sdk
const { Language } = models
const { local } = Language.useElementPlusI18n()
const route = useRoute()
const namespace = import.meta.env.VITE_APP_NAMESPACE
const v = localStorage.getItem('showMenu') || 'true'
const showMenu = ref(v === 'true')
const showBar = ref(false)
const showAction = ref(true)
const currentWidgetSettings = ref()
provide('isLocal', true)
/**
 * 右侧Bar控制
 */
const onClickBarBox = async () => {
  if (!currentWidgetSettings.value) {
    await getWidgetSettings()
    showBar.value = !!currentWidgetSettings.value
  } else {
    showBar.value = !showBar.value
  }
  localStorage.setItem('showBar', String(showBar.value))
}
/**
 * 左侧Bar
 */
const onClickToolBox = () => {
  showMenu.value = !showMenu.value
  localStorage.setItem('showMenu', showMenu.value ? 'true' : 'false')
}
const getWidgetSettingsFile = async (widgetName: string) => {
  const widgetPath = `./widgets/${widgetName}/Settings/${widgetName}.settings`
  const fn = async (suffix: string) => {
    const WidgetSettings = await import(/* @vite-ignore */ widgetPath + suffix)
    currentWidgetSettings.value = markRaw(WidgetSettings.default)
    showAction.value = true
    return currentWidgetSettings.value
  }
  try {
    await fn('.tsx')
  } catch (error) {
    await fn('.vue')
  }
}
/**
 * 获取当前组件
 */
const getWidgetSettings = async () => {
  const widgetName = route.meta?.widgetName
  if (!widgetName) {
    showBar.value = false
    return
  }

  try {
    await getWidgetSettingsFile(widgetName)
  } catch (error) {
    // console.info(`%c 请检查 ${widgetPath} 是否存在后，再重试`, 'color: #ec7259')
    showAction.value = false
    currentWidgetSettings.value = null
  }
}
/**
 * 更新数据状态
 * @param data
 */
const onUpdate = (data: Record<string, any>) => {
  Object.assign(state.value, data)
}
/**
 * 菜单切换
 */
const onChangeMenu = () => {
  state.value = {}
  showBar.value = false
  localStorage.setItem('showBar', 'false')
}

/**
 * 当前组件属性状态
 */
const currentWidgetProps = computed(() => {
  return {
    ...state.value,
    node: {
      props: {
        ...state.value,
      },
    },
  }
})
watch(
  () => route.meta,
  (meta) => {
    const vBar = localStorage.getItem('showBar') || 'true'
    showBar.value = vBar === 'true'
    currentWidgetSettings.value = null
    getWidgetSettings()
  }
)
</script>

<style>
body {
  margin: 0;
}
</style>
<style lang="scss" scoped>
@import url('./assets/iconfont/iconfont.css');

.cs-tools-box {
  width: 30px;
  height: 30px;
  position: absolute;
  left: 205px;
  bottom: 50px;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  opacity: 0.7;
  &:hover {
    background-color: #dae4ff;
    opacity: 1;
  }
}
.cs-main {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .cs-bar-box {
    width: 30px;
    height: 30px;
    position: absolute;
    right: 280px;
    bottom: 50px;
    background-color: #fff;
    border-radius: 5px;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 999;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    opacity: 0.7;
    &:hover {
      background-color: #dae4ff;
      opacity: 1;
    }
  }
  .right-bar {
    width: 280px;
    height: 100%;
    background-color: #252727;
    flex-shrink: 0;
    position: relative;
  }
  .cs-menu-left {
    width: 200px;
    height: 100%;
    background-color: #545c64;
  }
  .cs-container {
    width: calc(100% - 200px);
    height: 100%;
    overflow: auto;
    position: relative;
    .language {
      width: fit-content;
      height: fit-content;
      position: absolute;
      right: 30px;
      top: 23px;
    }
    > div {
      width: 100%;
      height: 1080px;
    }
  }
}
</style>
