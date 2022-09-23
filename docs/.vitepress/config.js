import {defineConfig} from 'vitepress'

export default defineConfig({
  title: 'ikomom blog',
  description: 'Just playing around.',
  themeConfig: {
    outlineTitle: '目录',
    sidebar: [
      {
        text: '算法与数据结构',
        collapsible: true,
        items: [
          {text: '收集', link: '/algorithm/index'},
          {text: '树', link: '/algorithm/tree'},
        ]
      },
      {
        text: '需求尝试',
        collapsible: true,
        items: [
          {text: '在线代码编辑器', link: '/requirement/onlineCodeEditor'},
          {text: '个人demo网站', link: '/requirement/site'},
        ]
      },
      {
        text: 'nodejs',
        collapsible: true,
        items: [
          {text: 'net', link: '/nodejs/net'},
        ]
      },
      {
        text: 'linux',
        collapsible: true,
        items: [
          {text: '前端部署', link: '/linux/frontend'},
          {text: '小知识', link: '/linux/tips'},
        ]
      },
      {
        text: '读书笔记',
        collapsible: true,
        items: [
          {text: '《无器械健身》', link: '/sport/noMachineSport'},
          {text: '《囚徒健身》', link: '/sport/prisonerFitness'},
          {text: '《城市就是健身房》', link: '/sport/cityIsGym'},
        ]
      },
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
    // footer: {
    //   message: 'Released under the MIT License.',
    //   copyright: 'Copyright © 2019-present Evan You'
    // },
    docFooter: {
      prev: 'Pagina prior',
      next: 'Proxima pagina'
    }
  },

})
