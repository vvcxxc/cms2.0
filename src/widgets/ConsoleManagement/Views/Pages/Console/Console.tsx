import { defineComponent, SetupContext } from 'vue'
import styles from './Console.module.scss'
import Header from '../../Components/Header/Header'
import { useConsole } from '@/widgets/ConsoleManagement/Controllers/Console'
import BaseTable from '@/components/Table/Table'
import Title from '@/components/Title/Title'
import SvgIcon from '@/components/SvgIcon/SvgIcon'
import Logger from '../../Components/Logger/Logger'
import LoggerTrack from '../../Components/LoggerTrack/LoggerTrack'
import Tab from '@/components/Tab/Tab'
import TabPane from '@/components/Tab/TabPane'
import ControlDialog from '../../Components/ControlDialog/ControlDialog'
import FlowFunctionDialog from '../../Components/FlowFunctionDialog/FlowFunctionDialog'
import IssueDialog from '../../Components/IssueDialog/IssueDialog'

export default defineComponent({
  name: 'ConsoleManagement',
  props: {
    node: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, ctx: SetupContext) {
    const {
      onHeaderChange,
      onTabChange,
      onEmitFunction,
      onConfirmControl,
      onReloadAll,
      onOpenFlow,
      onConfirmFlow,
      onIssueVariable,
      onOpenIssue,
      onPositionLog,
      onStopConnect,
      currentLeftStyle,
      leftConfig,
      leftContentRef,
      flowName,
      currentLoggerData,
      flowLoggerMap,
      loggerRef,
      logConfig,
      issueConfig,
      flowConfig,
      controlConfig,
      active,
      dataSource,
      loggerTrackRef,
      flowInfos,
      socket,
      headerParams,
    } = useConsole(props, ctx)
    return () => {
      return (
        <div class={styles.console}>
          <Header
            onChange={onHeaderChange}
            onReloadAll={onReloadAll}
            onFlow={onOpenFlow}
            flowType={active.value}
            flowName={flowName.value}
            node={props.node}
            onStop={onStopConnect}
          />
          <div class={styles.content}>
            <div class={styles.config} ref={leftContentRef}>
              {flowInfos.value.length ? (
                <Tab
                  class={styles.tabContent}
                  v-model:active={active.value}
                  size="small"
                  type="params"
                  onTab={onTabChange}
                >
                  {flowInfos.value.map((item: any) => {
                    return (
                      <TabPane
                        key={item.type}
                        label={item.name}
                        name={String(item.type)}
                        lazy={true}
                      >
                        <Title bottom={20} top={10}>
                          关键日志
                        </Title>

                        <div
                          class={styles.table}
                          style={currentLeftStyle.value}
                        >
                          <BaseTable
                            dataSource={currentLoggerData.value(item.procName)}
                            isHidePagination={true}
                            isSeq={false}
                            isCheck={false}
                            isDrag={false}
                            v-slots={{
                              action: ({ row }: any) => {
                                return (
                                  <el-button
                                    onClick={() => onPositionLog(row)}
                                    type="primary"
                                    size="small"
                                    link
                                  >
                                    定位
                                  </el-button>
                                )
                              },
                            }}
                            columns={[
                              {
                                field: 'seq',
                                title: '序号',
                                type: 'seq',
                              },
                              {
                                field: 'logMessage',
                                title: '参数',
                              },
                              {
                                field: 'action',
                                title: '操作',
                                width: 100,
                              },
                            ]}
                          />
                        </div>
                        <Title bottom={20} top={20}>
                          快捷操作
                        </Title>

                        <div class={styles.box}>
                          {item.controls.map((control: any) => {
                            return (
                              <el-button
                                onClick={() =>
                                  onEmitFunction(item.name, control)
                                }
                                class={styles.btn}
                              >
                                {control.description}
                              </el-button>
                            )
                          })}
                        </div>
                        <Title bottom={20} top={20}>
                          参数信号操作
                        </Title>
                        <div
                          class={styles.table}
                          style={currentLeftStyle.value}
                        >
                          <BaseTable
                            v-model:dataSource={item.fields}
                            isHidePagination={true}
                            isSeq={false}
                            isCheck={false}
                            isDrag={false}
                            vSlots={{
                              realValue: ({ row }: { row: any }) => {
                                return (
                                  <span style={{ color: '#5a84ff' }}>
                                    {row.realValue || '-'}
                                  </span>
                                )
                              },
                              action: ({ row }: any) => {
                                return (
                                  <div>
                                    {row.isReadOnly ? null : (
                                      <SvgIcon
                                        onClick={() =>
                                          onOpenIssue(row, item.name)
                                        }
                                        type="d"
                                        title="下发"
                                        width={20}
                                        height={20}
                                        class={styles.icon}
                                      ></SvgIcon>
                                    )}
                                  </div>
                                )
                              },
                            }}
                            columns={[
                              {
                                field: 'seq',
                                title: '序号',
                                type: 'seq',
                              },
                              {
                                field: 'name',
                                title: '功能字段',
                              },
                              {
                                field: 'description',
                                title: '描述',
                              },
                              {
                                field: 'objectValue',
                                title: '变量名',
                              },
                              {
                                field: 'realValue',
                                title: '变量值',
                                width: 200,
                              },
                              {
                                field: 'variableType',
                                title: '类型',
                                width: 60,
                              },
                              {
                                field: 'action',
                                title: '操作',
                                width: 60,
                              },
                            ]}
                          />
                        </div>
                      </TabPane>
                    )
                  })}
                </Tab>
              ) : (
                <el-empty description="暂无数据" />
              )}
            </div>
            {/* 日志 */}
            <div class={styles.logContent}>
              <Logger
                ref={loggerRef}
                socket={socket.value}
                logConfig={logConfig}
                headerParams={headerParams.value}
              />
              <LoggerTrack
                ref={loggerTrackRef}
                socket={socket.value}
                headerParams={headerParams.value}
              />
            </div>
          </div>
          <ControlDialog
            title={controlConfig.title}
            v-model={controlConfig.show}
            type={controlConfig.type}
            onConfirm={onConfirmControl}
          ></ControlDialog>
          <FlowFunctionDialog
            v-model:data={flowConfig.data}
            v-model={flowConfig.show}
            onConfirm={onConfirmFlow}
          ></FlowFunctionDialog>
          <IssueDialog
            title={issueConfig.title}
            v-model={issueConfig.show}
            onConfirm={onIssueVariable}
          />
        </div>
      )
    }
  },
})
