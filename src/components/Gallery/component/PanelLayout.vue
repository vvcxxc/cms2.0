<template>
  <div class="panel-layout">
    <!-- search -->
    <section class="search">
      <el-input
        class="cms-el-input-x-search"
        v-model="keyword"
        @change="search"
        clearable
      />
    </section>
    <section style="position: relative">
      <!-- tab bar -->
      <section class="tab-wrapper">
        <!-- tabs -->
        <ul class="tabs">
          <li
            v-for="item in $props.tabs"
            :key="item.key"
            @click="tabChange(item)"
            :class="{ active: item.key == activeTab?.key }"
          >
            {{ item.name }}
          </li>
        </ul>
        <!-- sub tabs -->
        <div
          class="subtab-wrapper"
          :style="{ height: subTabBarToggle.wrapperHeight + 'px' }"
          v-if="activeTab?.nexts?.length"
        >
          <i
            v-show="subTabBarToggle.visible"
            class="iconfont icon-shouqifenlei toggle-btn"
            :class="{ active: subTabBarToggle.active }"
            @click="subTabBarToggle.toggle"
          />
          <ul class="subtab" ref="subTabBar">
            <li
              v-for="item in activeTab.nexts"
              :key="item.key"
              @click="subTabChange(item)"
              :class="{ active: item.key == activeSubTab?.key }"
              :style="{
                paddingRight: item.name?.length == 1 ? '34px' : 'auto',
              }"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
      </section>
      <!-- image list -->
      <section class="list">
        <ul
          ref="imageListRef"
          :style="{
            paddingTop: subTabBarToggle.diffHeight + 'px',
          }"
        >
          <li
            v-for="(item, i) in $props.data"
            :key="i + item.imageKey"
            :class="{ large: activeTab?.size == 'large' }"
          >
            <img
              :src="item.imageUrl"
              loading="lazy"
              :draggable="$props.draggable"
              :ondragstart="(e: DragEvent) => dragstart(e, item)"
              :ondragend="(e: DragEvent) => dragend(e, item)"
              @click="(e: Event) => click(e, item)"
              :class="{ 'un-draggable': !$props.draggable }"
            />
            <EllipsisTooltip
              class="name"
              width="100%"
              placement="bottom-start"
              :content="item.imageName"
            />
          </li>
        </ul>
      </section>
      <!-- empty -->
      <section class="empty" v-if="!$props.data.length">
        <span class="bg"></span>
        <span class="tip">暂无数据</span>
      </section>
    </section>
  </div>
</template>
<script lang="ts" setup>
import { reactive, nextTick, onMounted } from 'vue'
import EllipsisTooltip from '@/components/EllipsisTooltip/EllipsisTooltip.vue'
import { useEventListener } from '@vueuse/core'

interface Tab {
  name: string
  key: string
  nexts?: Tab[] | null
  size?: 'normal' | 'large'
}

const emit = defineEmits([
  'update:keyword',
  'onSearch',
  'onLoadMore',
  'onTabChange',
  'onSubTabChange',
  'imgDrag',
  'imgDragend',
  'imgTrigger',
])

const $props = withDefaults(
  defineProps<{
    tabs: Tab[]
    data: any
    activeTab?: Tab | null
    activeSubTab?: Tab | null
    keyword?: string
    draggable?: boolean
    loadMore?: boolean
  }>(),
  {
    draggable: true,
  }
)
let keyword = $ref($props.keyword)
let activeTab = $ref($props.activeTab)
let activeSubTab = $ref($props.activeSubTab)

// 搜索
function search() {
  emit('update:keyword', keyword)
  emit('onSearch', keyword)
}
// tab点击
function tabChange(tab: Tab) {
  activeTab = tab

  subTabBarToggle.visible = true
  subTabBarToggle.active = false

  if (tab.nexts && tab.nexts.length) {
    activeSubTab = tab.nexts[0]

    subTabBarToggle.getVisible()
    subTabBarToggle.toggle(false)
  }
  imageList.initScrollTop()

  emit('onTabChange', tab)
}
// subTab点击
function subTabChange(subTab: Tab) {
  activeSubTab = subTab

  imageList.initScrollTop()

  emit('onSubTabChange', subTab)
}
// 图片拖拽开始
function dragstart(e: DragEvent, item: any) {
  emit('imgDrag', e, item)
}
// 图片拖拽结束
function dragend(e: DragEvent, item: any) {
  emit('imgDragend', e, item)
}
// 图片点击
function click(e: Event, item: any) {
  // 可拖拽时不触发
  if (!$props.draggable) {
    emit('imgTrigger', e, item)
  }
}

