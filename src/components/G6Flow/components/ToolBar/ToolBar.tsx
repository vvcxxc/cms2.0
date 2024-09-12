import { defineComponent } from 'vue'
import styles from './ToolBar.module.scss'
import BaseConfigProvider from '@/components/BaseConfigProvider/BaseConfigProvider'

export default defineComponent({
  name: 'ToolBar',
  components: {
    BaseConfigProvider,
  },
  setup() {
    const namespace = import.meta.env.VITE_APP_NAMESPACE

    const toolBar = [
      {
        code: 'undo',
        name: '撤销',
        icon: 'undo',
      },
      {
        code: 'redo',
        name: '恢复',
        icon: 'redo',
      },
      {
        code: 'enlarge',
        name: '放大',
        icon: 'enlarge',
      },
      {
        code: 'reduce',
        name: '缩小',
        icon: 'reduce',
      },
      {
        code: 'format',
        name: '美化',
        icon: 'format1',
      },
      {
        code: 'download',
        name: '下载',
        icon: 'download',
      },
    ]
    return () => {
      return (
        <ul class={styles.toolBarContent}>
          {toolBar.map((item: any) => {
            const imgUrl = new URL(
              `../../../../assets/images/${item.icon}.svg`,
              import.meta.url
            ).href
            return (
              <el-config-provider namespace={namespace}>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content={item.name}
                  placement="right"
                >
                  <li
                    class={styles.toolBarItem}
                    key={item.code}
                    // @ts-ignore
                    code={item.code}
                  >
                    <img
                      src={imgUrl}
                      width={20}
                      height={20}
                      // @ts-ignore
                      code={item.code}
                    />
                  </li>
                </el-tooltip>
              </el-config-provider>
            )
          })}
        </ul>
      )
    }
  },
})
