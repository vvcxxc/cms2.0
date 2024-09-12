import { computed, defineComponent, ref, inject } from 'vue'
import { useProductDelivery } from '../../../Controller/ProductDeliver'
import styles from './Debugger.module.scss'
import { Rect, TipTypeEnum } from '../../../Types'

export default defineComponent({
  name: 'setting',
  props: {
    debuggerData: {
      type: Array,
      default: () => [],
    },
    rectMap: {
      type: Object,
      default: () => ({}),
    },
    workStation: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const { onDestroyData } = useProductDelivery(props, emit)
    const isApp = inject('isApp', false)

    return () => {
      return isApp ? (
        <div
          class={styles.debugger}
          onClick={(event: Event) => event.stopPropagation()}
        >
          以下为本地调试用，请勿在生产环境使用
          <el-button type="danger" onClick={onDestroyData}>
            销毁
          </el-button>
          <p class={styles.work}>工位：{props.workStation}</p>
          {props.debuggerData.map((item: any) => {
            const rect = props.rectMap[item.serialNumber]
            return (
              <div class={styles.box}>
                {/* <p class={styles.p}>工位：{workStation.value}</p> */}
                <p class={styles.p}>产品码:{rect.serialNumber}</p>
                <p class={styles.p} style={{ color: 'red', width: '80px' }}>
                  坐标X: {parseInt(String(rect.x))} px
                </p>
                <p class={styles.p}>进度: {parseInt(String(rect.progress))}%</p>
                <p class={styles.p} style={{ color: 'red' }}>
                  终点位置: {parseInt(String(rect.endpoint))}
                </p>
                <p class={styles.p}>单位: {rect.unit?.toFixed(2)}px/hz</p>
                <p
                  class={styles.p}
                  style={{ color: rect.status ? 'green' : 'red' }}
                >
                  状态: {rect.status ? '显示' : '隐藏'}
                </p>
              </div>
            )
          })}
        </div>
      ) : null
    }
  },
})
