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

# Camera Calibration相机校准/标定

## 3D Vision

3D视觉的目标是从图像中重建3D结构。而主要的问题出现在单视角下的歧义性/模糊性：我们不知道前后关系。

解决方法？

- **光学辅助**：利用光源发射器（如激光、结构光等）从传感器射出光线来捕获场景信息。

- **立体视觉（Stereo）**：使用 **两台经过校准的摄像头** 从不同视角观察同一场景，通过分析两张图像（通过对应关系找到匹配的点），恢复出景物的深度。（类似于人的双目视觉）

- **多视图几何（Multi-view Geometry）**：让摄像机移动，拍摄多个图像，并通过图像之间的对应关系推算出场景深度和结构。（需要旋转矩阵和平移矩阵）

- **从阴影中获取形状（Shape from Shading）**：固定摄像机位置，在不同光线条件下拍摄多张照片，通过图像亮度信息的变化推测场景的几何特征，重建出类似地形或物体表面的 3D 几何形状。

- **数据学习**：训练神经网络，让深度学习从大规模数据中推测出适合的 3D 信息。

## Camera Calibration标定

相机参数（复习 -> [Lecture01&02](https://lh314-pku.github.io/notes/CV/Lecture01&02)）

$$
\Pi = 
\begin{bmatrix}
f & s & c_x \\
0 & \alpha f & c_y \\
0 & 0 & 1
\end{bmatrix}
\begin{bmatrix}
1 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0
\end{bmatrix}
\begin{bmatrix}
\mathbf{R}_{3 \times 3} & \mathbf{0}_{3 \times 1} \\
\mathbf{0}_{1 \times 3} & 1
\end{bmatrix}
\begin{bmatrix}
\mathbf{I}_{3 \times 3} & \mathbf{T}_{3 \times 1} \\
\mathbf{0}_{1 \times 3} & 1
\end{bmatrix}


$$

即得：$x\cong K[R,t]X$：

$$
\begin{pmatrix}
x \\
y \\
1
\end{pmatrix}
\cong
\begin{bmatrix}
p_{11} & p_{12} & p_{13} & p_{14} \\
p_{21} & p_{22} & p_{23} & p_{24} \\
p_{31} & p_{32} & p_{33} & p_{34}
\end{bmatrix}
\begin{pmatrix}
X \\
Y \\
Z \\
1
\end{pmatrix}


$$

于是我们有一个思路：用三维空间内已知坐标的点，能不能标定一个相机的参数？对于点对$[x_i,y_i]$和$[X_i,Y_i,Z_i]$，有：

$$
x_i = \frac{p_{11}X_i + p_{12}Y_i + p_{13}Z_i + p_{14}}{p_{31}X_i + p_{32}Y_i + p_{33}Z_i + p_{34}}


$$

$$
y_i = \frac{p_{21}X_i + p_{22}Y_i + p_{23}Z_i + p_{24}}{p_{31}X_i + p_{32}Y_i + p_{33}Z_i + p_{34}}
$$

参考上一章计算单应矩阵的过程，我们可以将其写成齐次线性方程组：

$$
A_{2n\times 12}P_{12}=0_{2n}
$$

我们需要6对不共线的点来计算矩阵$P$。而更加一般的，我们考虑能量函数：

$$
E = \|Ap\|^2 + \lambda (\|p\|^2 - 1) = p^T A^T A p + \lambda p^T p - \lambda
$$

经过一系列操作，我们发现：$p$是矩阵$A^TA$最小特征值的特征向量。

但是许多问题产生了，我们得到了矩阵$P$，但是不能得到具体的参数$K[R,t]$。观察发现：矩阵$K$是一个上三角矩阵，$R$是一个正交矩阵。我们就可以考虑对矩阵$P$做**RQ分解**。

> **QR分解**与**RQ分解**：
> 
> QR分解是将矩阵A分解为正交矩阵Q和上三角矩阵R：
> 
> $$
> A=QR
> $$
> 
> 其原理是施密特正交化：计算A的列向量的正交化矩阵Q，其系数作为矩阵R。
> 
> RQ分解实质上就是将列向量变为行向量进行正交化：
> 
> $$
> A=RQ
> $$

对于$3\times 4$矩阵 $P$，我们对其前3阶子矩阵做RQ分解，即得内参矩阵 $K$ 和旋转矩阵 $R$；而位移 $t$ 则是投影矩阵的最后一列（需要 $P$ 和 $K$ 参与计算）。

实际上，**非线性方法**可以有更好的结果：

> `proj`函数：标准化函数，$x' = x / z$, $ y' = y / z$ 

考虑如下误差函数：

$$
\sum_{i} \| \text{proj}(K[R \; t]X_i) - x_i \|^2_2
$$

用**测量的二维点**与**三维点投影的估计值**之间的平方之和作为误差，可以考虑到径向畸变等其他约束，适应更多的真实场景。我们用线性方法做初始化，令该误差函数最小化。

## Triangultion三角测量

三角测量的目标是：在已知相机矩阵的情况下，给定一个三维点在两张或多张图像中的投影，求该点的空间坐标。

一个朴素的想法是：链接两条相机中心->投影点的射线，使其交于一点，即三维点的空间坐标。但是由于噪声和数值误差的存在，这两条射线通常不会严格相交，这会导致交点的位置难以确定。

---

**#1 几何逼近Geometric Approach**

找到连接两条射线的最短线段，并将该线段的**中点**作为交点 $X$ 的估计位置。

只能说是一种合理的估计，简单直观，但并非最佳。

---

**#2 非线性逼近Nonlinear Approach**

最小化误差函数：

$$
\|proj(P_1\textcolor{red}X)-x_1\|_2^2+
\|proj(P_2\textcolor{red}X)-x_2\|_2^2
$$

（其实就是找一个点，使其投影与实际点偏离最少）

---

**#3 线性优化Linear Optimization**

> 矩阵叉积的矩阵乘法表示，其中 $\mathbf{a}=[a_1,a_2,a_3]$
> 
> $$
> \mathbf{a} \times \mathbf{b} = 
\begin{bmatrix}
0 & -a_3 & a_2 \\
a_3 & 0 & -a_1 \\
-a_2 & a_1 & 0
\end{bmatrix}
\begin{bmatrix}
b_1 \\
b_2 \\
b_3
\end{bmatrix} 
= [\mathbf{a}_\times] \mathbf{b}
> $$
> 
> 我们可以将矩阵的叉乘写为矩阵乘法的形式，方便我们计算，其中$[\mathbf{a}_\times]$是一个反对称矩阵。

考虑 $x_1\cong P_1X$，有 $x_1\times P_1X=0$，即 $[x_{1\times}]P_1X=0$。同理还有 $[x_{2\times}]P_2X=0$。

每台相机有两个方程式用于求解 $X$ 中的三个未知数，可使用**约束最小二乘法**求解。也就是说我们需要找到$AX=0$的非零解（在$\|X\|^2=1$的条件下）

参考前述的各种优化过程，最优解还是 $A^TA$ 的最小特征值的特征向量。（特征值分解）

## Calibration with Vanishing Points

（滚去复习消失点，传送门：[消失点](https://lh314-pku.github.io/notes/CV/Lecture01&02#消失点)）

有时候并不能获取图像中的点对应的世界坐标，比如给定一个已经拍摄好的照片，要计算拍摄时用的相机的参数，此时可以利用 vanishing point 计算

但是这种方法有局限性，即需要图片中可以找到三个正交的 vanishing 方向，并以此建立世界坐标系，那么对于投影矩阵 $P$，设（xyz方向上的）消失点 $p_1$，$p_2$，$p_3$，则有：

$$
\begin{bmatrix}
p_{11} & p_{12} & p_{13} & p_{14} \\
p_{21} & p_{22} & p_{23} & p_{24} \\
p_{31} & p_{32} & p_{33} & p_{34}
\end{bmatrix}
\begin{pmatrix}
1\\0\\0\\0
\end{pmatrix}=Pe_1=p_1
$$

以此类推还有$Pe_2=p_2$，$Pe_3=p_3$。至于$Pe_4=p_4$，它是世界坐标系原点在图像中的齐次坐标。

那么怎么求解矩阵$K$、$R$和$t$呢？我们有：

$$
p_i=Pe_i=K[R, t]e_i=KRe_i,i=1,2,3 \tag{1}
$$

那么就有（还是不得不提一嘴R是个正交矩阵）：

$$
e_i=R^TK^{-1}p_i
$$

> **正交矩阵**：若$AA^T=I$或$A^TA=I$，我们称$A$为正交矩阵。
> 
> $A$为正交矩阵可以推出$A$可逆且$A^{-1}=A^T$。

由相互正交性 $e_i^Te_j=0,i\ne j$：

$$
p_i^TK^{-T}RR^TK^{-1}p_j=p_i^TK^{-T}K^{-1}p_j=0\tag{2}
$$

由于 $K$ 上三角矩阵的特殊性，可得 $K^{-1}$ 和 $K^{-T}$ 的形式如下，其中$g=\frac{1}{f}$：

$$
K = 
\begin{bmatrix} 
f & 0 & c_x \\ 
0 & f & c_y \\ 
0 & 0 & 1 
\end{bmatrix}, \quad 
K^{-1} = 
\begin{bmatrix} 
g & 0 & -g c_x \\ 
0 & g & -g c_y \\ 
0 & 0 & 1 
\end{bmatrix}, \quad 
K^{-T} = 
\begin{bmatrix} 
g & 0 & 0 \\ 
0 & g & 0 \\ 
-g c_x & -g c_y & 1 
\end{bmatrix}

$$

令$p_i=(x_i,y_i,w_i)$带入方程$(2)$，有：

$$
\mathbf{v}_i^T K^{-T} K^{-1} \mathbf{v}_j =
g^2 \left( x_i x_j + y_i y_j \right) 
- g^2 c_x \left( w_i x_j + w_j x_i \right) \newline
- g^2 c_y \left( w_i y_j + w_j y_i \right) 
+ g^2 \left( c_x^2 + c_y^2 \right) w_i w_j 
+ w_i w_j = 0
\tag{3}
$$

求解上述**非线性**方程（组），至少需要2个有限消失点。

求解矩阵 $K$ 后，就可以通过方程$(1)$来求解矩阵 $R$。至于位移 $t$，可以通过$Pe_4 = Kt=p_4$来求解。

优点：不需要手动放置标定板并计算图像上的点对应的世界坐标，能够自动根据图片进行计算

缺点：需要特定角度拍摄，而且需要精确定位消失点。
