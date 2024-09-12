<!-- eslint-disable vue/no-mutating-props -->
<template></template>

<script setup lang="ts">
const props = defineProps<{
  node: any
  href?: string
  text?: string
}>()
</script>
