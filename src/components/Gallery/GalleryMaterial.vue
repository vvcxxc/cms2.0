<!-- 图片素材 -->
<template>
  <div class="component-gallery-material">
    <div class="component-gallery-material-other">
      <div class="component-box-module-search-input">
        <el-input
          class="cms-el-input-x"
          v-model="searchKeyWord"
          @change="getImageTreefun"
          clearable
        >
        </el-input>
      </div>

      <el-button
        @click="selectModeFun"
        class="iconfont icon-piliang icon-operations"
        :class="{
          active: select,
          'icon-piliang': !selectedMap.size,
          'icon-qingchu': selectedMap.size,
        }"
        :title="!selectedMap.size ? '选择模式' : '批量删除'"
      ></el-button>
      <el-button
        @click="addImageFileFun"
        class="iconfont icon-wenjianjia icon-operations folder"
        title="新建文件夹"
        data-tooltip-placement="bottom-start"
      ></el-button>
      <el-button
        @click="uploadImage"
        :disabled="!allPictureList?.length"
        class="iconfont icon-daoru2 icon-operations"
        title="导入"
      ></el-button>
      <el-button
        @click="exportFile.open"
        :disabled="!allPictureList?.length"
        class="iconfont icon-daochu3 icon-operations"
        title="导出"
      ></el-button>
      <!-- <el-button
        @click="batchDeletePic"
        class="iconfont icon-qingchu icon-operations"
        title="删除"
      ></el-button> -->
    </div>
    <div
      class="component-gallery-material-collapse"
      id="galleryMaterialId"
      ref="galleryMaterialRef"
    >
      <el-collapse
        v-for="(item, index) in pictureList"
        @change="collapseChange(item)"
        :key="'collapse' + index"
        v-model="activeList"
        ref="collRef"
        id="collId"
        class="collId"
      >
        <el-collapse-item :name="item.key">
          <template v-slot:title>
            <div class="component-gallery-material-collapse-title">
              <div
                class="component-gallery-material-collapse-icon"
                :class="{ 'is-ative': item.isActive }"
              >
                <i class="iconfont icon-xiala2"></i>
              </div>
              <input
                class="collapse-title-input"
                :ref="(el) => setItemTitleRef(el, item.key)"
                @click="titleInputClick($event, item)"
                @blur="collapseItemEditor(item)"
                @keydown.enter.stop.prevent="titleRefs[item.key]?.blur()"
                :disabled="item.isDisabled"
                v-model="item.name"
              />
            </div>
            <div class="component-gallery-material-collapse-righticon">
              <span
                class="iconfont icon-bianjigongcheng left-icon"
                title="编辑"
                @click.stop="collapseItemEditIconClick(item)"
              ></span>
              <span
                class="iconfont icon-qingchu right-icon"
                title="删除"
                @click.stop="collapseItemDelete(item, index)"
              ></span>
            </div>
          </template>
          <div class="component-gallery-material-list">
            <div
              v-show="item.items.length"
              v-for="(item1, index1) in item.items"
              :key="index1"
              onselectstart="return false"
              class="component-gallery-material-list-item"
            >
              <div
                class="component-gallery-material-list-item-img"
                :class="{
                  active: selectedMap.has(item1.groupKey + item1.imageKey),
                }"
                @mouseenter="listItemMouseEnter(item1)"
                @mouseleave="listItemMouseLeave(item1)"
              >
                <img
                  :draggable="draggable"
                  :ondragstart="(e: DragEvent) => drag(e, item1)"
                  :ondragend="(e: DragEvent) => dragend(e, item1,item)"
                  @click="imgTrigger(item1, item)"
                  :src="item1.imgUrl"
                  loading="lazy"
                  class="item-img"
                  :class="{
                    'un-draggable': !props.draggable,
                  }"
                />
                <div class="img-icon" v-show="item1.showIcon">
                  <!-- 下载图片 -->
                  <span
                    class="iconfont icon-baocuntupian"
                    title="下载图片"
                    data-tooltip-placement="bottom-start"
                    @mousedown.stop
                    @click="downloadPic(item1)"
                  ></span>

                  <!-- 删除图片 -->
                  <span
                    class="iconfont icon-qingchu"
                    title="删除"
                    @mousedown.stop
                    @click="deletePic($event, item1, index, index1)"
                  ></span>
                </div>
                <!-- 选中图片 -->
                <span
                  v-if="selectedMap.has(item1.groupKey + item1.imageKey)"
                  class="iconfont icon-gouxuan"
                ></span>
              </div>
              <div
                v-if="item1.isDisabled"
                class="item-img-title show"
                @dblclick="editImgName(item1)"
              >
                <EllipsisTooltip
                  width="100%"
                  placement="bottom-start"
                  :content="item1.name"
                  :key="item1.name"
                />
              </div>
              <div v-else class="item-img-title edit">
                <el-input
                  class="cms-el-input-x img-input"
                  :ref="(el:any) => setImgRef(el, item1.key)"
                  @blur="saveImgName(item1)"
                  @keydown.enter.prevent="$event.target?.blur()"
                  v-model="item1.leftName"
                />
                <span> .{{ item1.type }}</span>
              </div>
            </div>
            <div v-show="!item.items.length" class="no-image-class">
              <el-image :src="defaultImg"></el-image>
              <div class="no-image-class-tips">
                暂无，请先
                <el-upload
                  :multiple="true"
                  :limit="100"
                  class="el-upload"
                  name="formFiles"
                  :on-success="uploadSuccess"
                  action=""
                  :show-file-list="false"
                  :accept="ACCEPT.join(',')"
                  :headers="headers"
                  :auto-upload="false"
                  :on-change="(file:any) => onChange(file, item.key)"
                >
                  <span>上传图片</span>
                </el-upload>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- 无分组数据时 -->
    <div v-if="!pictureList?.length" class="component-gallery-material-empty">
      <el-image :src="defaultImg"></el-image>
      <p>暂无，请先 <span @click="addImageFileFun">添加文件夹</span></p>
    </div>
    <div v-show="uploadNumber" class="component-gallery-material-uploadshow">
      <!-- <el-progress :text-inside="true" :stroke-width="26" :percentage="progressNumber / uploadNumber * 100" /> -->
      <div class="uploadshow-box">
        <span>正在上传图片{{ progressNumber }}/{{ uploadNumber }}</span>
        <span style="float: right"
          >{{ ((progressNumber / uploadNumber) * 100).toFixed(2) }}%</span
        >
        <div
          class="uploadshow-progress"
          :style="{ width: (progressNumber / uploadNumber) * 100 + '%' }"
        ></div>
      </div>
    </div>
    <!-- 导入图片 -->
    <el-dialog
      v-model="dialogVisible"
      title="导入图片"
      custom-class="cms-el-dialog"
      width="450px"
      top="16%"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <el-select
        v-model="lastFileName"
        class="cms-el-select"
        popper-class="cms-el-select__popper"
      >
        <el-option
          v-for="(item, index) in allPictureList"
          :key="index"
          :label="item.name"
          :value="item.key"
        />
      </el-select>
      <div class="tips">支持批量上传 {{ ACCEPT_TEXT }}</div>
      <div class="el-dialog__footer">
        <el-upload
          :multiple="true"
          :limit="100"
          class="el-upload"
          name="formFiles"
          :on-success="uploadSuccess"
          action=""
          :show-file-list="false"
          :accept="ACCEPT.join(',')"
          :headers="headers"
          :auto-upload="false"
          :on-change="(file:any) => onChange(file, lastFileName)"
        >
          <button class="btn btn-submit">选择图片</button>
        </el-upload>

        <!-- <button class="btn btn-submit" @click="submitForn">选择图片</button> -->
        <button class="btn btn-normal" @click="closeDialog">取消</button>
      </div>
    </el-dialog>
    <!-- 导出图片 -->
    <el-dialog
      v-model="exportFile.visible"
      title="导出图片"
      custom-class="cms-el-dialog"
      width="450px"
      top="16%"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <el-select
        v-model="exportFile.group"
        class="cms-el-select"
        popper-class="cms-el-select__popper"
      >
        <el-option
          v-for="(item, index) in allPictureList"
          :key="index"
          :label="item.name"
          :value="item.key"
        />
      </el-select>
      <div class="tips">将以上文件夹的图片导出至</div>
      <div class="el-dialog__footer">
        <button class="btn btn-submit" @click="exportFile.confirm">
          {{ exportFile.confirmText }}
        </button>
        <button class="btn" @click="exportFile.close">取消</button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import {
  PropType,
  ref,
  Ref,
  onMounted,
  onUnmounted,
  nextTick,
  reactive,
} from 'vue'
import {
  getImageTree,
  addImageFile,
  delGroupAllImage,
  reGroupName,
  reGroupImageName,
  delGroupImageFile,
  updateImg,
} from './api'
import request from '@/utils/request'
import defaultImg from '@/assets/images/noImage.png'
import { ElMessage, ElMessageBox } from 'element-plus'
import { uploadBefore, createProjectImg } from './index'
import EllipsisTooltip from '@/components/EllipsisTooltip/EllipsisTooltip.vue'
import { utils } from '@/utils'
const { toast } = '@/libs/Socket/toast'
import JSZip from 'jszip'

