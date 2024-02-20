---
outline: deep
---

# vue

## 实际

### 图片懒加载和预加载的实现与原理

https://blog.csdn.net/Oruizn/article/details/115028962



## 源码



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

### 响应式原理

[vue3响应式原理](https://juejin.cn/post/7042493531813838878#heading-0)



## 技巧

### 十几行的代码实现vue.watch

```js
function getBaseType(target) {
    const typeStr = Object.prototype.toString.apply(target);
    return typeStr.slice(8, -1);
}

class watcher{
    constructor(opts){
        this.$data = getBaseType(opts.data) === 'Object' ? opts.data : {};
        this.$watch = getBaseType(opts.watch) === 'Object' ? opts.watch : {};
        for(let key in opts.data){
            this.setData(key)
        }
    }  

    setData(_key){
        Object.defineProperty(this,_key,{
            get: function () {
                return this.$data[_key];
            },
            set: function (val) {
                const oldVal = this.$data[_key];
                // 浅比对新旧值，没变化不触发watch
                if(oldVal === val) return val;
                this.$data[_key] = val;
                this.$watch[_key] && typeof this.$watch[_key] === 'function' && (
                    this.$watch[_key].call(this,val,oldVal)
                );
                return val;
            },
        });
    }
}


const wm = new watcher({
    data:{
        a: 0 
    },
    watch:{
        a(newVal,oldVal){
            console.log('newVal:'+newVal);
            console.log('oldVal:'+oldVal);
        }
    }
})
vm.a = 1 
// newVal:1
// oldVal:0
```

