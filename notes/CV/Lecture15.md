# 反向传播

## Optimization and Back Propagation

Softmax：$L(w)=\lambda\|W\|_2^2+\sum_{i=1}^n-\log{(\frac{\exp(s_{y_i})}{\sum_k\exp(s_k)})}$

SVM Loss：$L(w)=\lambda\|W\|_2^2+\sum_{i=1}^n\sum_j\max(0,s_j-s_{y_i}+1)$

### 网格搜索优化？

```python
best, bestScore = None, Inf
for d1 in range1:
    for d2 in range2:
        w = [d1, d2]
        if L(w) < bestScore:
            best, bestScore = w, L(w)
```

- 优点：简单，只需要评估模型

- 缺点：在高维空间计算复杂

### 随机搜索优化？

```python
best, bestScore = None, Inf
for iter in range(numIters):
    w = random(N, 1)  # sample
    score = L(w)      # evaluate
    if score < bestScore:
        best, bestScore = w, score
```

- 优点：简单，只需要评估模型

- 缺点：在高维空间中投掷飞镖容易错过优化值

维度数量较少，空间有限，目标函数难以/无法分析。我们只需评估函数。随机搜索通常在与其他策略结合时更有效，例如遗传算法、模拟退火。

接下来是唯一真神：**梯度下降**

## Gradient Decent

梯度下降：每一步都沿着负梯度的方向移动。

$$
\nabla_w L(w) = 
\begin{bmatrix}
\frac{\partial L}{\partial w_1} \\
\vdots \\
\frac{\partial L}{\partial w_N}
\end{bmatrix}
\quad \implies \quad
w = w - \alpha \nabla_w L(w)
$$

### Learning rate？

学习率是一个很重要的超参数。相较于固定的学习率，我们更加希望它可以随着下降过程逐渐减小。

比如：Cosine Decay：$\alpha_t=\frac{1}{2}\alpha_0(1+\cos(\frac{t\pi}{T}))$

### Compute Gradient?

#### 1. 数值方法

$$
\frac{\partial f(x)}{\partial x} = \lim_{\epsilon \to 0} \frac{f(x + \epsilon) - f(x)}{\epsilon} 
= \lim_{\epsilon \to 0} \frac{f(x + \epsilon) - f(x - \epsilon)}{2\epsilon}

$$

实际过程中，使用中心差分法会更加精确。

精确，好写，但是更慢。

#### 2. 解析方法

以 L2 正则化的线性损失函数为例，对 w 直接求导：

$$
L(w) = \lambda \|w\|_2^2 + \sum_{i=1}^n (y_i - w^T x_i)^2
$$

即得：

$$
\nabla_w L(w) = 2\lambda w - \sum_{i=1}^n 2(y_i - w^T x_i)x_i
$$

这样得到的结果更加精确、快速，但是容易出错。

实际过程中通常使用的就是解析方法，并通过反向传播实现。

相关计算过程……在AI引论中，不多加赘述。

![](https://lh314-pku.github.io/notes/CV/images/BP.png)

在最终的层或计算图中，都可以实现自动差分，即实现`forward`和`backward`两个函数。例如在 PyTouch 中的乘法机：

```python
class Multiply(torch.autograd.Function):
    @staticmethod
    def forward(ctx, x, y):
        ctx.save_for_backward(x, y)
        z = x * y
        return z

    @staticmethod
    def backward(ctx, grad_z):
        x, y = ctx.saved_tensors
        grad_x = y * grad_z  # dz/dx * dL/dz
        grad_y = x * grad_z  # dz/dy * dL/dz
        return grad_x, grad_y
```

### Tensor

其实就是将标量改张量，计算形式不变。（例如雅各比矩阵）

在某些操作中，例如 ReLU，雅可比矩阵是稀疏的（大多数值为零）。在反向传播中，我们通常不显式构造雅可比矩阵，而是直接使用隐式计算。

![](https://lh314-pku.github.io/notes/CV/images/Tensor.png)

在数学上，反向传播的本质就是链式法则。
