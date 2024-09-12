<template>
  <el-config-provider :namespace="namespace" :z-index="300" :locale="local">
    <div v-if="!notPage" class="widget_slot_page_content" v-bind="widgetProps">
      <slot v-bind="defineProps"></slot>
    </div>
    <slot v-else v-bind="widgetProps"></slot>
  </el-config-provider>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref, provide, watch } from 'vue'
import { isNil } from 'lodash'
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'
import sdk from 'sdk'
declare global {
  interface Window {
    __BUILD_INFO__: Record<string, any>
    __BUILD_TIME__: string
    __COMMIT__: string
    __BRANCH__: string
    __USER_NAME__: string
  }
}

export default defineComponent({
  name: 'Provider',
  props: {
    isApp: {
      type: Boolean,
    },
    widgetName: {
      type: String,
    },
    widgetProps: {
      type: Object,
      default: () => ({}),
    },
    isFullyCover: {
      type: Boolean,
      default: false,
    },
    defaultConfig: {
      type: Object,
      default: () => ({}),
    },
    notPage: {
      type: Boolean,
    },
  },
  setup(props, { attrs }: { attrs: any }) {
    const { models } = sdk
    const { Language } = models
    const { local } = Language.useElementPlusI18n()
    const namespace = import.meta.env.VITE_APP_NAMESPACE
    provide('isApp', props.isApp)
    const notPage = computed(() => {
      return props.notPage
    })
    const background = computed(() => {
      const { background } = props.defaultConfig
      return props.isApp ? '#fff' : background || '#fff'
    })
    const width = computed(() => {
      const { width } = props.defaultConfig
      return props.isApp ? '100%' : width || '1920px'
    })
    const height = computed(() => {
      const { height } = props.defaultConfig
      return props.isApp ? '100%' : height || '1080px'
    })

    const widgetProps = computed(() => {
      return props.widgetProps
    })

    const padding = computed(() => {
      const { padding } = props.defaultConfig
      const paddingValue = isNil(padding) ? '12px 18px 0 18px' : padding
      return props.isFullyCover ? '0px' : paddingValue
    })

    const defineProps = ref({})

    window.__BUILD_INFO__ = {
      // 编译时间
      time: window.__BUILD_TIME__,
      // 组件版本
      version: import.meta.env.VITE_APP_VERSION,
      // git commit hash
      commit: window.__COMMIT__,
      // 分支
      branch: window.__BRANCH__,
      // git用户名
      userName: window.__USER_NAME__,
      // 组件名
      widgetName: props.widgetName || '-',
    }

    const onUpdateWidgetProps = () => {
      const o = { ...props.widgetProps }
      delete o.style
      defineProps.value = {
        ...o,
      }
    }

    watch(() => props.widgetProps, onUpdateWidgetProps, {
      deep: true,
      immediate: true,
    })

    onMounted(() => {
      onUpdateWidgetProps()
    })

    return {
      attrs,
      namespace,
      width,
      local,
      widgetProps,
      defineProps,
      padding,
      height,
      background,
      notPage,
    }
  },
})
</script>
<style lang="scss">
.cs-message--error,
.cs-message--success,
.cs-message--warning,
.cs-message--info {
  padding: 12px;
  box-shadow: 0px 2px 6px 0px rgba(1, 1, 1, 0.43);

  .cs-message__icon {
    font-size: 20px;

    &::before {
      // content: '\e6a4';
      font-family: 'iconfont' !important;
      font-style: normal;
    }
  }

  .cs-message__content {
    color: #fff;
  }
}

.cs-message--error {
  background: #33242b;
  border: 1px solid #a45769;

  .cs-message__icon {
    color: var(--cms-color-warning-darker);

    &::before {
      content: '\e6c5';
    }
  }
}

.cs-message--success {
  background: #192f1d;
  border: 1px solid #57d05b;
  color: #fff;
  width: 380px;
  .cs-message__content {
    color: #fff;
    overflow-wrap: anywhere;
  }
  .cs-message__icon {
    color: #57d05b;

    &::before {
      content: '\e6c7';
    }
  }
}

.cs-message--warning {
  background: #382c21;
  border: 1px solid #febf72;
  width: 380px;
  .cs-message__content {
    color: #fff;
    overflow-wrap: anywhere;
  }
  .cs-message__icon {
    color: #febf72;

    &::before {
      content: '\e6c6';
    }
  }
}

.cs-message--info {
  background: #333;
  border: 1px solid #111;
  width: 380px;
  .cs-message__content {
    color: #fff;
    overflow-wrap: anywhere;
  }
  .cs-message__icon {
    color: #fff;

    &::before {
      content: '\e6c6';
    }
  }
}
:root {
  --cs-disabled-bg-color: #f5f7fa;
  --cs-fill-color-light: #e8e8e8;
  --cs-disabled-text-color: #5c5c5c;
}
</style>
<style lang="scss" scoped>
.widget_slot_page_content {
  width: v-bind(width);
  padding: v-bind(padding);
  background: v-bind(background);
  height: v-bind(height);
}
</style>
