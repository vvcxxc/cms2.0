<template>
  <div class="collapse" :class="{ 'collapsed': isCollapsed }">
    <div class="header">
      <div class="header-left" @click="toggleCollapse">
        <transition name="icon">
          <div :class="['icon', themeClass]" :key="'isCollapsed'">
            <span v-if="isCollapsed" class="triangle right"></span>
            <span v-else class="triangle"></span>
          </div>
        </transition>
        <div :class="['text', themeClass]">{{ $props.title }}</div>
      </div>
      <div class="header-right">
        <slot name="header-right"></slot>
      </div>
    </div>
    <transition name="collapse">
      <div class="content" v-if="!isCollapsed">
        <slot name="content"></slot>
      </div>
    </transition>
    <div class="slot">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { ORDER_STATUS } from '../../enum'

const $props = defineProps<{
  title: string
  status: number
}>()

const THEME_MAP = {
  [ORDER_STATUS.PRODUCTION]: 'PRODUCTION',
  [ORDER_STATUS.PRODUCED]: 'PRODUCED',
  [ORDER_STATUS.PAUSED]: 'PAUSED',
  [ORDER_STATUS.NOT_ACTIVE]: 'NOT_ACTIVE',
}

const isCollapsed = ref(false)

const themeClass = computed(() => THEME_MAP[$props.status])

const toggleCollapse= () => {
  isCollapsed.value = !isCollapsed.value;
}
</script>

<style lang="scss" scoped>
.collapse {
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 10px;
  background-color: #f1f1f1;
  font-size: 16px;
  font-weight: bold;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}
.header-left {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f1f1f1;
  cursor: pointer;
  font-weight: bold;
}

.icon {
  width: 20px;
  height: 20px;
  line-height: 1;
  border-radius: 50%;
  text-align: center;
  margin-right: 5px;
  font-weight: bold;
}

.content {
  background-color: #ffffff;
}
.triangle {
  display: inline-block;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 5px 0 5px;
  border-color: #fff transparent transparent transparent;
}

.right {
  transform: rotate(270deg);
  position: relative;
  top: -1px;
  right: -1px;
}

.PRODUCTION {
  &.icon{
    background-color: #426aeb;
  }
  &.text {
    color: #426aeb;
  }
}
.PRODUCED {
  &.icon {
    background-color: #f3b666;
  }
  &.text {
    color: #f3b666;
  }
}
.PAUSED {
  &.icon {
    background-color: #ea7a76;
  }
  &.text {
    color: #ea7a76;
  }
}
.NOT_ACTIVE {
  &.icon {
    background-color: #737373;
  }
  &.text {
    color: #737373;
  }
}
</style>