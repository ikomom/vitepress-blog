---
outline: deep
---

# CSS

[learn css](https://web.dev/learn/css/)

## 重绘和回流有什么区别?

https://blog.csdn.net/pig_is_duck/article/details/105903741

[你真的了解回流和重绘吗](https://zhuanlan.zhihu.com/p/52076790)

1、 重绘：元素样式的改变（但宽高、大小、位置等不变）

2、 回流：元素的大小或者位置发生改变（当页面布局和几何信息发生改变的时候），触发了重新布局导致渲染树重新计算布局和渲染



### 何时发生回流重绘

- 添加或删除可见的DOM元素
- 元素的位置发生变化
- 元素的尺寸发生变化（包括外边距、内边框、边框大小、高度和宽度等）
- 内容发生变化，比如文本变化或图片被另一个不同尺寸的图片所替代。
- 页面一开始渲染的时候（这肯定避免不了）
- 浏览器的窗口尺寸变化（因为回流是根据视口的大小来计算元素的位置和大小的）

浏览器会将修改操作放入到队列里，直到过了一段时间或者操作达到了一个阈值，才清空队列,  **当你获取布局信息的操作的时候，会强制队列刷新**



### 减少回流和重绘

1.  合并修改语法

```js
const el = document.getElementById('test');
el.style.padding = '5px';
el.style.borderLeft = '1px';
el.style.borderRight = '2px';
```

改为

```js
// 使用cssText
const el = document.getElementById('test'); 
el.style.cssText += 'border-left: 1px; border-right: 2px; padding: 5px;'; 

// 或者修改CSS的class
const el = document.getElementById('test'); 
el.className += ' active'; 
```

2. 批量修改DOM

对DOM对一系列修改的时候，可以通过以下步骤减少回流重绘次数：

1. 使元素脱离文档流
   1. 隐藏元素 -> 应用修改 -> 重新显示
   2. document fragment
   3. 将原始元素**拷贝**到一个脱离文档的节点中，修改节点后，再替换原始的元素
   4. 绝对定位
   5.  css3 硬件加速
      1. transform、opacity、filter、Will-change
      2. 如果你为太多元素使用css3硬件加速，会导致**内存占用较大**，会有性能问题；GPU渲染字体会导致抗锯齿无效。这是因为GPU和CPU的算法不同。因此如果你不在动画结束的时候关闭硬件加速，会产生**字体模糊**
2. 对其进行多次修改
3. 将元素带回到文档中



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

## CSS 单位ch用法

https://deepinout.com/css/css-questions/38_tk_1702359103.html

`ch` 是相对于当前元素的字体宽度的单位

## font-size

[【css】探究font-size、文本实际高度、line-height之间的关系](https://blog.csdn.net/w390058785/article/details/96832707)

[CSS字体、文本属性](https://blog.csdn.net/qq_52301431/article/details/123710504)

[说一说css的font-size: 0?](https://juejin.cn/post/7260752483055878204?searchId=2024021813594476D1F15405883E4F60E3)

>  [真的理解font-size和line-height了吗？](https://juejin.cn/post/6971673576017494053)
>
> 1. `fontsize` 的值不代表字体高度，也不代表的字体内容（`content-area`）高度
> 2. 字体内容（`content-area`）高度 与 `font-size` 和 `font-family` 相关
>
> `line-height` ,又称行高，指的是两行文字**基线之间的距离**，也可以称为这行文字所占的高度。
>
> - **内容区域（content area）**：是一种围绕文字看不见的盒子。
>
>   内容区域的大小与`font-size`大小相关，`Ascender` 与 `Descender`之间的高度，`Ascender + Descender = conent-area`
>
> - **内联元素的高度是由行高(line-height)决定的**
>
> - **内容区域高度(content area) + 行间距(vertical spacing) = 行高(line-height)，其中行间距分上下部分，间距对半分。**
>
> 

