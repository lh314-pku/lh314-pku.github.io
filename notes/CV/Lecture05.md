# Image Stitching图像拼接

## Panorama全景

提取特征 -> 特征匹配 -> 解决变换 -> 混合图像

## Solve Transformations变换

- Filtering滤波：改变图像的范围（值域）
  $g(x)=\textcolor{red}{T(}f(x)\textcolor{red}{)}$

- Warping扭曲：改变图像的区域Domain（定义域）
  $g(x)=f(\textcolor{red}{T(}x\textcolor{red}{)})$

T 对所有点都是相同的，并且不依赖于图像内容；p 和 p' 是二维像素坐标。

（Translation、Rotation、Aspect、Affine、Perspective、Cylindrical）

### 1.齐次坐标(Homogeneous Coordinates)变换

齐次坐标：

$$
(x,y)\Rightarrow\begin{bmatrix}
x\\y\\1\end{bmatrix},
\begin{bmatrix}
x\\y\\w\end{bmatrix}\Rightarrow(x/w,y/w)
$$

线性变换加平移（有 6 个自由度）：

$$
\begin{bmatrix}
x'\\y'\\1\end{bmatrix}\equiv\begin{bmatrix}
a&b&c\\d&e&f\\0&0&1\end{bmatrix}\begin{bmatrix}
x\\y\\1\end{bmatrix}
\equiv T\begin{bmatrix}
x\\y\\1\end{bmatrix}
$$

我们得到没有齐次坐标的以下变换：

$$
x'=Ax+b
$$

我们就可以做相应的变换：平移、拉伸、二维平面内旋转、剪切等

![image](https://lh314-pku.github.io/notes/CV/images/transformation.png)

我们将前后两个图片上的对应点联立，可以有：

$$
\begin{bmatrix} 
x_i' \\ 
y_i'
\end{bmatrix} 
= 
\begin{bmatrix} 
a & b \\ 
d & e
\end{bmatrix}
\begin{bmatrix} 
x_i \\ 
y_i
\end{bmatrix} 
+ 
\begin{bmatrix} 
c \\ 
f
\end{bmatrix}

$$

我们考虑应该如何求解 abcdef 这六个变量？将上述方程转化为更大的稀疏矩阵：

$$
\begin{bmatrix}
x_i' \\
y_i' \\
\vdots
\end{bmatrix}
=
\begin{bmatrix}
x_i & y_i & 0 & 0 & 1 & 0 \\
0 & 0 & x_i & y_i & 0 & 1 \\
\vdots & \vdots & \vdots & \vdots & \vdots & \vdots
\end{bmatrix}
\begin{bmatrix}
a \\
b \\
d \\
e \\
c \\
f
\end{bmatrix}
$$

即：$\mathbf{b}_{2n \times 1} = \mathbf{A}_{2n \times 6} \mathbf{t}_{6 \times 1}$。我们发现每一对对应点可以得到两个方程，那么只需要3个不共线的点就可以求解上述线性方程组。

但是在现实中，我们可以找到很多组点对，他们求解的结果可能会出现误差。于是我们考虑最小二乘法，通过最小化能量来求全局最优解：

$$
E = \|A t - b\|_2^2 = t^T A^T A t - 2 t^T A^T b + b^T b
$$

E 是一个二次函数，为了求解最小值（广义解），我们对其求导并令其导数为 0（显然$A^TA$是一个满秩矩阵）：

$$
A^T A t = A^T b,t = (A^T A)^{-1} A^T b
$$

但是进行图像拼接时，两张图片往往只有一部分可以对应，这不是一个仿射变换。所以我们将上述的$3\times3$矩阵$T$的最后一行替换为另外三个参数：$[g,h,i]$。就得到了：**Homography单应矩阵**。

### Homography



## Feature Matching特征匹配

## Image Blending图像混合