export interface headerCardType {
  title: string
}
export interface CollapseList {
  id: number | string
  title: string
  components: Array<any>
  isActive: boolean
}

function collapseChange(item: any) {
  item.isActive = !item.isActive
  scroll()
  let galleryHeight = galleryMaterialRef.clientHeight
  nextTick(() => {
    let height = 0
    while (
      galleryHeight > height &&
      allPictureList.length > pictureList.value.length
    ) {
      pictureList.value.push(allPictureList[pictureList.value.length])
      setTimeout(() => {
        const element =
          document.getElementsByClassName('collId')[
            pictureList.value.length - 1
          ]
        height += element.clientHeight
      })
    }
  })
}

const emit = defineEmits(['list-item-mouse-down', 'imgDrag', 'imgTrigger'])
let props = defineProps({
  galleryLabel: {
    type: String,
    default: '我的',
  },
  draggable: {
    type: Boolean,
    default: true,
  },
  modelType: {
    type: String as PropType<String>,
    required: false,
    default: () => {
      return ''
    },
  },
  components: {
    type: Array as PropType<Array<any>>,
    required: false,
    default: () => {
      return []
    },
  },
})

const ACCEPT = ['.jpg', '.jpeg', '.png', '.gif', '.svg'] //限制的文件类型
const ACCEPT_TEXT = ACCEPT.map((e) => e.slice(1))
  .join('/')
  .toUpperCase()
