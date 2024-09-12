<!-- 
  <SettingItem :title="string?">
    content
  </SettingItem>
 -->
<template>
  <div class="setting-item">
    <el-collapse
      v-if="props.title"
      v-model="state.SettingItemModel"
      :accordion="state.accordion"
    >
      <el-collapse-item :title="props.title" :name="props.title">
        <template #title>
          <slot name="title" />
        </template>

        <slot>settingItemCollapse</slot>
      </el-collapse-item>
    </el-collapse>
    <slot v-else>settingItem</slot>
  </div>
</template>

<script setup lang="ts">
import { watch, inject } from 'vue'
import { state } from './state'
const isLocal = inject('isLocal')

const props = defineProps({
  title: {
    default: '',
  },
  /**
   * 是否折叠，默认false不折叠
   * */
  fold: {
    type: Boolean,
    default: false,
  },
})

const initSelect = () => {
  if (state.accordion) {
    if (props.title && !state.SettingItemModel) {
      state.SettingItemModel = props.title
    }
  } else {
    if (isLocal) {
      if (props.title && !props.fold) {
        if (Array.isArray(state.SettingItemModel)) {
          state.SettingItemModel.push(props.title)
        } else {
          state.SettingItemModel = [props.title]
        }
      }
    }
  }
}
watch(
  () => state.init,
  (val) => {
    if (val) {
      initSelect()
      setTimeout(() => {
        state.init = false
      })
    }
  },
  {
    immediate: true,
  }
)
</script>

<style lang="scss" scoped>
.setting-item {
  &::before,
  &::after {
    content: '';
    display: block;
    margin: 10px;
    clear: both;
  }

  min-height: 2em;
  padding: 0 10px;
  border: solid 1px #000;
  border-left: 0;
  border-right: 0;
  margin-top: -1px;
  margin-left: 0;
  font-size: 12px;
  color: #949494;
  :deep(.el-collapse-item__header) {
    border: 0;
    width: 100%;
    cursor: pointer;
    margin-left: -6px;
  }

  :deep(.el-collapse-item__content) {
    padding-bottom: 0;
    color: #949494;
  }
  :deep(.el-collapse-item__arrow) {
    margin-right: 0;
  }

  :deep(.cms-el-select-x .el-input__inner) {
    &::-webkit-input-placeholder {
      color: #606162;
      font-weight: bold;
    }
  }
}
</style>
