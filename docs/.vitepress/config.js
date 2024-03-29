import {defineConfig} from 'vitepress'

export default defineConfig({
  title: 'ikomom blog',
  description: 'Just playing around.',
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,

  markdown: {
    math: true,
  },
  themeConfig: {
    search: {
      provider: 'local'
    },
    outlineTitle: '目录',
    sidebar: [
      {
        text: '算法与数据结构',
        collapsible: true,
        items: [
          {text: '收集', link: '/algorithm/algorithm'},
          {text: '[TODO]树', link: '/algorithm/tree'},
        ]
      },
      {
        text: '需求尝试',
        collapsible: true,
        items: [
          {text: 'demo', link: '/requirement/demo'},
          {text: '[TODO]在线代码编辑器', link: '/requirement/onlineCodeEditor'},
          {text: '[TODO]个人demo网站', link: '/requirement/site'},
        ]
      },
      {
        text: 'nodejs',
        collapsible: true,
        items: [
          {text: '[TODO]net', link: '/nodejs/net'},
        ]
      },
      {
        text: '面试',
        collapsible: true,
        items: [
          {text: '安全', link: '/front/面试/安全'},
          {text: '低代码', link: '/front/面试/低代码'},
          {text: '设计模式', link: '/front/面试/设计模式'},
          {text: '杂项', link: '/front/面试/杂项'},
          {text: 'CSS', link: '/front/面试/CSS'},
          {text: 'HTML', link: '/front/面试/HTML'},
          {text: 'HTTP', link: '/front/面试/HTTP'},
          {text: 'JS', link: '/front/面试/JS'},
          {text: 'VUE', link: '/front/面试/vue'},
        ]
      },
      {
        text: '前端',
        collapsible: true,
        items: [
          {text: '[TODO]react状态管理', link: '/front/state'},
          {text: '[TODO]状态机', link: '/front/stateMachine'},
          {text: '[TODO]装饰器', link: '/front/decorator'},
        ]
      },
      {
        text: 'network',
        collapsible: true,
        items: [
          {text: '浏览器', link: '/network/浏览器'},
          {text: 'Http缓存', link: '/network/Http缓存'},
        ]
      },
      {
        text: 'linux',
        collapsible: true,
        items: [
          {text: '[TODO]前端部署', link: '/linux/frontend'},
          {text: '小知识', link: '/linux/tips'},
        ]
      },
      {
        text: '读书笔记',
        collapsible: true,
        items: [
          {text: '健身日记', link: '/sport/prisonerFitness'},
          {text: '《无器械健身》', link: '/sport/noMachineSport'},
          {text: '《城市就是健身房》', link: '/sport/cityIsGym'},
        ]
      },
      {
        text: '杂项',
        collapsible: true,
        items: [
          {text: '围棋', link: '/extra/围棋'},
          // {text: '人际交往', link: '/extra/人际交往'},
        ]
      },
      {
        text: '游戏开发',
        collapsible: true,
        items: [
          {
            text: 'godot', link: '/gameDev/godot'
          }
        ]
      }
    ],
    nav: [
      // {
      //   text: '算法',
      //   items: [
      //     {text: '树', link: '/algorithm/tree'},
      //   ]
      // },
    ],
    socialLinks: [
      {icon: 'github', link: 'https://github.com/ikomom/vitepress-blog'},
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present Ikomom'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    }
  },

})
