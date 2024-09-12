<template>
  <el-dialog
    :class="className"
    width="525px"
    v-bind="attrs"
    :show-close="false"
    @close="() => onClose(false)"
    @open="onOpen"
  >
    <div
      :style="`
      height: ${currentHeight};
      overflow: ${attrs.height ? 'auto' : 'initial'};
      padding-right: 20px;
      `"
    >
      <slot></slot>
    </div>

    <template #header>
      <div class="cs-dialog-content">
        <p>{{ attrs.title }}</p>
        <Icon
          style="cursor: pointer"
          :width="16"
          :height="16"
          icon="X"
          @click="onClose"
        />
      </div>
    </template>
    <template #footer>
      <div class="cs-dialog-footer">
        <slot name="footer" v-if="footer"></slot>
        <template v-else>
          <slot name="custom-btn"></slot>
          <el-button
            @click="onClose"
            type="info"
            plain
            class="dialog-btn cs-base-btn"
            >{{ _t('取消') }}</el-button
          >
          <el-button
            :disabled="attrs.submitDisabled"
            @click="onConfirm"
            type="primary"
            class="cs-base-btn"
            >{{ _t('确认') }}</el-button
          >
        </template>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { useAttrs, computed, useSlots } from 'vue'
import { _t } from '@/libs/Language/Language'
import Icon from '../Icon/Icon'
const footer = !!useSlots().footer
const emit = defineEmits(['close', 'confirm', 'open'])
const attrs = useAttrs()
const props = defineProps<{ [key: string]: any }>()
const className = computed(() => {
  if (attrs.class) {
    return `without-cs-dialog ${attrs.class}`
  }
  return 'without-cs-dialog'
})

// 关闭弹窗都会调这个方法，有些时候点击confirm的时候不能同时触发close的，加个参数，用于区分是点击按钮关闭的事件还是close事件
const onClose = (isClose = true) => emit('close', isClose)

const onConfirm = () => emit('confirm')

const onOpen = () => emit('open')

const currentHeight = computed(() => {
  return attrs.height || 'auto'
})
</script>
<style lang="scss">
.without-cs-dialog {
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
  border-radius: 6px 6px 6px 6px;
  padding-top: 10px;

  header.cs-dialog__header {
    padding: 0;
    padding-bottom: 0;
    margin-right: 0;
  }
  .cs-dialog__body {
    padding: 10px 20px;
    padding-right: 0;
    padding-bottom: 0;
  }

  .cs-dialog-content {
    width: 100%;
    height: 42px;
    border-radius: 6px 6px 0px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px 0;
    /* padding-top: 36px; */

    p {
      /* width: 72px; */
      /* height: 18px; */
      margin: 0;
      font-size: 18px;
      font-family: Source Han Sans CN, Source Han Sans CN;
      font-weight: bold;
      color: #464e54;
    }
  }
  .cs-dialog__footer {
    padding: 0;
    padding-top: 10px;
  }
  .cs-dialog-footer {
    padding: 0 18px;
    .cs-base-btn {
      width: 98px;
      height: 26px;
    }
    .dialog-btn {
      background: #efeded;
      color: #666666;
    }
  }
}
.without-cs-dialog.is-fullscreen {
  overflow: hidden;
  .cs-dialog__body {
    height: calc(100% - 80px);
  }
}
</style>
