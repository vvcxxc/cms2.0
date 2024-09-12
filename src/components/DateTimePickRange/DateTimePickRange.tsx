import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import styles from './DateTimePickRange.module.scss'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
export default defineComponent({
  name: '日期范围',
  props: {
    label: {
      type: String,
      default: '时间范围',
    },
    From: {
      type: String,
      default: '',
      requred: true,
    },
    To: {
      type: String,
      default: '',
      requred: true,
    },
    valueFormat: {
      type: String,
      default: 'YYYY-MM-DD HH:mm:ss',
    },
    clearable: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['change'],
  setup(props, { attrs, slots, emit }) {
    // todo 支持配置默认时间
    const times = reactive({
      From: '',
      To: '',
    })

    onMounted(() => {
      if (props.From) {
        times.From = props.From
      }
      if (props.To) {
        times.To = props.To
      }
    })

    const onChangeFrom = (val: Date) => {
      console.log(val)
      if (times.To && dayjs(val).isAfter(times.To)) {
        ElMessage.warning('开始时间必须比结束时间小')
        return
      }
      emit('change', times)
    }

    const onChangeTo = (val: Date) => {
      console.log(val)
      if (times.To && dayjs(val).isBefore(times.From)) {
        ElMessage.warning('开始时间必须比结束时间小')
        return
      }
      emit('change', times)
    }

    return () => {
      return (
        <div class={styles.DateTimePickRange}>
          <span class={styles.label}>{props.label}</span>
          <el-date-picker
            v-model={times.From}
            type="datetime"
            placeholder="请选择开始时间"
            onChange={onChangeFrom}
            valueFormat={props.valueFormat}
            clearable={props.clearable}
          />
          <span class={styles.line}>-</span>
          <el-date-picker
            v-model={times.To}
            type="datetime"
            placeholder="请选择结束时间"
            onChange={onChangeTo}
            valueFormat={props.valueFormat}
            clearable={props.clearable}
          />
        </div>
      )
    }
  },
})
