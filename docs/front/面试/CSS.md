# CSS

[learn css](https://web.dev/learn/css/)

## 重绘和回流有什么区别?

https://blog.csdn.net/pig_is_duck/article/details/105903741

1、 重绘：元素样式的改变（但宽高、大小、位置等不变）

2、 回流：元素的大小或者位置发生改变（当页面布局和几何信息发生改变的时候），触发了重新布局导致渲染树重新计算布局和渲染



## BFC 是什么

[10 分钟理解 BFC 原理](https://zhuanlan.zhihu.com/p/25321647)

[块格式化上下文BFC](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)

## flex

[flex可视化教程](https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/)

### flex布局子元素宽度超出父元素问题

https://juejin.cn/post/6974356682574921765

1. 设置`min-width：0`可以解决当`flex子元素`的子元素大小为`auto`的情况；
2. 设置`overflow`不为`visible`可以解决所有情况下的麻烦；

[flex-shrink](https://www.runoob.com/cssref/css3-pr-flex-shrink.html)

