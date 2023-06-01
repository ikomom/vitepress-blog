# vite

## 问答

### vite打包排除monaco编辑器，vite.config怎么配置

> 如果你想在 vite 打包时排除 monaco 编辑器，你可以在 vite.config.js 文件中配置 optimizeDeps.exclude 选项，将 monaco-editor 添加到排除列表中。请看以下代码：
>
> ```js
> // vite.config.js
> export default {
>   // ...
>   optimizeDeps: {
>     exclude: ['monaco-editor']
>   }
> }
> ```
>
> 这样，vite 就不会对 monaco-editor 进行预构建，而是将其作为外部依赖处理。你还需要在 index.html 文件中手动引入 monaco-editor 的 CDN 脚本，以及配置 monaco-editor 的 loader。请看以下代码：
>
> ```html
> <!-- index.html -->
> <head>
>   <!-- ... -->
>   <script src="https://unpkg.com/monaco-editor/min/vs/loader.js"></script>
> </head>
> <body>
>   <!-- ... -->
>   <script>
>     // 配置 monaco-editor 的 loader
>     window.MonacoEnvironment = {
>       getWorkerUrl: function (moduleId, label) {
>         if (label === 'json') {
>           return 'https://unpkg.com/monaco-editor/min/vs/language/json/json.worker.js';
>         }
>         if (label === 'css' || label === 'scss' || label === 'less') {
>           return 'https://unpkg.com/monaco-editor/min/vs/language/css/css.worker.js';
>         }
>         if (label === 'html' || label === 'handlebars' || label === 'razor') {
>           return 'https://unpkg.com/monaco-editor/min/vs/language/html/html.worker.js';
>         }
>         if (label === 'typescript' || label === 'javascript') {
>           return 'https://unpkg.com/monaco-editor/min/vs/language/typescript/ts.worker.js';
>         }
>         return 'https://unpkg.com/monaco-editor/min/vs/editor/editor.worker.js';
>       },
>     };
>   </script>
> </body>
> ```
>
> 具体的用法和示例代码，你可以查看以下网址：
>
> - [配置 Vite | Vite 官方中文文档](#1)
> - [关于 vite.config.js 相关配置，拿走不谢 - 掘金](#2)
> - [vue3+vite简单搞搞Monaco-Editor - 掘金](#3)
>
> 希望这些信息对你有用。😊
>
> 源: 与必应的对话， 2023/6/1
> (1) 配置 Vite | Vite 官方中文文档. https://cn.vitejs.dev/config/.
> (2) 关于 vite.config.js 相关配置，拿走不谢 - 掘金. https://juejin.cn/post/7039879176534360077.
> (3) vue3+vite简单搞搞Monaco-Editor - 掘金. https://juejin.cn/post/7064935898080608287.

### 那vite怎么打包monoca为单独的文件呢

> 如果你想在 vite 打包时将 monaco 编辑器作为单独的文件，你可以在 vite.config.js 文件中配置 build.rollupOptions.output.manualChunks 选项，将 monaco-editor 添加到一个单独的 chunk 中。请看以下代码：
>
> ```js
> // vite.config.js
> export default {
>   // ...
>   build: {
>     rollupOptions: {
>       output: {
>         manualChunks: {
>           // 将 monaco-editor 分离为一个单独的 chunk
>           'monaco-editor': ['monaco-editor']
>         }
>       }
>     }
>   }
> }
> ```
>
> 这样，vite 就会在打包时将 monaco-editor 的代码分离为一个单独的文件，而不是打包到主入口文件中。你还需要在 index.html 文件中手动引入 monaco-editor 的 CDN 脚本，以及配置 monaco-editor 的 loader。请看以下代码：
>
> ```html
> <!-- index.html -->
> <head>
>   <!-- ... -->
>   <script src="https://unpkg.com/monaco-editor/min/vs/loader.js"></script>
> </head>
> <body>
>   <!-- ... -->
>   <script>
>     // 配置 monaco-editor 的 loader
>     window.MonacoEnvironment = {
>       getWorkerUrl: function (moduleId, label) {
>         if (label === 'json') {
>           return 'https://unpkg.com/monaco-editor/min/vs/language/json/json.worker.js';
>         }
>         if (label === 'css' || label === 'scss' || label === 'less') {
>           return 'https://unpkg.com/monaco-editor/min/vs/language/css/css.worker.js';
>         }
>         if (label === 'html' || label === 'handlebars' || label === 'razor') {
>           return 'https://unpkg.com/monaco-editor/min/vs/language/html/html.worker.js';
>         }
>         if (label === 'typescript' || label === 'javascript') {
>           return 'https://unpkg.com/monaco-editor/min/vs/language/typescript/ts.worker.js';
>         }
>         return 'https://unpkg.com/monaco-editor/min/vs/editor/editor.worker.js';
>       },
>     };
>   </script>
> </body>
> ```
>
> 具体的用法和示例代码，你可以查看以下网址：
>
> - [vue3+vite简单搞搞Monaco-Editor - 掘金](#1)
> - [在vue3+vite中使用monaco-editor编辑器 - 掘金](#2)
> - [vite怎么实现组件库每个组件单独打包？ - 知乎](#3)
>
> 希望这些信息对你有用。😊
>
> 源: 与必应的对话， 2023/6/1
> (1) vue3+vite简单搞搞Monaco-Editor - 掘金. https://juejin.cn/post/7064935898080608287.
> (2) 在vue3+vite中使用monaco-editor编辑器 - 掘金. https://juejin.cn/post/7095994149753028615.
> (3) vite怎么实现组件库每个组件单独打包？ - 知乎. https://www.zhihu.com/question/530604549.