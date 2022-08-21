# 在线代码编辑器



## 一. 需求分析

以 https://play.vueuse.org/ 为例，实现一个以下功能vue代码编辑器

- [ ] 在线编辑

- [ ] 实时预览代码渲染

- [ ] 多文件模拟

- [ ] 导入npm包

- [ ] 导出代码

- [ ] 可分享页面

- [x] 多窗格布局



接下来继续拆解其功能



## 二. 技术选型

- 打包器`vite`，vue3 + ts
    - 组件按需导入 `vite-plugin-components`
    
- 代码编辑器`monaco-editor`
    - html 高亮 `vscode-html-languageservice`
    - VS Code 主题 `theme-vitesse`
    - 自定义html worker 线程封装
- 多窗格布局`splitpanes`
- 文件处理
    - 保存到本地 `file-saver`
    - 压缩 `jszip`
- ui
    - css框架`windicss`
    - 组件库`@headlessui/vue`
    - 图标包 `@iconify/json`

- 工具库 `@vueuse` `@antfu/utils`
- 字符串压缩 `lz-string `, 压缩代码为最小格式
- 按比例缩放窗格 `vue-hako`



## 三.  TODO: monaco 自定义插件与渲染 

 参考资料

- [用Monaco Editor打造接近vscode体验的浏览器IDE](https://www.cnblogs.com/FuturexGO/p/12976656.html)

- [开发一个爆款 VSCode 插件](https://zhuanlan.zhihu.com/p/90091936)
- [闲谈monaco的基本使用](https://zhuanlan.zhihu.com/p/47746336)
- https://github.com/Microsoft/monaco-editor/blob/main/CONTRIBUTING.md#a-brief-explanation-on-the-source-code-structure

---

monaco是从vscode中直接剥离出来的编辑器，以便可供web使用。

以下是源码仓库

- [monaco-editor](https://github.com/microsoft/monaco-editor)：仓库代码打包后的版本，不包含源码，一般用于用户使用
- [monaco-editor-core](https://www.npmjs.com/package/monaco-editor-core)：构建`monaco-editor` 的基础库，可以用这个库来添加自定义的语言服务

>  粗粗看了下， 好像两个库区别是 core 没有自带的language service

> [language service protocol](https://microsoft.github.io/language-server-protocol/overviews/lsp/overview/)
>
> 微软提出的高级语言服务协议，通信使用JSON-RPC传输，规范了编辑器与服务间的交互，避免了每个编辑器都用不同的代码实现同样的功能。
>
> 只需要实现对应的接口，就可以完美接入vscode; 

---

现在需要为其添加vue和windicss的支持，这需要非常了解vscode、vue、windicss的运行机制

- [vs插件官方文档](https://code.visualstudio.com/api/get-started/your-first-extension)



## 四.  加载npm包

> import map仅仅只能用于学习，生产环境还是得用stackbilz、codesandbox的方法



从[skypack](https://www.skypack.dev/) 获取esm 包

原理

- https://zhuanlan.zhihu.com/p/535994431
- https://docs.skypack.dev/



es-modules

- [import.meta](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/import.meta)



通过 [import-maps](https://github.com/WICG/import-maps) 特性加载es-moudle模块，在未支持这一特性的浏览器上，可使用 [es-module-shims](https://www.npmjs.com/package/es-module-shims) 做兼容性处理

- [「将 Vue SFC 编译为 ESM 」探索之路](https://segmentfault.com/a/1190000040059032)
- [vue 无build加载](https://cn.vuejs.org/guide/quick-start.html#without-build-tools)
- [import maps](https://www.cordc.net/link/hb0eOAVCkjWZabkD?sub=1)
- [(重要) es-module-shims原理及综合描述](https://juejin.cn/post/7070339012933713956)
  - [inline-module](https://www.npmjs.com/package/inline-module)
  - 只是需要注意的是，`<script src="https://unpkg.com/inline-module/index.js" setup></script>`这段必须出现在所有的`type="inline-module"`的script标签之后，所有`type="module"`的script标签之前。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script async src="https://unpkg.com/es-module-shims@1.5.15/dist/es-module-shims.js"></script>
</head>
<body>
<div id="app">
  template: {{ message }}
</div>
</body>

<script>
  console.log('currentScript', document.currentScript)
</script>
<script type="inline-module" id="foo">
  const foo = 'i am foo';
  export default {foo};



</script>
<!-- https://generator.jspm.io/#U2NhYGBkDM0rySzJSU1hKEpNTC5xMLTQM9Az0C1K1jMAAKFS5w0gAA -->
<script type="inline-module-importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }

</script>
<script setup>
  const currentScript = document.currentScript || document.querySelector('script')
  const map = {
    imports: {
      vue: 'https://unpkg.com/vue@3/dist/vue.esm-browser.js',
    },
    scopes: {},
  }

  function getBlobURL(module) {
    const jsCode = module.innerHTML
    const blob = new Blob([jsCode], {type: 'text/javascript'})
    return URL.createObjectURL(blob)
  }

  function setup() {
    const modules = document.querySelectorAll('script[type="inline-module"]')

    const importMap = {};
    [...modules].forEach((module) => {
      const {id} = module
      if (id)
        importMap[`#${id}`] = getBlobURL(module)
    })
    console.log('modules', {modules, importMap})
    const importMapEl = document.querySelector('script[type="importmap"]')
    if (importMapEl) {
      // map = JSON.parse(mapEl.innerHTML);
      throw new Error('Cannot setup after importmap is set. Use <script type="inline-module-importmap"> instead.')
    }

    const externalMapEl = document.querySelector('script[type="inline-module-importmap"]')
    if (externalMapEl) {
      const externalMap = JSON.parse(externalMapEl.textContent)
      Object.assign(map.imports, externalMap.imports)
      Object.assign(map.scopes, externalMap.scopes)
    }

    Object.assign(map.imports, importMap)

    const mapEl = document.createElement('script')
    mapEl.setAttribute('type', 'importmap')
    mapEl.textContent = JSON.stringify(map)
    currentScript.after(mapEl)
  }

  if (currentScript.hasAttribute('setup'))
    setup()

</script>

<script type="module">
  import {createApp} from 'vue'
  import * as vue from 'vue'
  import foo from '#foo';

  console.log('vue', vue)
  console.log(import.meta, document.currentScript)
  console.log('foo', foo)

  createApp({
    data() {
      return {
        message: foo,
      }
    },
  }).mount('#app')

</script>

</html>

```

[system.js](https://github.com/systemjs/systemjs) 在import-maps特性上，支持umd模块和更多的功能

- [SystemJS 探秘](https://zhuanlan.zhihu.com/p/402155045)

stackblitz

- https://zhuanlan.zhihu.com/p/35778751

## 五.  TODO 编译vue文件

### 1. 编译过程

正常情况下，使用importmap特性，已经可以在浏览器上直接运行es-module模块。但是，vue3的单文件，是无法在浏览器上直接使用的，所以，我们需要把其转换为js代码。

这时候需要使用[vue/compiler-sfc](https://www.npmjs.com/package/@vue/compiler-sfc) 转换单文件代码成原生js、css、html

简单流程 (TODO)

### 2. 多文件TODO

还没开始写,  但是有几个猜想

- [inline-module](https://www.npmjs.com/package/inline-module): 每个文件都创建成blob, 挂在import-map上，自然就可以通过浏览器互相import。这样每个文件的名字、导入方式需要一致
- vue-playground：原来的使用方法，有点像webpack,  挂载一个全局变量module,  嵌入iframe前提前做好挂载，从一个入口往下递归解析,  只解析相对地址 。  最后通过postMessage发送到iframe,  动态替换，每次不重新创建iframe,  只有在importmap或vue版本变化时才重新创建
  - [【Webpack】AST、babel、依赖](https://www.jianshu.com/p/c874dc43dc66)


