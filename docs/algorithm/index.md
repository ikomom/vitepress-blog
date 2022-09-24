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

### 3. 并查集

- 连接 union
- 查询是否连接 findUnion
  - reflexive(反射性)：p 被连接到p。自己连自己
  - symmetric(对称性)：如果p连接到q， q也连接到p
  - transitive(传递性)：如果p连接到q,  q连接到r, 则p连接到r

![联通分量](/union-component.png)

connect-component(联通分量):  互相连接的最大对象集合

自己实现的一个简单的过程,  目测是O(n)

```typescript

const unionSet: number[][] = reactive([]) // 联通分量
const unionLineSet: number[][] = reactive([]) // 原始的对象集合, 用于画线

const command = {
  clear() {
    unionSet.length = 0
    unionLineSet.length = 0
    console.log('clear')
  },
  separate(n1: number, n2: number) {
    const connected = command.findConnect(n1, n2)
    if (connected) {
      for (let i = 0; i < unionSet.length; i++) {
        const n1Index = unionSet[i].indexOf(n1)
        const n2Index = unionSet[i].indexOf(n2)
        if (n1Index !== -1 && n2Index !== -1) {
          unionSet[i] = unionSet[i].filter((_, index) => ![n1Index, n2Index].includes(index))
          break
        }
      }
      for (let i = 0; i < unionLineSet.length; i++) {
        if (isEqual([n1, n2], unionLineSet[i]))
          unionLineSet[i].splice(i, 1)
      }
    }
    else {
      toast.warning(`${[n1, n2]}未连接`)
    }
  },
  union(n1: number, n2: number) {
    const connected = command.findConnect(n1, n2)
    if (connected) {
      toast.warning(`[${[n1, n2]}]已经连接`)
    }
    else {
      // 查找是否单个数已经在已连接的节点中
      let n1Index = -1
      let n2Index = -1

      for (let i = 0; i < unionSet.length; i++) {
        const item = unionSet[i]
        if (n2Index === -1 && item.includes(n1))
          n2Index = i
        else if (n1Index === -1 && item.includes(n2))
          n1Index = i
      }
      console.log({ n1Index, n2Index }, cloneDeep(unionSet))
      // 合并已有的项目
      if (n1Index !== -1 && n2Index !== -1) {
        unionSet[n1Index] = unionSet[n1Index].concat(unionSet[n2Index])
        unionSet.splice(n2Index, 1)
      }
      else if (n1Index !== -1) {
        unionSet[n1Index].push(n1)
      }
      else if (n2Index !== -1) {
        unionSet[n2Index].push(n2)
      }
      else {
        unionSet.push([n1, n2])
      }
      unionLineSet.push([n1, n2])
    }
  },
  findConnect(n1: number, n2: number) {
    for (const item of unionSet) {
      if (item.length < 2)
        continue
      if (item.includes(n1) && item.includes(n2))
        return true
    }

    return false
  },
}

```

TODO: 看看 union-find库