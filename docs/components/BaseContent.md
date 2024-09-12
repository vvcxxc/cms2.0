# BaseContent

`BaseContent` 组件用于显示带有标题、内容区域和可选页脚的内容。

## 示例用法

<script setup>
import BaseContent from '@/components/BaseContent/BaseContent.tsx'
</script>

<BaseContent title='测试' icon='banben'>
    <div style="width: 100%;height: 500px">
      内容区
    </div>
</BaseContent>

```vue
<template>
  <BaseContent title="系统配置" icon="settings">
    <div>
      <!-- 这里放置你的内容 -->
    </div>
    <template #footer>
      <div>
        <!-- 这里放置页脚内容 -->
      </div>
    </template>
  </BaseContent>
</template>

<script>
import { defineComponent } from 'vue'
import BaseContent from '@/components/BaseContent'

export default defineComponent({
  components: {
    BaseContent,
  },
  // 其他组件选项...
})
</script>
```

在上面的示例中，我们使用了 `BaseContent` 组件，标题为 "系统配置"，图标为 "settings"。我们还在默认插槽中提供了内容，在页脚插槽中提供了页脚内容。

## 属性

| 属性  | 描述                       | 类型   | 默认值 | 示例值     |
| ----- | -------------------------- | ------ | ------ | ---------- |
| title | 在标题栏中显示的标题       | String | '标题' | '系统配置' |
| icon  | 在标题栏中显示的图标的名称 | String | ''     | 'settings' |

## 插槽

| 名称    | 描述                         |
| ------- | ---------------------------- |
| default | 要显示在内容区域中的主要内容 |
| footer  | 可选的页脚内容               |
