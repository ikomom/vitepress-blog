# js

## 变量、作用域和内存

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
>  我们以函数中局部变量的正常生命周期为例。函数中的局部变量会在函数执行时存在。此时，栈（或堆）内存会分配空间以保存相应的值。函数在内部使用了变量，然后退出。此时，就不再需要那个局部变量了，它占用的内存可以释放，供后面使用。这种情况下显然不再需要局部变量了，但并不是所有时候都会这么明显。垃圾回收程序必须跟踪记录哪个变量还会使用，以及哪个变量不会再使用，以便回收内存。如何标记未使用的变量也许有不同的实现方式，用到过两种主要的标记策略：标记清理和引用计数

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

## 静态分配与对象池

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



## 堆栈

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

> https://blog.csdn.net/viewyu12345/article/details/108703891)

## 对象

ECMA-262 将对象定义为一组**属性的无序集合**, 可以把 ECMAScript 的对象想象成一张**散列表**，其中的内容就是**一组名/值对**，值可以是

数据或者函数。

### 对象的属性

ECMA-262 使用一些**内部特性**来描述属性的特征。这些特性是由为 JavaScript 实现引擎的规范定义的。因此，开发者不能在 JavaScript 中直接访问这些特性。为了将某个特性标识为内部特性，规范会用两个中括号把特性的名称括起来，比如`[[Enumerable]]`。

有些地方又叫做**描述符(Descriptor)**

- `[[Configurable]]`：表示属性**是否可以通过 delete 删除并重新定义**，**是否可以修改它的特性(Object.defineProperty)**，以及是否可以把它**改为访问器属性(get / set)**。默认情况下，所有直接定义在对象上的属性的这个特性都是 true，如前面的例子所示。

- `[[Enumerable]]`：表示属性是否可以通过 **for-in 循环返回**。默认情况下，所有直接定义在对象上的属性的这个特性都是 true，如前面的例子所示。

- `[[Writable]]`：表示属性的**值是否可以被修改**。默认情况下，所有直接定义在对象上的属性的这个特性都是 true，如前面的例子所示。

- `[[Value]]`：包含**属性实际的值**。这就是前面提到的那个**读取和写入属性值(访问器设置/读取的值)**的位置。这个特性的默认值为 undefined。

属性操作

- 定义`Object.defineProperties()` , `Object.definePropertie()`
- 获取`Object.getOwnPropertyDescriptor()`, ECMAScript 2017 `Object.getOwnPropertyDescriptors()`

  ### 合并对象

**是把源对象所有的本地属性一起复制到目标对象上**, 有时候这种操作也被称为**“混入”（mixin）**，因为目标对象通过混入

源对象的属性得到了增强

- `Object.assign()`

  - 这个方法接收**一个目标对象和一个或多个源对象作为参数**，然后将每个源对象中**可枚举**（Object.propertyIsEnumerable()返回 true）和**自有属性**（Object.hasOwnProperty()返回 true）复制到目标对象; 

  - 对每个符合条件的属性，这个方法会使用**源对象上的`[[Get]]`取得属性的值**，然后使用**目标对象上的`[[Set]]`设置属性的值**; 

  - 执行的是**浅复制**,  相同的值会覆盖, 函数引用会复制; 

   ```js
    dest = {}; 
    src = { a: {} }; 
    Object.assign(dest, src); 
    // 浅复制意味着只会复制对象的引用
    console.log(dest); // { a :{} } 
    console.log(dest.a === src.a); // true
   ```

  - 赋值期间出错，则操作会中止并退出，同时抛出错误, 但是之前已经赋值不会回滚

  

### 深拷贝

https://developer.mozilla.org/zh-CN/docs/Glossary/Deep_copy

