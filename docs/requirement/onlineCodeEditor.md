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

从[skypack](https://www.skypack.dev/) 获取esm 包

原理

- https://zhuanlan.zhihu.com/p/535994431
- https://docs.skypack.dev/

通过 [es-module-shims](https://www.npmjs.com/package/es-module-shims) 加载

https://segmentfault.com/a/1190000040059032

https://github.com/WICG/import-maps
