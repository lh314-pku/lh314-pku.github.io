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

**平移矩阵(Translation)** 是一个$4\times4$的矩阵，有三个自由度：$T=\begin{bmatrix}I_{3\times3}&t_{3\times1}\\0&1\end{bmatrix}$，其中$t_{3\times1}=[t_x,t_y,t_z]^T$为平移向量，即相机中心在世界坐标系中的位置。

**旋转矩阵(Rotation)** 也是$4\times4$矩阵，存在3个自由度：$R=\begin{bmatrix}R_{3\times3}&0\\0&1\end{bmatrix}$，表示x、y、z三个坐标轴的旋转情况；

平移和旋转操作可以同时进行，即**刚体变换矩阵(Rigid transformation)**：$M=\begin{bmatrix}R_{3\times3}&t_{3\times1}\\0&1\end{bmatrix}$，有6个自由度。

#### 2.相机内参（Intrinsic Camera Parameters）

相机内参的作用是将相机坐标系下的三维点投影到成像平面的二维点。我们设相机坐标系下的点$P=(x_c,y_c,z_c)$，像平面坐标$(x_s,y_x)$，焦距(Focal Length)为$f$，由投影关系知：$\frac{x_s}{f}=\frac{x_c}{z_c}$，既有如下矩阵：$\begin{bmatrix}f&0&c_x\\0&f&c_y\\0&0&1\end{bmatrix}\begin{bmatrix}1&0&0&0\\0&1&0&0\\0&0&\textcolor{red}1&0\end{bmatrix}$，前者称为内参矩阵，利用二维齐次坐标进行缩放和平移操作，$c_x,c_y$称为**主点(principal point)**，表示图像平面中光轴的偏移；后者称为投影矩阵，当右下角的“1”有两种情况：

- **透视投影 (Perspective Projection)**：焦距$f$和$z_c$不为 0，近大远小。常用于实际摄像机。

- **正交投影 (Orthographic Projection)**：视场平行，焦距趋近无穷大，物体大小与深度无关（对应右下角矩阵中的 0 部分）。

#### 3.Summary

投影公式：$\Pi=\begin{bmatrix}f&s&c_x\\0&\alpha f&c_y\\0&0&1\end{bmatrix}\begin{bmatrix}1&0&0&0\\0&1&0&0\\0&0&1&0\end{bmatrix}\begin{bmatrix}R_{3\times3}&0\\0&1\end{bmatrix}\begin{bmatrix}I_{3\times3}&t_{3\times1}\\0&1\end{bmatrix}$

- **f：焦距 (focal length)**。

- **s：像素间的倾斜参数 (skew)**，通常为 0，除非像素形状非矩形（如平行四边形）。

- **(cx​,cy​)：主点 (principal point)**，图像光轴和图像平面的交点，默认是图像中心。

- **α：像素的长宽比 (aspect ratio)**，通常为 1（除非像素不是正方形）。

### 投影

### 消失点

## Lens镜头

如果针孔过大，那么会导致许多方向的光线被平均，从而使图像变得模糊；如果针孔过小，衍射效应会变得明显，也会使图像变得模糊。

通常，针孔相机拍摄的图像是暗的，因为只有来自场景中特定点的一小部分光线能够到达图像平面。而且针孔相机的速度较慢，因为在单位时间内，只有非常少量的光从场景中特定点到达图像平面。我们需要可以允许大光圈和清晰的图像的镜头。

镜头的作用是捕捉更多光线，同时尽可能保持理想小孔相机的抽象特性。

## Depth of Field景深

## Field of View视角

## Distortion畸变

## Colors色彩
