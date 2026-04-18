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

# Lecture02:递推方程

## 递推方程的求解

迭代法

- 直接迭代：插入排序最坏情况

- 换元迭代：二分归并排序最坏情况

- 差消迭代：快排平均情况的时间分析

迭代模型：递归树

尝试法：快排平均情况的时间分析

主定理：递归算法的分析

---

**汉诺塔**：$T(n)=2T(n-1)+1=2^2T(n-2)+2+1=...=2^n-1,T(1)=1$

**插入排序**：$W(n)=W(n-1)+n-1,W(1)=0$

$$
W(n)-W(1)=\sum_{k=0}^{n-1}k=\frac{n(n-1)}{2}=W(n)
$$

**二分归并**：$W(n)=2W(n/2)+n-1,W(1)=0$。令 $n=2^k$：

$$
\begin{aligned}
W(n)=&2W(2^{k-1})+2^k-1\\=&2^2W(2^{k-2})+2^k-2+2^k-1\\=&...\\=&k2^k-2^k+1\\=&n\log{n}-n+1
\end{aligned}
$$

**快速排序平均时间**（差消）：$T(n)=\frac{2}{n}\sum_{i=1}^{n-1}T(i)+O(n),T(1)=0$：

$$
\begin{aligned}
nT(n)=&2\sum_{i=1}^{n-1}T(i)+cn^2\\(n-1)T(n-1)=&2\sum_{i=1}^{n-2}T(i)+c(n-1)^2
\end{aligned}\\
$$

两式做差并移项：

$$
\Rightarrow nT(n)=(n+1)T(n-1)+O(n)
$$

两侧除以 $n(n+1)$：

$$
\frac{T(n)}{n+1}=\frac{T(n-1)}{n}+\frac{c_1}{n+1}=...=c_1[\frac{1}{n+1}+...+\frac{1}{3}]=\Theta(\log{n})
$$

即T(n)的复杂度为：

$$
T(n)=(n+1)\Theta(\log{n})\Rightarrow T(n)=\Theta(n\log{n})
$$

> 插入排序：插入排序通过逐步“构建有序序列”，将未排序的元素插入到已排序的部分中，以此达到排序的目的。例如初始时将第一个元素视为“已排序”，将后续元素插入有序部分。
> 
> 二分归并排序：通过将数组不断地分成更小的子数组，直到每个子数组只有一个元素（认为它已排序），然后通过归并操作将子数组重新合并为有序的大数组，最终完成排序。

**主定理**：设$a\ge0,b>1$为常数，$f(n)$为函数，$T(n)$非负，且：

$$
T(n)=aT(n/b)+f(n)
$$

则有：

1. 若$f(n)=O(n^{\log_b{a}-\epsilon}),\epsilon>0$，则$T(n)=\Theta(n^{\log_b{a}})$；

2. 若$f(n)=O(n^{\log_b{a}})$，则$T(n)=\Theta(n^{\log_b{a}}\log{n})$；

3. 若$f(n)=O(n^{\log_b{a}+\epsilon}),\epsilon>0$，且对于某个常数c<1和充分大的n，有$af(n/b)\le cf(n)$，则$T(n)=\Theta(f(n))$；