const BASE_URL = request.defaults.baseURL //默认IP
const galleryMaterialRef = $ref<HTMLElement>()
const collRef = $ref()

let headers: Ref<any> = ref({})
let searchKeyWord = ref('')
let lastFileName: Ref<string> = ref('')
let dialogVisible: Ref<Boolean> = ref(false)

let pictureList = ref<Array<any>>([])
let activeList: Ref<Array<any>> = ref([])

// 选择模式
const select = ref(false)
const selectedMap = ref(new Map())

let titleRefs: any = {}
let imgRefs: any = {}
const setItemTitleRef = (el: any, key: string) => {
  if (el) {
    titleRefs[key] = el
  }
}
const setImgRef = (el: any, key: string) => {
  if (el) {
    imgRefs[key] = el
  }
}

//图片拖拽
function drag(el: DragEvent, item: any) {
  emit('imgDrag', el, item)
}
//图片拖拽结束
function dragend(el: DragEvent, item: any, groupItem: any) {}
// 图片点击
async function imgTrigger(item: any, groupItem: any) {
  // 允许拖拽时不执行
  if (!props.draggable) {
    let imgUrl = await createProjectImg(groupItem.key, item.key)
    emit('imgTrigger', imgUrl)
  }
  if (select.value) {
    const key = item.groupKey + item.imageKey
    if (selectedMap.value.has(key)) {
      selectedMap.value.delete(key)
    } else {
      selectedMap.value.set(key, item)
    }
  }
}

const titleInputClick = (el: MouseEvent, item: any) => {
  if (!item.isDisabled) {
    el.stopPropagation()
  }
}

//鼠标进入
const listItemMouseEnter = (item: any) => {
  if (!select.value) {
    item.showIcon = true
  }
}

