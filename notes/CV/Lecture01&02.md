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

# Overview to CV

- 输入：对光的采样

- 输出：对3D空间的感知、分类、语义表达等

- 目标：将光转为意义

图像处理 + 3D重建 + 深度学习

Computer Vision is Hard。

# Lecture02 Image Formation图像形成

## Camera相机

直接使用数字传感器，所有场景点都对所有传感器像素有所贡献，导致像素模糊。于是，可以采用**针孔相机（Pinhole Camera）**

对于针孔相机，绝大多数的光线被挡住，只有一点可以透光，从而形成清晰的影像。

### 针孔相机的数学模型

小孔成像的数学模型可以考虑为在像平面的投影，即相似三角形。

#### 1.相机外参（Extrinsic Camera Parameters）

描述物体成像的时候，我们需要先将**世界坐标系(World coordinates)** 的坐标转为**相机坐标系(Camera coordinates)**，也就是说我们需要对坐标系进行平移和旋转。

设坐标$x = (x,y,x,w)=(x/w,y/w,z/w,1)$，化归为**齐次坐标(Homogeneous coordinates)**，方便平移和旋转的统一；

**平移矩阵(Translation)** 是一个$4\times4$的矩阵，有三个自由度：$T=\begin{bmatrix}I_{3\times3}&t_{3\times1}\\ 0&1\end{bmatrix}_{2\times2}$，其中$t_{3\times1}=[t_x,t_y,t_z]^T$为平移向量，即相机中心在世界坐标系中的位置。

**旋转矩阵(Rotation)** 也是$4\times4$矩阵，存在3个自由度：$R=\begin{bmatrix}R_{3\times3}&0\\ 0&1\end{bmatrix}_{2\times2}$，表示x、y、z三个坐标轴的旋转情况；

平移和旋转操作可以同时进行，即**刚体变换矩阵(Rigid transformation)**：$M=\begin{bmatrix}R_{3\times3}&t_{3\times1}\\ 0&1\end{bmatrix}_{2\times2}$，有6个自由度。

#### 2.相机内参（Intrinsic Camera Parameters）

相机内参的作用是将相机坐标系下的三维点投影到成像平面的二维点。我们设相机坐标系下的点$P=(x_c,y_c,z_c)$，像平面坐标$(x_s,y_x)$，焦距(Focal Length)为$f$，由投影关系知：$\frac{x_s}{f}=\frac{x_c}{z_c}$，既有如下矩阵：

$$
\begin{bmatrix}f&0&c_x\\0&f&c_y\\0&0&1\end{bmatrix}\begin{bmatrix}1&0&0&0\\0&1&0&0\\0&0&\textcolor{red}1&0\end{bmatrix}
$$

前者称为内参矩阵，利用二维齐次坐标进行缩放和平移操作，$c_x,c_y$称为**主点(principal point)**，表示图像平面中光轴的偏移；后者称为投影矩阵，当右下角的“1”有两种情况：

- **透视投影 (Perspective Projection)**：焦距$f$和$z_c$不为 0，近大远小。常用于实际摄像机。

- **正交投影 (Orthographic Projection)**：视场平行，焦距趋近无穷大，物体大小与深度无关（对应右下角矩阵中的 0 部分）。

#### 3.Summary

投影公式：

$$
\Pi=\begin{bmatrix}f&s&c_x\\ 0&\alpha f&c_y\\ 0&0&1\end{bmatrix}\begin{bmatrix}1&0&0&0\\ 0&1&0&0\\ 0&0&1&0\end{bmatrix}\begin{bmatrix}R_{3\times3}&0\\ 0&1\end{bmatrix}\begin{bmatrix}I_{3\times3}&t_{3\times1}\\ 0&1\end{bmatrix}
$$

- **f：焦距 (focal length)**。

- **s：像素间的倾斜参数 (skew)**，通常为 0，除非像素形状非矩形（如平行四边形）。

- **(cx​,cy​)：主点 (principal point)**，图像光轴和图像平面的交点，默认是图像中心。

- **α：像素的长宽比 (aspect ratio)**，通常为 1（除非像素不是正方形）。

### 投影

投影并不是一个线性变换，其性质是：点到点、线到线。

证明：对于三维空间的一条线$\pmb{X(t)}=\pmb{X_0}+t\pmb{d}$，其中$\pmb{X}(t)=(X(t),Y(t),Z(t),1)^T$为齐次坐标，设投影矩阵$P$：

$$
\pmb{P}=\begin{bmatrix}
p_{11}&p_{12}&p_{13}&p_{14}\\
p_{21}&p_{22}&p_{23}&p_{24}\\
p_{31}&p_{32}&p_{33}&p_{34}
\end{bmatrix}
$$

作用到直线上，得到：

$$
\pmb{x}(t)=\pmb{PX}_0+t\pmb{Pd}=\begin{bmatrix}
x_0+td_x'\\
y_0+td_y'\\
w_0+td_w'
\end{bmatrix}
$$

再次归一化后得到欧几里得坐标系：

$$
x(t)_{\text{euclidean}} = \frac{x_0 + t d_x}{w_0 + t d_w}, \quad 
y(t)_{\text{euclidean}} = \frac{y_0 + t d_y}{w_0 + t d_w}
$$

即得像平面上的一条直线：

$$
A x_{\text{euclidean}} + B y_{\text{euclidean}} + C = 0
$$

