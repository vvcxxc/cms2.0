<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :title="title"
    custom-class="cms-el-dialog"
    width="661px"
    @close="close"
  >
    <div class="dialog-body">
      <div class="row">
        <div class="col">
          <InputCode ref="inputCode" v-model="code"></InputCode>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button class="btn" @click="close">取消</el-button>
      <el-button class="btn btn-submit" type="primary" @click="change"
        >确定</el-button
      >
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { defineEmits, watch } from 'vue'
import InputCode from './InputCode.vue'

const props = defineProps({
  code: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'update:code', 'change'])

// code ------------------------------

let code = $ref('')
const reset = () => {
  code = props.code || ''
}
watch(
  () => props.code,
  () => {
    code = props.code || ''
  },
  { immediate: true }
)

async function change() {
  emit('update:code', code)
  emit('change', code)
}

function close() {
  emit('update:modelValue', false)
  reset()
}
</script>

<!-- .row>.col -->
<style lang="scss" scoped>
.row {
  display: flex;
  gap: 1px;
  .col {
    flex: 1;
    min-width: 0;
  }
}
</style>

<!-- panel -->
<style lang="scss" scoped>
.dialog-body {
  margin-top: -8px;
  .header {
    font-size: 14px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    padding: 0 10px 12px;
    span {
      font-size: 12px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 700;
      color: #606162;
    }
  }
}
</style>
<!-- global -->
<style lang="scss">
dl.global_usage_0002 {
  margin: -6px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-width: 480px;
  // pointer-events: none;
  > div {
    display: flex;
    // gap: 10px;
    dt {
      flex: none;
    }
    dd {
      margin: 0;
      white-space: pre-line;
    }
  }
}
</style>
