<template>
  <div class="d_Button" @click="handleclick">
    <el-button
      :class="{
        d_btn: true,
        sumbitButton: type == 'sumbit',
        delButton: type == 'del',
      }"
      v-if="type && (type == 'sumbit' || type == 'del')"
    >
      {{ text }}
    </el-button>
    <el-button
      class="d_btn editButton"
      v-else
      :style="{
        color: type == 'fill' ? '#fff' : color,
        backgroundColor: type != 'fill' ? '#fff' : color,
        borderColor: color,
      }"
    >
      {{ text }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['callback'])
const $props = defineProps<{
  text: string
  type?: string
  color?: string //(type == 'sumbit' || type == 'del')时可不传
}>()

const handleclick = () => {
  emit('callback')
}
</script>

<style lang="scss" scoped>
.d_Button {
  width: fit-content;
  height: auto;
  display: inline-block;

  .d_btn {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 26px;
    height: 26px;
    min-width: 110px;
    width: fit-content;
    padding: 8px 16px;
    box-sizing: border-box;
    border-radius: 4px;
    cursor: pointer;
    word-break: keep-all;

    &:hover {
      opacity: 0.8;
    }
  }

  .delButton {
    border: 1px solid #cccccd;
    background-color: #efeded;
    color: #666666;
  }

  .sumbitButton {
    border: 1px solid #5a84ff !important;
    background-color: #5a84ff !important;
    color: #fff !important;
  }

  .editButton {
    border-width: 2px;
    border-style: solid;
  }

  .editButton:active {
    background-color: #ededed;
  }
}

.d_Button:last-child {
  .d_btn {
    margin-right: 0;
  }
}
</style>
