<head>
   <script>
  MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']]
    }
  };
</script>
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" async></script>
</head>

</head>

# Lecture04:动态规划（DP）

## 4.1 基本思想与使用条件

以多起点/多终点为例，暴力解法就是穷举所有的路径，时间复杂度 $O(m2^n)$。

使用动态规划方法，从终点回推：先以终点前的一层为起点，记录各节点到达终点的方式和代价；之后依次向前递推。最终就可以得到最小代价及其序列。时间复杂度 $O(mn)$。

动态规划（Dynamic Programming）的基本思想是：任何最短路径的子路径都是相对于子路径的始
点和终点的最短路径，即符合优化思路：子问题的最优解构成完整问题的最优解。（即优化原则/最优子结构原则）

不满足优化原则的问题是无法使用 DP 的。

## 4.2 设计要素

以矩阵链乘法为例：设 $A_1,A_2,...A_n$ 为矩阵序列，输入向量 $P=<P_0,P_1,...P_n>$ 为其尺寸，即 $A_i$ 是 $P_{i-1}\times P_i$ 大小的矩阵。我们需要找到一种乘法顺序，使得进行基本运算的次数最小？

在暴力解法下，这是一个 n 个元素的乘法序列，向其中加入 n 对括号的方法有 Catalan 种，即 $\frac{1}{n+1}C_{2n}^n$；利用 Stiring 公式，其时间复杂度为：$\Omega(2^{2n}/n^{\frac{3}{2}})$，是指数级别。

### 4.2.1 子问题划分&递推方程

考虑**动态规划**：我们用 $A_{i...j}$ 定义 $A_i...A_j$ 的子问题，$m[i,j]$ 表示所需的最少运算次数，则子问题 $A_{i...j}$ 的计算依赖于 $A_{i...k}$ 和 $A_{k...j}$ 的计算结果；换句话说，$m[i,j]$ 的结果依赖于 $m[i,k]$ 和 $m[k,j]$。可以定义如下**转移方程**：

$$
m[i,j]=\begin{cases}
0&i=j\\
\min_{i\le k<j}\{m[i,k]+m[k,j]+P_{i-1}P_kP_j\}&i<j
\end{cases}
$$

### 4.2.2 递归实现

我们用表 $s[i,j]$ 记录 $m[i,j]$ 最小时的划分位置：

```python
RecurMatrixChain(P,i,j):
# input: 向量P，问题范围i，j
# output:最小乘法次数 m[i,j] 和最后一次运算的位置 s[i,j]
if i == j
    then m[i,j] = 0; s[i,j] = i; return m[i,j]
m[i,j] = +inf, s[i,j] = i
for k from i to j-1:
    q = RecurMatrixChain(P,i,k) + RecurMatrixChain(P,k+1,j)
        +P[i-1]*P[k]*P[j]
    if q < m[i,j]
        then m[i,j] = q, s[i,j] = k
return m[i,j]
```

考虑输入规模为 $n$ 的矩阵链，算法执行 `for` 循环，对两个子问题进行求解，规模分别为 $k$ 和 $n-k$，其余工作均为常数时间：

$$
T(n)\ge\Theta(n)+\sum_{k=1}^{n-1} (T(k)+T(n-k))=
\Theta(n)+2\sum_{k=1}^{n-1} (T(k))
$$

经过证明，$T(n)=\Omega(2^{n-1})$，还是没有得到多项式级别的优秀算法。其时间复杂度高的原因在于：同一重复的子问题在反复被调用。

### 4.2.3 迭代实现

idea：

1. 开辟新的存储空间“备忘录”，存储子问题的优化函数值和划分边界

2. 自底向上计算子问题。

```python
MatrixChain(P, n):
    # input 向量 P
    # output m, s
    # 设置 m[i,j]全0，s[i,j]为i
    for r from 2 to n:              # r 表示问题规模，r=1在初始化时已经完成
        for i from 1 to n-r+1:
            j = i+r-1               # i,j分别为问题的前后边界
            m[i,j] = m[i+1,j] + P[i-1]*P[i]*P[j]
            s[i,j] = i
            for k from i+1 to j-1:  # 遍历所有可能的划分
                t = m[i,k] + m[k+1,j] + P[i-1]*P[k]*P[j]
                if t < m[i,j]
                    m[i,j] = t, s[i,j] = k
```

在这样的方法下，算法内只有三次循环，时间复杂度为 $W(n)=O(n^3)$，有了明显改进。

## 4.3 应用

### 4.3.1 投资问题

### 4.3.2 背包问题

### 4.3.3 最长公共子序列 LCS

### 4.3.4 图像压缩

### 4.3.5 最大子段和

### 4.3.6 最优二分检索树

### 4.3.7 生物信息学
