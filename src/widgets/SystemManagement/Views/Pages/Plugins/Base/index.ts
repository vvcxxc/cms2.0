import Base from './Base'

export default {
  widget: Base,
  name: '基本设置',
  id: 'base',
  type: 'base',
  sort: 1,
  /**
   * 自定义默认配置
   * 以下注释打开后查看效果
   * @example 如下
   */
  // initConfig: () => {
  //   return {
  //     /**
  //      * {
  //      * PluginEdition: 1
  //      * }
  //      */
  //     formData: {
  //       // test: 3449949499494,
  //     },
  //     /**
  //      * {
  //      * PluginEdition: 'SCMS.AppSettings.PluginEdition',
  //      * }
  //      */
  //     ConfigureCodeMap: {
  //       // test: 'SCMS.AppSettings.TestsdasfeaPluginEdition',
  //     },
  //     /**
  //      * 调用保存更新接口前的回调
  //      */
  //     beforeUpdate: (setting: Record<string, any>) => {
  //       console.log(setting, '---==>')
  //     },
  //   }
  // },
}