//鼠标离开
const listItemMouseLeave = (item: any) => {
  item.showIcon = false
}

//点击上传图片按钮
const uploadImage = () => {
  if (lastFileName.value == '' && allPictureList.length) {
    lastFileName.value = allPictureList[0].key
  }
  dialogVisible.value = true
}

//图片下载
const downloadPic = (item: any) => {
  fetchBlob(item.imgUrl, 'GET').then((blob) => {
    utils.downFile(blob, item.name)
  })
}

//图片名称编辑
let oldImgLeftName = ''
const editImgName = (item: any) => {
  oldImgLeftName = item.leftName
  item.isDisabled = false
  nextTick(() => {
    imgRefs[item.key].select()
  })
}
//图片名称保存
const saveImgName = (item: any) => {
  item.isDisabled = true

  if (item.leftName == oldImgLeftName) return

  if (!item.leftName.trim()) {
    ElMessage({
      message: `图片名字不能为空`,
      type: 'error',
      customClass: 'cms-el-message el-message--error',
    })
    item.leftName = oldImgLeftName
    return
  }

  const newName = item.leftName + '.' + item.type
  reGroupImageName(item.groupKey, item.key, newName)
    .then((res: any) => {
      if (res && res.imageKey && res.imageName) {
        const key = res.imageKey
        const name = res.imageName
        item.imageKey = key
        item.imageName = name
        item.leftName = name.substring(0, name.lastIndexOf('.'))
        item.imgUrl = createImageUrl(key, item.groupKey)
        item.key = key
        item.name = name
      }
      if (!res) {
        ElMessage({
          message: `编辑失败`,
          type: 'error',
          customClass: 'cms-el-message el-message--error',
        })
        item.leftName = oldImgLeftName
      }
    })
    .catch(() => {
      item.leftName = oldImgLeftName
    })
}

//图片删除
const deletePic = async (
  el: MouseEvent,
  item: any,
  index: number,
  index1: number
) => {
  delGroupImageFile(item.groupKey, item.key).then(() => {
    pictureList.value[index].items.splice(index1, 1)
  })
}

// 图片批量删除
const batchDeletePic = async () => {
  ElMessageBox.confirm('是否确认操作，将删除选中的图片', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  }).then(fn)
  function fn() {
    Array.from(selectedMap.value.values()).forEach(async (item) => {
      await delGroupImageFile(item.groupKey, item.key).then(() => {
        const items =
          pictureList.value.find((e) => e.key === item.groupKey).items || []
        const index = items.findIndex((e: any) => e.imageKey === item.imageKey)
        items.splice(index, 1)
      })
    })
    select.value = false
    selectedMap.value.clear()
  }
}
// 返回文件blob
async function fetchBlob(fetchUrl: string, method = 'POST', body = null) {
  const response = await window.fetch(fetchUrl, {
    method,
    body: body ? JSON.stringify(body) : null,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  })
  const blob = await response.blob()
  return blob
}
// 图片批量下载
const batchDownloadPic = async () => {
  const zip = new JSZip()
  Array.from(selectedMap.value.values()).forEach((item: any) => {
    zip.file(item.name, fetchBlob(item.imgUrl, 'GET'))
  })
  zip
    .generateAsync({ type: 'blob' })
    .then(function (blob) {
      utils.downFile(blob, 'download.zip')
      toast('导出成功', 'success')
      return true
    })
    .catch((err) => {
      console.error(err)
      toast('导出失败', 'error')
    })
    .finally(() => {
      select.value = false
      selectedMap.value.clear()
    })
}

//图片列表标题编辑
let collapseItemEditorName = ''
const collapseItemEditIconClick = (item: any) => {
  collapseItemEditorName = item.name
  item.isDisabled = false
  nextTick(() => {
    titleRefs[item.key].select()
  })
}
const collapseItemEditor = (item: any) => {
  item.isDisabled = true

  if (!item.name.trim()) {
    ElMessage({
      message: `文件夹名字不能为空`,
      type: 'error',
      customClass: 'cms-el-message el-message--error',
    })
    item.name = collapseItemEditorName
    return
  }

  if (item.name == collapseItemEditorName) return

  const collapseItemEditorKey = item.key

  reGroupName(item.key, item.name)
    .then((res: any) => {
      if (res && res.groupKey && res.groupName) {
        item.key = res.groupKey
        item.name = res.groupName

        const activeIndex = activeList.value.findIndex(
          (e) => e == collapseItemEditorKey
        )
        if (activeIndex != -1) {
          activeList.value.splice(activeIndex, 1, res.groupKey)
        }
      }
      if (!res) {
        ElMessage({
          message: `编辑失败`,
          type: 'error',
          customClass: 'cms-el-message el-message--error',
        })
        item.name = collapseItemEditorName
      }
    })
    .catch(() => {
      item.name = collapseItemEditorName
    })
}

