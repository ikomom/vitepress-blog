# (6)select语句

标签（空格分隔）： MySQL

---

## 一.基本查询语句

```sql
SELECT 属性列表
     FROM表名和视图列表
     [WHERE条件表达式1]
     [GROUP BY 属性名1 [HAVING条件表达式2]]
     [ORDER BY 属性名2[ASC|DESC]]
```


## 二.单表查询

1.带IN关键字的查询
IN关键字可以判断某个字段是否在集合中

```sql
[NOT] IN (元素1，元素2，……，元素n)
```

2.BETWEEN AND范围查询

```sql
[NOT] BETWEEN 值1 AND 值2
```

3.Like字符串匹配查询

```sql
[NOT] LIKE '字符串'
```

- %：`b%k`表示b开头，k结尾的任意字符串
- _ :`b_k`中间只能插入一个数

4.查询空值：

```sql
IS [NOT] NULL
```

5.与或

```sql
条件1 AND 条件2[ …… 条件n-1 AND 条件n]
条件1 OR 条件2[ …… 条件n-1 AND ORn]
```
>AND与OR一起使用时，AND先运算

6.消除重复记录

```sql
SELECT DISTINCT 属性名 FROM 表名
```

7.对查询结果的排序

```sql
ORDER BY 属性名[ASC | DESE]
```

8.分组查询

```sql
[GROUP BY 属性名1 [HAVING条件表达式2]][WITH ROLLUP]
```

- [HAVING条件表达式2]：用来限制分组后的显示
- [WITH ROLLUP]：在所有记录后加上一条记录，值是所有记录的总和

分组查询还可以和许多函数一起使用：

- GROUP_CONCAT(属性)：每个分组的指定字段都显示出来
- 集合函数
 - COUNT(属性)：显示出记录数
 - SUM()、MAX()、MIN()、AVG()

9.用LIMIT限制查询结果数量，不指定初始位置就从第一条开始

```sql
LIMIT 记录数
LIMIT 初始位置，记录数
```


​    
## 三.连接查询
将两个或两个以上的表按照某个条件连接起来，从中选取需要的数据
**1.内连接查询**：最常用的连接查询。当两个表中拥有**相同意义的字段**时，可以通过这个字段来连接两个表；**字段值相等**时就可以查出这条记录
>可以指父表的主键和子表的外键

```sql
 select a.*, b.* from a, b wherea.xid=b.xid
```

**2.外连接查询**：字段不相等的记录也可以查询出来


```sql
 SELECT 属性名列表 
 FROM 表名1 LEFT|RIGHT JOIN 表名2
     ON 表名1.属性1＝表名2.属性2；
```


- LEFT JOIN：左表全记录，右表符合条件的显示，不存在的显示null
- RIGHT JOIN：右表全记录，左表符合条件的显示，不存在的显示null

   
## 四.复合条件连接查询

在连接查询后面加上



