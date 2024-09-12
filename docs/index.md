---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'information-ui'
  text: '前端信息化组件库'
  tagline: '基于Vue3.x开发的组件库'
  image:
    # 想执行该命令，需要先把vue版本升级到3.3+,或者把package.json中的vue删除，重新安装，编译好了后，再恢复
    src: /tt.png
    alt: lems
  actions:
    - theme: brand
      text: 快速开始
      link: /quick-start
    - theme: alt
      text: 查看组件
      link: /components/BaseContent

features:
  - title: 集成
    details: 集成于信息化标准组件开发
  - title: 复用
    details: 组件API复用，减少开发成本
  - title: 样式统一
    details: 样式基于信息化组件标准，省去样式走查步骤
---
