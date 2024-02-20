---
outline: deep
---

## HTML

HTML是一种设计用于网页的[置标语言](https://blog.csdn.net/l540538550/article/details/5641476)，描述页面的结构与内容，和CSS，一种广义的样式表(en:stylesheet) 语言，用以指定页面在不同媒介中（屏幕显示器的视觉样式，打印页面时的打印样式，页面被屏幕阅读器所阅读时的听觉样式等）该如何被渲染

> 与 **置标语言(Markup Language)**对应的是 **自然语言**



**怪异模式**

[怪异模式](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Quirks_Mode_and_Standards_Mode)（英语：quirks mode）是指在计算机领域中，一些[网页浏览器](https://baike.baidu.com/item/网页浏览器/8309940?fromModule=lemma_inlink)为了维持对较旧的网页设计的向后兼容性，而使用的一种技术，有别于严格遵循万维网联盟（W3C）与[互联网工程任务组](https://baike.baidu.com/item/互联网工程任务组/707674?fromModule=lemma_inlink)（[IETF](https://baike.baidu.com/item/IETF/0?fromModule=lemma_inlink)）标准而设计的“标准模式”。

浏览器使用文件开头的 DOCTYPE 来决定用怪异模式处理或标准模式处理





### link标签

#### rel属性

[link rel=alternate网站换肤功能最佳实现](https://www.zhangxinxu.com/wordpress/2019/02/link-rel-alternate-website-skin/)

[33个ref属性详解](https://www.cainiaoxueyuan.com/zhizuo/13261.html)

**`rel`** 属性定义了**所链接的资源(href)**与**当前文档(document)**的关系，在 [`a`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a)、[`area`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/area) 和 [`link`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/link) 元素上有效。支持的值取决于拥有该属性的元素。

关系的类型是由 `rel` 属性的值给出的，如果存在的话，它的值必须是一组**无序的**、**唯一的**、**用空格隔开**的关键字；并且其不区分大小写

```html
<link href="css/skin-default.css" rel="stylesheet" type="text/css" title="默认">
<link href="css/red.css" rel="alternate stylesheet" type="text/css" title="红色">
<link href="css/green.css" rel="alternate stylesheet" type="text/css" title="绿色">
```

`rel` 属性**没有默认值**。如果该属性被省略，或者该属性中没有一个值被支持，那么除了两者之间有一个超链接之外，文档与目标资源没有特别的关系



### script 标签

####  async 和 defer 

[script 标签中的 async 和 defer 属性](https://juejin.cn/post/6894629999215640583)

- `script` ：**会阻碍 HTML 解析**，只有下载好并执行完脚本才会继续解析 HTML。
- `async script` ：解析 HTML 过程中进行脚本的**异步下载**，**下载成功立马执行**，有**可能会阻断 HTML 的解析**。
- `defer script`：完全不会阻碍 HTML 的解析，解析完成(onContentLoaded)之后再按照**顺序执行脚本**。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ea091aed8364b88a653a13c4845a824~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
