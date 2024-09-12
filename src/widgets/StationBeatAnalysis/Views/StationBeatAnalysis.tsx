import { defineComponent } from 'vue'
import styles from './StationBeatAnalysis.module.scss'
import Content from '@/components/Content/Content'
import { useProvideModels } from '@/libs/Provider/app'
import StationBeatAnalysis from './Pages/StationBeatAnalysis/StationBeatAnalysis'
import { useEditionFeature } from '@/libs/Permission/Permission'

export default defineComponent({
  name: '工位节拍分析',
  setup(props, ctx) {
    useEditionFeature()
    useProvideModels()
    const tabData = [
      {
        label: '工位节拍分析',
        name: 'configuration',
        hidden: false,
        component: StationBeatAnalysis,
      },
    ]
    return () => {
      return (
        <div class={styles.StationBeatAnalysis}>
          <Content title="工位节拍分析">
            <StationBeatAnalysis />
          </Content>
        </div>
      )
    }
  },
})
