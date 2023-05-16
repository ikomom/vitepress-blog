# 面试



## HTTP

### webSocket 协议是什么，能简述一下吗

> WebSocket协议是一种基于TCP/IP的双向通信协议，它可以让浏览器和服务器之间实现实时、低延迟、高效的数据交换¹²。WebSocket协议的特点有：
>
> - 它是独立于HTTP协议的，但是复用了HTTP的握手通道，通过HTTP请求与服务器协商升级协议²³。
> - 它是双向的，客户端和服务器都可以主动发送和接收数据，而不需要像HTTP那样通过轮询或长轮询等方式¹²。
> - 它是有状态的，一旦建立连接，就会保持连接，直到客户端或服务器主动关闭¹²。
> - 它支持文本和二进制数据的传输，数据帧格式简单，控制开销小²⁴。
> - 它支持扩展，可以自定义子协议或者添加额外的功能²。
>
> WebSocket协议的工作流程大致如下：
>
> - 客户端通过HTTP请求向服务器发起协议升级，携带一些必要的头部信息，如Upgrade、Connection、Sec-WebSocket-Key等²³⁴。
> - 服务器收到请求后，如果同意升级协议，就返回一个101状态码的响应，同时也携带一些必要的头部信息，如Upgrade、Connection、Sec-WebSocket-Accept等²³⁴。
> - 客户端和服务器完成握手后，就建立了一个WebSocket连接，然后就可以通过该连接双向传输数据²³⁴。
> - 数据传输时，客户端和服务器都需要遵循一定的数据帧格式，每个数据帧包含一个固定长度的头部和一个可变长度的负载数据部分⁴。
> - 数据传输时，客户端和服务器都可以发送控制帧来维持连接或关闭连接，如ping、pong、close等⁴。
> - 当客户端或服务器想要关闭连接时，需要发送一个close帧，并等待对方的回应。如果对方也发送了close帧，则双方关闭TCP连接。如果对方没有回应，则主动关闭TCP连接⁴。
>
> 以上是对WebSocket协议的简要介绍，你可以根据你的具体需求和兴趣深入学习更多细节。
>
> 源: 与必应的对话， 2023/5/10
> (1) 十分钟了解WebSocket协议 - 知乎. https://bing.com/search?q=webSocket+%e5%8d%8f%e8%ae%ae.
> (2) WebSocket协议：5分钟从入门到精通 - 程序猿小卡 - 博客园. https://www.cnblogs.com/chyingp/p/websocket-deep-in.html.
> (3) WebSocket 协议完整解析 - 知乎. https://zhuanlan.zhihu.com/p/407711596.
> (4) 十分钟了解WebSocket协议 - 知乎. https://zhuanlan.zhihu.com/p/145628937.
> (5) 中的 WebSocket 支持 .NET - .NET | Microsoft Learn. https://learn.microsoft.com/zh-cn/dotnet/fundamentals/networking/websockets.
> (6) websocket协议详解及报文分析 - CSDN博客. https://blog.csdn.net/LL845876425/article/details/106393358.

### 请求头数据流换行是用什么符号表示

> 请求头数据流换行是用回车符和换行符（CRLF）表示的，也就是\r\n¹²。例如，一个HTTP请求头的数据流可能是这样的：
>
> GET /index.html HTTP/1.1\r\n
> Host: www.example.com\r\n
> User-Agent: Mozilla/5.0\r\n
> \r\n
>
> 注意，每个请求头都以\r\n结尾，并且最后一个请求头后面还有一个额外的空行\r\n，表示请求头的结束¹²。
>
> 源: 与必应的对话， 2023/5/10
> (1) 请求标头（Request header） - Mozilla Developer. https://developer.mozilla.org/zh-CN/docs/Glossary/Request_header.
> (2) HTTP请求消息数据格式详解(请求头,请求行,请求体) - CSDN博客. https://blog.csdn.net/qq_40121580/article/details/107349943.
> (3) HTTP 概述 - HTTP | MDN - Mozilla Developer. https://developer.mozilla.org/zh-CN/docs/web/http/overview.



### 服务器重启websocket时如何通知浏览器刷新

