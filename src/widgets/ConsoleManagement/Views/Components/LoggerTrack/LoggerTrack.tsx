import { defineComponent, ref } from 'vue'
import styles from './LoggerTrack.module.scss'
import { useLogger } from '@/widgets/ConsoleManagement/Controllers/Logger'
import { LoggerTrack } from '@/widgets/ConsoleManagement/enum'
import IconButton from '@/components/IconButton/IconButton'

export default defineComponent({
  name: 'Logger',
  props: {
    socket: {
      type: Object,
    },
    headerParams: {
      type: Object,
    },
  },
  setup(props, ctx) {
    const {
      form,
      isHistory,
      printTraceLogs,
      logContentRef,
      onSearch,
      onClickExport,
      onSwitchChange,
    } = useLogger(props, ctx, LoggerTrack)

    return () => (
      <div class={styles.logger}>
        <div class={styles.header}>
          <el-form model={form.value} label-width="auto" inline={true}>
            <el-form-item label="时间">
              <el-date-picker
                style="width: 120px;margin-right: 10px"
                v-model={form.value.BeginTime}
                type="datetime"
                placeholder="开始时间"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
              <el-date-picker
                style="width: 120px"
                v-model={form.value.EndTime}
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="结束时间"
              />
            </el-form-item>
            <el-form-item label="关键词">
              <el-input
                style="width: 100px"
                v-model={form.value.Keyword}
                placeholder="关键词"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                onClick={() => onSearch()}
                class={styles.btn}
                type="primary"
              >
                搜索
              </el-button>
            </el-form-item>
          </el-form>

          <div class={styles.logAction}>
            {isHistory.value ? (
              <IconButton
                class={styles.Icon}
                icon="out"
                onClick={onClickExport}
              >
                导出
              </IconButton>
            ) : null}
            <el-switch
              active-text={isHistory.value ? '历史' : '实时'}
              v-model={isHistory.value}
              active-value={false}
              inactive-value={true}
              style="--cs-switch-on-color: #13ce66;"
              onChange={onSwitchChange}
            />
          </div>
        </div>
        <div class={styles.content} ref={logContentRef}>
          {printTraceLogs.value.map((log) => {
            return (
              <p
                class={[styles.logLine, styles[log.type]]}
                v-html={log.content}
              ></p>
            )
          })}
        </div>
      </div>
    )
  },
})
