<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="http">
    <SettingItem title="功能">
      <div class="row">
        <span>文字内容：</span>
        <el-input
          style="width: 150px"
          v-model="text"
          placeholder="请输入文字内容"
          class="cms-el-input-x row-input"
        />
      </div>
      <div class="row">
        <span>请求地址：</span>
        <el-input
          style="width: 150px"
          v-model="url"
          placeholder="请输入请求地址"
          class="cms-el-input-x row-input"
        />
      </div>
      <div class="row">
        <span>请求方法：</span>
        <ElSelect
          class="cms-el-select-x el-select-x-box_http"
          popper-class="cms-el-select_check"
          v-model="method"
          style="width: 150px"
          placeholder="请选择"
        >
          <ElOption
            v-for="method in methods"
            :label="method"
            :value="method"
          ></ElOption>
        </ElSelect>
      </div>
      <div class="row">
        <span>请求体：</span>
        <el-input
          style="width: 150px"
          v-model="body"
          placeholder="请输入请求数据"
          class="cms-el-input-x row-input"
          readonly
        />
        <i
          style="cursor: pointer; margin-left: 10px"
          class="iconfont icon-shezhi"
          @click="onOpenCodeDialog(TYPE_CONFIG.DATA)"
        ></i>
      </div>
      <div class="row">
        <span>请求头：</span>
        <el-input
          style="width: 150px"
          readonly
          v-model="headers"
          placeholder="请输入请求头"
          class="cms-el-input-x row-input"
        />
        <i
          style="cursor: pointer; margin-left: 10px"
          class="iconfont icon-shezhi"
          @click="onOpenCodeDialog(TYPE_CONFIG.HEADER)"
        ></i>
      </div>
      <div class="row">
        <span>消息文案：</span>
        <el-input
          style="width: 150px"
          placeholder="请输入消息文案"
          class="cms-el-input-x row-input"
          v-model="msg"
        ></el-input>
      </div>
      <div class="row">
        <span>消息提示：</span>
        <el-switch v-model="isShowMsg"></el-switch>
      </div>
    </SettingItem>
    <OptionConfigDialog
      v-model="optionConfig.visible"
      :title="optionConfig.title"
      :code="optionConfig.value"
      @change="optionConfigConfirm"
    ></OptionConfigDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted } from 'vue'
import OptionConfigDialog from '../components/OptionConfigDialog.vue'
import { ElMessage } from 'element-plus'
// import sdk from 'sdk'
// const SettingItem = sdk.components.SettingItem
import SettingItem from '@/components/SettingItem/SettingItem.vue'
import ElSelect from '@/components/ElSelect/ElSelect'
import ElOption from '@/components/ElSelect/ElOption'

const emit = defineEmits(['update'])
const props = withDefaults(
  defineProps<{
    node: any
    url?: string
    body?: any
    headers?: any
    method?: string
    text?: string
    isShowMsg?: boolean
    msg?: string
  }>(),
  {
    isShowMsg: true,
    msg: '调用成功',
  }
)

onMounted(() => {
  !props.text && emit('update', { text: '按钮' })
})

const TYPE_CONFIG = {
  DATA: 'DATA',
  HEADER: 'HEADER',
}

const currentType = ref(null)

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']

const optionConfig = reactive({
  visible: false,
  value: '',
  title: '',
})
const msg: any = computed({
  get() {
    return props.msg
  },
  set(v) {
    emit('update', { msg: v })
  },
})
const isShowMsg: any = computed({
  get() {
    return props.isShowMsg
  },
  set(v) {
    emit('update', { isShowMsg: v })
  },
})

const text: any = computed({
  get() {
    return props.text
  },
  set(v) {
    emit('update', { text: v })
  },
})

const url: any = computed({
  get() {
    return props.url
  },
  set(v) {
    emit('update', { url: v })
  },
})

const body: any = computed({
  get() {
    return props.body
  },
  set(v) {
    emit('update', { body: v })
  },
})

const headers: any = computed({
  get() {
    return props.headers
  },
  set(v) {
    emit('update', { headers: v })
  },
})

const method: any = computed({
  get() {
    return props.method
  },
  set(v) {
    emit('update', { method: v })
  },
})

const optionConfigConfirm = (v: any) => {
  try {
    if (v) {
      const data = JSON.parse(v)
      const jsData = JSON.stringify(data)
      if (currentType.value === TYPE_CONFIG.DATA) {
        body.value = jsData
      } else {
        headers.value = jsData
      }
    }
    optionConfig.visible = false
  } catch (error) {
    console.log(error)
    ElMessage.error('请输入正确的JSON格式')
  }
}

const onOpenCodeDialog = (v: any) => {
  currentType.value = v
  optionConfig.title = v === TYPE_CONFIG.DATA ? '请输入请求体' : '请输入请求头'
  optionConfig.value = v === TYPE_CONFIG.DATA ? body.value : headers.value
  optionConfig.visible = true
}
</script>

<style lang="scss" scoped>
.http {
  .row {
    > span {
      display: flex;
      width: 80px;
      font-size: 12px;
    }
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .el-select-x-box_http {
    box-shadow: none;
    height: 28px;
    line-height: 28px;
    padding: 0 12px 0 8px !important;
    font-size: 12px;
    border-radius: 4px;
    color: var(--cms-text-el-input-color);
    border: 1px solid var(--cms-color-bg-4);
    background-color: var(--cms-color-bg-3);
    background-color: #141414;
    outline: none;
    box-sizing: border-box;
    &:hover {
      border: 1px solid var(--cms-color-bg-4);
      border-bottom: 1px solid var(--cms-color-primary-1);
      box-shadow: none !important;
    }
    .el-select-x-box_http {
      ::deep(.el-input__inner) {
        padding-right: 24px !important;
      }
    }
  }
}
</style>
<style lang="scss">
.el-select-x-box_http {
  .el-select__wrapper {
    display: flex;
    align-items: center;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
    text-align: left;
    font-size: 12px;
    gap: 6px;
    min-height: 28px;
    line-height: 24px;
    border-radius: var(--el-border-radius-base);
    transition: var(--el-transition-duration);
  }
  .el-select__selection {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    flex: 1;
    min-width: 0;
    gap: 6px;
  }

  .el-select__input-wrapper.is-hidden {
    position: absolute;
    opacity: 0;
  }
  .el-select__input-wrapper {
    max-width: 100%;
  }
  .el-select__selected-item {
    display: flex;
    flex-wrap: wrap;
    user-select: none;
  }
  .el-select__placeholder.is-transparent {
    user-select: none;
    color: var(--el-text-color-placeholder);
  }
  .el-select__placeholder {
    position: absolute;
    display: block;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-select__input {
    border: none;
    outline: none;
    padding: 0;
    color: var(--el-select-multiple-input-color);
    font-size: inherit;
    font-family: inherit;
    appearance: none;
    height: 24px;
    max-width: 100%;
    background-color: transparent;
  }
  .el-select__prefix,
  .el-select__suffix {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    gap: 6px;
    color: var(--el-input-icon-color, var(--el-text-color-placeholder));
    .el-select__caret {
      color: var(--el-select-input-color);
      font-size: var(--el-select-input-font-size);
      transition: var(--el-transition-duration);
      transform: rotate(0);
      cursor: pointer;
    }
    .el-icon {
      --color: inherit;
      height: 1em;
      width: 1em;
      line-height: 1em;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      position: relative;
      fill: currentColor;
      color: var(--color);
      font-size: inherit;
    }
  }
}
</style>
