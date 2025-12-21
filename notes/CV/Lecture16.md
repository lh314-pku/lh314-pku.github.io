<div>

</div>

# Optimization 优化

## 随机梯度下降 SGD

当数据量 N 很大时，计算损失函数的梯度需要对所有数据求和，非常耗时：

$$
\nabla_W L(W) = \frac{1}{N} \sum_{i=1}^N \nabla_W L_i(x_i, y_i, W) + \lambda \nabla_W R(W)

$$

为了提高计算效率，我们可以使用小批量（minibatch，例如 32）的方法，只对一部分数据计算梯度：

$$
\nabla_W L(W) = \frac{1}{B}
\sum_{i=1}^B \nabla_W L_i(x_i, y_i, W) + \lambda \nabla_W R(W)
$$

这种方法称为：Stochastic Gradient Descent，随机梯度下降，SGD。

### Questions

- **Q1：梯度方向不一致**

当损失函数在某些方向变化缓慢，而在其他方向变化迅速时：梯度下降会在变化快的方向上产生抖动（jitter），而在变化慢的方向上进展缓慢。

原因是损失函数的条件数（Condition Number）较高，Hessian矩阵的最大奇异值与最小奇异值的比值较大（也就是说其梯度图会趋近于更加扁的椭圆）。

Solution：减少步长（Step Size）可以缓解抖动问题，但这会导致收敛速度变慢。

- **Q2：梯度噪声**

SGD的梯度来自于小批量数据（Minibatches，B << N），因此梯度具有噪声。小批量数据的梯度波动可能会导致优化路径不平稳。

- **Q3：局部最小值/鞍点**

在局部最小值/鞍点出，其梯度也可以为 0，导致无法收敛到全局最小值。（卡住了）

### SGD with Momentum

我们为 SGD 添加“动量‘来模拟“惯性”，以避免在局部停留。有两种表达形式：

```python
for t in range(num_steps):
    dw = compute_gradient(w)
    # TensorFlow
    v = rho * v - learning_rate * dw
    w += v
    # PyTorch
    v = rho * v + dw
    w -= learning_rate * v
```

![](https://lh314-pku.github.io/notes/CV/images/SGD.png)

其中 $\rho$ 一般设置为 0.9，展开变成：

$$
v_{t+1} = h_t + \rho h_{t-1} + \rho^2 h_{t-2} + \cdots + \rho^t h_0, \quad h_t = \nabla L(\mathbf{w}_t)
$$

即使局部最小值/鞍点梯度为 0，结果依然在移动。

### Nesterov Momentum

Nesterov Momentum的核心思想是：Look Ahead。不是直接使用当前位置计算梯度，而是先根据动量 $v_t$​ 估算下一步的位置，然后在该位置计算梯度，并结合动量进行更新。

即将普通动量更新的：

$$
v_{t+1}=\rho v_t+\nabla L(w_t)
$$

优化为：

$$
v_{t+1}=\rho v_t+\nabla L(w_t+\rho v_t)
$$

我们将这种”预测位置“简化为

> TO DO

```python
for t in range(num_steps):
    dw = compute_gradient(w)
    old_v = v
    v = rho * v - learning_rate * dw
    w -= rho * old_v - (1 + rho) * v
```

## Adaptiive Learning Rate Methods

### AdaGard & RMSProp

**AdaGrad**的核心思想是让学习率随着梯度变化自适应调节，梯度较大时学习率会逐渐减小。假设梯度为 $g_t$，历史梯度平方和为 $G_t$，有如下更新：

$$
G_t=G_{t-1}+g_t^2,
w_{t+1}=w_t-\frac{\alpha}{\sqrt{G_t}+\epsilon}\cdot g_t
$$

其中 $\epsilon=10^{-7}$ 是用于防止分母为 0 的常数。$G_t$ 会不断叠加，导致学习率持续下降，优化可能会过早停止。

```python
grad_squared = 0
for t in range(num_steps):
    dw = compute_gradient(w)  # 计算梯度
    grad_squared += dw * dw   # 梯度平方累加
    w -= learning_rate * dw / (grad_squared.sqrt() + 1e-7)
```

**RMSProp**是AdaGrad的优化版本，其引入了**滑动平均**的概念来代替累加，防止 $G_t$ 过大。假设梯度为 $g_t$，历史梯度平方均值为 $S_t$，有如下优化：

$$
S_t=\gamma S_{t-1}+(1-\gamma)g_t^2,
w_{t+1}=w_t-\frac{\alpha}{\sqrt{S_t}+\epsilon}\cdot g_t
$$

其中 $\gamma$ 是一个衰减因子，通常为 0.9。RMSProp避免了学习率持续下降的问题，能够长期稳定优化，更适合处理非平稳梯度。

```python
grad_squared = 0
for t in range(num_steps):
    dw = compute_gradient(w)  # 计算梯度
    grad_squared = decay_rate * grad_squared 
                   + (1 - decay_rate) * dw * dw
    w -= learning_rate * dw / (grad_squared.sqrt() + 1e-7)
```

### Adam

**Adam** （Adaptive Momentum）结合了 RMSProp 和 Momentum，分别考虑动量项（一阶矩）和梯度平方项（二阶矩），并让其共同调整学习率：

- 动量项（一阶矩）：改善梯度方向的稳定性

$$
m_t=\beta_1m_{t-1}+(1-\beta_1)g_t
$$

- 梯度平方项（二阶矩）：自适应调整学习率

$$
v_t=\beta_2v_{t-1}+(1-\beta_2)g_t^2
$$

- 偏差修正（Bias Correction）

$m_t$ 和 $v_t$ 会在初期偏向 0，需要引入偏差修正，将初期的偏差调整为更合理的值：

$$
\hat{m}_t = \frac{m_t}{1 - \beta_1^t},
\hat{v}_t = \frac{v_t}{1 - \beta_2^t}
$$

完整的Adam如下：

```python
moment1 = 0
moment2 = 0
for t in range(1, num_steps + 1):  # Start at t = 1
    dw = compute_gradient(w)
    moment1 = beta1 * moment1 + (1 - beta1) * dw
    moment2 = beta2 * moment2 + (1 - beta2) * dw * dw
    moment1_unbias = moment1 / (1 - beta1 ** t)
    moment2_unbias = moment2 / (1 - beta2 ** t)
    w -= learning_rate * moment1_unbias / (moment2_unbias.sqrt() + 1e-7)
```

### AdamW

L2正则化：在损失函数中加入 $\lambda\|w\|^2$ 项，用来防止模型过拟合；更新参数时，梯度会包括正则化项：

$$
g_t=\nabla L_{data}(w)+2\lambda w_t
$$

权重衰减（Weight Decay）：直接减小模型参数：

$$
w_{t+1}=w_t-\alpha(s_t+2\lambda w_t)
$$

Adam 的梯度归一化机制会导致权重衰减的效果被“抵消”。即使权重衰减被显式加入到梯度中，归一化后的梯度更新可能仍无法达到预期的正则化效果。这种问题使得 Adam 的性能在某些情况下不如 SGD。

![](https://lh314-pku.github.io/notes/CV/images/adamw.png)
