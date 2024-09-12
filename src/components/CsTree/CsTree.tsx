/**
 * 禁止在非Setting配置下使用
 */

import { defineComponent, SetupContext } from 'vue'
import './CsTree.scss'
export default defineComponent({
  name: 'CsTree',
  setup(props, { attrs }: SetupContext) {
    const namespace = import.meta.env.VITE_APP_NAMESPACE

    return () => (
      <el-config-provider namespace={namespace} z-index={300}>
        <el-tree-select
          class="cs-setting-tree_custom_style"
          popper-class="settings-cs-tree_check cs-tree_check-settings"
          {...attrs}
        />
      </el-config-provider>
    )
  },
})
