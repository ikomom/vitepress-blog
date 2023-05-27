# 面试

## 链接

[2021年前端面试必读文章【超三百篇文章/赠复习导图】](https://juejin.cn/post/6844904116339261447#heading-55)

[做了一份前端面试复习计划，保熟～](https://juejin.cn/post/7061588533214969892#heading-30)

## HTML

### script 标签中的 async 和 defer 属性

[script 标签中的 async 和 defer 属性](https://juejin.cn/post/6894629999215640583)

- `script` ：**会阻碍 HTML 解析**，只有下载好并执行完脚本才会继续解析 HTML。
- `async script` ：解析 HTML 过程中进行脚本的**异步下载**，**下载成功立马执行**，有**可能会阻断 HTML 的解析**。
- `defer script`：完全不会阻碍 HTML 的解析，解析完成(onContentLoaded)之后再按照**顺序执行脚本**。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ea091aed8364b88a653a13c4845a824~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

## js

### 对象复制

https://developer.mozilla.org/zh-CN/docs/Glossary/Deep_copy

#### 浅拷贝





### 对象循环引用会发生什么

[简单聊一聊JS中的循环引用及问题](https://www.cnblogs.com/zhangguicheng/p/12173538.html)

1. （简略的说下）使用**引用计数法**时，两个对象互相引用，就算运行完将两个变量都清空，引用计数器也不会清空，就会会造成内存泄漏；但是现在的**标记清除法**不会有这样的问题
   - **标记清除**回收策略的大致流程是这样的，最开始的时候**将所有的变量加上标记**，**cycularReference 函数的时候会将函数内部的变量这些标记清除*， 函数执行完后再加上标记**
2. `JSON.stringfy()`转换会报错，因为其无法将一个无限循环转换的



### JavaScript垃圾回收机制

[「硬核JS」你真的了解垃圾回收机制吗](https://juejin.cn/post/6981588276356317214)

[JavaScript垃圾回收机制](https://zhuanlan.zhihu.com/p/60336501)

1. 标记清除（mark and sweep）
2. 引用计数（reference counting）



>  这个过程是周期性的，即垃圾回收程序每隔一定时间（或者说在代码执行过程中某个预定的收集时间）就会自动运行。垃圾回收过程是一个近似且不完美的方案，因为某块内存是否还有用，属于“不可判定的”问题，意味着靠算法是解决不了的
>
> 我们以函数中局部变量的正常生命周期为例。函数中的局部变量会在函数执行时存在。此时，栈（或堆）内存会分配空间以保存相应的值。函数在内部使用了变量，然后退出。此时，就不再需要那个局部变量了，它占用的内存可以释放，供后面使用。这种情况下显然不再需要局部变量了，但并不是所有时候都会这么明显。垃圾回收程序必须跟踪记录哪个变量还会使用，以及哪个变量不会再使用，以便回收内存。如何标记未使用的变量也许有不同的实现方式，用到过两种主要的标记策略：标记清理和引用计数

**解除对一个值的引用并不会自动导致相关内存被回收。解除引用的关键在于确保相关的值已经不在上下文里了，因此它在下次垃圾回收时会被回收。**

### 什么情况会引起内存泄漏

[JS中4种常见的内存泄漏](https://blog.csdn.net/weixin_44786530/article/details/126617193)

[内存管理](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Memory_Management)

1. **意外的全局变量引起的内存泄漏。**

```js
function foo(arg) {
    bar = "this is a hidden global variable";// 实际上是： window.bar = "this is an explicit global variable";
}

function bar() {
    this.variable = "potential accidental global";
} 
bar();// foo函数再全局作用域中被调用，因此this指向window
```

解决方法，使用严格模式避免`"use strict"`

2. **闭包引起的内存泄漏**

闭包可以使变量常驻内存，但如果使用不当就会在成内存泄漏

```js
var theThing = null;
var replaceThing = function () {
  var originalThing = theThing;
  var unused = function () {
    if (originalThing)
      console.log("hi");
  };
  theThing = {
    longStr: new Array(1000000).join('*'),
    someMethod: function () {
      console.log("someMessage");
    }
  };
};
setInterval(replaceThing, 1000);
```

> 每次调用 `replaceThing` 时，`theThing` 都会得到新的包含一个大数组和新的闭包（`someMethod`）的对象。
>
> 同时，没有用到的那个变量持有一个引用了 `originalThing`（`replaceThing` 调用之前的 `theThing`）闭包。
>
> 关键的问题是每当在同一个父作用域下创建闭包作用域的时候，这个作用域是被共享的。在这种情况下，`someMethod` 的闭包作用域和 `unused` 的作用域是共享的。
>
> `unused` 持有一个 `originalThing` 的引用。尽管 `unused` 从来没有被使用过，`someMethod` 可以在 `theThing` 之外被访问。
>
> 而且 `someMethod` 和 `unused` 共享了闭包作用域，即便 `unused` 从来都没有被使用过，它对 `originalThing` 的引用还是强制它保持活跃状态（阻止它被回收）。
>
> 当这段代码重复运行时，将可以观察到内存消耗稳定地上涨，并且不会因为 GC 的存在而下降。
>
> 本质上来讲，创建了一个闭包链表（根节点是 `theThing` 形式的变量），而且每个闭包作用域都持有一个对大数组的间接引用，这导致了一个巨大的内存泄露。

3. **没有清理的DOM元素引用**

原因：虽然别的地方删除了，但是对象中还存在对dom的引用

解决：手动删除。

4. **被遗忘的定时器或者回调**

手动删除定时器

5. **子元素存在引用引起的内存泄漏**

原因：div中的ul li 得到这个div，会间接引用某个得到的li，那么此时因为div间接引用li，即使li被清空，也还是在内存中，并且只要li不被删除，他的父元素都不会被删除。

### 静态分配与对象池

> 为了提升 JavaScript 性能，最后要考虑的一点往往就是压榨浏览器了。此时，一个关键问题就是**如何减少浏览器执行垃圾回收的次数**。开发者无法直接控制什么时候开始收集垃圾，但**可以间接控制触发垃圾回收的条件**。理论上，如果能够合理使用分配的内存，同时避免多余的垃圾回收，那就可以保住因释放内存而损失的性能。**浏览器决定何时运行垃圾回收程序的一个标准就是对象更替的速度**

```js
function addVector(a, b) { 
 let resultant = new Vector(); 
 resultant.x = a.x + b.x; 
 resultant.y = a.y + b.y; 
 return resultant; 
}
```

上面这个函数，如果频繁创建的话，就会一直创建一个新的Vector，更快的触发垃圾回收。所以，不让它一直创建，就可以提升性能

```js
function addVector(a, b, resultant) { 
 resultant.x = a.x + b.x; 
 resultant.y = a.y + b.y; 
 return resultant; 
}
```

当然，这需要在其他地方实例化矢量参数 resultant，但这个函数的行为没有变。那么在哪里创建矢量可以不让垃圾回收调度程序盯上呢？

**一个策略是使用对象池**。在初始化的某一时刻，可以创建一个对象池，用来管理一组可回收的对象，应用程序可以向这个对象池请求一个对象、设置其属性、使用它，然后在操作完成后再把它还给对象池。由于没发生对象初始化，垃圾回收探测就不会发现有对象更替，因此垃圾回收程序就不会那么频繁地运行

```js
// vectorPool 是已有的对象池 
let v1 = vectorPool.allocate(); 
let v2 = vectorPool.allocate(); 
let v3 = vectorPool.allocate(); 
v1.x = 10; 
v1.y = 5; 
v2.x = -3; 
v2.y = -6; 
addVector(v1, v2, v3); 
console.log([v3.x, v3.y]); // [7, -1] 
// 释放
vectorPool.free(v1); 
vectorPool.free(v2); 
vectorPool.free(v3); 
// 如果对象有属性引用了其他对象
// 则这里也需要把这些属性设置为 null 
v1 = null; 
v2 = null; 
v3 = null;
```

如果对象池只按需分配矢量**（在对象不存在时创建新的，在对象存在时则复用存在的）**，那么这个实现本质上是一种**贪婪算法**，有单调增长但为静态的内存。这个对象池必须使用某种结构维护所有对象，数组是比较好的选择。不过，使用数组来实现，必须留意不要招致额外的垃圾回收

```js
let vectorList = new Array(100); 
let vector = new Vector(); 
vectorList.push(vector);
```

由于 JavaScript 数组的大小是动态可变的，引擎会删除大小为 100 的数组，再创建一个新的大小为200 的数组。垃圾回收程序会看到这个删除操作，说不定因此很快就会跑来收一次垃圾。要避免这种动态分配操作，可以在初始化时就创建一个大小够用的数组，从而避免上述先删除再创建的操作。不过，**必须事先想好这个数组有多大**

> 静态分配是优化的一种极端形式。如果你的应用程序被垃圾回收严重地拖了后腿，可以利用它提升性能。但这种情况并不多见。大多数情况下，这都属于过早优化，因此不用考虑。



### 堆栈

[JavaScript 内存机制](https://blog.csdn.net/davidffffff/article/details/107716345)

**基本类型**的值（Undefined/Null/Boolean/Number/String）被保存在**栈内存**中。从一个变量向另一个变量**复制基本类型的值**，**会创建这个值的一个副本**。

- **引用类型**的值是对象，保存在**堆内存**中。
  - 包含引用类型值的变量实际上包含的并不是对象本身，而是一个**指向该对象的指针**。从一个变量向另一个变量复制引用类型的值，**复制的其实是指针，因此两个变量最终都指向同一个对象**。
  - js不允许直接访问内存中的位置，也就是**不能直接访问操作对象的内存空间**。在操作对象时，实际上是在操作对象的引用而不是实际的对象。



1、**堆栈空间**分配区别：

- 栈（操作系统）：由**操作系统自动分配释放** ，**存放函数的参数值，局部变量的值等**。其操作方式类似于**数据结构中的栈**

- 堆（操作系统）： 一般由**程序员分配释放，若程序员不释放，程序结束时可能由OS回收，分配方式倒是类似于链表**

2、堆栈缓存方式区别：

- 栈使用的是**一级缓存**， 他们通常都是被调用时处于**存储空间（内存）**中，**调用完毕立即释放**

- 堆是存放在**二级缓存**中，**生命周期由虚拟机的垃圾回收算法来决定**（并不是一旦成为孤儿对象就能被回收）。所以调用这些对象的速度要相对来得低一些。

3、堆栈数据结构区别：

- 堆（数据结构）：堆可以被看成是一棵树，如：堆排序；
- 栈（数据结构）：一种先进后出的数据结构。



### 执行上下文

**执行上下文（以下简称“上下文”）**的概念在 JavaScript 中是颇为重要的。变量或函数的上下文**决定了它们可以访问哪些数据**，以及它们的行为。**每个上下文都有一个关联的变量对象**（variable object），而这个上下文中定义的所有变量和函数都存在于这个对象上

全局上下文是最外层(window)的上下文，所有**var定义的全局变量和函数**，都会挂载到window上，成为它的属性和方法。

使用 let 和 const 的顶级声明能引用，但不会挂载window上，其在**作用域链解析**的效果是一样的

上下文在**其所有代码都执行完毕后会被销毁**，包括定义在它上面的所有变量和函数（**全局上下文在应用程序退出前才会被销毁**，比如关闭网页或退出浏览器）。

**每个函数调用都有自己的上下文**。当**代码执行流进入函数时，函数的上下文被推到一个上下文栈上**。在**函数执行完之后，上下文栈会弹出该函数上下文，将控制权返还给之前的执行上下文**

上下文中的代码在执行的时候，会创建变量对象的一个**作用域链（scope chain）**。这个作用域链决定了各级上下文中的代码在访问变量和函数时的顺序。**代码正在执行的上下文的变量对象始终位于作用域链的最前端**。若上下文是函数，则其活动对象（activation object）(arguments)用作变量对象

代码执行时的**标识符解析是通过沿作用域链逐级搜索标识符名称**完成的。搜索过程始终**从作用域链的最前端开始**，然后逐级往后，直到找到标识符。（如果没有找到标识符，那么通常会报错。）

**局部作用域中定义的变量可用于在局部上下文中替换全局变量**（因为是从作用域链从前往后找，所以，局部肯定比全局先被找到）



#### 作用域链增强

虽然执行上下文主要有全局上下文和函数上下文两种（**eval()调用内部存在第三种上下文**），但有其他方式来增强作用域链

某些语句会导致在作用域链前端临时添加一个上下文，这个上下文在代码执行后会被删除

- try/catch 语句的 catch 块

- with 语句

```js
function buildUrl() { 
 let qs = "?debug=true"; 
 with(location){ 
 let url = href + qs; 
 } 
 return url; 
}
```

这里，with 语句将 location 对象作为上下文，因此 location 会被添加到作用域链前端。 with 语句中的代码引用变量 href 时，实际上引用的是location.href。找qs时，location内没有这个属性，才会去找函数的qs



#### 例子

假设我们定义一个二层闭包

```js
let a = 33
var b = 222
var fuc = function three() {
    let gg = 23;
    try {
        console.log(a)
        return function two() {
            var tow_gg = 999
            console.log('two', )
            eval(`console.log('two', tow_gg)`)
            return function one() {
                console.log('one', this)// 指向window
                 return {tow_gg, gg}
            }
        }
    } catch(e) {}
}
console.dir(fuc()())
```

![image-20230527120111449](C:\Users\31579\AppData\Roaming\Typora\typora-user-images\image-20230527120111449.png)

> A：你好，这是Bing。我可以帮你回答这个问题。😊
>
> js怎么查看当前上下文，这个问题有多种答案，取决于你想要查看的是什么类型的上下文。一般来说，上下文（Context）是程序运行的环境，在上下文中存储了一段程序运行时所需要的全部数据¹。
>
> 如果你想要查看的是**执行上下文**，也就是在执行一段代码时创建的对象，那么你可以使用**调试工具**来查看当前执行的js代码的位置和变量的值⁴。例如，在Chrome浏览器中，你可以按F12键打开开发者工具，然后在Sources面板中找到你想要调试的js文件，然后在代码中设置断点，然后运行代码，当代码执行到断点处时，你就可以在右侧的Scope面板中查看当前执行上下文的词法环境对象和变量环境对象¹。
>
> 如果你想要查看的是**全局上下文**，也就是在开始执行一段javascript代码时所创建的上下文对象，在html环境中，该上下文对象就是window对象¹。在node环境中为global对象¹。那么你可以直接使用window或global来访问全局上下文对象。
>
> 如果你想要查看的是**函数上下文**，也就是在一个函数开始执行时所创建的上下文对象¹，那么你可以使用**arguments.callee**来获取当前函数对象²，然后使用**arguments.callee.caller**来获取调用当前函数的函数对象²。例如：
>
> ```javascript
> function f1() {
>   console.log(arguments.callee); //打印f1函数对象
>   console.log(arguments.callee.caller); //打印f2函数对象
> }
> 
> function f2() {
>   f1();
> }
> 
> f2();
> ```
>
> 如果你想要查看的是**this指向**，也就是在执行一段代码时this关键字所指向的对象，那么你可以直接使用this来获取当前this指向³。不过要注意，this指向并不是固定不变的，它会根据函数调用方式的不同而有所变化³。例如：
>
> ```javascript
> var name = "global";
> 
> function f1() {
>   console.log(this.name); //打印global
> }
> 
> var obj = {
>   name: "obj",
>   f2: function() {
>     console.log(this.name); //打印obj
>     f1(); //打印global
>     f1.call(this); //打印obj
>   }
> };
> 
> f1(); //打印global
> obj.f2(); //打印obj global obj
> ```
>
> 以上就是我能找到的关于js怎么查看当前上下文的一些答案，希望对你有所帮助。
>
> 源: 与必应的对话， 2023/5/27
> (1) 理解 JavaScript 的执行上下文这篇就够了！ - 掘金. https://juejin.cn/post/6954966248233009182.
> (2) 如何知道浏览器当前执行的JS代码的位置？ - 知乎. https://www.zhihu.com/question/21073282.
> (3) JavaScript中的上下文环境 - 掘金. https://juejin.cn/post/7008866769301405726.
> (4) js中获取上下文路径_xb12369的博客-CSDN博客. https://blog.csdn.net/xb12369/article/details/46416845.



> [javascript——执行环境和作用域](https://blog.csdn.net/viewyu12345/article/details/79653587)
>
> [ scopes结合实际分析 ](https://blog.csdn.net/viewyu12345/article/details/108703891)



### TODO什么是闭包





### es6或更高的js数据结构，如WeakMap，怎么转换成旧时代浏览器可以运行的方式，原理是什么

> 你好，这是Bing。我可以帮你回答这个问题。😊
>
> es6或更高的js数据结构，如WeakMap，怎么转换成旧时代浏览器可以运行的方式，原理是什么，这个问题的答案是使用**polyfill**，也就是一种用来模拟原生功能的代码¹。
>
> polyfill的原理是检测浏览器是否支持某个特性，如果不支持，就用js代码来实现该特性的功能¹。例如，WeakMap是一种用来存储键值对的数据结构，其中键必须是对象，而且不会阻止垃圾回收²。如果浏览器不支持WeakMap，就可以用一个数组来存储键值对，然后用一个隐藏属性来标记键对象，以便在垃圾回收时删除对应的键值对³。
>
> 有一些开源的库提供了es6或更高的js数据结构的polyfill，例如weakmap-polyfill¹ 和es6-structs。你可以使用npm安装这些库，然后在你的代码中引入它们，就可以在旧时代浏览器中使用WeakMap等数据结构了¹ 。
>
> 以上就是我能找到的关于es6或更高的js数据结构，如WeakMap，怎么转换成旧时代浏览器可以运行的方式，原理是什么的一些答案，希望对你有所帮助。
>
> 源: 与必应的对话， 2023/5/27
> (1) polygonplanet/weakmap-polyfill: ECMAScript6 WeakMap polyfill - GitHub. https://github.com/polygonplanet/weakmap-polyfill.
> (2) weakmap-polyfill - npm. https://www.npmjs.com/package/weakmap-polyfill.
> (3) dregre/es6-structs: Polyfills for WeakMap, Map, WeakSet, and Set. - GitHub. https://github.com/dregre/es6-structs.



### WeakMap的使用方式

WeakMap中，只要值的引用不存在，就会自动销毁；并且因为其这个特性，它是不可迭代的，只能通过原始引用取得键值

```js
const wm = new WeakMap(); 
wm.set({}, "val");
```

set()方法初始化了一个新对象并将它用作一个字符串的键。因为**没有指向这个对象的其他引用**， 所以当这行代码执行完成后，**这个对象键就会被当作垃圾回收**。

#### 1. 私有变量

弱映射造就了在 JavaScript 中实现真正**私有变量**的一种新方式。前提是，**私有变量会存储在弱映射中，以对象实例为键，以私有成员的字典为值**

```js
const wm = new WeakMap(); 
class User { 
 constructor(id) { 
     this.idProperty = Symbol('id'); 
     this.setId(id); 
 } 
 setPrivate(property, value) { 
     const privateMembers = wm.get(this) || {}; 
     privateMembers[property] = value; 
     // 当前引用作为键，成员对象作为值
     wm.set(this, privateMembers); 
 } 
 getPrivate(property) { 
	 return wm.get(this)[property]; 
 } 
 setId(id) { 
     // 设置私有, property值都是固定的
	 this.setPrivate(this.idProperty, id); 
 } 
 getId() { 
	 return this.getPrivate(this.idProperty); 
 } 
} 
const user = new User(123); 
alert(user.getId()); // 123 
user.setId(456); 
alert(user.getId()); // 456 
// 并不是真正私有的
alert(wm.get(user)[user.idProperty]); // 456
```

对于上面的实现，外部代码只需要拿到**对象实例的引用和弱映射**，就可以取得“私有”变量了, 为了避免这种访问，可以用一个闭包把 WeakMap 包装起来，这样就可以把弱映射与外界完全隔离开了

```js
// 立即执行函数，闭包，wm一直被返回的User的class持有，就不会触发垃圾回收
const User = (() => { 
     const wm = new WeakMap(); 
     class User { 
         constructor(id) { 
       	  	this.idProperty = Symbol('id');
        	this.setId(id); 
         } 
     	setPrivate(property, value) { 
             const privateMembers = wm.get(this) || {}; 
             privateMembers[property] = value; 
             wm.set(this, privateMembers); 
     	} 
         getPrivate(property) { 
       	 	 return wm.get(this)[property]; 
         } 
         setId(id) { 
        	 this.setPrivate(this.idProperty, id); 
         } 
         getId(id) { 
        	 return this.getPrivate(this.idProperty); 
         } 
     } 
     return User; 
})();
const user = new User(123); 
alert(user.getId()); // 123 
user.setId(456); 
alert(user.getId()); // 456
```

这样，拿不到弱映射中的健，也就无法取得弱映射中对应的值。虽然这防止了前面提到的访问，但整个代码也完全陷入了 ES6 之前的闭包私有变量模式。

```js
const User = (function () {
  const wm = new WeakMap()
  function User() {
    const idProperty = Symbol('id')
    return {
      set(id) {
        const privateMember = wm.get(this) || {}
        privateMember[idProperty] = id
        wm.set(this, privateMember)
      },
      get(id) {
        return wm.get(this)[idProperty]
      },
    }
  }
  return User
})()
```

#### 2. DOM 节点元数据

因为 WeakMap 实例不会妨碍垃圾回收，所以非常适合保存关联元数据。来看下面这个例子，其中使用了常规的 Map

```js
const m = new Map(); 
const loginButton = document.querySelector('#login'); 
// 给这个节点关联一些元数据
m.set(loginButton, {disabled: true});
```

假设在上面的代码执行后，页面被 JavaScript 改变了，原来的登录按钮从 DOM 树中被删掉了。但由于映射中还保存着按钮的引用，所以对应的 DOM 节点仍然会逗留在内存中，除非明确将其从映射中删除或者等到映射本身被销毁

如果这里使用的是弱映射，如以下代码所示，那么当节点从 DOM 树中被删除后，垃圾回收程序就可以立即释放其内存（假设没有其他地方引用这个对象）：

```js
const wm = new WeakMap(); 
const loginButton = document.querySelector('#login'); 
// 给这个节点关联一些元数据
wm.set(loginButton, {disabled: true});
```

### 迭代器

如果迭代器没有关闭，则还可以继续从上次离开的地方继续迭代。比如，数组的迭代器就是不能关闭的

```js
let a = [1, 2, 3, 4, 5];
let iter = a[Symbol.iterator](); 
for (let i of iter) { 
 console.log(i); 
 if (i > 2) { 
 break 
 } 
} 
// 1 
// 2 
// 3 
for (let i of iter) { 
 console.log(i); 
} 
// 4 
// 5
```

因为 return()方法是可选的，所以并非所有迭代器都是可关闭的。要知道某个迭代器是否可关闭，可以测试这个迭代器实例的 return 属性是不是函数对象。不过，仅仅给一个不可关闭的迭代器增加这个方法并不能让它变成可关闭的。这是因为调用 return()不会强制迭代器进入关闭状态。即便如此，return()方法还是会被调用。

那如何关闭？答案是不去管它，或者生成新的迭代对象，或者直接迭代它的本体，不用迭代器

[JavaScript迭代器如何关闭?](https://www.zhihu.com/question/462012759)



### [从两个角度理解为什么 JS 中没有函数重载 ](https://www.cnblogs.com/zhangguicheng/p/12155512.html)

1. 方法签名

方法签名指的是**函数的名称加形参列表**，并且通过函数的名称或者形参列表都可以区分出是不同的函数。而js是弱类型语言，参数不固定，也没有类型，所以没有重载

2. 函数指针

定义了两个同名函数，则后定义的会覆盖先定义的

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

### 浏览器中的最大并行 HTTP 连接数？

https://stackoverflow.com/questions/985431/max-parallel-http-connections-in-a-browser

### 了解RTT 和RTO 对于TCP 重传的影响 

https://www.cnblogs.com/zy09/p/16636881.html

- **RTT (Round Trip Time)**： 对于 Ping 和 Traceroute，这测量了发送 Ping 数据包和取回 ICMP 数据包之间的往返时间；对于 TCP 连接，它非常相似；它测量发送数据包到从目标主机获得确认数据包的时间。
- TODO

### TCP_NODELAY

[网络编程：TCP_NODELAY](https://zhuanlan.zhihu.com/p/80104656)

[TCP连接中启用和禁用TCP_NODELAY有什么影响？](https://www.zhihu.com/question/42308970)

TCP_NODELAY，会禁用Nagle算法。Nagle算法的作用是减少小包的数量

- 什么是小包：小于 MSS(一个TCP段在网络上传输的最大尺寸) 的都可以定义为小包。
- 如果前一个TCP段发送出去后，还没有收到对端的ACK包，那么接下来的发送数据会先累积起来不发。
- 等到对端返回ACK，或者数据累积已快达到MSS，才会发送出去。



## 杂项

1. ts   extend  infer 手写题、函数重载   2题
2. 沙箱  手写 伪代码
3. http缓存 强缓存 协商缓存 各请求头作用   http 1.0 1.1   2.0    https原理   非对称和对称加密原理
4. cas认证和oauth2认证 流程
5. npm yarn pnpm 区别  原理  软连接和硬连接作用  什么是幽灵依赖
6. commonjs  esm 区别
7. prefetch preload 区别

### 前端性能优化总结

https://blog.csdn.net/qq_41328247/article/details/113859458

## 前端安全



## CSS



### 重绘和回流有什么区别?

https://blog.csdn.net/pig_is_duck/article/details/105903741

1、 重绘：元素样式的改变（但宽高、大小、位置等不变）

2、 回流：元素的大小或者位置发生改变（当页面布局和几何信息发生改变的时候），触发了重新布局导致渲染树重新计算布局和渲染



### BFC 是什么

[10 分钟理解 BFC 原理](https://zhuanlan.zhihu.com/p/25321647)

[块格式化上下文BFC](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)

### flex布局子元素宽度超出父元素问题

https://juejin.cn/post/6974356682574921765

1. 设置`min-width：0`可以解决当`flex子元素`的子元素大小为`auto`的情况；
2. 设置`overflow`不为`visible`可以解决所有情况下的麻烦；

[flex-shrink](https://www.runoob.com/cssref/css3-pr-flex-shrink.html)



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

### 【集合】统一身份认证（CAS）和OAuth2的工作流程

https://blog.csdn.net/tpriwwq/article/details/125740936

## 题目

### 设计一个websocket客户端模块给团队人员使用

> 题目：设计一个websocket客户端模块给团队人员使用
> 要求：稳定性和可用性，不需要考虑安全性，扩展性等其他因素
> 考察要点：如何通过设计机制来保证强稳定性，需要考虑到各种情况，保证业务高可用
>
> 技术方式不限，ws相关代码用js，不引入现有生态的ws的npm库

#### 1. 参考页面

- https://cloud.tencent.com/developer/article/2168088
- https://juejin.cn/post/7128030988479037447
- https://github.com/nuls-io/nuls-v2-docs/blob/master/design-zh-CHS/r.rpc-tool-websocket%E8%AE%BE%E8%AE%A1v1.3.md
- https://socket.io/zh-CN/docs/v4/
- https://blog.csdn.net/niugang0920/article/details/83686205
- [十分钟了解WebSocket协议](https://zhuanlan.zhihu.com/p/145628937)
  - 基于TCP/IP协议，独立于HTTP协议的通信协议
  - 双向通讯，有状态，客户端一（多）个与服务端一（多）双向实时响应（客户端 ⇄ 服务端）
  - 应用在浏览器的 Socket （是 Socket 模型接口的实现），Socket 是一个网络通信接口 （通信规范）
  - [RFC 6455 规范](https://link.zhihu.com/?target=https%3A//tools.ietf.org/html/rfc6455) 是大多数浏览器实现的 WebSocket API 协议。
  - **WebSocket协议不受同源策略影响。**
  - 发心跳包最好服务器发送？

- [WebSockets版本之间的协议差异是什么？](http://news.558idc.com/94700.html)

- [使用WebSocket 时的安全注意事项](https://zhuanlan.zhihu.com/p/628423871)
- [Websocket 可以玩出些什么花儿？](https://zhuanlan.zhihu.com/p/460470270)
- [WebSocket 浅析](https://zhuanlan.zhihu.com/p/25592934)
- [websocket长文本问题？](https://segmentfault.com/q/1010000010620489)
- 待看
  - https://www.cnblogs.com/cangqinglang/p/15991378.html
  - [【译】Engine.IO协议](https://www.kevinwu0904.top/blogs/network-engineio/)


#### 2.实现功能

- 连接错误处理：当连接失败时，你需要监听error事件和close事件，获取错误信息和关闭码，并尝试重新连接或报告错误。
- 心跳检测：为了检测和关闭断开的连接，你需要定期发送心跳包（ping帧）并等待响应（pong帧）。如果没有收到响应，你可以关闭连接并重新连接
- 数据压缩：你可以使用permessage-deflate扩展来压缩数据负载。这个扩展可以在客户端和服务器之间协商压缩算法和参数





