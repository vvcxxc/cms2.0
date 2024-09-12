<template>
  <Dialog v-model="visible" class="without-dialog-el-tip">
    <template #title>
      <span class="tip-header">
        <div class="tip"></div>
        提示
      </span>
    </template>
    <div class="without-dialog-body-text">
      <slot></slot>
    </div>
    <!-- 按钮 -->
    <template #footer>
      <el-button class="without-el-btn" @click="onClose">取消</el-button>
      <el-button
        type="primary"
        class="without-el-btn"
        style="margin-right: 10px"
        @click="onSubmit"
        >确认</el-button
      >
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import Dialog from 'components/BaseDialog/index.vue'
defineProps<{
  visible: boolean
}>()

const emit = defineEmits(['close', 'confirm'])

const onClose = () => emit('close')

const onSubmit = () => emit('confirm')
</script>
<style lang="scss">
.without-dialog-el-tip {
  .without-dialog-body-text {
    height: 110px;
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    text-align: center;
    line-height: 110px;
  }
  .without-el-btn {
    width: 98px;
    height: 26px !important;
    line-height: 26px !important;
  }

  .tip-header {
    font-size: 15px;
    font-weight: bold;
    color: #35363b;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .tip {
      width: 20px;
      height: 20px;
      background-image: url(@/assets/svg/tip.svg);
      background-size: 20px 20px;
      margin-right: 8px;
    }
  }
}
</style>
