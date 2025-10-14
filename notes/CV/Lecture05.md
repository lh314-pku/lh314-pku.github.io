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

## Feature Matching特征匹配

## Image Blending图像混合
