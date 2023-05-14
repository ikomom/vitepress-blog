# Http缓存

- [HTTP/Caching](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching)

- [HTTP/Headers/Cache-Control](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control)



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

可以通过`Cache-Control: no-store`请求头禁止自动缓存，接着实现自己的缓存。但是，如果缓存工具忽略这个请求头的话，是不会有效的，还是需要具体问题具体分析

### 启发式缓存

HTTP 旨在尽可能多地缓存，因此即使没有给出 `Cache-Control`，如果满足某些条件，响应也会被存储和重用。这称为**启发式缓存**。

比如，请求头有以下时间字段

```http
Date: Tue, 22 Feb 2022 22:22:22 GMT
Last-Modified: Tue, 22 Feb 2021 22:22:22 GMT
```

浏览器会知道，文档有很长时间没有更新，就会重用它一段时间；复用多长时间取决于实现，但规范建议存储后大约离现在日期 10%的时间



## 基于 age 的缓存策略(强缓存)

存储的 HTTP 响应有两种状态：**fresh** 和 **stale**。*fresh* 状态通常表示响应仍然有效，可以重复使用，而 *stale* 状态表示缓存的响应已经过期。

例如，根据响应中请求头`Cache-Control: max-age=604800`，604800 秒是一周，age小于一周是fresh，反之不新鲜

#### Nginx 客户端缓存控制

expires、etag、if_modified_since： https://www.w3schools.cn/nginx/nginx_expires.asp

> **nginx会自动为静态资源生成Last-Modified字段，该字段值为静态资源文件的最后编辑时间⁴。nginx也会自动为静态资源生成ETag字段，该字段值为Last-Modified和Content-Length的十六进制组合³。**ETag和Last-Modified都是用来验证资源是否修改的响应首部字段，但**ETag的精确度比Last-Modified要高**，因为Last-Modified只能表示秒级的改变，而ETag可以表示更细微的改变²。如果同时使用ETag和Last-Modified，那么它们必须同时匹配才能认为资源没有修改¹。
>
> 源: 与必应的对话， 2023/5/13
> (1) Nginx expires/etag/if_modified_since 客户端缓存控制. https://www.w3schools.cn/nginx/nginx_expires.asp.
> (2) nginx中的etag是如何生成的 - 大数据 - 亿速云. https://www.yisu.com/zixun/551629.html.
> (3) How to enable ETag headers on Nginx for static files?. https://stackoverflow.com/questions/24549377/how-to-enable-etag-headers-on-nginx-for-static-files.
> (4) Why is the Nginx etag created from last-modified-time and content .... https://stackoverflow.com/questions/55860358/why-is-the-nginx-etag-created-from-last-modified-time-and-content-length.

#### max-age和age有什么区别

> max-age和age有以下区别：
>
> - max-age是一个Cache-Control响应头的指令，用来指定一个资源在被请求后的多长时间内（以秒为单位）可以被缓存¹。例如，`Cache-Control: max-age=3600`表示该资源可以在接下来的一个小时内被缓存。
> - age是一个响应头，用来表示自原始服务器返回该资源以来经过的时间（以秒为单位）²。例如，`Age: 60`表示该资源是在一分钟前从原始服务器返回的。
> - max-age和age的关系是，age的值通常会随着时间增加，而max-age的值通常会随着时间减少。当age的值超过max-age的值时，表示该资源已经过期，需要重新从服务器获取³。
>
> 源: 与必应的对话， 2023/5/13
> (1) 图文讲解 Cache-Control 浅显易懂 - 知乎. https://zhuanlan.zhihu.com/p/79042406.
> (2) 图解Http缓存控制之max-age=0、no-cache、no-store区别 - 知乎. https://zhuanlan.zhihu.com/p/55623075.
> (3) cookie属性max-age与expires同时存在时谁会生效 - CSDN博客. https://blog.csdn.net/feinifi/article/details/116448186.
> (4) OKHTTP缓存max-age和max-stale详解 - CSDN博客. https://blog.csdn.net/polo2044/article/details/80779528.
> (5) http 中设置过期时间expires和max-age的区别 - CSDN博客. https://blog.csdn.net/yingzizizizizizzz/article/details/81347719.

