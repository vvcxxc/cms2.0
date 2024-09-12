<template>
  <div class="gallery" :class="{ 'un-draggable': !$props?.draggable }">
    <ul class="tabs">
      <li
        v-for="(item, i) in tabs"
        :key="i"
        @click="change(item)"
        :class="{ active: item.label == activeTab.label }"
      >
        {{ item.label }}
      </li>
    </ul>
    <div class="panels">
      <component
        :is="activeTab.compt"
        :galleryLabel="activeTab.label"
        :draggable="$props?.draggable"
        @imgDrag="imgDrag"
        @imgTrigger="imgTrigger"
      ></component>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { shallowRef, defineAsyncComponent } from 'vue'

const $props = withDefaults(
  defineProps<{
    // 非组件箱面板时图片不可拖拽
    draggable?: boolean
    // 默认激活面板
    activeIndex?: 0 | 1
  }>(),
  {
    draggable: true,
    activeIndex: 0,
  }
)

const emit = defineEmits(['imgDrag', 'imgTrigger'])

// emit: imgDrag
function imgDrag(e: DragEvent, imgData: any) {
  emit('imgDrag', e, imgData)
}

// emit: imgTrigger
function imgTrigger(imageUrl: string) {
  emit('imgTrigger', imageUrl)
}

const tabs = shallowRef([
  {
    label: '官方',
    compt: defineAsyncComponent(() => import('./OfficialMaterial.vue')),
  },
  {
    label: '我的',
    compt: defineAsyncComponent(() => import('./GalleryMaterial.vue')),
  },
])

const activeTab = shallowRef(tabs.value[$props.activeIndex])

function change(tab: any) {
  activeTab.value = tab
}
</script>
<style lang="scss" scoped>
@import './industrial-black.scss';

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.gallery {
  width: 390px;
  border-radius: 6px;
  background: var(--cms-color-bg-13);
  &.un-draggable {
    padding-top: 16px;
  }
  ul.tabs {
    display: flex;
    margin: 0 20px;
    background: var(--cms-color-bg-14);
    li {
      flex: 1;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-weight: 500;
      font-size: var(--cms-font-size-base); // 14px
      color: var(--cms-text-color-regular-3); // D3D3D3
      border-radius: 3px;
      transition: all 0.2s;
      cursor: pointer;
      &.active {
        color: var(--cms-color-primary-2);
        background: rgba($--cms-color-primary-2, 0.1);
      }
    }
  }
  .panels {
    width: 100%;
    height: 616px;
    background: var(--cms-color-bg-13);
  }
}
</style>
