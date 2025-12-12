# Optimization 优化

## 随机梯度下降，SGD

当数据量 N 很大时，计算损失函数的梯度需要对所有数据求和，非常耗时：

$$
\nabla_W L(W) = \frac{1}{N} \sum_{i=1}^N \nabla_W L_i(x_i, y_i, W) + \lambda \nabla_W R(W)

$$

为了提高计算效率，我们可以使用小批量（minibatch）的方法，只对一部分数据计算梯度：
