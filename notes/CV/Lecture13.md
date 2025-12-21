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

</div>

# Image Recognition 图像识别

## Introduction

传统编程的流程是由人类设计算法，将输入数据转化为输出结果。在简单任务中，例如排序，传统编程非常有效，但在复杂任务（如图像语义识别）中，传统方法显得无力。

我们想要将图像转换回语义——**Reconstruct Semantics from Images图像语义重建**。

```python
def cat_or_dog(image):
    if ????:
        return 'cat'
    else:
        return 'dog'
```

IDEA：让算法从已知数据**学习**。

```python
def train(images, labels):
    # Machine learning
    return model
def predict(model, test_images):
    # Predict labels
    return test_labels
```

### 监督/非监督学习

**监督学习（Supervised Learning）**：其输入是 $(x,y)$，即输入特征和对应标签；学习目的是映射函数 $y=f(x)$，使之可以预测 $y$。

- 图像分类、图像回归

**非监督学习（Unsupervised Learning）**：输入只有 $x$，学习其数据发布/结构。

- 聚类（Clustering）、降维（Dimension reduction）、数据生成（Generation）。

## Linear Regression Model

> 线性回归这一块。考虑二维数据点：

- 数据：$(x_1,y_1),\dots,(x_N,y_N),x_i,y_i\in\mathbf{R}$；

- 模型：$y=mx+b$；（or：$y=\mathbf{w}\cdot\mathbf{x},\mathbf{w}=(w,b),\mathbf{x}=(x,1)$）

- 训练：w和b，即$\mathbf{w}=(w,b)$：$\mathbf{w}^*=\arg\min_w\sum_{i=1}^N(y_i-\mathbf{w}\cdot\mathbf{x}_i)^2$

将其展开用最小二乘法，首先调整数据大小：

$$
\mathbf{y} = 
\begin{bmatrix}
y_1 \\
\vdots \\
y_N
\end{bmatrix}, \quad 
\mathbf{X} = 
\begin{bmatrix}
x_1 & 1 \\
\vdots & \vdots \\
x_N & 1
\end{bmatrix}, \quad 
\mathbf{w} = \begin{bmatrix}
m\\b
\end{bmatrix}
$$

我们称：

- $\mathbf{y}$：Label，一个 (N,) 的向量。

- $\mathbf{X}$：Inputs，(N,2) 的矩阵。

- $\mathbf{w}$：Weights，(2,1) 的向量。

则有：

$$
\mathbf{w}^* = 
\arg\min_{\mathbf{w}} \sum_{i=1}^N (y_i - \mathbf{w} \cdot \mathbf{x}_i)^2 = 
\arg\min_{\mathbf{w}} \|\mathbf{y} - \mathbf{X}\mathbf{w}\|^2

$$

最小二乘法：

$$
\mathbf{w}^* = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T \mathbf{y}
$$

> 我猜你忘了怎么推导：
> 
> 将二次型展开（称为损失函数）：
> 
> $$
> \|\mathbf{y} - \mathbf{X}\mathbf{w}\|^2
=(y-Xw)^T\cdot(y-Xw)=y^Ty-2y^TXw+w^TX^TXw
> $$
> 
> 我们不妨将其视为 w 的函数，对其求偏导并令其为 0：
> 
> $$
> \frac{\partial L}{\partial w}=-2X^Ty+2X^TXw=0
> $$
> 
> 化简后即得：
> 
> $$
> X^TXw=X^Ty,w=(X^TX)^{-1}X^Ty
> $$
> 
> 此时损失函数有最小值。

### 过拟合和正则化

**过拟合 Overfitting**：模型在训练集上表现很好，甚至拟合了训练集中的噪声，但在新数据（测试集）上表现很差。（参数太多 or 模型太复杂）

**正则化 Regularization**：在损失函数中加入正则化项，通过惩罚模型参数的大小来控制复杂度（以L2-正则化为例）：

$$
L=\|y-Xw\|^2+\lambda\|w\|^2
$$

$\lambda$ 作为模型超参数，控制拟合程度与复杂度的平衡，不宜过大和过小。

此时最小二乘法的结果也有不同：

$$
w^*=(X^TX+\lambda I)^{-1}X^Ty
$$

### 超参数

超参数的选择其实就是如何处理训练集的问题：

- 直接在整个数据集上尝试不同的超参数，选择效果最好的参数。但是容易造成过拟合。

- **划分数据集**：将数据集分为训练集和验证集。模型在训练集上训练，超参数选择基于验证集表现。略有改进。

- **训练集+验证集+测试集**：将数据集分为训练集、验证集和测试集。训练模型时使用训练集，通过验证集选择超参数，最终在测试集评估表现。
  对于大数据集来说是最常用的方法，适合深度学习等。

- **交叉验证Cross-Validation**：如果数据集较小，可以将数据集划分为 k 个子集，每次选择一个子集作为验证集，其他子集作为训练集。
  对于小数据集来说能够充分利用数据，但是计算成本较高，不会用于深度学习。

### Multi-Dimension

但是更加常见的情况是，输入和输出都是高维数据而非简单的一维，我们可以将线性回归扩展到高维空间（w的表达式没有变，把一维数字视为 1x1 大小的矩阵即可）：

- 假设：$x\in\mathbf{R}^D$