> 服务器重启WebSocket时，浏览器端的WebSocket连接会被关闭，这时浏览器端会触发onclose事件¹²。有几种方法可以通知浏览器刷新：
>
> - 在onclose事件中，使用window.location.reload()方法强制刷新浏览器³。这种方法简单粗暴，但是可能会导致用户体验不佳，或者丢失一些未保存的数据。
> - 在onclose事件中，使用WebSocket对象的connect()方法重新建立连接。这种方法可以避免刷新浏览器，但是需要服务器端支持重连机制，否则可能会失败或者造成资源浪费。
> - 在onclose事件中，使用setTimeout()方法设置一个定时器，定期尝试重新建立连接。这种方法可以在服务器端恢复后自动恢复连接，但是需要注意设置合理的重连间隔和次数，避免过于频繁或者无限重连。
> - 在onclose事件中，使用Notification API或者其他方式向用户发送一个通知，提示用户刷新浏览器。这种方法可以让用户自主选择是否刷新浏览器，但是需要用户的授权和配合。
>
> 以上是一些常见的通知浏览器刷新的方法，你可以根据你的具体需求和场景选择合适的方法。
>
> 源: 与必应的对话， 2023/5/10
> (1) HTML5 WebSocket | 菜鸟教程. https://www.runoob.com/html/html5-websocket.html.
> (2) WebSocket API (WebSockets) - Web API | MDN - Mozilla .... https://developer.mozilla.org/ja/docs/Web/API/WebSockets_API.
> (3) The WebSocket API (WebSockets) - Web APIs | MDN. https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API.

### 怎样解决跨域问题

参考答案：

1.使用 JSONP

2.使用 cors

服务器设置请求头`Access-Control-Allow-Origin: origin`

### 如何劫持 https 的请求，提供思路

> 劫持https的请求是一种中间人攻击的手法，目的是窃取或篡改用户和服务器之间的加密通信内容。要实现这种攻击，有以下几种思路：
>
> - 伪造或窃取目标网站的证书，然后通过DNS劫持或ARP欺骗等方式，让用户访问到自己的服务器，从而截取用户的请求和响应¹²。这种方法需要让用户信任伪造或窃取的证书，或者诱导用户忽略浏览器的警告。
> - 通过安装恶意软件或插件，或者诱导用户安装不知名的根证书，从而在用户的浏览器上进行https拦截和解密³ 。这种方法需要用户的配合或者不注意。
> - 通过入侵目标网站的域名服务器或域名账户控制权，然后申请合法的证书，并将域名指向自己的服务器。这种方法难度较高，但是可以完全欺骗用户和浏览器。
>
> 源: 与必应的对话， 2023/5/10
> (1) 如何劫持https的请求_https劫持_缓月的博客-CSDN博客. https://blog.csdn.net/qq_42893625/article/details/104971069.
> (2) HTTPS 可能被这样劫持吗？ - 知乎. https://www.zhihu.com/question/22795329.
> (3) 【计算机网络(二)】DNS协议_满满和米兜的博客-CSDN博客. https://blog.csdn.net/haolinbird/article/details/130432269.



### JSONP的优缺点
1.优点
- 它不像XMLHttpRequest对象实现的Ajax请求那样受到同源策略的限制，JSONP可以跨越同源策略；
- 它的兼容性更好，在更加古老的浏览器中都可以运行，不需要XMLHttpRequest或ActiveX的支持
- 在请求完毕后可以通过调用callback的方式回传结果。将回调方法的权限给了调用方。这个就相当于将controller层和view层终于分开了。我提供的jsonp服务只提供纯服务的数据，至于提供服务以 后的页面渲染和后续view操作都由调用者来自己定义就好了。如果有两个页面需要渲染同一份数据，你们只需要有不同的渲染逻辑就可以了，逻辑都可以使用同 一个jsonp服务。

2.缺点

- 它只支持**GET请求**而不支持POST等其它类型的HTTP请求
- 它只支持跨域HTTP请求这种情况，不能解决不同域的两个页面之间如何进行JavaScript调用的问题。
- jsonp在**调用失败的时候不会返回各种HTTP状态码**。
- 缺点是安全性。万一假如提供jsonp的服务存在页面注入漏洞，即它返回的javascript的内容被人控制的。那么结果是什么？所有调用这个 jsonp的网站都会存在漏洞。于是无法把危险控制在一个域名下…所以在使用jsonp的时候必须要保证使用的jsonp服务必须是安全可信的。

### 什么是粘包?

https://blog.csdn.net/u014600626/article/details/108222945

### nginx gzip 和 webpack gzip 有什么区别，需要同时打开吗

