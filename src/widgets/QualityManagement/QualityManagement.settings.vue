<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="Example">
    <h3>Example</h3>
    <pre>{{ props.node.style }}</pre>
    <div>
      {{ props.text }}
    </div>
    <input v-model="props.node.style.width" />
    <button @click="props.node.style.width = '100px'">button</button>
  </div>
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
