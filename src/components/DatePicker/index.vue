<template>
  <div class="date-picker-component">
    <el-date-picker
      v-bind="$attrs"
      :prefix-icon="PrefixIcon"
      popper-class="light-datetime-picker"
    ></el-date-picker>
  </div>
</template>

<script setup lang="ts">
import PrefixIcon from './PrefixIcon.vue'
</script>
