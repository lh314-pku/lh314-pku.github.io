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

# Feature Detection特征检测

## Edge Detection边缘检测

图像边缘通常携带了大部分的语义和形状信息，边界检测是任务就是识别图像中的突变/不连续性（表面、深度、颜色、光照）

### 图像的偏导数(Partial Derivatives)

图像是一个2D函数$f(x,y)$，在离散条件下并不适用极限定义下的导数，而是采用差分：

**前向差分**：

$$
\frac{\partial f(x, y)}{\partial x} \approx \frac{f(x + 1, y) - f(x, y)}{1}
$$

**中心差分**：

$$
\frac{\partial f(x, y)}{\partial x} \approx \frac{f(x + 1, y) - f(x - 1, y)}{2}
$$

由于是近似的线性映射，所以图像的偏导数可以通过图像滤波来计算：

| 微分矩阵    | 水平                                                    | 垂直                                                   |
| ------- | ----------------------------------------------------- | ---------------------------------------------------- |
| Prewitt | $\begin{bmatrix}-1&0&1\\ -1&0&1\\-1&0&1\end{bmatrix}$ | $\begin{bmatrix}1&1&1\\0&0&0\\-1&-1&-1\end{bmatrix}$ |
| Sobel   | $\begin{bmatrix}-1&0&1\\-2&0&2\\-1&0&1\end{bmatrix}$  | $\begin{bmatrix}1&2&1\\0&0&0\\-1&-2&-1\end{bmatrix}$ |

但是噪声对图像影响严重，方差几乎翻倍。所以在求导前还需要对图像进行预处理。

与其使用f与高斯函数卷积后求导，可以直接让原图像与高斯导数滤波以加速。

使用**高斯导数(Gaussian Derivative)** 后，确实去除了噪声，但是图像边缘也被模糊了。

### 图像梯度(Gradient)

$$
\nabla f = \begin{bmatrix} \frac{\partial f}{\partial x}, \frac{\partial f}{\partial y} \end{bmatrix}
$$

梯度指向强度最快增加的方向，方向由$\theta=\tan^{-1}{(\frac{\partial f}{\partial x}/\frac{\partial f}{\partial y})}$给出，而大小由$\|\nabla f\| = \sqrt{\left(\frac{\partial f}{\partial x}\right)^2 + \left(\frac{\partial f}{\partial y}\right)^2}$给出。

### Canny边缘检测器

1. **预处理Preprocessing**：灰度转换 + 高斯模糊；

2. 使用**中心差分法**计算梯度图像（而不是向前差分法），这样更准确；

3. **计算梯度大小**。
   索贝尔边缘检测器通过阈值化梯度大小来获得边缘。但阈值是脆弱的，并且很难选择合适的阈值。

4. **Non-Maximum Suppression非极大抑制**：

## Corner Detection拐点检测

确定位置时，除了边缘，我们还可以依靠拐角来进一步确定位置。

### Harris角点检测器

一个角可以检测为两个或多个边的交点，关键思想在于通过在移动一个小的局部窗口时测量（边缘方向）变化强度来表征角点。

## Blobs

## SIFT Feature

---

高效制备亚铁离子（作者整活）：

$$
(Fe^{3+})'=3(Fe^{2+})
$$
