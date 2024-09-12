<template>
  <el-menu
    :default-active="defaultActive"
    class="cs-menu-vertical-demo"
    :collapse="isCollapse"
    active-text-color="#fff"
    background-color="#545c64"
    text-color="#fff"
    @select="handleSelected"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-menu-item v-for="item in routes" :index="item.path">
      <div class="menu-li">
        <div class="icon">
          <img
            width="16"
            v-if="!item.icon.includes('icon-')"
            :src="
              item.icon.includes('icon-')
                ? item.icon
                : `../../../src/assets/svg/${item.icon}.svg`
            "
          />
          <i
            v-else-if="item.icon"
            :class="{
              iconfont: true,
              [item.icon]: true,
            }"
          ></i>
          <el-icon v-else><document /></el-icon>
        </div>
        {{ item.name }}
      </div>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Document, Menu as IconMenu } from '@element-plus/icons-vue'
import { routeInfo } from '@/router'
import { useRouter } from 'vue-router'
const emit = defineEmits(['change'])
const router = useRouter()

const routes = computed(() => {
  return routeInfo.routes || []
})
const isCollapse = ref(true)

const defaultActive = computed(() => {
  return location.hash.split('#')[1]
})

const handleSelected = (index: string) => {
  emit('change')
  router.push(index)
}
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style lang="scss" scoped>
.cs-menu-vertical-demo {
  position: relative;
  width: 201px;
  height: 100%;
  background-color: #000000 !important;
  overflow-y: auto;
  // overflow-x: inherit;

  :deep(.is-active) {
    background-color: #292929;
    border-right: 5px solid #5a84ff;
  }
  :deep(.cs-menu-item) {
    &:hover {
      background-color: #292929;
    }
  }
}

.menu-li {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .icon {
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