$$
\mathbf{y} = 
\begin{bmatrix}
y_1 \\\vdots \\y_N
\end{bmatrix}, \quad 
\mathbf{X} = 
\begin{bmatrix}
x_{1,1} & \cdots & x_{1,D} & 1 \\
\vdots & \ddots & \vdots & \vdots \\
x_{N,1} & \cdots & x_{N,D} & 1
\end{bmatrix}, \quad 
\mathbf{w} = 
\begin{bmatrix}
w_1 \\\vdots \\w_D \\b
\end{bmatrix}
$$

Label 的大小依然是 (N,)，Inputs 的大小是 (N, D+1)，Weights 的大小是 (D+1,)

- 假设：$x\in\mathbf{R}^{D_{in}}$，$y\in\mathbf{R}^{D_{out}}$，矩阵会更加复杂：

$$
\mathbf{Y} = 
\begin{bmatrix}
y_{1,1} & \cdots & y_{1,D_{\text{out}}} \\
\vdots & \ddots & \vdots \\
y_{N,1} & \cdots & y_{N,D_{\text{out}}}
\end{bmatrix},
\mathbf{X} = 
\begin{bmatrix}
x_{1,1} & \cdots & x_{1,D_{\text{in}}} & 1 \\
\vdots & \ddots & \vdots & \vdots \\
x_{N,1} & \cdots & x_{N,D_{\text{in}}} & 1
\end{bmatrix},
\mathbf{W} = 
\begin{bmatrix}
W_{1,1} & \cdots & W_{1,D_{\text{out}}} \\
\vdots & \ddots & \vdots \\
W_{D_{\text{in}},1} & \cdots & W_{D_{\text{in}},D_{\text{out}}} \\
b_1 & \cdots & b_{D_{\text{out}}}
\end{bmatrix}
$$

但是优化方法和结果同上。

## Linear Classifiers线性分类器

**CIFAR10**：有50k张训练集（32x32x3=3072）和10k张测试集图片，分为10类（airplane，automobile，bird，cat，deer，dog，frog，horse，ship，truck）

**MNIST**：手写数字数据集，大小同上，但是图像是 32x32x1 的黑白图片，分为 0-9 共10类。

线性分类器的实质是一个函数：$f(x,W)=Wx+b$，模型通过计算类别分数，选择分数最高的类别：$label=\arg\max{(Wx+b)}$（当然也可以写为齐次形式，但不方便区分权重Weight和偏置Bias）

以 CIFAR10 为例，其权重矩阵为 (32x32x3, 10)，表示将 3072 个数据映射到 10 个分类；偏置为 (10, )，用于调整每个类别的分数。

### 优化/学习

线性分类器实际上效果很差~~（训练了也好不到哪去）~~

我们需要定义损失函数（Loss Function，或者叫目标函数Objection / 代价函数Cost）对其训练。

负损失函数，有时称为奖励函数、收益函数、效用函数、适应度函数。

对于给定的数据样例，其损失为：$L_i(f(x_i,W),y_i)$

而对于数据集的完整的损失为：$L=\frac{1}{N}\sum_{i=1}^NL_i(f(x_i,W),y_i)$

### L2 Loss

**L2-Loss**：其损失函数基于最小二乘法，其表达式为：

$$
L(x,y)=\frac{1}{n}\sum_{i=1}^n|y_i-f(x_i,W)|^2
$$

L2-Loss也称均方误差（Mean Square Error，MSE），优点是各点都连续光滑，方便求导，具有较为稳定的解；但是容易造成梯度爆炸（不够稳健）

### Cross-Entropy

**Cross-Entropy Loss交叉熵损失**：交叉熵损失将分类器输出的分数解释为概率，让模型预测的概率尽量接近真实类别。

真实标签通常是类别的 one-hot 标签，而模型输出结果的各个类别的概率（0~1）。对于输出结果（得分），我们用 Softmax 函数得到其概率：

$$
p_i=\log(\frac{e^{z_i}}{\sum_{j=i}^ne^{z_j}}), z_i=f(x_i,W)
$$

交叉熵损失定义为（$y_i$ 是真实标签）：

$$
L_i=-\log(y_i\cdot p_i)
$$

交叉熵损失可以视为**最大似然估计**的负对数形式。

**最大似然估计Maximum Likelihood 
Estimation**：选择权重以最大化观测数据的可能性。

> P.S. 对于二分类，CEL有更加简单的形式：
> 
> 将模型的原始输出 $s=f(x,W)$ 结果 Sigmoid 函数压缩，得到概率：
> 
> $$
> \sigma(s)=\frac{1}{1+e^{-s}}
> $$
> 
> 则二分类损失为（y 为实际标签，$\hat{y}$ 为预测概率）：
> 
> $$
> L(y,\hat{y})=-(y\cdot\log(\hat{y})+(1-y)\cdot\log(1-\hat{y}))
> $$

### Multiclass SVM

Multiclass SVM Loss，**多分类支持向量机**损失，其要求正确类别的分数需要比其他类别的分数至少高出一个固定的边界值（Margin）。

对于给定样本 $(x_i,y_i)$，$s=f(x_i,W)$，其损失函数（Hinge Loss）定义为：

$$
L=\sum_{j\ne y_i}\max(0,1-(s_{y_i}-s_j))
$$

（口述版）对于每个模型输出结果，其损失计算方式为：对于每个错误预测的输出，计算其与正确预测输出结果的差值并加上边界（$s_j-s_{y_i}+1$），并与 0 做max。对所有结果求和（应该有类别减一个），即得总损失。

对于总的

（假定边界为 1）如果正确类别分数与其他类别分数的差值大于边界值，则不产生损失。

当然还可以加入权重衰减（Weight Decay，如**正则化**）约束权重大小。

Margin 进一步提高了模型对类别的区分能力。
