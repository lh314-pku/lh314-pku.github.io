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

# Structure from Motion（SfM三维重建）

双目视觉：输入一对照片，相机参数已知（已校准），输出一个密集深度图。

Review：

- [校准](https://lh314-pku.github.io/notes/CV/Lecture06#camera-calibration标定)：通过已知的3D点和2D点映射关系，计算相机参数；

- [三角测量](https://lh314-pku.github.io/notes/CV/Lecture06#triangultion三角测量)：使用多个视角的相机（已校准）以及图像点对，通过几何关系恢复三维点。

- SFM：一种更复杂、更通用的方法，目标是同时恢复**三维点（3D points）** 和**相机参数（Camera parameters）**，不依赖已知的三维点。

**SFM的目的**是通过匹配的二维点对，即多个视角下的图像点匹配关系，直接恢复三维空间结构，同时得到每个视角的相机内参和外参。

假设我们输入 m 张图像，其中有 n 个固定的 3D 点的投影（假设n个点均可见，不考虑遮挡问题），第 i 张图像上的第 j 个点用 $x_{ij}$ 表示，有：

$$
x_{ij}\cong P_iX_j(i=1,\dots,m;j=1,\dots,n)
$$

输出则是从这 $mn$ 个2D 点求解的 **m 个投影矩阵和 n 个恢复后的 3D 点**。

显然，SFM算法没有唯一解。（例如[纳克方块NeckerCube](https://baike.baidu.com/item/纳克方块/10752116)）也就是说，SFM算法具有 **Ambiguity模糊性**。

### 尺度模糊性Scale Ambiguity

在 SfM 中，恢复的三维场景和相机参数存在比例因子的模糊性。例如，我们同时放缩三维点和投影矩阵：

$$
x\cong PX=(\frac{1}{k}P)(kX)
$$

图像投影结果不会改变，但三维点改变了。也就是说，没有参考测量的情况下，我们无法恢复场景的绝对尺度。

### 投影模糊性Projective Ambiguity

进一步推广，我们称之为投影模糊性，例如我们对三维点和投影矩阵做**任意线性变换**及其逆变换：

$$
x\cong PX=(PQ^{-1})(QX)
$$

此处 $Q$ 可以是任意的满秩 4 阶矩阵，图像投影结果不变，但如果没有对相机标定或场景的约束，重建结果只能到达一个投影模糊的程度。

### 仿射模糊性Affine Ambiguity

在前者的条件下，我们引入一部分约束：**平行约束（Parallelism Constraints）**，其假设了场景中点的平行性，将重建的结果限制到一个仿射变换的程度。

将上述满秩 4 阶矩阵 $Q$ 约束为仿射变换 $Q_A$，在保证图像投影结果不变的情况下：

$$
x\cong PX=(PQ_A^{-1})(Q_AX)
$$

仿射变换矩阵是一种特殊的线性变换，它可以表示为：

$$
Q_A=\begin{bmatrix}
A&t\\0&1
\end{bmatrix}
$$

其中，A是一个 3x3 的满秩矩阵（指示旋转、缩放、剪切等），t是一个 3x1 的平移向量。零向量保证齐次坐标的形式。

平行约束是一种弱约束，仿射变换保留了**点之间的平行性**，但可能会改变比例和角度。但这有利于减少模糊性。

### 相似模糊性Similarity Ambiguity

相似模糊性是我们进一步引入**正交约束（Orthogonality Constraints）**，即让相机的内参矩阵或场景满足正交性条件。这种约束可以将投影模糊性或仿射模糊性进一步约束到相似性变换，即**比例、旋转、平移**。

将上述矩阵 $Q$ 约束为相似变换矩阵 $Q_S$，即：

$$
Q_S=\begin{bmatrix}
sR&t\\0&1
\end{bmatrix}
$$

其中：

- s：比例因子，表示场景的整体缩放。

- t：平移向量，表示场景的平移。

- R：3阶满秩旋转矩阵，表示场景的旋转。

相似性变换保留了点与点之间的比例、角度和平行关系。其对相机的投影矩阵或场景的几何结构施加正交性假设，例如 R 是正交矩阵等。

其将结果限制在一个**相似性结构**中，保留了点之间的**比例、角度和方向**，但绝对的**尺寸**依然不确定。

## Affine Structure from Motion

在 SFM 中，我们用仿射相机/弱透视相机（affine or weak perspective caremas）模型来简化计算。

**弱透视相机（weak perspective caremas）**：在物体距离相机较远或焦距较长等情况下，透视效果可简化为弱透视模型，物体的投影看起来大小基本一致，深度信息被弱化。其透视效果可以近似为**正交投影（Orthographic Projection）**。

### 正交投影

正交投影保持物体的比例关系，但不反映深度信息，其矩阵形式为：

$$
\begin{pmatrix}
x'\\y'\\1
\end{pmatrix}=
\begin{bmatrix}
1&0&0&0\\0&1&0&0\\0&0&0&1
\end{bmatrix}
\begin{pmatrix}
x\\y\\z\\1
\end{pmatrix}
$$

正交矩阵可以极大的简化计算，使得仿射结构恢复更容易。（相当于忽略深度信息）

### Affine Carema

基于正交投影，将仿射相机的投影矩阵P表示为：

$$
P=\begin{bmatrix}
K_{2D}&t_{2D}\\0&1
\end{bmatrix}
\begin{bmatrix}
1&0&0&0\\0&1&0&0\\0&0&0&1
\end{bmatrix}
\begin{bmatrix}
R_{3D}&t_{3D}\\0&1
\end{bmatrix}
$$

其中前后均为 2D/3D 中的仿射变换矩阵，中间为 3x4 的正交投影矩阵。将其化简，得到：

$$
P=\begin{bmatrix}
a_{11}&a_{12}&a_{13}&t_1\\
a_{21}&a_{22}&a_{23}&t_2\\
0&0&0&1
\end{bmatrix}=\begin{bmatrix}
A_{2\times3}&t\\0&1
\end{bmatrix}
$$

在笛卡尔坐标系（非齐次坐标）下，表示为：

$$
\begin{pmatrix}
x\\y
\end{pmatrix}=
\begin{bmatrix}
a_{11}&a_{12}&a_{13}\\
a_{21}&a_{22}&a_{23}
\end{bmatrix}
\begin{pmatrix}
X\\Y\\Z
\end{pmatrix}+
\begin{pmatrix}
t_1\\t_2\end{pmatrix}=AX+t
$$

其中 t 就对应着世界坐标系原点在图像中的坐标。

### Affine SFM

在仿射结构恢复中，有关系（变换自 $x_{ij}=P_iX_j$）：

$$
x_{ij}=A_iX_j+t_i,i=1,...,m;j=1,...,n
$$

则 SFM 问题变换为：通过 mn 给点的信息估计 $A_i$、$t_i$ 和 $X_j$。

三维重建结果定义在一个仿射变换 Q 的约束下，该仿射变换具有 12 个自由度，意味着最终的三维结构恢复结果可以任意地进行仿射变换。

考虑信息：对于已知的 m 个图像和每张图像 n 个点，有一共 2mn 的已知量；而需要求解的未知量有 $(6m+2m+3n)=8m+3n$ 个，同时考虑 Q 引入的12个自由度的不确定性，想要求解，就需要：

$$
2mn\ge 8m+3n-12
$$

（例如对于两台相机，就需要至少4个点）

为了简化方程，我们将图像 $i$ 的中心调整为所有点的中心（归一化）：

$$
\begin{align}
\hat{x}_{ij}=&x_{ij}-\frac{1}{n}\sum_{k=1}^nx_{ik}\\
=&A_iX_j=t_i-\frac{1}{n}\sum_{k=1}^n(A_iX_k+t_i)\\
=&A_i(X_j-\frac{1}{n}\sum_{k=1}^nX_k)\\
=&A_i\hat{X}_j
\end{align}
$$

我们不妨将三维点的中心设为世界坐标系的原点，则 $\hat{X}_j=X_j$，此时：

$$
\hat{x}_{ij}=A_iX_j
$$

将所有上述形式的方程合并为矩阵：

$$
\begin{bmatrix}
\hat{x}_{11} & \hat{x}_{12} & \cdots & \hat{x}_{1n} \\
\hat{x}_{21} & \hat{x}_{22} & \cdots & \hat{x}_{2n} \\
\vdots & \vdots & \ddots & \vdots \\
\hat{x}_{m1} & \hat{x}_{m2} & \cdots & \hat{x}_{mn}
\end{bmatrix}
=
\begin{bmatrix}
A_1 \\
A_2 \\
\vdots \\
A_m
\end{bmatrix}
\begin{bmatrix}
X_1 & X_2 & \cdots & X_n
\end{bmatrix}

$$

即：$D_{2m\times n}=M_{2m\times 3}S_{3\times n}$。

由于 $\hat{x}_{ij}$ 是2D向量，所以是 2m 列。矩阵 D 的秩最多为 3，因为仿射变换的本质是从三维空间到二维空间的线性映射。

> 或者说也可以活用线性代数：
> 
> $rank(D)\le\min(rank(M), rank(S))$
> 
> 显然M和S的秩都不超过3，所以D最多是一个秩3的矩阵。

我们对矩阵 D 做奇异值分解（即SVD分解）：$D=U\Sigma V^t$，

- $U$：左奇异向量矩阵，列向量是 $DD^T$ 的特征向量。

- $\Sigma$：对角矩阵，对角线上的元素是奇异值，表示矩阵的能量分布。

- $V$：右奇异向量矩阵，列向量是 $D^TD$ 的特征向量。

由于$rank(D)\le 3$，我们取出前 3 行/列，其余均设置为0：

![](https://lh314-pku.github.io/notes/CV/images/SVD.png)

那么$M$和$S$就是：

$$
M=U_3\Sigma_3^{\frac{1}{2}},S=\Sigma_3^{\frac{1}{2}}V_3^T
$$

其中：$\Sigma_3^{\frac{1}{2}}$ 是对角矩阵，对角线上是原矩阵对角线上奇异值的平方根。因此，通过低秩近似，我们可以仅保留前三个奇异值，忽略高阶噪声，简化计算。

但是依然存在问题。因为$D=MS$的分解并不唯一，仍然存在**仿射模糊性**。

> 其实就是类似这个过程：
> 
> $$
> D=MS=(MQ)(Q^{-1}S)
> $$

我们还需要更强的约束条件：令所有的相机矩阵 $A_iQ$ 满足**正交投影矩阵的性质**：不相同两行向量正交，行向量模为1（其实$A_i$只有两行……）。写为矩阵形式就是：

$$
(A_iQ)(A_iQ)^T=A_i(QQ^T)A_i^T=I_{2\times 2},i=1,\dots,m
$$

不妨令 $N=QQ^T$，则有 $A_iNA_i^T=I$，将问题转化为求解矩阵 N 的约束。这是一个非线性约束问题，但通过适当的数学方法可以求解。

- 通过最小二乘法（即假设N为对称阵，展开后重整为非齐次线性方程组的矩阵形式，通过最小二乘法求解），求解 N 满足上述约束；

- N 是一个对称正定矩阵，通过 Cholesky 分解得到 Q；

- 更新：$M\leftarrow MQ$，$S\leftarrow Q^{-1}S$

---

剩余部分可以参考[思源笔记](https://lihua5487.github.io/Notes/CV/8%20Structure%20from%20Motion)