投影操作可能会扭曲原始形状，使得投影后角度不再保持。

### 消失点

一条直线可以用定点$\pmb{X}_0=(X_0,Y_0,Z_0,1)^T$和方向$\pmb{D}=(D_1,D_2,D_3)^T$表示：

$$
\mathbf{X}_t = 
\begin{pmatrix}
X_0 + tD_1 \\
Y_0 + tD_2 \\
Z_0 + tD_3 \\
1
\end{pmatrix}
\sim
\begin{pmatrix}
X_0 / t + D_1 \\
Y_0 / t + D_2 \\
Z_0 / t + D_3 \\
1 / t
\end{pmatrix}
$$

当 t 趋于无穷时，得到点$\pmb{X}_{\infin}=(D_1,D_2,D_3,1)^T$。将该点投影到平面上：

$$
\pmb{v}\sim PX_{\infin}
$$

即空间中所有方向相同的直线都会汇聚于同一消失点。(平行于屏幕的直线没有消失点)

## Lens镜头

如果针孔过大，那么会导致许多方向的光线被平均，从而使图像变得模糊；如果针孔过小，衍射效应会变得明显，也会使图像变得模糊。

通常，针孔相机拍摄的图像是暗的，因为只有来自场景中特定点的一小部分光线能够到达图像平面。而且针孔相机的速度较慢，因为在单位时间内，只有非常少量的光从场景中特定点到达图像平面。我们需要可以允许大光圈和清晰的图像的镜头。

镜头的作用是捕捉更多光线，同时尽可能保持理想小孔相机的抽象特性。

### 薄透镜公式(Thin Lens Equation)：

设$ y $ 是物体高度，$ y' $ 是成像高度，$ z $ 是物体距透镜的距离，$ z' $ 是成像距透镜的距离，则由相似三角形有：

$$
\frac{y}{y'}=\frac{z}{z'}
$$

而由于凸透镜焦点的特点，又有：

$$
\frac{y'}{f}=\frac{y + y'}{z}\\
\frac{y}{y'}=z(\frac{1}{f}-\frac{1}{z})
$$

两式合并即得**薄透镜公式**：

$$
\frac{1}{f}=\frac{1}{z}+\frac{1}{z'}
$$

即物距的倒数与像距的倒数之和等于焦距的倒数。

## Depth of Field景深(DoF)

在固定的焦距和成像平面下，有一个特定的距离，物体在该距离上是“清晰对焦”的。其他点被投影到图像中的“模糊圆”上。**景深(Depth Of Field)** 是图像中看起来清晰的最近和最远物体之间的距离。

影响景深的因素主要是**光圈(Aperture)** 大小，小光圈有大景深。

但是小光圈会减少光线量，就需要增加曝光，图像噪点更多。

## Field of View视场角/视界(FoV)

**视场角(Field of View)** 是指相机观察到的世界的角度范围。设$S_2$为传感器到镜头的距离，$d$为传感器尺寸，$\alpha$为视场角，则有：

$$
\tan{\frac{\alpha}{2}}=\frac{d/2}{S_2}
$$

## Distortion畸变

### 1.径向畸变(Radial Distortion)

径向畸变通常是镜头不完美导致的，尤其是在广角镜头中显著，分为正畸变和负畸变：

- **负径向畸变（Barrel Distortion）**：图像边缘向外扩展，类似桶状。

- **正径向畸变（Pincushion Distortion）**：图像边缘向内收缩，类似枕形。

$$
\hat{x}_c = x_c (1 + \kappa_1 r_c^2 + \kappa_2 r_c^4)\\
\hat{y}_c = y_c (1 + \kappa_1 r_c^2 + \kappa_2 r_c^4)\\
r_c^2 = x_c^2 + y_c^2
$$

其中$\kappa_1, \kappa_2$称为径向畸变量。越靠近图像中心，畸变较小；而越靠近图像边缘，畸变越严重。

矫正径向畸变，我们可以对标准投影矩阵变换进行优化：

首先是归一化到标准成像坐标：

$$
x_n=\frac{\hat{x}}{\hat{z}},y_n=\frac{\hat{y}}{\hat{z}}
$$

在此基础上应用径向畸变：

$$
x_d=x_n(1 + \kappa_1 r^2 + \kappa_2 r^4)\\
y_d=y_n(1 + \kappa_1 r^2 + \kappa_2 r^4)\\
r^2 = x_n^2+y_n^2
$$

最后通过相机内参映射回图像平面：

$$
x'=f_xx_d+x_c,y'=f_yy_d+y_c
$$

### 2.色差(Chromatic Aberration)

- 玻璃的折射率会随着波长的不同而略有变化。

- 简单的镜头会出现**色差**，即不同颜色的光会在略微不同的位置聚焦，这会导致图像模糊或出现颜色偏移。

- 为了减少色差和其他类型的像差，大多数摄影镜头由不同材质的玻璃元件（带有不同的涂层）组成的复合镜头构成。

### 3.渐晕(Vignetting)

- **渐晕（Vignetting）：** 图像亮度在边缘部分逐渐减弱的现象。

- **机械渐晕（Mechanical Vignetting）：** 被遮挡的部分光束永远无法到达图像传感器。

## Colors色彩(参考VCL)

### aa

$$
\begin{bmatrix}
1&0\\0&1
\end{bmatrix}_{2\times2}
$$