#### 那么max-age和expires有什么区别？

expires是服务器时间，是绝对值；max-age是相对时间，

> max-age和expires有以下区别：
>
> - max-age是一个Cache-Control响应头的指令，用来指定一个资源在被请求后的多长时间内（以秒为单位）可以被缓存¹。expires是一个响应头，用来指定一个资源在什么时候（以GMT格式的绝对时间）过期²。
> - max-age是HTTP/1.1中定义的，而expires是HTTP/1.0中定义的³。为了向下兼容，建议同时使用两者³。
> - max-age是一个相对的值，相对于请求时间而言，而expires是一个绝对的值，相对于服务器时间而言⁴。这意味着max-age不会受到客户端和服务器时间不同步的影响，而expires可能会导致缓存失效或过早过期⁴。
> - 如果同时使用max-age和expires，那么max-age会优先生效⁵。
>
> 源: 与必应的对话， 2023/5/13
> (1) HTTP 缓存 - HTTP | MDN - MDN Web Docs. https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching.
> (2) http 中设置过期时间expires和max-age的区别 - CSDN博客. https://blog.csdn.net/yingzizizizizizzz/article/details/81347719.
> (3) cookie属性max-age与expires同时存在时谁会生效 - CSDN博客. https://blog.csdn.net/feinifi/article/details/116448186.
> (4) expires和max-age的区别 - 千茉紫依 - 博客园. https://www.cnblogs.com/qmzy/p/9487502.html.
> (5) max-age 和 Expires_adb96102的博客-CSDN博客. https://blog.csdn.net/adb96102/article/details/101264527.

#### 浏览器判断max-age是否过期的吗，能否通过响应头修改使得max-age失效

