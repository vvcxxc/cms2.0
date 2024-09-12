<template>
  <div class="head-title">
    <!-- <img src="@/assets/images/title-icon.png" alt="" /> -->
    <div class="icon"></div>
    <span>{{ title }}</span>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HeadTitle',

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
.head-title {
  width: 100%;
  display: flex;
  align-items: center;

  img {
    width: 22px;
    height: 22px;
  }

  span {
    margin-left: 8px;
    color: #333333;
  }

  .icon {
    width: 22px;
    height: 22px;
    background-image: url(../../../../assets/svg/peifangguanli.svg);
    background-size: 22px 22px;
  }
}
</style>