# Lecture2：神经网络语言模型(1)

## NNs and NLM

- 神经元（Neural Unit/Neuron）：$y=\sigma(wx+b)$

- 激活函数：sigmoid、tanh、ReLU

- FFN/MLP：前馈神经网络/多层感知机，一种无环多层神经网络

FFN举例：$h=\sigma(Wx+b),y=\text{softmax}(Uh)$，训练方法是计算loss，利用链式法则反向传播梯度。

常见损失函数：交叉熵损失/负对数似然损失（可加正则化项）

二分类：

$$
L(\hat{y},y)=-\log p(y|x)=-[y\log \hat{y}+(1-y)\log (1-\hat{y})]
$$

K分类：

$$
L_{CE}(\hat{y},y)=-\sum_{k=1}^K y_k \log \hat{y}_k
$$

### Fixed-window Nerual Language Model

固定窗口神经语言模型，将单词用嵌入向量表示（而非离散标识符），不存在稀疏问题，不需要存储所有的 n-grams。

输入层是前置词语的 one-hot 向量，经过编码矩阵变换后得到编码层 embedding layer $e_i=Ex_i$ ；

hidden layer：$h=\sigma(We+b)$；

output layer：$\hat{y}=\text{softmax}(Uh)$

y 中每一个位置的值都是在输入情况下下一个词的预测概率 p，根据实际的结果，可以构建 $L=-\log p(w_t|input)$ 来进行自学习。

## RNNs and LSTMs

### 1. Recurrent Neural Networks

RNN：循环神经网络

以最简单的RNN为例：

输入部分依然是 $e^{(t)}=Ex^{(t)}$，该过程称为 word embeddings；

隐藏层部分会有一共初始状态的向量 $h^{(0)}$，后续每一次输入，都会有同一个权重产生新的状态：$h^{(t)}=\sigma(W_hh^{(t-1)}+W_ee^{(t)}+b_1)$；

RNN 的每一次更新都可以产生输出，$\hat{y}^{(t)}=\text{softmat}(Uh^{(t)}+b_2)$。

**优势**：

- 能处理任意长度的输入

- 第t步计算能够利用之前多步的信息

- 对于长文本输入模型大小不增加

**训练**：

对于每次输入，均可以产生一个预测 $\hat{y}^{(t)}$ 以及对应的 Loss $J^{(t)}(\theta)$。基于句子产生一系列的 Loss 后，得到 $J(\theta)=\frac{1}{T}\sum J^{(t)}(\theta)$，计算梯度后更新权重。这样根据已知词语序列计算 Loss 的方式称为：Teacher Forcing。

在实际测试和应用中因为并不知道下一个词，只能用上一步的结果作为下一步的输入，无法进行 Teacher Forcing。

**多层RNN**：

RNN是可以加入多个隐藏层的，将 layer i 的隐状态作为 layer i+1 的输入。

**问题**：

- Vanishing Gradients / 梯度消失：梯度过小导致远距离的梯度信号丢失，权重更新不受远距离依赖的影响。解决办法：LSTM

- Exploding Gradients / 梯度爆炸：导致权重更新过大，得到错误的参数 or NaN / INF 异常。解决办法：梯度裁剪clipping。

### 2. Long Short-Term Memory

**LSTM：长短期记忆递归神经网络**，一种特殊的RNN。其特点在于除了 隐状态 hidden state 外，引入了 cell state，可以长期存储信息。LSTM可以通过三个门结构分别控制其中信息的读、删、写。

对于每一个时间步 $t$，有三个门部件：

- **Forget gate**：哪些信息需要丢弃，$f^{(t)}=\sigma(W_fh^{(t-1)}+U_fx^{(t)}+b_f)$

- **Input gate**：哪些新的信息需要写入，$i^{(t)}=\sigma(W_ih^{(t-1)}+U_ix^{(t)}+b_i)$

- **Output gate**：哪些部分被输出为隐藏状态，$o^{(t)}=\sigma(W_oh^{(t-1)}+U_ox^{(t)}+b_o)$

根据三个门部件的权重，会产生新的 cell context 内容：$\tilde{c}^{(t)}=\tanh(W_ch^{(t-1)}+U_cx^{(t)}+b_c)$；

接下来，由遗忘门和输入们产生新的 cell state：$c^{(t)}=f^{(t)}\circ c^{(t-1)}+i^{(t)}\circ \tilde{c}^{(t)}$；

而真正的隐状态：$h^{(t)}=o^{(t)}\circ \tanh c^{(t)}$

> 注：$\circ$ 代表逐元素相乘

---

梯度爆炸 / 梯度消失 的其他解决办法？在不同层间加上直接连接，方便梯度传递。

代表方法：**ResNet 残差网络**。通过跳跃连接为梯度提供了一条绕过非线性层、直接反向传播的途径；改变了学习目标：从学习一个完整的映射变为学习一个残差映射，降低了训练的难度

$$
H(x):=F(x)+x
$$
