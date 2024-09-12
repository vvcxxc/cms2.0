<template>
  <div class="customFormItem">
    <div
      v-if="showLabel"
      class="label"
      :style="{ width: labelWidth || 'auto' }"
    >
      <span v-if="!showToolTip" ref="contentRef" class="label-content">{{
        label
      }}</span>
      <el-tooltip
        v-else
        class="box-item"
        effect="dark"
        :content="showToolTip ? label : ''"
      >
        <span class="label-content" ref="contentRef">{{ label }}</span>
      </el-tooltip>
    </div>
    <div class="content">
      <div v-if="isReadOnly" :style="{ width: inputWidth || 'auto' }">
        {{ readOnlyLabel }}
      </div>
      <div v-else-if="($props.source = 'productForm')">
        <component
          :is="componentName"
          v-model="value"
          v-bind="combineAttrs($attrs, $props)"
          class="fix-input-style fix-datetime-picker productForm-picker"
          format="YYYY-MM-DD HH:mm"
          date-format="YYYY-MM-DD"
          time-format="HH:mm"
          popper-class="light-datetime-picker productForm-picker"
          :style="{ width: inputWidth || 'auto' }"
        >
          <slot></slot>
        </component>
      </div>
      <div v-else>
        <component
          :is="componentName"
          v-model="value"
          v-bind="combineAttrs($attrs, $props)"
          class="fix-input-style fix-datetime-picker"
          popper-class="light-datetime-picker"
          :style="{ width: inputWidth || 'auto' }"
        >
          <slot></slot>
        </component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, computed, ref, onMounted } from 'vue'
import { isFunction, omit } from 'lodash'
import { useVModel } from '@vueuse/core'
import { ElInput, ElSelect, ElDatePicker } from 'element-plus'

export default defineComponent({
  name: 'CustomFormItem',
  components: { ElInput, ElSelect, ElDatePicker },
  props: {
    showLabel: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
      default: '',
    },
    componentName: {
      type: [String, Object] as PropType<
        string | ReturnType<typeof defineComponent>
      >,
      default: '',
    },
    isReadOnly: {
      type: Boolean,
      default: false,
    },
    formatter: {
      type: [null, Function] as PropType<(...args: any[]) => void | null>,
      default: null,
    },
    modelValue: {
      type: [String, Number, Array, Date],
      default: '',
    },
    labelWidth: {
      type: String,
      default: '',
    },
    inputWidth: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      default: '',
    },
  },

  setup(props) {
    const value = useVModel(props)
    const showToolTip = ref(true)
    const contentRef = ref()

    // 只读状态下返回一个formatter 函数来处理数据
    const readOnlyLabel = computed(() => {
      if (props.isReadOnly && isFunction(props.formatter)) {
        return props.formatter(value)
      }

      return value
    })

    onMounted(() => {
      try {
        const offerWidth = contentRef.value.offsetWidth
        const BASE_WIDTH = 80

        showToolTip.value = offerWidth > BASE_WIDTH
      } catch (error) {
        console.log(error)
      }
    })

    const combineAttrs = (
      attrs: Record<string, unknown>,
      props: Record<string, unknown>,
      omitPropNames: Array<string> = []
    ) => {
      const newObject = { ...attrs, ...props }
      return omit(newObject, omitPropNames)
    }

    return { value, readOnlyLabel, contentRef, showToolTip, combineAttrs }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/common.scss';

.customFormItem {
  display: inline-flex;
  align-items: center;
  .label {
    overflow: hidden;
    text-overflow: ellipsis;

    &-content {
      width: 100%;
      color: #666;
      white-space: nowrap;
    }
  }

  .content {
    margin-left: 10px;

    :deep(.cs-select) {
      width: 100%;
    }

    :deep(.cs-date-editor.cs-input) {
      width: 100%;
    }
  }
}
</style>
<style lang="scss" scoped>
@import '../../styles/common.scss';
</style>
<style lang="scss">
// .productForm-picker {
//   .cs-time-spinner {
//     .cs-scrollbar {
//       width: 50%;
//     }

//     .cs-scrollbar:nth-child(3) {
//       display: none;
//     }
//   }

// }
</style>
