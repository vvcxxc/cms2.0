import { defineComponent } from 'vue'
import styles from './Parameter.module.scss'
export default defineComponent({
  name: '参数',
  props: {
    processParameters: {
      type: Array,
      default: () => [],
    },
    materialParameters: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    return () => (
      <div class={styles.parametersWrap}>
        {props.processParameters?.map((item: any) => {
          return (
            <div class={styles.parameters}>
              <h3 class={styles.title} title={item.name}>
                {item.name}
              </h3>
              <div class={styles.value}>下限：{item.lower}</div>
              <div class={styles.value}>上限：{item.upper}</div>
              <el-tooltip
                effect="dark"
                content={item.value}
                placement="top"
                disabled={!item.value}
              >
                <div class={styles.value}>实时：{item.value}</div>
              </el-tooltip>

              <div class={styles.result}>
                结果：
                <span class={item.result === 'NG' ? styles.ng : styles.ok}>
                  {item.result}
                </span>
              </div>
            </div>
          )
        })}

        {props.materialParameters?.map((item: any) => {
          return (
            <div class={styles.parameters2}>
              <h3 class={styles.title2} title={item.name}>
                {item.name}
              </h3>
              <div class={styles.value2}>物料条码：{item.barcode}</div>
            </div>
          )
        })}
      </div>
    )
  },
})
