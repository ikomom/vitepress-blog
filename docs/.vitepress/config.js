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
          {text: '树', link: '/algorithm/tree'},
        ]
      },
      {
        text: '需求尝试',
        collapsible: true,
        items: [
          {text: '在线代码编辑器', link: '/requirement/onlineCodeEditor'},
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
