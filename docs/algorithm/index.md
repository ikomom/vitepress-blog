## 算法

## 收集

###  1. 欧几里得算法求最大公约数

又称[辗转相除法](https://zh.wikipedia.org/wiki/%E8%BC%BE%E8%BD%89%E7%9B%B8%E9%99%A4%E6%B3%95)， 用于计算两个**非负整数**a，b的[最大公约数](https://zh.wikipedia.org/wiki/%E6%9C%80%E5%A4%A7%E5%85%AC%E5%9B%A0%E6%95%B8) 

```typescript
export function getGcd(p: number, q: number): number {
  if (q === 0)
    return p
  return gcd(q, p % q)
}

```

- https://zhuanlan.zhihu.com/p/259706781

### 2. 最小公倍数

$$
两个数的乘积 = 最大公约数 * 最小公倍数
$$

$$
最小公倍数 = 两个数的乘积 / 最大公约数
$$

https://knightyun.github.io/2019/09/03/js-lcm

```typescript
 function getLcm(p: number, q: number) {
  return p * q / getGcd(p, q)
}
```