[如何写出一个惊艳面试官的深拷贝?](https://juejin.cn/post/6844903929705136141)

```js
export class cloneable {
  public static deepCopy<T>(source: T): T {
    return Array.isArray(source)
    ? source.map(item => this.deepCopy(item))
    : source instanceof Date
    ? new Date(source.getTime())
    : source && typeof source === 'object'
          ? Object.getOwnPropertyNames(source).reduce((o, prop) => {
             Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop)!);
             o[prop] = this.deepCopy((source as { [key: string]: any })[prop]);
             return o;
          }, Object.create(Object.getPrototypeOf(source)))
    : source as T;
  }
}
```



### 理解原型

原型对象 `prototype` 和原型`__proto__`不一样



无论何时，只要创建一个函数，就会按照特定的规则为这个函数创建一个 `prototype` 属性（指向**原型对象**）

![image-20230528121335129](C:\Users\31579\AppData\Roaming\Typora\typora-user-images\image-20230528121335129.png)

`Name.prototype.constructor` 指向 `Name`。然后，因构造函数而异，可能会给原型对象添加其他属性和方法。

![image-20230528121523878](C:\Users\31579\AppData\Roaming\Typora\typora-user-images\image-20230528121523878.png)

也可以通过`Name.__proto__`，通过这个属性可以访问对象的**原型**

**实例**与**构造函数原型**之间有直接的联系，但**实例与构造函数之间没有**, 以下为例子

```js
/** 
 * 构造函数可以是函数表达式
 * 也可以是函数声明，因此以下两种形式都可以：
 * function Person() {} 
 * let Person = function() {} 
 */ 
function Person() {} 
/** 
 * 声明之后，构造函数就有了一个
 * 与之关联的原型对象：
 */ 
console.log(typeof Person.prototype);// object 
// { 
// constructor: f Person(), 
// __proto__: Object
// }
console.log(Person.prototype); 

/** 
 * 如前所述，构造函数有一个 prototype 属性
 * 引用其原型对象，而这个原型对象也有一个
 * constructor 属性，引用这个构造函数
 * 换句话说，两者循环引用：
 */ 
console.log(Person.prototype.constructor === Person); // true 原型对象的constructor指向本体
/*
 * 正常的原型链都会终止于 Object 的原型对象
 * Object 原型的原型是 null 
 */ 
console.log(Person.prototype.__proto__ === Object.prototype); // true 
console.log(Person.prototype.__proto__.constructor === Object); // true 
console.log(Person.prototype.__proto__.__proto__ === null); // true Object的原型是null

let person1 = new Person(), 
    person2 = new Person(); 
/** 
 * 构造函数、原型对象和实例
 * 是 3 个完全不同的对象：
 */ 
console.log(person1 !== Person); // true  
console.log(person1 !== Person.prototype); // true 
console.log(Person.prototype !== Person); // true

/** 
 * 实例通过__proto__链接到原型对象，
 * 它实际上指向隐藏特性[[Prototype]] 
 * 
 * 构造函数通过 prototype 属性链接到原型对象
 * 
 * 实例与构造函数没有直接联系，与原型对象有直接联系
 */ 
console.log(person1.__proto__ === Person.prototype); // true 
conosle.log(person1.__proto__.constructor === Person); // true
/** 
 * 同一个构造函数创建的两个实例
 * 共享同一个原型对象：
 */ 
console.log(person1.__proto__ === person2.__proto__); // true
```

![image-20230528144315910](C:\Users\31579\AppData\Roaming\Typora\typora-user-images\image-20230528144315910.png)	

逐级查找机制

> 在通过对象访问属性时，会按照这个属性的名称开始搜索。搜索开始于对象实例本身。如果在这个实例上发现了给定的名称，则返回该名称对应的值。如果没有找到这个属性，则搜索会沿着指针进入原型对象，然后在原型对象上找到属性后，再返回对应的值

**原型的问题**

1. 它**弱化了向构造函数传递初始化参数的能力**，**会导致所有实例默都取得相同的属性值**。
2. 原型的最主要问题源自它的共享特性, 原始值的引用还好, 但是引用值的属性就会出问题

```js
function Person() {} 
Person.prototype = { 
 constructor: Person, 
 name: "Nicholas", 
 age: 29, 
 job: "Software Engineer", 
 friends: ["Shelby", "Court"],
 sayName() { 
	 console.log(this.name); 
 } 
}; 
let person1 = new Person(); 
let person2 = new Person(); 
person1.friends.push("Van"); // push了一个, 所有实例的引用值都变了
console.log(person1.friends); // "Shelby,Court,Van" 
console.log(person2.friends); // "Shelby,Court,Van" 
console.log(person1.friends === person2.friends); // true
```

### 继承

**实现继承**是 ECMAScript 唯一支持的继承方式，而这主要是通过**原型链**实现的

重温一下构造函数、原型和实例的关系：

每个**构造函数都有一个原型对象**，**原型有一个属性指回构造函数**，而**实例有一个内部指针指向原型**。

如果原型是另一个类型的实例呢？那就意味着这个原型本身有一个内部指针指向另一个原型，相应地另一个原型也有一个指针指向另一个构造函数。这样就在实例和原型之间构造了一条原型链

```js
function SuperType() {
   this.property = true; 
} 
SuperType.prototype.getSuperValue = function() { 
 return this.property; 
}; 
function SubType() { 
 this.subproperty = false; 
} 
// 继承 SuperType 
SubType.prototype = new SuperType(); 
SubType.prototype.getSubValue = function () {
     return this.subproperty; 
}; 
let instance = new SubType(); 
console.log(instance.getSuperValue()); // true
```

**原型链的问题**

- 主要问题出现在原型中包含引用值的时候。前面在谈到原型的问题时也提到过，**原型中包含的引用值会在所有实例间共享**，这也是为什么属性通常会在构造函数中定义而不会定义在原型上的原因
- 原型链的第二个问题是，**子类型在实例化时不能给父类型的构造函数传参**。

为了解决原型包含引用值导致的继承问题，一种叫作**“盗用构造函数”（constructor stealing）**. 基本思路很简单：在子类构造函数中调用父类构造函数

```js
 this.colors = ["red", "blue", "green"]; 
} 
function SubType() { 
 // 继承 SuperType 
 SuperType.call(this); 
} 
let instance1 = new SubType(); 
instance1.colors.push("black"); 
console.log(instance1.colors); // "red,blue,green,black" 
let instance2 = new SubType(); 
console.log(instance2.colors); // "red,blue,green"
```

盗用构造函数的一个优点就是可以在子类构造函数中向父类构造函数传参

```js
function SuperType(name){ 
 this.name = name; 
} 
function SubType() { 
 // 继承 SuperType 并传参
 SuperType.call(this, "Nicholas"); 
 // 实例属性
 this.age = 29; 
} 
let instance = new SubType(); 
console.log(instance.name); // "Nicholas"; 
console.log(instance.age); // 29
```

问题是函数不能重用, 子类也不能访问父类原型上定义的方法，因此所有类型只能使用构造函数模式

### 组合继承

**组合继承（有时候也叫伪经典继承）**综合了原型链和盗用构造函数，将两者的优点集中了起来

```js
function SuperType(name){ 
 this.name = name; 
 this.colors = ["red", "blue", "green"]; 
} 
SuperType.prototype.sayName = function() { 
 console.log(this.name); 
}; 
function SubType(name, age){ 
 // 继承属性
 SuperType.call(this, name); 
 this.age = age; 
} 
// 继承方法
SubType.prototype = new SuperType(); 
SubType.prototype.sayAge = function() { 
 console.log(this.age); 
}; 
let instance1 = new SubType("Nicholas", 29); 
instance1.colors.push("black"); 
console.log(instance1.colors); // "red,blue,green,black" 
instance1.sayName(); // "Nicholas"; 
instance1.sayAge(); // 29 
let instance2 = new SubType("Greg", 27); 
console.log(instance2.colors); // "red,blue,green" 
instance2.sayName(); // "Greg"; 
instance2.sayAge(); // 27
```

### 原型式继承

出发点是即使**不自定义类型也可以通过原型实现对象之间的信息共享**

```js
// 和Object.create()效果一致
function object(o) { 
 function Father() {} 
 Father.prototype = o; 
 return new Father(); 
}
let person = { 
 name: "Nicholas", 
 friends: ["Shelby", "Court", "Van"] 
}; 
let anotherPerson = object(person); 
anotherPerson.name = "Greg"; 
anotherPerson.friends.push("Rob"); 
let yetAnotherPerson = object(person); 
yetAnotherPerson.name = "Linda"; 
yetAnotherPerson.friends.push("Barbie"); 
console.log(person.friends); // "Shelby,Court,Van,Rob,Barbie"
```

### 寄生式继承

与原型式继承比较接近的一种继承方式是**寄生式继承（parasitic inheritance）**，也是 Crockford 首倡的一种模式。

寄生式继承背后的思路类似于**寄生构造函数和工厂模式**：创建一个实现继承的函数，以某种方式增强对象，然后返回这个对象

```js
function createAnother(original){ 
 let clone = Object.create(original); // 通过调用函数创建一个新对象
 clone.sayHi = function() { // 以某种方式增强这个对象
 console.log("hi"); 
 }; 
 return clone; // 返回这个对象
}

let person = { 
 name: "Nicholas", 
 friends: ["Shelby", "Court", "Van"] 
}; 
let anotherPerson = createAnother(person); 
anotherPerson.sayHi(); // "hi"
```

### 寄生式组合继承

**组合继承其实也存在效率问题**。最主要的效率问题就**是父类构造函数始终会被调用两次**：一次在是创建子类原型时调用，另一次是在子类构造函数中调用

```js
function SuperType(name) { 
 this.name = name; 
 this.colors = ["red", "blue", "green"]; 
} 
SuperType.prototype.sayName = function() { 
 console.log(this.name); 
}; 
function SubType(name, age){ 
 SuperType.call(this, name); // 第二次调用 SuperType() 
 this.age = age; 
} 
SubType.prototype = new SuperType(); // 第一次调用 SuperType() 
SubType.prototype.constructor = SubType; 
SubType.prototype.sayAge = function() { 
 console.log(this.age); 
};
```

而寄生组合继承逻辑

```js
function inheritPrototype(subType, superType) { 
 let prototype = Object.create(superType.prototype); // 创建对象
 prototype.constructor = subType; // 增强对象 (解决由于重写原型导致默认 constructor 丢失的问题)
 subType.prototype = prototype; // 赋值对象
}

function SuperType(name) { 
 this.name = name; 
 this.colors = ["red", "blue", "green"]; 
} 
SuperType.prototype.sayName = function() { 
 console.log(this.name); 
}; 
function SubType(name, age) { 
 SuperType.call(this, name);
     this.age = age; 
} 
inheritPrototype(SubType, SuperType); 
SubType.prototype.sayAge = function() { 
 console.log(this.age); 
};
```




## 函数

### 属性和方法

ECMAScript 中的函数是对象，因此有属性和方法，每个函数都有两个属性：`length `和 `prototype`。其中，`length` 属性保存函数定义的命名参数的个数

```js
function sayName(name) { 
 console.log(name); 
} 
function sum(num1, num2) { 
 return num1 + num2; 
} 
function sayHi() { 
 console.log("hi"); 
} 
console.log(sayName.length); // 1 
console.log(sum.length); // 2 
console.log(sayHi.length); // 0
```

`prototype` 是保存引用类型所有**实例方法**的地方，这意味着 `toString()`、`valueOf()`等方法实际上都保存在 `prototype` 上，进而由所有实例共享

### 闭包

闭包指的是那些引用了**另一个函数作用域中变量的函数**，通常是**在嵌套函数中实现**的



#### 执行上下文

**执行上下文（以下简称“上下文”）**的概念在 JavaScript 中是颇为重要的。变量或函数的上下文**决定了它们可以访问哪些数据**，以及它们的行为。**每个上下文都有一个关联的变量对象**（variable object），而这个上下文中定义的所有变量和函数都存在于这个对象上

全局上下文是最外层(window)的上下文，所有**var定义的全局变量和函数**，都会挂载到window上，成为它的属性和方法。

使用 let 和 const 的顶级声明能引用，但不会挂载window上，其在**作用域链解析**的效果是一样的

上下文在**其所有代码都执行完毕后会被销毁**，包括定义在它上面的所有变量和函数（**全局上下文在应用程序退出前才会被销毁**，比如关闭网页或退出浏览器）。

**每个函数调用都有自己的上下文**。当**代码执行流进入函数时，函数的上下文被推到一个上下文栈上**。在**函数执行完之后，上下文栈会弹出该函数上下文，将控制权返还给之前的执行上下文**

上下文中的代码在执行的时候，会创建变量对象的一个**作用域链（scope chain）**。这个作用域链决定了各级上下文中的代码在访问变量和函数时的顺序。**代码正在执行的上下文的变量对象始终位于作用域链的最前端**。若上下文是函数，则其活动对象（activation object）(arguments)用作变量对象

代码执行时的**标识符解析是通过沿作用域链逐级搜索标识符名称**完成的。搜索过程始终**从作用域链的最前端开始**，然后逐级往后，直到找到标识符。（如果没有找到标识符，那么通常会报错。）

**局部作用域中定义的变量可用于在局部上下文中替换全局变量**（因为是从作用域链从前往后找，所以，局部肯定比全局先被找到）



###### 作用域链增强

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



###### 例子

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
> console.log(arguments.callee); //打印f1函数对象
> console.log(arguments.callee.caller); //打印f2函数对象
> }
> 
> function f2() {
> f1();
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
> console.log(this.name); //打印global
> }
> 
> var obj = {
> name: "obj",
> f2: function() {
> console.log(this.name); //打印obj
> f1(); //打印global
> f1.call(this); //打印obj
> }
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
> [ scopes结合实际分析 ](


### es6

#### WeakMap的使用方式

WeakMap中，只要值的引用不存在，就会自动销毁；并且因为其这个特性，它是不可迭代的，只能通过原始引用取得键值

```js
const wm = new WeakMap(); 
wm.set({}, "val");
```

set()方法初始化了一个新对象并将它用作一个字符串的键。因为**没有指向这个对象的其他引用**， 所以当这行代码执行完成后，**这个对象键就会被当作垃圾回收**。

##### 1. 私有变量

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



##### 2. DOM 节点元数据

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

## 迭代器

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

## Event Loop	

[一次弄懂Event Loop（彻底解决此类面试问题）](https://juejin.cn/post/6844903764202094606)

`Event Loop`即事件循环，是指浏览器或`Node`的一种解决`javaScript`单线程运行时不会阻塞的一种机制，也就是我们经常使用**异步**的原理。

在`JavaScript`中，任务被分为两种，一种**宏任务**（`MacroTask`）也叫`Task`，一种叫**微任务**（`MicroTask`）。

### MacroTask（宏任务）

 `script`全部代码、`setTimeout`、`setInterval`、`setImmediate`（浏览器暂时不支持，只有IE10支持，具体可见[`MDN`](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2FsetImmediate)）、`I/O`、`UI Rendering`。

### MicroTask（微任务）

 `Process.nextTick（Node独有）`、`Promise`、`Object.observe(废弃)`、`MutationObserver`（具体使用方式查看[这里](https://link.juejin.cn/?target=http%3A%2F%2Fjavascript.ruanyifeng.com%2Fdom%2Fmutationobserver.html)）



### 浏览器中的Event Loop

`Javascript` 有一个 `main thread` 主线程和 `call-stack` 调用栈(执行栈)，所有的任务都会被放到调用栈等待主线程执行。

#### JS调用栈

JS**调用栈**采用的是**后进先出**的规则，当函数执行的时候，会被添加到栈的顶部，当执行栈执行完成后，就会从栈顶移出，直到栈内被清空。

#### 同步任务和异步任务

`Javascript`单线程任务被分为**同步任务**和**异步任务**

- 同步任务会在调用栈中按照**顺序等待**主线程依次执行
- 异步任务**会在异步任务有了结果后**，**将注册的回调函数放入任务队列中等待主线程空闲的时候**（调用栈被清空），被读取到栈内等待主线程的执行。
  - 任务队列`Task Queue`，即队列，是一种先进先出的一种数据结构。
  - <img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/18/1685f037d48da0de~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp" alt="img" style="zoom: 80%;" />

#### 事件循环的进程模型

- 选择**当前要执行的任务队列**，选择任务队列中最先进入的任务，如果任务队列为空即`null`，则执行跳转到微任务（`MicroTask`）的执行步骤。
- 将**事件循环中的任务设置为已选择任务**。
- 执行任务。
- 将**事件循环中当前运行任务设置为null**。
- 将已经运行完成的任务从任务队列中删除。
- microtasks步骤：进入microtask检查点。
- 更新界面渲染。
- 返回第一步。

#### 执行进入microtask检查点时，用户代理会执行以下步骤：

- 设置`microtask`检查点标志为true。
- 当事件循环`microtask`执行不为空时：选择一个最先进入的`microtask`队列的`microtask`，将事件循环的`microtask`设置为已选择的`microtask`，运行`microtask`，将已经执行完成的`microtask`为`null`，移出`microtask`中的`microtask`。
- 清理IndexDB事务
- 设置进入microtask检查点的标志为false。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/18/1686078c7a2f63e5~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

执行栈在执行完**同步任务**后，查看**执行栈**是否为空，如果执行栈为空，就会去检查**微任务**(`microTask`)队列是否为空，如果为空的话，就执行`Task`（宏任务），否则就一次性执行完所有微任务。

每次单个**宏任务**执行完毕后，检查**微任务**(`microTask`)队列是否为空，如果不为空的话，会按照**先入先**出的规则全部执行完**微任务**(`microTask`)后，设置**微任务**(`microTask`)队列为`null`，然后再执行**宏任务**，如此循环。

> 即执行栈中运行同步任务 -> 检查微任务 -> 宏任务 -> 检查微任务

 

### vue 的nextTick

[简单理解Vue中的nextTick](https://www.jianshu.com/p/a7550c0e164f)

```jsx
const callbacks = []
// 立即执行函数,返回一个闭包
export const nextTick = (function () {

  let pending = false
  // 运行函数
  let timerFunc

  function nextTickHandler () {
    pending = false
    // 复制一份callbacks 
    const copies = callbacks.slice(0)
    // 释放旧内存
    callbacks.length = 0
    // 批量运行回调 
    for (let i = 0; i < copies.length; i++) {
      copies[i]()
    }
  }

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore if */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve()
    var logError = err => { console.error(err) }
    timerFunc = () => {
      p.then(nextTickHandler).catch(logError)
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) setTimeout(noop)
    }
  } else if (!isIE && typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // use MutationObserver where native Promise is not available,
    // e.g. PhantomJS, iOS7, Android 4.4
    var counter = 1
    var observer = new MutationObserver(nextTickHandler)
    var textNode = document.createTextNode(String(counter))
    observer.observe(textNode, {
      characterData: true
    })
    timerFunc = () => {
      counter = (counter + 1) % 2
      textNode.data = String(counter)
    }
  } else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
     timerFunc = () => {
        setImmediate(flushCallbacks)
      }
    }
    else {
    // fallback to setTimeout
    /* istanbul ignore next */
    timerFunc = () => {
      setTimeout(nextTickHandler, 0)
    }
  }

  return function queueNextTick (cb?: Function, ctx?: Object) {
    let _resolve
    // 放入回调队列
    callbacks.push(() => {
      if (cb) {
        try {
          // 调用回调  
          cb.call(ctx)
        } catch (e) {
          handleError(e, ctx, 'nextTick')
        }
      } else if (_resolve) {
        // 运行微任务  
        _resolve(ctx)
      }
    })
     // 未发起发起更新
    if (!pending) {
      pending = true
      timerFunc()
    }
      
     // 回调不存在就用promise做微任务后调用
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise((resolve, reject) => {
        _resolve = resolve
      })
    }
  }
})()
```

1. 优先使用Promise, `IOS`环境用setTimeout, 触发nextTickHandler
2. 不是IE, 且支持MutationObserver的直接创建内存dom, 监听dom, 触发nextTickHandler
3. 其他用setTimeout, 触发nextTickHandler





## 问答

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

### [从两个角度理解为什么 JS 中没有函数重载 ](https://www.cnblogs.com/zhangguicheng/p/12155512.html)

1. 方法签名

方法签名指的是**函数的名称加形参列表**，并且通过函数的名称或者形参列表都可以区分出是不同的函数。而js是弱类型语言，参数不固定，也没有类型，所以没有重载

2. 函数指针

定义了两个同名函数，则后定义的会覆盖先定义的

### 你知道+0与-0的区别吗？

https://blog.csdn.net/qiwoo_weekly/article/details/101442976

https://juejin.cn/post/6844903812931518478