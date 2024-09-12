import { defineComponent, ref } from 'vue'
import styles from './Logger.module.scss'
import { useLogger } from '@/widgets/ConsoleManagement/Controllers/Logger'
import { Logger } from '@/widgets/ConsoleManagement/enum'
import IconButton from '@/components/IconButton/IconButton'
// import { Socket } from '@/libs/Socket'
// import { RecycleScroller } from 'vue-virtual-scroller'

export default defineComponent({
  name: 'Logger',
  props: {
    socket: {
      type: Object,
    },
    logConfig: {
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
      printFlowLogs,
      logContentRef,
      onSearch,
      onClickExport,
      onSwitchChange,
    } = useLogger(props, ctx, Logger)

    return () => (
      <div class={styles.logger}>
        <div class={styles.header}>
          <el-form model={form.value} label-width="auto" inline={true}>
            <el-form-item label="日志等级">
              <el-select style="width: 100px" v-model={form.value.LogLevel}>
                <el-option label="全部" value={6}></el-option>
                <el-option label="info" value={2}></el-option>
                <el-option label="warning" value={3}></el-option>
                <el-option label="error" value={4}></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键词">
              <el-input
                style="width: 100px"
                v-model={form.value.Keyword}
                placeholder="请输入关键字"
              />
            </el-form-item>
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
                placeholder="结束时间"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>

            <el-form-item>
              <el-button
                class={styles.btn}
                onClick={() => onSearch()}
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
          {printFlowLogs.value.map((log) => {
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
