<template>
  <div class="head-tag">
    {{ title }}
  </div>
</template>
    
  <script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HeadTag',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  setup() {
    return {}
  },
})
</script>
      
  <style lang="scss" scoped>
.head-tag {
  width: 74px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  background: #f3f3f3;
  border-radius: 0px 0px 0px 0px;
  opacity: 1;
  font-size: 14px;
  color: #333333;
  font-weight: bold;
}
</style>