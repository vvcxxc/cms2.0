<!-- 
<EllipsisTooltipLabel width="100%" :content="content" />

-->
<template>
  <div
    class="content"
    :style="{ width: props.width }"
    @mouseover="mouseover"
    @mouseleave="mouseleave"
    :title="props.tooltipContent ? props.tooltipContent : props.content"
    :data-tooltip-disabled="!visible"
    :data-tooltip-effect="props.effect"
    :data-tooltip-placement="props.placement"
    :data-tooltip-popper-class="props.popperClass"
    :data-tooltip-raw-content="props.rawContent"
  >
    <span ref="contentRef">
      <slot name="content">{{ props.content }}</slot>
    </span>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
interface Props {
  width: string // 超出宽度时用省略号表示
  content: string // 显示内容
  tooltipContent?: string // 提示内容（设置‘提示内容’与‘显示内容’不同）
  effect?: string
  placement?: string
  popperClass?: string
  disabled?: boolean
  rawContent?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  effect: 'dark',
  placement: 'top-start',
  content: '',
  popperClass: '',
  width: '',
  tooltipContent: '',
  disabled: false,
  rawContent: false,
})

let visible = ref(false)
const contentRef = ref()
const mouseover = function (): void {
  // 计算span标签的offsetWidth与父盒子元素的offsetWidth，来判断tooltip是否显示
  visible.value =
    contentRef.value.offsetWidth > contentRef.value.parentNode.offsetWidth ? true : false
}
const mouseleave = function (): void {
  visible.value = false
}
</script>
<style lang="scss" scoped>
.content {
  text-overflow: ellipsis;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
}
</style>
