<template>
  <div class="_touchScale">
    <slot></slot>
    <div class="_touch-mask" v-if="isShowMask"></div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, computed, reactive } from 'vue'
const store: any = reactive({
  scale: 1,
})

const decomposeMatrix = (matrix: string) => {
  // 使用正则表达式提取矩阵中的数值部分
  const matrixRegex = /matrix\((.+),\s*(.+),\s*(.+),\s*(.+),\s*(.+),\s*(.+)/
  const matches = matrix.match(matrixRegex)

  if (!matches) {
    throw new Error('错误')
  }

  // 提取平移和缩放值
  const scaleX = parseFloat(matches[1])
  const scaleY = parseFloat(matches[4])
  const translateX = parseFloat(matches[5])
  const translateY = parseFloat(matches[6])

  return {
    translate: { x: translateX, y: translateY },
    scale: { x: scaleX, y: scaleY },
  }
}

const isShowMask = computed(() => store.isShowMask)

const initEvent = () => {
  const ele: any = document.querySelector('._touchScale')

  // 缩放事件的处理
  ele.addEventListener('touchstart', function (event: any) {
    const touches = event?.touches
    const events = touches[0]
    const events2 = touches[1]

    // 第一个触摸点的坐标
    store.pageX = events.pageX
    store.pageY = events.pageY
    store.moveable = true
    store.originScale = store.scale || 1
    const transform = window.getComputedStyle(ele, null).transform
    if (transform !== 'none') {
      store.matrix = decomposeMatrix(transform)
    }
    if (events2) {
      store.pageX2 = events2.pageX
      store.pageY2 = events2.pageY
    } else {
      // 双击
      store.isDbl = false
      if (!store.t) {
        store.t = Date.now()
      } else {
        const t = Date.now() - store.t
        if (t <= 400) {
          store.isDbl = true
        }
        store.t = null
      }
    }
    if (store.isDbl) {
      store.scale = store.scale - 0.1
      const translateX = store.matrix?.translate?.x || 0
      const translateY = store.matrix?.translate?.y || 0
      ele.style.transform = `translate(${translateX}px, ${translateY}px) scale(${store.scale})`
    }
  })

  document.addEventListener('touchmove', function (event: any) {
    if (!store.moveable) {
      return
    }
    store.t = null
    store.isDbl = false
    store.isShowMask = true
    event.preventDefault()

    var touches = event.touches
    var events = touches[0]
    var events2 = touches[1]
    const translateX = store.matrix?.translate?.x || 0
    const translateY = store.matrix?.translate?.y || 0
    // 双指移动
    if (events2) {
      // 第2个指头坐标在touchmove时候获取
      if (!store.pageX2) {
        store.pageX2 = events2.pageX
      }
      if (!store.pageY2) {
        store.pageY2 = events2.pageY
      }

      // 获取坐标之间的举例
      var getDistance = function (start: any, stop: any) {
        return Math.hypot(stop.x - start.x, stop.y - start.y)
      }
      // 双指缩放比例计算
      var zoom =
        getDistance(
          {
            x: events.pageX,
            y: events.pageY,
          },
          {
            x: events2.pageX,
            y: events2.pageY,
          }
        ) /
        getDistance(
          {
            x: store.pageX,
            y: store.pageY,
          },
          {
            x: store.pageX2,
            y: store.pageY2,
          }
        )
      // 应用在元素上的缩放比例
      var newScale = store.originScale * zoom
      // 最大缩放比例限制
      // if (newScale > 3) {
      //   newScale = 3
      // }
      // 记住使用的缩放值
      store.scale = newScale

      // 图像应用缩放效果
      ele.style.transform = `translate(${translateX}px, ${translateY}px) scale(${store.scale})`
    } else {
      // 单指移动
      const x = events.pageX - store.pageX + translateX
      const y = events.pageY - store.pageY + translateY

      ele.style.transform = `translate(${x}px, ${y}px) scale(${store.scale})`
    }
  })

  document.addEventListener('touchend', function () {
    store.moveable = false
    store.isShowMask = false
    delete store.pageX2
    delete store.pageY2
  })
  document.addEventListener('touchcancel', function () {
    store.moveable = false
    store.isShowMask = false

    delete store.pageX2
    delete store.pageY2
  })
}
onMounted(() => initEvent())
</script>

<style lang="scss" scoped>
._touchScale {
  width: fit-content;
  height: fit-content;
  position: relative;
  ._touch-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
