import { defineComponent } from 'vue'
import styles from './ProcessConfiguration.module.scss'
import Content from '@/components/Content/Content'
import { useProvideModels } from '../app'
import Configuration from './Pages/Configuration/Configuration'
import { useEditionFeature } from '@/libs/Permission/Permission'

export default defineComponent({
  name: '过程配置',
  props: {
    node: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, ctx) {
    useEditionFeature()
    useProvideModels()
    const tabData = [
      {
        label: '过程配置',
        name: 'configuration',
        hidden: false,
        component: Configuration,
      },
    ]
    return () => {
      return (
        <div class={styles.ProcessConfiguration}>
          <Content title="过程设置">
            <Configuration />
          </Content>
        </div>
      )
    }
  },
})
