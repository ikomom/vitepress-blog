# callie跨境电商 网页拆解

https://www.callie.com/

## 框架

多页应用，疑似服务端渲染，支持seo

发现jquery, 不会还是用php吧



css: 感觉没有用框架，组件库都是现写的



[结构化数据，json-ld，application/ld+json初学探究](https://blog.csdn.net/weixin_43840289/article/details/115521821) seo



支持i18n

- 怎么判断当前用户是哪个国家的人
- [link标签 rel=“ alternate“ 应用解析](https://blog.csdn.net/demo_yo/article/details/109202554)
<!-- - ![image-20230721230339051](C:\Users\31579\AppData\Roaming\Typora\typora-user-images\image-20230721230339051.png) -->


---

```html
<script type="text/javascript" id="">(rtbhEvents=window.rtbhEvents||[]).push({eventType:"placebo"});</script>
```
[RTBH技术在云端DDoS防护服务中的应用研究及实践](http://www.cnki.com.cn/Article/CJFDTotal-SDTX201803002.htm)

rem，我看很少用啊，而且body又设置字体为14px

```js

;(function(global){global.customJs = function(key,fn){var _customJs = this._customJs || {};_customJs[key] = fn;this._customJs = _customJs;}})(this);
function setRootFontSize() {
    var width = document.documentElement.clientWidth || document.body.clientWidth;
    width = width < 1200 ? 1200 : width;
    fontSize = (width / 10);
    document.getElementsByTagName('html')[0].style['font-size'] = fontSize + 'px';
}
setRootFontSize();
window.addEventListener('resize', function() {setRootFontSize();}, false);
```





## 部署

cloudfront

cloudfare

google analyse

nfaa.js : NetFlying Advertising Analytics DATA SDK

clarity.js