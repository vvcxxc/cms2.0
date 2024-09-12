<template>
  <el-dialog
    :class="className"
    :show-close="false"
    width="897px"
    v-bind="attrs"
  >
    <slot></slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
    <template #header>
      <slot name="title"></slot>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { useAttrs, computed } from 'vue'
const attrs = useAttrs()
const className = computed(() => {
  if (attrs.class) {
    return `information-dialog ${attrs.class}`
  }
  return 'information-dialog'
})
</script>
<style lang="scss">
.information-dialog {
  background-color: #fff !important;
  border-radius: 6px;
  overflow: hidden;

  .cs-dialog__body {
    padding: 20px 28px 20px 30px;
  }
  .cs-dialog__header {
    background-color: #edeff0 !important;
    line-height: 42px;
    height: 42px;
    padding: 10px 20px;
    margin-right: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .cs-dialog__title {
      color: #35363b !important;
      font-size: 15px;
      line-height: 0;
    }
  }
  .cs-dialog__headerbtn {
    display: none;
  }

  .cs-input__inner:not(el-overwrite-ignore *) {
    background-color: transparent !important;
    color: #35363b !important;
  }

  .cs-input__inner:hover {
    box-shadow: none !important;
  }

  .cs-input__inner:focus {
    box-shadow: none !important;
  }

  .cs-input.is-disabled .cs-input__inner {
    box-shadow: none !important;
    color: #999 !important;
  }

  .cs-input-group__append,
  .cs-input-group__prepend {
    padding: 0 14px !important;
  }

  .cs-input-group {
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
      inset !important;
    border-radius: 3px !important;
  }

  .cs-input {
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
      inset !important;
    border-radius: 3px !important;
  }

  .cs-input.is-focus .cs-input__inner {
    box-shadow: none !important;
  }

  .cs-dialog__footer {
    .cs-button--default,
    .cs-button {
      line-height: 26px;
      height: 26px;
      min-width: 110px;
      border: 1px solid #cccccd;
      background-color: #efeded;
      color: #666666;

      &:hover {
        opacity: 0.8;
      }

      &.cs-button--primary {
        border: 1px solid #5a84ff;
        background-color: #5a84ff;
        color: #fff;
      }

      &.cs-button--info {
        border: 1px solid #8b9ca4;
        background-color: #8b9ca4;
        color: #fff;
      }
    }
  }
}
</style>
