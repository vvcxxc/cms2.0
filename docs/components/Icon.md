# Icon 图标组件

该组件用于显示图标，支持自定义图标名称、宽度和高度，并可以响应点击事件。

## 示例

<Layout>
  <div style="
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  ">
    <span 
      :title="name"
      style="
        flex-shrink: 0;
        margin-right: 10px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        padding: 20px 0;
        align-items: center;
        flex-direction: column;
        width: 100px;
        height: 100px;
        overflow:hidden;
      " 
      v-for="name in icons" 
      class='hover'
      @click="() => handleClick(name)"
      :key="name">
      <Icon :icon="name" :width="20" :height="20"  />
      <span>{{name}}</span>
    </span>
  </div>

</Layout>

<script setup>
import { ref } from 'vue'
import Icon from '@/components/Icon/Icon.tsx'
const iconMap = import.meta.glob('../../src/assets/images/*.png', {
  eager: true,
})
const icons = ref([])

const extractFileNameWithoutExtension = (filePath) => {
  const parts = filePath.split('/')
  const fileNameWithExtension = parts[parts.length - 1]
  const fileNameParts = fileNameWithExtension.split('.')
  return fileNameParts[0]
}
const  fallbackCopyTextToClipboard = (text) => {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
const copyTextToClipboard = (text) => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    console.log('复制成功');
  }, function(err) {
    console.error('复制失败', err);
  });
}
Object.entries(iconMap).forEach(([key, v]) => {
  const name = extractFileNameWithoutExtension(key)
  icons.value.push(name)
})
const handleClick = (name) => {
  copyTextToClipboard(`<Icon :icon="${name}" :width="24" :height="24"  />`)
  alert('复制成功')
}
</script>

```vue
<template>
  <Icon icon="logo" width="24" height="24" @click="handleClick" />
</template>

<script setup>
import Icon from '@/components/Icon/Icon.tsx'

const handleClick = (evt) => {
  console.log('点击了图标')
}
</script>
```

在该示例中，`Icon` 组件被使用，并通过属性设置了图标名称为 "logo"，宽度为 24，高度为 24。当点击图标时，触发 `click` 事件，调用 `handleClick` 方法。

## 属性

| 属性名 | 类型   | 默认值 | 必填 | 描述     |
| ------ | ------ | ------ | ---- | -------- |
| icon   | String | ''     | 否   | 图标名称 |
| width  | Number | 12     | 否   | 图标宽度 |
| height | Number | 12     | 否   | 图标高度 |

## 事件

| 事件名 | 参数  | 描述             |
| ------ | ----- | ---------------- |
| click  | Event | 当点击图标时触发 |
