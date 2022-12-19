# 状态管理

[react 状态管理选型](https://www.zhihu.com/question/403178453)



待看	

- [React 之什么时候你不应该用 rxjs](https://zhuanlan.zhihu.com/p/393890916)
- [如何评价 Facebook 的 React 状态管理库 Recoil？](http://www-quic.zhihu.com/question/394899726)
- [精读recoil](https://zhuanlan.zhihu.com/p/143335599)



## recoil

- [官方文档](https://recoiljs.org/zh-hans/docs/introduction/core-concepts)

- 



功能总结

- 数据结构是**有向图**

- 组件状态分享，响应式更新（atom）
- 需要手动唯一key
- 监听其他atom、selector更新后自动更新的**selector** 函数，类似vue的computed
  - 可写：set、get
  - 不可写：get
- 异步数据处理--待实验