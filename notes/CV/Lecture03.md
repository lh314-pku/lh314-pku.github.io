# Image Processing图像处理

## Image Processing图像处理

一张图片就是一个二维函数$I(x, y)\in[0,255]\in\mathbb{Z}$，$(x,y)\in([1,width],[1,height])$，有颜色图则是$I(x, y,c)$。（注：左上角为原点，上x左y。）

### 1.像素/点处理

| 处理              | 函数                          |
| --------------- | --------------------------- |
| 原样              | $I(x,y)$                    |
| 暗化darken        | $I(x,y)-128$                |
| 亮化lighten       | $I(x,y)+128$                |
| 低对比low contrast | $I(x,y)/2$                  |
| 反相invert        | $255-I(x,y)$                |
| 灰度图gray         | $dot([0.3,0.6,0.1],I(x,y))$ |

我们可以将图像像素处理总结为：

$$
g(x)=a(x)f(x)+b(x)
$$

其中$f(x)$是处理前的像素，$a(x)$调整像素的对比度，$b(x)$调整像素的明暗程度。

### 2.Histogram Equalization直方图均衡化

首先将原图像的直方图（纵轴数量，横轴亮度/像素值）绘制出来，可以发现不同位置颜色和亮度分布非常不均匀。

首先我们计算像素（在不同亮度下）的累积分布，除以总数后得到**概率密度的累积分布图**；再映射到[0, 255]，就得到了原图像像素值到新像素值的映射，也就实现了直方图均衡化。

直方图均衡化通过对图像的亮度值进行转化，使像素值按更均匀的分布排列，凸显更多的细节。（其实就是按排名分布像素值）

- 数学原理？**随机数生成(Random Number Generator)**！

先考虑一个**均匀分布(Uniform distribution)** 的随机数生成器$U$：

$$
U_n=(aU_{n-1}+c)\mod{m}
$$

这是一个**线性同余生成器**，$a$、$c$、$m$均为质数，用于生成伪随机数。为了让生成的随机变量$X$能够服从某种分布，我们需要$X$的**累积分布函数CDF**：$F(X)$，则有：

$$
X=F^{-1}(U)
$$

将均匀分布$U$转化为随机变量$X$。

- 证明：

$$
P(X < x)=P(F^{-1}(U) < X)=P(U<F(x))=F(x)
$$

直方图均衡化也使用了类似的逆变换原理。它将原始图像的灰度值当作随机变量，通过其累积分布函数（CDF）对其进行均衡化，使得输出灰度值更加均匀。

这种方法可以实现任意两种发布的互相转化。

## Image Filter图像滤波（线性）

像素/点操作可以看作 1x1 的滤波。

- 图像$I(i,j)$：$w\times h$的数字图像；

- $h(u,v)$：$m\times n$的**滤波器(filter)** or **滤波核\卷积核(Kernel)**

- 假设m、n均为奇数，p、q为m/2和n/2向下取整；

$$
I(i, j) = \sum_{k=-p}^{p} \sum_{l=q}^{-q} I(i + k, j + l) \cdot h(k, l)
$$

输出像素可以视为输入像素一个邻域内像素的加权平均。

然后处理边界？

- **忽略**？会造成图像大小缩减；

- 补零？没有图像的地方全为0；

- 假设图像周期分布？左侧没有右侧补；

- 反射？最大h，h+1=h-1；

```python
torch.nn.functional.pad(image, pad, mode="contant", value = None).
mode - 'constant', 'reflect' or 'circular'
```

（一般要求Kernel总和为1，以免导致图像亮度变化）

### 1.Box Fliter

$$
\frac{1}{9}\begin{bmatrix}
1&1&1\\1&1&1\\1&1&1
\end{bmatrix}
$$

模糊图像。

### 2.Gaussian Filter/Low Pass Filtering高斯滤波/低通滤波

指定$\sigma^2 =1$：

$$
\frac{1}{16}\begin{bmatrix}
1&2&1\\2&4&2\\1&2&1
\end{bmatrix}
$$

模糊图像，但过渡平滑，更加自然，能够更好地保留边缘和降噪。

### 3.Sharpening Filter锐化滤波

$$
\begin{bmatrix}
0&0&0\\0&2&0\\0&0&0
\end{bmatrix}-\frac{1}{9}\begin{bmatrix}
1&1&1\\1&1&1\\1&1&1
\end{bmatrix}\\
I+\lambda (I-I_{blur})
$$

可以提高图像对比度，即“锐化”：突出高频去低频

为了加速滤波，有一些滤波器是 **“可分离的”(Separable)**：

### Separable Filtering

我们可以将一个二维的滤波器分解为两个一维滤波器，将每个像素的运算次数从$K^2$降到$2K$，其中：$K=vh^T$：

$$
\frac{1}{K^2}\begin{bmatrix}
1&1&\cdots&1\\1&1&\cdots&1\\\vdots&\vdots&\ddots&\vdots\\1&1&\dots&1
\end{bmatrix}\rightarrow
\frac{1}{K}[1,1,\cdots,1]
$$

$$
\frac{1}{16}\begin{bmatrix}
1&2&1\\2&4&2\\1&2&1
\end{bmatrix}\rightarrow
\frac{1}{4}[1,2,1]
$$

### Properties

数学中称为Cross-Correlation：

$$
g(i, j) = \sum_{k, l} f(i + k, j + l) h(k, l)
$$

而卷积Convolution：

$$
g(i, j) = \sum_{k, l} f(i - k, j - l) h(k, l)
\\= \sum_{k, l} f(k, l) h(i - k, j - l)
$$

对于卷积神经网络，其实是在作“相关”运算。两者都称为 **“线性移位不变性linear shift-invariant”LSI** 运算：

- **Linear**：$h \circ (f_0 + f_1) = h \circ f_0 + h \circ f_1$

- **Shift-invariant等变性**：$g(i, j) = f(i + k, j + l) \iff (h \circ g)(i, j) = (h \circ f)(i + k, j + l)$

卷积操作是CNN的核心，网络通过卷积层提取特征。

**输入数据 > 卷积层 > ReLU激活 > 池化 > 全连接层 > 分类**

卷积和相关两者都可以表示为矩阵向量的乘积：

$$
g=Hf
$$

即使用一个稀疏矩阵来进行相关操作，例如：

$$
[72,88,62,52,37]\cdot[\frac{1}{4},\frac{1}{2},\frac{1}{4}]\rightarrow
\frac{1}{4}\begin{bmatrix}
   2 & 1 &   &   &   \\
   1 & 2 & 1 &   &   \\
     & 1 & 2 & 1 &   \\
     &   & 1 & 2 & 1 \\
     &   &   & 1 & 2
   \end{bmatrix}
\begin{bmatrix}72\\88\\62\\52\\37\end{bmatrix}
$$

## Non-Linear Filter（非线性滤波）

### 1.Median Filter中值滤波

### 2.Bilateral Filter双边滤波

## Application of Filters应用

## Gaussian Pyramid高斯金字塔

## Upsampling升采样

## Laplacian Pyramid拉普拉斯金字塔

## Transformation变形
