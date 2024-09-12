import { createApp, h, ref, nextTick, Component } from 'vue'
import BaseDialog from '@/components/BaseDialog/index.vue'
import { ElConfigProvider } from 'element-plus'
import styles from './ConfirmBox.module.scss'
import { _t } from '@/libs/Language/Language'
export const ConfirmBox = (text: string, title = '确认') => {
  return new Promise((resolve, reject) => {
    const mountNode = document.createElement('div')
    document.body.appendChild(mountNode)

    const visible = ref(true)
    const RenderProvider = (Widget: any) => {
      return (
        <el-config-provider namespace="cs">
          <Widget />
        </el-config-provider>
      )
    }
    const app = createApp({
      render() {
        return RenderProvider(
          h(
            BaseDialog,
            {
              class: styles.ConfirmBox,
              modelValue: visible.value,
              'onUpdate:modelValue': (value: boolean) => {
                visible.value = value
              },
              title: _t(title),
              width: '379px',
              onConfirm: () => {
                resolve(true)
                nextTick(() => {
                  mountNode.remove()
                })
              },
              onClose: () => {
                reject(false)
                nextTick(() => {
                  mountNode.remove()
                })
              },
            },
            h('div', { class: styles.confirmDialog }, text)
          )
        )
      },
    })

    app.mount(mountNode)
  })
}