// subTabBarToggle ----------------------------------------------
// 子菜单 展开/收起
const subTabBar = $ref<HTMLElement | undefined>()
const subTabBarToggle = reactive({
  wrapperHeight: 25,
  diffHeight: 0, // 展开-收起 高度差
  visible: true, // 显示
  active: false, // 展开
  getVisible() {
    nextTick(() => {
      const ulH = subTabBar?.clientHeight || 0
      const liH = subTabBar?.firstElementChild?.clientHeight || 0
      subTabBarToggle.visible = ulH > liH
    })
  },

  toggle(value: boolean) {
    const setValue = (
      active: boolean,
      wrapperHeight: number,
      diffHeight: number
    ) => {
      subTabBarToggle.active = active
      subTabBarToggle.wrapperHeight = wrapperHeight
      subTabBarToggle.diffHeight = diffHeight
    }

    if (value === false) {
      // 收起
      setValue(false, 25, 0)
      return
    }

    if (!subTabBar) return

    const ulH = subTabBar?.clientHeight || 0
    const liH = subTabBar?.firstElementChild?.clientHeight || 0
    const ulWrapperH = subTabBar?.parentElement?.clientHeight || 0

    if (ulWrapperH > liH) {
      // 收起
      setValue(false, liH, 0)
    } else {
      // 展开
      setValue(true, ulH, ulH - liH)
    }
  },
})

// imageList ----------------------------------------------------
// 图片列表容器
const imageListRef = $ref<HTMLElement | undefined>()
const imageList = reactive({
  // 重置滚动条到顶部
  initScrollTop() {
    nextTick(() => {
      if (imageListRef) imageListRef.scrollTop = 0
    })
  },
  // 滚动到底部时触发加载更多事件
  loadMoreInBottom() {
    if (!imageListRef) return
    const { scrollHeight, scrollTop, clientHeight } = imageListRef

    if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
      if ($props.loadMore) {
        emit('onLoadMore')
      }
    }
  },
  // 滚动事件监听
  scrollEventListen() {
    if (!imageListRef) return
    useEventListener(imageListRef, 'scroll', imageList.loadMoreInBottom)
  },
})

onMounted(() => {
  imageList?.scrollEventListen()
})

/**导出 */
defineExpose({
  tabChange,
})
</script>
<style lang="scss" scoped>
@import '../industrial-black.scss';

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.search {
  width: 100%;
  padding: 16px 20px 0;
  :deep(.el-input__inner) {
    height: 32px;
    line-height: 32px;
  }
}
.panel-layout {
  min-width: 100%;
  height: 100%;
  background: var($--cms-color-bg-13);
  border-radius: 6px;
  font-size: var(--cms-font-size-extra-small); //12
  color: var(--cms-text-color-regular-3); //D3D3D3
  .tab-wrapper {
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 1;
    width: 352px;
    margin: 16px 20px 0;
    padding-bottom: 16px;
    background: var(--cms-color-bg-13);
    ul.tabs {
      display: flex;
      overflow-y: hidden;
      overflow-x: scroll;
      margin-bottom: -8px;
      li {
        flex-shrink: 0;
        min-width: 60px;
        height: 28px;
        padding: 0 10px;
        margin-left: 10px;
        line-height: 28px;
        text-align: center;
        border-radius: 2px;
        transition: all 0.2s;
        word-break: keep-all;
        cursor: pointer;
        background: var(--cms-color-bg-14);
        &.active {
          color: #fff;
          background: var(--cms-color-primary-1);
        }
      }
      li:first-child {
        margin-left: 0px;
      }
    }
    .subtab-wrapper {
      position: relative;
      overflow: hidden;
      margin-top: 10px;
      border-top: 1px solid #474747;
      transition: all 0.32s;
      .toggle-btn {
        position: absolute;
        padding: 5px;
        right: -5px;
        top: 6px;
        font-size: 12px;
        color: #545353;
        transition: all 0.32s;
        cursor: pointer;

        &.active {
          color: var(--cms-color-primary-2);
          transform: rotate(-180deg);
        }
      }
    }
    ul.subtab {
      display: flex;
      flex-wrap: wrap;
      li {
        padding: 10px 26px 0 0;
        cursor: pointer;
        &.active {
          color: var(--cms-color-primary-2);
        }
      }
    }
  }
  .list {
    position: absolute;
    left: 0;
    top: 98px;
    width: 100%;
    ul {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      height: 470px;
      overflow-y: scroll;
      padding: 0 0 10px 22px;
      border-radius: 6px;
      transition: all 0.32s;
      li {
        width: 80px;
        margin-right: 10px;
        margin-bottom: 16px;

        &:nth-child(4n) {
          margin-right: 0;
        }

        img {
          width: 100%;
          background: #141414;
          border-radius: 6px;
          border: 1px solid #141414;
          padding: 8px 10px;
          object-fit: contain;
          cursor: copy;
          flex: none;
          aspect-ratio: 1/1;
          &.un-draggable {
            cursor: pointer;
          }

          &:hover {
            border-color: var(--cms-color-primary-1);
          }
        }
        .name {
          width: 100%;
          padding-top: 6px;
          text-align: center;
          color: #949494;
        }
      }
      li.large {
        width: 158px;
        margin-right: 0px;
        margin-bottom: 16px;
        &:nth-child(odd) {
          margin-right: 26px;
        }
        img {
          width: 100%;
          height: 92px;
        }
      }
    }
  }
  .empty {
    position: absolute;
    top: 210px;
    left: 0;
    width: 100%;
    .bg {
      display: block;
      margin: 0 auto;
      width: 52px;
      height: 41px;
      background-image: url('@/assets/images/resource-empty.png');
      background-size: 100%;
    }
    .tip {
      display: block;
      margin: 18px auto 0;
      padding: 6px 0;
      width: 100px;
      text-align: center;
      font-size: var(--cms-font-size-extra-small);
      background: #313131;
    }
  }
}
</style>
