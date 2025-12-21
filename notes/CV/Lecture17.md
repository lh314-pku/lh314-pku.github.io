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

# CNN卷积神经网络-1

## Convolutional Nerual Networks

- 平移不变性：图像主体平移不影响语义；

- 局部性：图像的远距离区域通常彼此独立；

- 层次结构：图像具有**尺度不变性**，即物体的大小变化不会改变其语义。

这都是 MLP 无法解决的。——CNN！！！！（突然激动）

### Fully-Connected Layer全连接层

将32x32x3的图像展开为3072x1x1（一维），结果10x3072的矩阵变换，得到一个10x1x1的输出。输出的每个数字都是 W 的一行与输入的点积。

> 以下约定，第一个参数为深度，即从左到右的“长度”（就是不想画图）

### Convolution Layer卷积层

卷积层需要一个 **卷积核（Kernel）**：其深度与输入一致，大小则小于输入。这个核相当于一个窗口，用来提取其相应的特征。窗口滑动时，就可以提取一系列特征。（就像缩小版的局部MLP）

而且卷积层运行同时使用多个卷积核（高维卷积核）处理多组同尺寸输入（高维输入）。（当然还需要相应数量的偏置）

| Input         | Kernel   | Output           |
| ------------- | -------- | ---------------- |
| 3x32x32       | 3x5x5    | 3xH'xW'          |
| 3x32x32       | 4x 3x5x5 | 4x 3xH'xW'       |
| Nx C_{in}xHxW | 4x 3x5x5 | Nx C_{out}xH'xW' |

之所以不直接得出输出的H和W，是因为我们需要处理卷积层的**边界问题**：

- 忽略：会导致输出结果尺寸减小。

- 零填充：用 0 补足空位

- 假设周期：假设图像循环，左侧连接右侧，下方链接上方

- 边界反射：根据边界的值进行镜像反射填充。

这可以在PyTorch的函数中自行调整；

```python
torch.nn.functional.pad(image, pad, mode='constant', value=None)
```

其中`model`可以选择：`constant`，`reflect`，`replicate`，`circular`。

卷积层可以相互堆叠：卷积->激活->卷积->激活……

**感受野（Receptive Fields）** 是指神经网络中某一层的一个神经元能够“看到”的输入图像的区域大小。感受野的大小会随着网络层数的增加而扩大，这是卷积神经网络的重要特性之一。

对于大尺寸图像，如果仅通过叠加卷积来扩大感受野，可能需要非常多的卷积层，导致计算复杂度过高。

解决办法：下采样（池化层或步长卷积）快速减少图像大小。

以及一些奇妙的卷积：

**1x1 卷积**：也称Point-Wise Convolution，其卷积核大小为 1x1，用来放缩输入张量的通道（即深度）而不改变其空间尺寸（宽，高）。用于设计瓶颈结构，降低计算量。

**空洞卷积**：Atrous/Dilated Convolution，通过在卷积核之间插入空洞，增加卷积核的感受野。（例如3x3的卷积核可以扩展到5x5大小的顶点、边的中点和中心）用于需要较大感受野的任务，可以在不降低分辨率的情况下增强上下文信息。

### Pooling Layer池化层

池化层很像卷积层，区别在于池化层窗口滑动时不会重复处理，可以快速降低图像大小。

### LeNet-5

![](https://lh314-pku.github.io/notes/CV/images/lenet5.png)

## Deep Convolutional Nerual Networks

### AlexNet

技术亮点：ReLU，数据增强，Dropout，GPU并行，DeepCNN（8层）。

Input：224x224x3的彩色图片

Output：1000类别的分类

AlexNet的网络结构在当时算是较为复杂的网络，共包含5 个卷积层（包含3个池化）和 3 个全连接层。其中，每个卷积层都包含卷积核、偏置项、ReLU激活函数和局部响应归一化（LRN）模块。第1、2、5个卷积层后面都跟着一个最大池化层，后三个层为全连接层。最终输出层为softmax。

![](https://lh314-pku.github.io/notes/CV/images/alexnet.png)

### Data Augmentation

### Regularization

### Dropout
