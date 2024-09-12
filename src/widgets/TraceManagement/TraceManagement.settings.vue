<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div></div>
</template>

<script setup lang="ts">
const $props = defineProps<{
  node: any
  href?: string
  text?: string
}>()

const node = $props.node
const props = node.props
</script>

<style lang="scss" scoped>
.Example {
  width: 100px;
  height: 100px;
  border: 1px solid #000;
}
</style>
