<template>
  <div class="variable">
    <div class="variable--title" :style="{ width: width }" v-show="title">
      {{ title }}
    </div>
    <el-input :model-value="modelValue" v-bind="combineAttrs($attrs, $props)">
      <template #append>
        <div class="variable__icon" @click="handleButtonClick">
          <img
            src="@/assets/images/variable.png"
            style="width: 25px; height: 15px"
            alt=""
          />
        </div>
      </template>
    </el-input>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { omit } from 'lodash'
import sdk from 'sdk'
const { utils } = sdk
const { openVariableDialog } = utils

export default defineComponent({
  name: 'VariableInput',
  props: {
    title: {
      type: String,
      default: '',
    },
    UUID: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      default: '',
    },
    config: {
      type: Object,
      default: () => ({}),
    },
    width: {
      type: String,
      default: '80px',
    },
  },
  setup(props) {
    // const { variableList } = createInjector()

    const handleButtonClick = async () => {
      // 处理按钮点击事件
      const data = await openVariableDialog({
        isMultiple: false,
      })
      const params = {
        ...data,
        value: data.name,
      }
    }

    const combineAttrs = (
      attrs: Record<string, unknown>,
      props: Record<string, unknown>,
      omitPropNames: Array<string> = []
    ) => {
      const newObject = { ...attrs, ...props }
      return omit(newObject, omitPropNames)
    }

    return {
      combineAttrs,
      handleButtonClick,
    }
  },
})
</script>
<style lang="scss" scoped>
.variable {
  display: inline-flex;
  align-items: center;

  &--title {
    font-size: 14px;
    font-weight: bold;
    width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__icon {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    margin-right: 8px;
  }

  :deep .cs-input__inner {
    height: 30px;
  }

  :deep(.cs-input__wrapper) {
    border: 1px solid var(--el-border-color);
    border-right: none;
    box-shadow: none;
  }

  :deep(.cs-input-group__append) {
    box-shadow: none;
    border: 1px solid var(--el-border-color);
    border-left: none;
    background-color: #fff;
  }
}
</style>