> nginx gzip 和 webpack gzip 有以下区别：
>
> - nginx gzip 是在服务器端对静态资源进行实时压缩的功能，它可以通过配置 nginx.conf 文件中的 gzip 指令来开启或关闭¹。nginx gzip 可以减少网络传输的数据量，提高网页加载的速度，但是也会增加服务器的 CPU 资源消耗¹。
> - webpack gzip 是在打包时对静态资源进行预压缩的功能，它可以通过使用 compression-webpack-plugin 插件来实现²。webpack gzip 可以生成对应的 .gz 文件，这些文件可以被 nginx 直接使用，而不需要再进行实时压缩³。webpack gzip 可以减少服务器的 CPU 资源消耗，但是也会增加打包的时间和磁盘空间²。
>
> 一般来说，建议同时开启 nginx gzip 和 webpack gzip ，这样可以让 nginx 优先使用 webpack 生成的 .gz 文件作为响应，从而减少服务器的 CPU 资源消耗，同时也保证了网页加载的速度⁴。
>
> 源: 与必应的对话， 2023/5/13
> (1) webpack gzip和Nginx gzip区别 - 掘金. https://juejin.cn/post/7170689393311612958.
> (2) nginx和webpack开启gzip压缩--前端开发 - 掘金. https://juejin.cn/post/6844904002979627016.
> (3) webpack gzip 和 nginx gzip的区别_打包压缩和nginx访问压缩 .... https://blog.csdn.net/sd4015700/article/details/118650050.
> (4) 配置nginx直接使用webpack生成的gz压缩文件，而不用nginx .... https://blog.csdn.net/ywl570717586/article/details/100011721.
> (5) webpack性能优化：使用gzip压缩功能 - CSDN博客. https://blog.csdn.net/qq_38086247/article/details/118992974.

### DNS解析过程