//图片列表删除
const collapseItemDelete = (item: any, index: number) => {
  function fn() {
    ElMessageBox.confirm('是否确认删除？', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    }).then(() => {
      let key = item.key
      delGroupAllImage(key).then(() => {
        pictureList.value.splice(index, 1)
        for (let i = 0; i < allPictureList.length; i++) {
          let item = allPictureList[i]
          if (item.key == key) {
            allPictureList.splice(i, 1)
            break
          }
        }
        exportFile.group = ''
        lastFileName.value = ''
      })
    })
  }
  fn()
}

// 判断是否确认操作
const selectConfirm = (fn: Function) => {
  if (select.value) {
    ElMessageBox.confirm('是否确认操作，将取消当前图片的选中', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    }).then(() => {
      select.value = false
      selectedMap.value.clear()
      fn()
    })
    return true
  }
  return false
}

//新建分组
const addImageFileFun = () => {
  let name = '未命名分组'
  let timer: ReturnType<typeof setTimeout>
  addImageFile(name, props.galleryLabel).then(async (data: any) => {
    if (data?.groupKey && data?.groupName) {
      let fileData = {
        name: data.groupName,
        key: data.groupKey,
        isActive: true,
        items: [],
        isDisabled: true,
      }
      allPictureList.push(fileData)
      pictureList.value = allPictureList
      activeList.value.push(data.groupKey)

      // 滚动到底部
      clearTimeout(timer)
      timer = setTimeout(() => {
        const scrollBox = document.getElementById('galleryMaterialId')
        if (!scrollBox) return
        scrollBox.scrollTo({ top: scrollBox.scrollHeight, behavior: 'smooth' })
      }, 200)
    }
  })
}

// 切换选中模式
const selectModeFun = () => {
  if (selectedMap.value.size) {
    batchDeletePic()
  } else {
    select.value = !select.value
    selectedMap.value.clear()
  }
}

let allPictureList: Array<any> = $ref([])
// 获取图库树
const createImageUrl = (imageKey: string, groupKey: string) => {
  return `${BASE_URL}/api/v1/view/image/gallery/${imageKey}?compress=true&maxWidth=80&maxHeight=80&group=${groupKey}`
}
const createImageItem = (imageItem: any) => {
  const name = imageItem.imageName
  const obj = {
    ...imageItem,
    isDisabled: true,
    leftName: name.substring(0, name.lastIndexOf('.')),
    type: getFileType(name),
    imgUrl: createImageUrl(imageItem.imageKey, imageItem.groupKey),
    key: imageItem.imageKey,
    name: name,
  }

  return obj
}
const getImageTreefun = async (keyWord: string, isInit = false) => {
  await getImageTree(keyWord, props.galleryLabel).then((res: any) => {
    pictureList.value = []
    let groups = res.groups
    let values = res.values
    let showNum = 0
    allPictureList = groups.map((item: any) => {
      let list = values
        .filter((v: any) => v.groupKey == item.groupKey)
        .map((v: any) => createImageItem(v))

      let pict = allPictureList.filter((pic) => pic.key === item.groupKey)

      let data = {
        isDisabled: true,
        isActive:
          isInit ||
          activeList.value.includes(item.groupKey) ||
          !!pict[0]?.isActive,
        items: list,
        key: item.groupKey,
        name: item.groupName,
      }
      if (showNum < 20) {
        if (data.isActive) {
          showNum += list.length
        }
        pictureList.value = [...pictureList.value, data]
      }
      if (data.isActive && !activeList.value.includes(item.groupKey)) {
        activeList.value.push(data.key)
      }
      return data
    })
  })
}

