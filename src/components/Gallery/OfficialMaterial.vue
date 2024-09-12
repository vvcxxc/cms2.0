<template>
  <div class="gallery-official">
    <PanelLayout
      ref="PanelLayoutRef"
      v-model:keyword="keyword"
      :tabs="tabs"
      :data="imageList"
      :draggable="$props?.draggable"
      :loadMore="true"
      @onLoadMore="loadMore"
      @onSearch="search"
      @onTabChange="tabChange"
      @onSubTabChange="subTabChange"
      @imgDrag="imgDrag"
      @imgTrigger="imgTrigger"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import PanelLayout from './component/PanelLayout.vue'
import { getImageTree } from './api'
import { createProjectImg } from './index'
import request from '@/utils/request'

const PanelLayoutRef = ref<InstanceType<typeof PanelLayout>>()

const emit = defineEmits(['imgDrag', 'imgTrigger'])

const $props = defineProps<{
  galleryLabel: string
  draggable?: boolean
}>()

interface Tab {
  name: string
  key: string
  nexts?: Tab[] | null
  size?: 'normal' | 'large'
}

let tabs: Tab[] = $ref([])
let imageList: any = $ref([])
let imageListTotal: any = []

// 滚动到底部自动加载下20条数据
const pagination = {
  size: 20, // 每次加载条数
  count: 0, // 当前加载次数
  total: 0, // 数据总条数
}
function loadMore() {
  if (pagination.total > imageList.length) {
    const size = pagination.size
    const count = pagination.count

    const newData = imageListTotal.slice(count * size, (count + 1) * size)
    imageList = imageList.concat(newData)

    pagination.count += 1
  }
}

// search
let keyword = $ref('')
async function search() {
  tabs = []
  imageList = []
  await getNav()
  if (tabs.length) {
    PanelLayoutRef.value?.tabChange(tabs[0])
  }
}

// tab click
let groupPath: string = $ref($props.galleryLabel)
function tabChange(tab: Tab) {
  groupPath = tab?.nexts?.length ? tab.nexts[0].key : tab.key
  getData(groupPath)
}
function subTabChange(subTab: Tab) {
  groupPath = subTab.key
  getData(groupPath)
}

const getNav = () => {
  return request({
    url: `/api/v1/view/image/gallery/struct?group=${$props.galleryLabel}&keyword=${keyword}`,
    method: 'get',
    silent: true,
  }).then((res: any) => {
    if (res?.nexts) {
      res.nexts.forEach((e: Tab) => {
        if (e.name == '设计素材') e.size = 'large'
        if (e.nexts) {
          const total: Tab = {
            key: e.key,
            name: '全部',
            nexts: null,
          }
          e.nexts.unshift(total)
        }
      })
      tabs = res.nexts
    }
  })
}
const getData = (groupPath: string = $props.galleryLabel) => {
  const BASE_URL = request.defaults.baseURL
  return getImageTree(keyword, groupPath).then((res: any) => {
    imageList = []
    imageListTotal = []
    if (res?.values) {
      res.values.forEach((e: any) => {
        e.imageUrl = `${BASE_URL}/api/v1/view/image/gallery/${e.imageKey}?compress=true&maxWidth=158&maxHeight=92&group=${e.groupKey}`
      })

      imageListTotal = res.values

      pagination.count = 0
      pagination.total = imageListTotal.length

      loadMore()
    }
  })
}

// emit: imgDrag
function imgDrag(e: DragEvent, item: any) {
  emit('imgDrag', e, item)
}
// emit: imgTrigger
async function imgTrigger(e: DragEvent, item: any) {
  const imageUrl = await createProjectImg(item.groupKey, item.imageKey)
  emit('imgTrigger', imageUrl)
}

onMounted(async () => {
  await getNav()

  if (tabs.length) {
    PanelLayoutRef.value?.tabChange(tabs[0])
  }
})
</script>
<style lang="scss" scoped>
.gallery-official {
  height: 616px;
  overflow: hidden;
}
</style>
