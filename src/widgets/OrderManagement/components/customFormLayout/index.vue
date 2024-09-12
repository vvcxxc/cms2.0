<template>
  <div class="customFormLayout">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CustomFormLayout',

  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
.customFormLayout {
  width: 100%;
}
</style>