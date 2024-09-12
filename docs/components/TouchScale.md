# TouchScale 触摸缩放组件文档

## 简介

TouchScale 组件用于实现触摸屏上的图像缩放效果。通过触摸屏幕，用户可以对图像进行放大、缩小和移动操作。

## 使用方式

<Layout>
  用手触摸屏幕，对图像进行放大、缩小和移动操作。
  <TouchScale>
    <!-- 图像内容插槽 -->
    <img src="https://images.pexels.com/photos/7945944/pexels-photo-7945944.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="..." />
  </TouchScale>
</Layout>

<script setup>
import TouchScale from '@/components/TouchScale/index.vue'
</script>

```vue
<template>
  <TouchScale>
    <!-- 图像内容插槽 -->
    <img
      src="https://images.pexels.com/photos/7945944/pexels-photo-7945944.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      alt="..."
    />
  </TouchScale>
</template>

<script setup>
import TouchScale from '@/components/TouchScale/index.vue'
</script>
```

## 插槽

| 名称    | 说明         |
| ------- | ------------ |
| default | 图像内容插槽 |

## 属性

TouchScale 组件暂不支持任何属性。

## 事件

TouchScale 组件暂不支持任何事件。

## 样式

TouchScale 组件提供了基本的样式，可以通过以下方式进行定制：

```scss
// 自定义样式
._touchScale {
  /* Your styles here */
}

._touch-mask {
  /* Your styles here */
}
```

---

这样的文档形式清晰地介绍了组件的功能和用法，并提供了样式定制的示例。
