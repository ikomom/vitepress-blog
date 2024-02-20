---
outline: deep
---

# HTTP

## 三次握手过程(TODO)

TODO



## webSocket 协议是什么，能简述一下吗

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

## 请求头数据流换行是用什么符号表示

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



## 服务器重启websocket时如何通知浏览器刷新

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

## 怎样解决跨域问题

参考答案：

1.使用 JSONP

2.使用 cors

服务器设置请求头`Access-Control-Allow-Origin: origin`

## 如何劫持 https 的请求，提供思路

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



## JSONP的优缺点

1.优点

- 它不像XMLHttpRequest对象实现的Ajax请求那样受到同源策略的限制，JSONP可以跨越同源策略；
- 它的兼容性更好，在更加古老的浏览器中都可以运行，不需要XMLHttpRequest或ActiveX的支持
- 在请求完毕后可以通过调用callback的方式回传结果。将回调方法的权限给了调用方。这个就相当于将controller层和view层终于分开了。我提供的jsonp服务只提供纯服务的数据，至于提供服务以 后的页面渲染和后续view操作都由调用者来自己定义就好了。如果有两个页面需要渲染同一份数据，你们只需要有不同的渲染逻辑就可以了，逻辑都可以使用同 一个jsonp服务。

2.缺点

- 它只支持**GET请求**而不支持POST等其它类型的HTTP请求
- 它只支持跨域HTTP请求这种情况，不能解决不同域的两个页面之间如何进行JavaScript调用的问题。
- jsonp在**调用失败的时候不会返回各种HTTP状态码**。
- 缺点是安全性。万一假如提供jsonp的服务存在页面注入漏洞，即它返回的javascript的内容被人控制的。那么结果是什么？所有调用这个 jsonp的网站都会存在漏洞。于是无法把危险控制在一个域名下…所以在使用jsonp的时候必须要保证使用的jsonp服务必须是安全可信的。

## 什么是粘包?

https://blog.csdn.net/u014600626/article/details/108222945

## nginx gzip 和 webpack gzip 有什么区别，需要同时打开吗

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

## DNS解析过程

[DNS基础之使用dig查询DNS解析过程](https://blog.csdn.net/zxl1990_ok/article/details/125452535)

[What are DNS root servers? are there really only 13?](https://itroasters.com/tutorials/what-are-dns-root-servers/)

## 内容协商是什么

> https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Content_negotiation
>
> 在 [HTTP](https://developer.mozilla.org/zh-CN/docs/Glossary/HTTP) 协议中，***内容协商***是一种机制，用于为同一 URI 提供资源不同的[表示](https://developer.mozilla.org/zh-CN/docs/Glossary/Representation_header)形式，以帮助用户代理指定最适合用户的表示形式（例如，哪种文档语言、哪种图片格式或者哪种内容编码）。

## Transfer-Encoding

[HTTP 协议中的 Transfer-Encoding](https://www.51cto.com/article/491335.html)

HTTP/1.1 则规定所有连接都必须是持久的`Connection: keep-alive`，除非显式地在头部加上 `Connection: close`

## 浏览器中的最大并行 HTTP 连接数？

https://stackoverflow.com/questions/985431/max-parallel-http-connections-in-a-browser

## 了解RTT 和RTO 对于TCP 重传的影响 

https://www.cnblogs.com/zy09/p/16636881.html

- **RTT (Round Trip Time)**： 对于 Ping 和 Traceroute，这测量了发送 Ping 数据包和取回 ICMP 数据包之间的往返时间；对于 TCP 连接，它非常相似；它测量发送数据包到从目标主机获得确认数据包的时间。
- TODO

## TCP_NODELAY

[网络编程：TCP_NODELAY](https://zhuanlan.zhihu.com/p/80104656)

[TCP连接中启用和禁用TCP_NODELAY有什么影响？](https://www.zhihu.com/question/42308970)

TCP_NODELAY，会禁用Nagle算法。Nagle算法的作用是减少小包的数量

- 什么是小包：小于 MSS(一个TCP段在网络上传输的最大尺寸) 的都可以定义为小包。
- 如果前一个TCP段发送出去后，还没有收到对端的ACK包，那么接下来的发送数据会先累积起来不发。
- 等到对端返回ACK，或者数据累积已快达到MSS，才会发送出去。