let uploadNumber: Ref<number> = ref(0)
let progressNumber: Ref<number> = ref(0)

//图片上传成功
const uploadSuccess = () => {
  progressNumber.value++
  if (progressNumber.value == uploadNumber.value) {
    uploadNumber.value = 0
    progressNumber.value = 0
  }
  getImageTreefun('')
}

//关闭弹窗
const closeDialog = () => {
  dialogVisible.value = false
}

const MAX_SIZE = 5 * 1024 * 1024
//图片上传选择前
const onChange = (file: any, group: string) => {
  closeDialog()
  let suffix = getFileType(file.name) //获取文件后缀名
  let size = file.size
  if (ACCEPT.indexOf('.' + suffix) === -1) {
    ElMessage({
      message: `${file.name}文件格式错误`,
      type: 'error',
      customClass: 'cms-el-message el-message--error',
    })
  } else {
    if (size > MAX_SIZE) {
      ElMessage({
        message: `${file.name}文件大小超5M，上传失败`,
        type: 'error',
        customClass: 'cms-el-message el-message--error',
      })
      return
    }
    if (file) uploadNumber.value++
    const updateImgFun = (param: any) => {
      updateImg(param, group).then(async (res) => {
        if (res) {
          progressNumber.value++
          if (progressNumber.value == uploadNumber.value) {
            uploadNumber.value = 0
            progressNumber.value = 0
          }

          if (uploadNumber.value == 0) {
            const groupData: any = await getImageTree('', group)
            if (groupData?.values) {
              const groupImageList = groupData.values.map((v: any) =>
                createImageItem(v)
              )
              for (let i = 0; i < allPictureList.length; i++) {
                if (allPictureList[i].key == group) {
                  const newGroupItem = {
                    ...allPictureList[i],
                    items: groupImageList,
                  }
                  allPictureList.splice(i, 1, newGroupItem)
                  if (pictureList.value[i]) {
                    pictureList.value.splice(i, 1, newGroupItem)
                  }
                  break
                }
              }
            }
          }
        } else {
          ElMessage({
            message: '图片上传失败',
            type: 'error',
            customClass: 'cms-el-message el-message--error',
          })
        }
      })
    }

    if (suffix == 'gif') {
      let param = new FormData() // 创建form对象
      param.append('formFiles', file.raw) // 通过append向form对象添加数据
      updateImgFun(param)
    } else {
      //压缩图片上传
      uploadBefore(file.raw)
        .then((fileData: any) => {
          let newFile = new File([fileData], file.name)
          let param = new FormData() // 创建form对象
          param.append('formFiles', newFile) // 通过append向form对象添加数据
          updateImgFun(param)
        })
        .catch(() => {})
    }
  }
}

//获取文件类型
const getFileType = (name: string) => {
  let startIndex = name.lastIndexOf('.')
  if (startIndex !== -1) {
    return name.slice(startIndex + 1).toLowerCase()
  } else {
    return ''
  }
}

//监听图库滚动条,滚动加载
const scroll = () => {
  if (document.getElementById('collId')) {
    let scrollTop = galleryMaterialRef.scrollTop
    let galleryHeight = galleryMaterialRef.clientHeight
    let collIdHeight = document.getElementById('collId')?.clientHeight || 0
    if (
      scrollTop + galleryHeight >= collIdHeight &&
      allPictureList.length > pictureList.value.length
    ) {
      pictureList.value.push(allPictureList[pictureList.value.length])
    }
  }
}

// 导出图片
const exportFile = reactive({
  visible: false,
  group: '',
  confirmText: !window.electron ? '导出' : '选择路径',
  open() {
    if (select.value) {
      batchDownloadPic()
      return
    }
    if (!exportFile.group && allPictureList.length) {
      exportFile.group = allPictureList[0].key
    }
    exportFile.visible = true
  },
  close() {
    exportFile.visible = false
  },
  confirm() {
    const groupItem = allPictureList.find((e) => e.key == exportFile.group)
    const url = `/api/v1/view/image/gallery/export?group=${exportFile.group}`
    const name = `图库素材_我的_${groupItem?.name}.zip`

    request({
      responseType: 'blob',
      url,
      method: 'get',
      silent: true,
    }).then((res) => {
      if (res) {
        utils.downFile(res, name)
        ElMessage.success('导出成功')
      } else {
        ElMessage.error('导出失败')
      }
    })

    exportFile.close()
  },
})