> 浏览器是根据max-age来判断响应是否过期的，它会记录响应的请求时间，并根据max-age的值计算出过期时间¹。当再次请求该资源时，浏览器会比较当前时间和过期时间，如果当前时间小于过期时间，表示响应还没有过期，可以直接从缓存中读取¹。如果当前时间大于或等于过期时间，表示响应已经过期，需要向服务器发送验证请求¹。
>
> 如果想要通过响应头修改使得max-age失效，有以下几种方法：
>
> - 设置max-age为0或负数，表示响应立即过期²。
> - 设置Cache-Control为no-cache或no-store，表示响应不能被缓存或复用³。
> - 设置Expires为一个过去的日期，表示响应已经过期。
>
> 源: 与必应的对话， 2023/5/13
> (1) HTTP 缓存策略：强缓存和协商缓存 - 掘金. https://juejin.cn/post/7095206869072871455.
> (2) HTTP 安全响应头（Security Response header）配置手册 - 知乎. https://zhuanlan.zhihu.com/p/335165168.
> (3) HTTP - Access-Control-Max-Age响应头表示预检请求的结果(即 .... https://runebook.dev/zh/docs/http/headers/access-control-max-age.



### [Vary](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching#vary_%E5%93%8D%E5%BA%94)

区分响应的方式本质上是基于它们的 URL，但是URL相同的情况下，响应的内容可能根据`Accept`、`Accept-Language` 和 `Accept-Encoding` 的变化改变。

浏览器请求URL时，服务器在响应头上设置`Vary: 请求头名`，当浏览器再次请求同样的URL时，如果Vary指定的请求头不变，并且协商缓存和强缓存都不变，就不会重新请求资源，而是返回304状态码

> **Q: Vary和max-age和Etag的优先级是什么**
>
> A:你好，这是Bing。根据搜索结果¹，**Vary、max-age和Etag都是HTTP响应头的一部分，用于控制缓存的行为。它们之间没有固定的优先级**，而是根据不同的情况进行内容协商。
>
> Vary指定了哪些请求头会影响缓存的命中率，例如Accept-Encoding或User-Agent²。
>
> max-age指定了响应的有效期，即从响应生成到过期的时间¹。
>
> Etag是响应的唯一标识符，用于验证缓存是否与源服务器一致³。
>
> 一般来说，如果响应没有过期（即max-age没有超过），则缓存会直接返回响应，不需要验证Etag。
>
> 如果响应已经过期，但是Etag没有变化，那么缓存会返回一个304 Not Modified的状态码，表示响应仍然有效。
>
> 如果Etag也变化了，那么缓存会返回一个新的响应，并更新缓存。
>
> Vary会影响缓存的查找过程，因为它要求缓存根据请求头的不同值来区分不同的响应¹。
>
> 源: 与必应的对话， 2023/5/14
> (1) HTTP 缓存 - HTTP | MDN - MDN Web Docs. https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching.
> (2) 一文讲透HTTP缓存之ETag - 掘金. https://juejin.cn/post/7078272638203723789.
> (3) 通过HTTP Header控制缓存 - 知乎. https://zhuanlan.zhihu.com/p/92104754.

### 协商缓存

https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching#vary_%E5%93%8D%E5%BA%94

https://juejin.cn/post/7095206869072871455

验证是通过使用包含 `If-Modified-Since` 或 `If-None-Match` 请求标头的**条件请求**完成的。



# 名词解释

## CDN

https://www.zhihu.com/question/36514327?rf=37353035



## 反向代理



## 子网掩码

[基础概念解释（科普性质）](https://www.cloudflare.com/zh-cn/learning/network-layer/what-is-a-subnet/)

[知乎-详细解释子网掩码](https://www.zhihu.com/question/56895036)

[如何计算网络地址和广播地址](https://zhuanlan.zhihu.com/p/111334061)

> 网段个数要减去广播地址和网络地址。👍
>
> 根据¹，广播地址是专门用于同时向网络中所有工作站进行发送的一个地址。在使用TCP/IP协议的网络中，主机标识段host ID为全1的IP地址为广播地址，广播的分组传送给host ID段所涉及的所有计算机。
>
> 根据²，网络地址就是把IP地址转成二进制和子网掩码进行与运算，得到IP地址的网络地址，剩下的部分就是主机地址，从而区分出任意IP地址中的网络地址和主机地址。网络地址用了标识主机或路由器所连接到的网络，主机号用来标识该主机或路由器。
>
> 因此，网段个数要减去广播地址和网络地址，才能得到可用的主机地址。😊
>
> 源: 与必应的对话， 2023/5/13
> (1) IP地址、子网掩码、网络数、主机数、广播地址及其 .... https://zhuanlan.zhihu.com/p/146841397.
> (2) 如何计算网络地址和广播地址 - 知乎. https://zhuanlan.zhihu.com/p/111334061.
> (3) 网段地址和广播地址是怎么划分的 - 百度知道. https://zhidao.baidu.com/question/489154145635192772.html.
> (4) 子网掩码255.255.255.192，可以划分几个网段，他们的 .... https://zhidao.baidu.com/question/1769628193013749900.html.



## 存活时间

> **存活时间**（英语：**T**ime **T**o **L**ive，简写**TTL**）是[电脑网络](https://zh.wikipedia.org/wiki/電腦網路)技术的一个术语，指一个[数据包](https://zh.wikipedia.org/wiki/封包)在经过一个路由器时，可传递的最长距离（跃点数）。每当数据包经过一个[路由器](https://zh.wikipedia.org/wiki/路由器)时，其存活次数就会被减一。当其存活次数为0时，路由器便会取消该数据包转发，[IP](https://zh.wikipedia.org/wiki/网际协议)网络的话，会向原数据包的发出者发送一个[ICMP](https://zh.wikipedia.org/wiki/ICMP) TTL数据包以告知跃点数超限。其设计目的是防止[数据包](https://zh.wikipedia.org/wiki/封包)因不正确的路由表等原因造成的无限循环而无法送达及耗尽网络资源。
>
> 源: [维基百科](https://zh.wikipedia.org/wiki/%E5%AD%98%E6%B4%BB%E6%99%82%E9%96%93)

> **Q: 数据包的存活时间怎么看，初始的存活时间是怎么制定的**
>
> A: 你好，这是必应。数据包的存活时间（TTL）是指一个数据包在经过一个路由器时，可传递的最长距离（跃点数）¹。每当数据包经过一个路由器时，其存活次数就会减一。当其存活次数为0时，路由器便会取消该数据包转发，并向原数据包的发出者发送一个ICMP消息¹。其设计目的是防止数据包因不正确的路由表等原因造成的无限循环而无法送达及耗尽网络资源¹。
>
> 初始的存活时间是由发送方设定的，不同的操作系统有不同的默认值²。例如，**Linux系统的TTL值为64或255** ，**Windows NT/2000/XP系统的TTL值为128** ，**Windows 98系统的TTL值为32**， **UNIX主机的TTL值为255**²。返回的TTL值等于系统默认TTL值减去路由器跳数²。
>
> 源: 与必应的对话， 2023/5/13
> (1) 什么是网络中的生存时间 (TTL)？ - 知乎. https://zhuanlan.zhihu.com/p/449716685.
> (2) TTL、Ping包最大字节数、网络时延、抖动、丢包率，看 .... https://zhuanlan.zhihu.com/p/382459372.
> (3) TTL 数据包存活时间_ttl包_风之谷呼呼的博客-CSDN博客. https://blog.csdn.net/sinat_16790541/article/details/39430513.



> **Q: 如何查看数据包存活时间**
>
> A: 查看数据包的存活时间的一种方法是使用ping命令²。ping命令可以向特定的目的主机发送ICMP Echo请求报文，并显示返回的TTL值²。例如，我们可以在命令行中输入`ping baidu.com`，就可以看到返回的TTL值是55，说明经过了128-55=73个路由器²。另一种方法是使用tracert命令¹，它可以显示数据包经过的每个路由器的TTL值¹。例如，我们可以在命令行中输入`tracert baidu.com`，就可以看到数据包经过的每个路由器的TTL值和IP地址¹。
>
> 源: 与必应的对话， 2023/5/13
> (1) TTL、Ping包最大字节数、网络时延、抖动、丢包率，看 .... https://zhuanlan.zhihu.com/p/382459372.
> (2) 什么是网络中的生存时间 (TTL)？ - 知乎. https://zhuanlan.zhihu.com/p/449716685.
> (3) 在电脑中,如何能够查看数据包的存活时间 - 百度知道. https://zhidao.baidu.com/question/144210368434878685.html.
> (4) 不同操作系统的默认TTL（生存时间）值 - CSDN博客. https://blog.csdn.net/allway2/article/details/109136579.



## MTU（Maximum Transmission Unit）

> MTU是最大传输单元的缩写，它是指网络能够传输的最大数据包大小，以字节为单位¹。不同的网络类型有不同的MTU值，例如以太网的默认MTU值是1500字节²。如果数据包的大小超过了MTU值，就需要进行分片，即将数据包分成多个较小的片段，这会增加网络传输的负担和延迟。如果MTU值设置得太小，也会影响传输效率，因为需要处理更多的数据包²。因此，合理地设置MTU值可以提高网络性能和稳定性。
>
> 源: 与必应的对话， 2023/5/13
> (1) 什么是MTU？为什么把MTU改成1480游戏就不卡了？带你 .... https://blog.csdn.net/TaKe___Easy/article/details/113885108.
> (2) 什么是MTU（Maximum Transmission Unit）？MTU设置为多少合适 .... https://info.support.huawei.com/info-finder/encyclopedia/zh/MTU.html.
> (3) 一文搞懂什么是MTU - 知乎. https://zhuanlan.zhihu.com/p/360516704.

## 协商缓存

协商缓存，是**在缓存过期的情况下，客户端和服务端协商，确认客户端缓存是否需要更新**。

涉及的头字段有 `Last-Modified / If-Modified-Since` 和 `ETag / If-None-Match`。

https://juejin.cn/post/7095206869072871455
