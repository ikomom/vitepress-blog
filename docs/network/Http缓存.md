# Http缓存

https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching



## 概览

HTTP 缓存会存储与请求关联的响应，并将存储的响应复用于后续请求



## 不同种类缓存

在 [HTTP Caching](https://httpwg.org/specs/rfc9111.html) 标准中，有两种不同类型的缓存：**私有缓存**和**共享缓存**。



### 私有缓存

私有缓存是绑定到**特定客户端**的缓存(通常是浏览器缓存)



> **Q: cookies是私有缓存吗**
>
> A: 不一定。cookies是一种用来在浏览器和服务器之间存储和传递用户信息的技术，**它不是缓存的一部分，而是请求和响应的一部分**。
>
> cookies可以用来控制个性化的内容，比如登录状态、购物车等，但是cookies的存在并不总是意味着响应是私有的，因此cookies本身并不能决定响应是否可以被共享缓存¹。
>
> 响应是否可以被共享缓存，取决于响应头中的**Cache-Control**字段。如果响应头中有private指令，那么表示响应只能被用户的浏览器缓存，即私有缓存²。如果响应头中有public指令，那么表示响应可以被任何中间代理（比如CDN）缓存，即共享缓存²。如果响应头中没有这些指令，那么默认情况下，只有当响应没有Authorization头时，才可以被共享缓存¹。
>
> 源: 与必应的对话， 2023/4/26
> (1) HTTP caching - HTTP | MDN - Mozilla Developer. https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching.
> (2) Cache-Control - HTTP | MDN - Mozilla Developer. https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control.



> **Q: localstorage 是私有缓存吗**
>
> A: 不是。localstorage是一种用来在浏览器中存储和访问数据的技术，它不是缓存的一部分，而是一个独立的存储对象⁴。localstorage可以存储和重用个性化的内容，但是它不受HTTP缓存控制头的影响，也不会随着缓存的清除而清除¹。
>
> HTTP缓存是一种用来在浏览器和服务器之间存储和重用响应的技术，它可以是私有缓存或者共享缓存²。**私有缓存是指只能被用户的浏览器缓存的响应，通常是个性化的内容，比如登录状态、购物车等**。**共享缓存是指可以被任何中间代理（比如CDN）缓存的响应，通常是公共的内容，比如图片、样式表等**。HTTP缓存受Cache-Control字段等的控制，也会随着缓存的清除而清除²。
>
> 源: 与必应的对话， 2023/4/26
> (1) Web development: localStorage vs. cached HTTP - Stack Overflow. https://stackoverflow.com/questions/7136713/web-development-localstorage-vs-cached-http.
> (2) Window: localStorage property - Web APIs | MDN - Mozilla Developer. https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage.
> (3) Cache-Control - HTTP | MDN - Mozilla Developer. https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control.
> (4) caching - JavaScript localStorage cache with size limit and least .... https://stackoverflow.com/questions/52220254/javascript-localstorage-cache-with-size-limit-and-least-recently-used-lru-evic.



### 共享缓存



共享缓存位于**客户端和服务器之间**，可以存储能在用户之间共享的响应(cdn),  通常是公共的内容，比如图片、样式表等。

共享缓存可以进一步细分为**代理缓存**和**托管缓存**。



#### 代理缓存



> **Q: 代理缓存中代理什么意思**
>
> A: **代理缓存中的代理是指一种位于客户端和服务器之间的中间服务器**，它可以存储和重用响应，以便为多个用户提供更快更高效的服务¹。代理缓存可以减少网络流量，降低延迟，提高用户体验。
>
> 代理缓存的工作原理是，当客户端请求一个资源时，它会先向代理服务器发送请求。代理服务器会检查自己是否有这个资源的副本，如果有，并且还是新鲜的，就直接返回给客户端。如果没有，或者已经过期或需要验证，就会向源服务器发送请求。源服务器会根据请求头中的验证字段，判断是否需要返回新的内容，还是只返回304状态码。如果返回新的内容，代理服务器会更新自己的缓存，并把新的内容返回给客户端。如果只返回304状态码，代理服务器会刷新自己的缓存，并把缓存内容返回给客户端²。
>
> 源: 与必应的对话， 2023/4/26
> (1) What is Proxy Caching? - StackPath. https://www.stackpath.com/edge-academy/what-is-proxy-caching/.
> (2) HTTP caching - HTTP | MDN - Mozilla Developer. https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching.
> (3) What is Proxy Cache? | Webopedia. https://www.webopedia.com/definitions/proxy-cache/.
> (4) What is a Web Proxy Cache? - Definition from Techopedia. https://www.techopedia.com/definition/2453/web-proxy-cache.

-----

> Q: Kitchen-sink 标头 是什么意思
>
> A: Kitchen-sink 标头是指一种包含了**多个缓存控制指令的标头**，用来尽可能地防止过时的代理缓存实现（比如不理解no-store指令的实现）缓存响应¹。这种标头的名字来源于一个英语表达“everything but the kitchen sink”，意思是包含了所有可以想到的东西²。例如，下面的标头就是一个kitchen-sink标头：
>
> Cache-Control: no-store, no-cache, max-age=0, must-revalidate, proxy-revalidate
>
> 这个标头表示响应**不能被缓存（no-store）**，**每次都需要验证（no-cache）**，**立即过期（max-age=0）**，**过期后必须重新验证（must-revalidate）**，**并且代理服务器也不能缓存（proxy-revalidate）**¹。这样可以避免一些不符合HTTP缓存标准的代理服务器错误地缓存响应。
>
> 源: 与必应的对话， 2023/4/26
> (1) HTTP caching - HTTP | MDN - Mozilla Developer. https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching.
> (2) meaning - What is a "kitchen sink approach"? - English Language & Usage .... https://english.stackexchange.com/questions/221669/what-is-a-kitchen-sink-approach.
> (3) Kitchen-sink Definition & Meaning - Merriam-Webster. https://www.merriam-webster.com/dictionary/kitchen-sink.

----

> **Q: everything but the kitchen sink**
>
> A: 这是一个英语表达，意思是包含了**所有可以想到的东西**，或者过分地多的东西。它的出处可能是因为厨房水槽（kitchen sink）是一种很难移动或携带的物品，所以除了它之外，其他的东西都可以带走。例如：
>
> - When we go camping, she always packs everything but the kitchen sink. 我们去露营的时候，她总是带上所有能想到的东西。
> - His new novel has everything but the kitchen sink: romance, mystery, comedy, and even some science fiction. 他的新小说包含了各种元素：浪漫、悬疑、喜剧，甚至还有一些科幻。

---

#### 托管缓存

托管缓存由**服务开发人员明确部署**，以降低源服务器负载并有效地交付内容。包括**反向代理**、包括反向代理、CDN 和 **service worker** 与**缓存 API 的组合** 

可以通过`Cache-Control: no-store`来实现自己的缓存





## 名词解释

### CDN

https://www.zhihu.com/question/36514327?rf=37353035



### 反向代理