onMounted(() => {
  activeList.value = []
  getImageTreefun('', true)
  galleryMaterialRef.addEventListener('scroll', scroll)
})
onUnmounted(() => {
  if (galleryMaterialRef) {
    galleryMaterialRef.removeEventListener('scroll', scroll)
  }
})
</script>
<style lang="scss" scoped>
@import './industrial-black.scss';

.component-gallery-material {
  height: 616px;
  overflow: hidden;
  &-other {
    height: 64px;
    padding: 0 12px 0 20px;
    color: var(--cms-text-color-regular);
    line-height: 20px;
    display: flex;
    align-items: center;
    .component-box-module-search-input {
      display: inline-block;
      // width: 248px !important;
      flex-grow: 1;
      margin: 0 !important;
      :deep(.el-input__inner) {
        height: 32px;
        line-height: 32px;
      }
    }

    &-upload {
      cursor: pointer;
      margin: 0 12px;
      display: inline-block;
      padding: 0px 10px;
      background: var(--cms-color-bg-14);
      border: var(--cms-border-width-base) var(--cms-border-style-base)
        var(--cms-text-color-regular);
      color: var(--cms-text-color-regular);
      border-radius: var(--cms-border-radius-base-1);
      // opacity: 0.6;
    }

    .el-upload {
      display: inline-block;
    }
    .icon-operations {
      display: inline-block;
      width: 30px;
      height: 30px !important;
      box-sizing: border-box;
      font-size: 20px;
      vertical-align: middle;
      padding: 3px;
      margin-left: 6px;
      color: #7e7e7f;
      background: transparent;
      border-color: transparent;
      &:hover:not(:disabled) {
        color: var(--cms-color-primary-2);
      }
      &.active {
        border-radius: 50%;
        background: #392626;
        color: #7e7e7f;
      }
      &:disabled {
        opacity: 0.6;
      }
    }
  }

  &-collapse {
    overflow: auto;
    // height: 470px;
    overflow-y: overlay;
    height: 552px; // calc(616px - 64px)
    :deep(.el-collapse) {
      --el-collapse-header-bg-color: var(--cms-color-bg-14) !important;
      border: 0;
    }

    :deep(.el-collapse .el-collapse-item__content) {
      background-color: var(--cms-color-bg-13);
      padding-bottom: 0px;
    }

    :deep(.el-collapse .el-collapse-item__wrap, .el-collapse-item__header) {
      border: 0;
    }

    :deep(.el-collapse .el-collapse-item__header) {
      position: relative;
      height: 35px;
      border: 0;
      background: #323233;
    }

    :deep(.el-collapse-item__arrow) {
      display: none;
    }

    // :deep(.el-collapse-item) {
    //     // margin-bottom: -1px;
    //     // background-color: var(--cms-color-bg-13);
    // }
    &-icon {
      display: inline-block;
      // padding-right: 5px;
      transform: rotate(-90deg);
    }

    &-righticon {
      position: absolute;
      right: 12px;
      color: var(--cms-text-color-regular);
      // font-size: 25px;

      .right-icon {
        margin-left: 5px;
      }

      span {
        font-size: 20px;
        vertical-align: middle;
      }

      span:hover {
        color: var(--cms-color-primary-2) !important;
      }

      .icon-qingchu:hover {
        color: var(--cms-color-error-light) !important;
      }
    }

    &-title {
      padding-left: 12px;
      width: 84%;
      height: 100%;
      line-height: 35px;

      i {
        font-size: 12px;
        color: var(--cms-text-color-regular-1);
      }

      input {
        padding-left: 5px;
        font-size: 14px;
        background: rgba(0, 0, 0, 0);
        border: 0;
        color: var(--cms-text-el-input-color);
        width: calc(100% - 25px);

        &:focus-visible {
          border: 0px;
          outline: 0px;
        }
      }
    }

    .is-ative {
      transform: rotate(0deg);
    }
  }

  &-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 5px;
    padding-right: 0px;

    &-item {
      width: 80px;
      margin: 5px 0;
      margin-left: 10px;
      font-size: var(--cms-font-size-extra-small);
      word-wrap: break-word;
      word-break: break-all;
      overflow: hidden;
      color: var(--cms-text-color-regular);
      text-align: center;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;

      &-img {
        width: 80px;
        height: 80px;
        background: var(--cms-color-bg-14);
        border-radius: var(--cms-border-radius-base-1);
        position: relative;

        border: 1px solid transparent;
        border-radius: 6px 6px 6px 0;
        &.active {
          border-color: #3d6eff;
        }
        .img-icon {
          display: flex;
          justify-content: space-evenly;
          position: absolute;
          width: 100%;
          bottom: 0;
          background-color: rgba(23, 26, 31, 0.6);
          span {
            font-size: 18px;
            line-height: 1.5;
            color: #e9e9ea;
            cursor: pointer;
            padding: 0 4px;
          }

          span:active {
            color: var(--cms-color-primary-2) !important;
          }
          .icon-qingchu:active {
            color: var(--cms-color-error-light) !important;
          }
        }
        .icon-gouxuan {
          width: 16px;
          height: 16px;
          line-height: 18px;
          position: absolute;
          left: 0;
          bottom: 0;
          color: #ffffff;
          background: #3d6eff;
          font-size: 12px;
        }
      }

      .item-img {
        width: 100%;
        object-fit: contain;
        flex: none;
        aspect-ratio: 1/1;
        cursor: copy;
        border-radius: 6px 6px 6px 6px;
        overflow: hidden;
        &.un-draggable {
          cursor: pointer;
        }
      }

      .item-img-title {
        width: 100%;
        height: 28px;
        margin: 5px 0;
        line-height: 28px;
        display: flex;
        align-items: center;
        &.show {
          justify-content: center;
          padding: 0 4px;
          overflow: hidden;

          white-space: normal;
          word-break: break-all;
          text-overflow: ellipsis;

          border-radius: 2px;
          border: 1px solid transparent;
          &:hover {
            border-color: #3d6eff;
          }

          cursor: pointer;
        }
        &.edit {
          justify-content: space-between;
          flex-shrink: 0;
        }
        .img-input {
          height: 100%;
          width: 54px;
          :deep(.el-input__inner) {
            padding: 8px !important;
            border-radius: 2px;
            border: 1px solid transparent;
            &:focus {
              border-color: #3d6eff;
            }
          }
        }
      }
    }

    .no-image-class {
      text-align: center;
      width: 100%;

      :deep(.el-image) {
        padding-top: 40px;
      }

      &-tips {
        margin-bottom: 40px;
        color: var(--cms-text-color-regular); // padding-bottom: 30px;

        span {
          color: #3d6eff;
          cursor: pointer;
        }
      }

      // &-tips1 {
      //     color: #949494;
      // }
    }
  }
  &-empty {
    position: absolute;
    top: 230px;
    width: 100%;
    text-align: center;
    p {
      font-size: var(--cms-font-size-base);
      color: var(--cms-text-color-regular);
      > span {
        padding: 2px 2px 2px 0;
        color: #3d6eff;
        cursor: pointer;
      }
    }
  }

  &-uploadshow {
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.8);
    position: absolute;
    top: 80px;
    width: 100%;
    height: calc(100% - 80px);

    border-radius: 0px 0px 6px 6px;
    display: flex;
    align-items: center;
    justify-content: center;

    .uploadshow-box {
      overflow: hidden;
      width: 70%;
      height: 34px;
      line-height: 34px;
      background: rgba(121, 121, 121, 0.4);
      border-radius: 6px;
      padding: 0 10px;
      font-size: 12px;
      color: #ffffff;
      position: relative;

      .uploadshow-progress {
        position: absolute;
        bottom: 0;
        height: 5px;
        width: 100%;
        background: #3d6eff;
        border-radius: 0px 0px 4px 4px;
        left: 0;
      }
    }
  }
}
.cms-el-dialog {
  .tips {
    padding: 10px;
    color: #686869;
  }
  .el-dialog__footer {
    margin-top: 60px;
  }
}
</style>
