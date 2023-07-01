# Decorator 装饰器语法

## 1. 背景

[如何看待 ECMAScript 装饰器（Decorators）提案进入 stage 3？ - 知乎 (zhihu.com)](https://www.zhihu.com/question/524781624)

[[2022年06]装饰器 - ECMAScript 6入门 (ruanyifeng.com)](https://es6.ruanyifeng.com/#docs/decorator#存取器装饰器（新语法）)

[暂定ts5.2支持装饰器第三阶段](https://github.com/microsoft/TypeScript/issues/53461)

[「程序猿同事的分享」TypeScript 元数据的理解与使用](https://zhuanlan.zhihu.com/p/166362122)



> ts会预留装饰器的口子
>
> - "design:type"
> - "design:paramtypes"
> - "design:returntype" 不能隐式推断，只能显式标注

## 2. 如何启用

以下两种方法都可以开启装饰器语法

1. [@babel/plugin-proposal-decorators · Babel (babeljs.io)](https://babeljs.io/docs/babel-plugin-proposal-decorators#decoratorsbeforeexport)

   > - `"2023-05"` is the proposal version after the updates that reached consensus in the March and May 2023 TC39 meetings, integrating [these changes](https://github.com/pzuraq/ecma262/compare/e86128e13b63a3c2efc3728f76c8332756752b02...c4465e44d514c6c1dba810487ec2721ccd6b08f9).
   > - `"2023-01"` is the proposal version after the updates that reached consensus in the January 2023 TC39 meeting, integrating [`pzuraq/ecma262#4`](https://github.com/pzuraq/ecma262/pull/4).
   > - `"2022-03"` is the proposal version that reached consensus for Stage 3 in the March 2022 TC39 meeting. You can read more about it at [`tc39/proposal-decorators@8ca65c046d`](https://github.com/tc39/proposal-decorators/tree/8ca65c046dd5e9aa3846a1fe5df343a6f7efd9f8).
   > - `"2021-12"` is the proposal version as it was presented to TC39 in Dec 2021. You can read more about it at [`tc39/proposal-decorators@d6c056fa06`](https://github.com/tc39/proposal-decorators/tree/d6c056fa061646178c34f361bad33d583316dc85).
   > - `"2018-09"` is the proposal version that was initially promoted to Stage 2 presented to TC39 in Sept 2018. You can read more about it at [`tc39/proposal-decorators@7fa580b40f`](https://github.com/tc39/proposal-decorators/tree/7fa580b40f2c19c561511ea2c978e307ae689a1b).
   > - `legacy` is the legacy Stage 1 proposal, defined at [`wycats/javascript-decorators@e1bf8d41bf`](https://github.com/wycats/javascript-decorators/blob/e1bf8d41bfa2591d949dd3bbf013514c8904b913/README.md).

2. [TypeScript: Documentation - Decorators (typescriptlang.org)](https://www.typescriptlang.org/docs/handbook/decorators.html)

## 3. 概念

装饰器是一种特殊的声明，可以附加到类声明、方法、访问器、属性或参数。

装饰器使用形式 `@expression` ，其中 `expression` 必须是计算一个函数，该函数将在运行时调用，其中包含有关修饰声明的信息。

legacy和stage3版本，差别还挺大的



打包结果

```js
function __decorate(decorators, target, key, descriptor) {
  const length = arguments.length;
  // 描述符
  let r =
    length < 3
      ? target
      : descriptor === null
        ? descriptor = Object.getOwnPropertyDescriptor(target, key)
        : descriptor;
  let decoratorFunc;
  // 预留Reflect新协议实现
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
    r = Reflect.decorate(decorators, target, key, descriptor);
  }
  else {
    // 循环调用函数
    for (let i = decorators.length - 1; i >= 0; i--) {
      decoratorFunc = decorators[i]
      if (decoratorFunc) {
        // 更新描述符，并传递到下一个装饰器
        r = (
          length < 3
          ? decoratorFunc(r) // class
          : length > 3
            ? decoratorFunc(target, key, r) // method
            : decoratorFunc(target, key) // property
          ) || r;
      }
    }
  }
  if (length > 3  && r ) {
    Object.defineProperty(target, key, r)
  }

  return r;
}
var ExampleClass = (function () {
    function ExampleClass(a) {
        this.pattern1 = { xx: 1 };
        console.log('init', a);
    }
    ExampleClass.prototype.runPatten = function () {
        console.log('log', this.pattern);
        return '111';
    };
    __decorate([
        PropertyDecorator,
        __metadata("design:type", String)
    ], ExampleClass.prototype, "pattern", void 0);
    __decorate([
        PropertyDecorator,
        __metadata("design:type", Object)
    ], ExampleClass.prototype, "pattern1", void 0);
    __decorate([
        PropertyDecorator,
        __metadata("design:type", Array)
    ], ExampleClass.prototype, "pattern2", void 0);
    __decorate([
        PropertyDecorator,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", String)
    ], ExampleClass.prototype, "runPatten", null);
      // 返回赋值给类
    ExampleClass = __decorate([
        reportableClassDecorator('hhhh'),
        Con,
        __metadata("design:paramtypes", [String])
    ], ExampleClass);
    return ExampleClass;
}());

```

### 类装饰器

### 函数装饰器





## 应用的库

- [reflect-metadata - npm (npmjs.com)](https://www.npmjs.com/package/reflect-metadata)
- [TypeORM - Amazing ORM for TypeScript and JavaScript (ES7, ES6, ES5). Supports MySQL, PostgreSQL, MariaDB, SQLite, MS SQL Server, Oracle, WebSQL databases. Works in NodeJS, Browser, Ionic, Cordova and Electron platforms.](https://typeorm.io/)
- [Documentation | NestJS - A progressive Node.js framework](https://docs.nestjs.com/)