[DNS基础之使用dig查询DNS解析过程](https://blog.csdn.net/zxl1990_ok/article/details/125452535)

[What are DNS root servers? are there really only 13?](https://itroasters.com/tutorials/what-are-dns-root-servers/)

### 内容协商是什么

> https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Content_negotiation
>
> 在 [HTTP](https://developer.mozilla.org/zh-CN/docs/Glossary/HTTP) 协议中，***内容协商***是一种机制，用于为同一 URI 提供资源不同的[表示](https://developer.mozilla.org/zh-CN/docs/Glossary/Representation_header)形式，以帮助用户代理指定最适合用户的表示形式（例如，哪种文档语言、哪种图片格式或者哪种内容编码）。

### Transfer-Encoding

[HTTP 协议中的 Transfer-Encoding](https://www.51cto.com/article/491335.html)

HTTP/1.1 则规定所有连接都必须是持久的`Connection: keep-alive`，除非显式地在头部加上 `Connection: close`

## 杂项

1. ts   extend  infer 手写题、函数重载   2题
2. 沙箱  手写 伪代码
3. http缓存 强缓存 协商缓存 各请求头作用   http 1.0 1.1   2.0    https原理   非对称和对称加密原理
4. cas认证和oauth2认证 流程
5. npm yarn pnpm 区别  原理  软连接和硬连接作用  什么是幽灵依赖
6. commonjs  esm 区别
7. prefetch preload 区别

## CSS

### 重绘和回流有什么区别?

https://blog.csdn.net/pig_is_duck/article/details/105903741

1、 重绘：元素样式的改变（但宽高、大小、位置等不变）

2、 回流：元素的大小或者位置发生改变（当页面布局和几何信息发生改变的时候），触发了重新布局导致渲染树重新计算布局和渲染



## 可能问题

### 开发vue项目都遇到过哪些问题怎么解决的？

https://www.zhihu.com/question/439229990

1. 从工程化的角度看，项目越大，webpack启动的速度就越慢，这一点就需要分包，抽离公共的代码；

2. 从语法上，我印象比较深的是，但是`v-if`和`v-else`的时候，如果使用的是同一个组件的话，需要单独指定key，不然组件会复用



### 当我在浏览器中输入URL，一直到页面显示，这个中间过程发生了哪些事情呢？



### vue是如何实现双向绑定的

双向绑定指的是

1. 数据更新 -》视图更新

   - 实现一个监听器 Observer，深度监听数据。用` Object.defineProperty()`对属性都加上`setter`和`getter`, 给对象的数据赋值，就会触发`setter`
   - 实现一个解析器 Compile，解析 Vue 模板指令，将模板中的变量都替换成数据，然后初始化渲染页面视图
   - 实现一个订阅者 Watcher，它时Compile和Observer间通信的桥梁，主要的任务是订阅 Observer 中的属性值变化的消息，当收到属性值变化的消息时，触发解析器 Compile 中对应的更新函数。
   - 实现一个订阅器 Dep：订阅器采用 发布-订阅 设计模式，用来收集订阅者 Watcher，对监听器 Observer 和 订阅者 Watcher 进行统一管理。

   

2. 视图更新 -》数据更新

   - 视图触发事件，更新js数据

![1.png](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/8/19/16ca75871f729d89~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

### MVVM和MVC

[正确认识 MVC/MVP/MVVM](https://juejin.cn/post/6901200799242649607)

[从react视角认识MVC](https://blog.yyisyou.tw/1dddc6d7/)

> 你好，这是Bing。MVVM和MVC是两种常用的软件架构模式，它们的主要区别是：
>
> - MVC是模型-视图-控制器（Model-View-Controller）的缩写，它将应用程序分为三个层次：模型负责处理数据和业务逻辑，视图负责显示用户界面，控制器负责接收用户输入并调用模型和视图来完成请求¹³。
> - MVVM是模型-视图-视图模型（Model-View-ViewModel）的缩写，它是MVC的改进版，它将视图的状态和行为抽象化为一个视图模型，通过数据绑定技术，实现了视图和模型的自动同步：当模型的属性改变时，视图也会自动更新²⁴。
> - MVC和MVVM的主要目的都是分离视图和模型，降低代码的耦合度和复杂度，提高可维护性和可测试性。但是MVVM相比MVC更加灵活和简洁，它减少了控制器层的代码量，避免了频繁地操作DOM元素，提高了页面的渲染性能和加载速度¹⁴。
>
> 希望这能帮助你理解MVVM和MVC的区别。😊
>
> 源: 与必应的对话， 2023/5/15
> (1) 来个简单的，MVVM和MVC有什么区别？ - 知乎专栏. https://zhuanlan.zhihu.com/p/377979044.
> (2) MVC、MVVM模式的概念与区别 - 理想三旬· - 博客园. https://www.cnblogs.com/wenkangIT/p/15149077.html.
> (3) MVC与MVVM模式的区别 - 掘金. https://juejin.cn/post/7110885291946147876.
> (4) 面试题51：MVVM和MVC有什么区别 - CSDN博客. https://blog.csdn.net/qq_51066068/article/details/125441774.

---

> 我可以尝试用原生js给你写一个MVC框架的代码示例。这个示例是一个简单的计数器应用，它有一个模型（Model）来存储计数值，一个视图（View）来显示计数值，和一个控制器（Controller）来响应用户点击按钮的事件。代码如下：
>
> ```javascript
> // Model
> var model = {
>   count: 0 // 计数值
> };
> 
> // View
> var view = {
>   init: function() {
>     // 获取页面元素
>     this.countDisplay = document.getElementById("count");
>     this.incrementButton = document.getElementById("increment");
>     this.decrementButton = document.getElementById("decrement");
>     // 渲染初始视图
>     this.render();
>   },
>   render: function() {
>     // 更新计数值显示
>     this.countDisplay.textContent = model.count;
>   }
> };
> 
> // Controller
> var controller = {
>   init: function() {
>     // 初始化视图
>     view.init();
>     // 绑定事件监听器
>     view.incrementButton.addEventListener("click", function() {
>       controller.increment(); // 调用控制器的方法
>     });
>     view.decrementButton.addEventListener("click", function() {
>       controller.decrement(); // 调用控制器的方法
>     });
>   },
>   increment: function() {
>     // 增加计数值
>     model.count++;
>     // 更新视图
>     view.render();
>   },
>   decrement: function() {
>     // 减少计数值
>     model.count--;
>     // 更新视图
>     view.render();
>   }
> };
> 
> // 启动应用
> controller.init();
> ```

---

> 我可以尝试用原生js给你写一个MVVM模式的代码示例。MVVM是Model-View-ViewModel的缩写，是一种将数据绑定和视图分离的软件架构模式。它有一个模型（Model）来存储数据，一个视图（View）来显示界面，和一个视图模型（ViewModel）来响应用户操作和更新视图。代码如下：
>
> ```javascript
> // Model
> var model = {
>   count: 0 // 计数值
> };
> 
> // View
> var view = {
>   init: function() {
>     // 获取页面元素
>     this.countDisplay = document.getElementById("count");
>     this.incrementButton = document.getElementById("increment");
>     this.decrementButton = document.getElementById("decrement");
>   }
> };
> 
> // ViewModel
> var viewModel = {
>   init: function() {
>     // 初始化视图
>     view.init();
>     // 绑定数据和视图
>     this.bindData();
>     // 绑定事件监听器
>     this.bindEvent();
>   },
>   bindData: function() {
>     // 使用Object.defineProperty实现数据绑定
>     Object.defineProperty(this, "count", {
>       get: function() {
>         return model.count; // 获取模型中的数据
>       },
>       set: function(value) {
>         model.count = value; // 设置模型中的数据
>         view.countDisplay.textContent = value; // 更新视图中的显示
>       }
>     });
>     // 初始化视图中的显示
>     view.countDisplay.textContent = this.count;
>   },
>   bindEvent: function() {
>     // 使用addEventListener实现事件绑定
>     view.incrementButton.addEventListener("click", () => {
>       this.increment(); // 调用视图模型的方法
>     });
>     view.decrementButton.addEventListener("click", () => {
>       this.decrement(); // 调用视图模型的方法
>     });
>   },
>   increment: function() {
>     // 增加计数值
>     this.count++;
>   },
>   decrement: function() {
>     // 减少计数值
>     this.count--;
>   }
> };
> 
> // 启动应用
> viewModel.init();
> ```
