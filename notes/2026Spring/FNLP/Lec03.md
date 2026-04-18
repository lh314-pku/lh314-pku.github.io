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

# Lecture3.1：Probabilistic Models

对于监督学习：

- 标签库已知；

- 用于训练的标注数据可用：(x1, y1), (x2, y2)...(xm, ym)，其中 xi 是数据样本（例如，带有指定目标词的句子），yi 是相应的标签（例如，目标词的含义）

- 目标：寻找函数 $g$：$y=g(x)$

在概率视角下，找到 g 等价于使 y 是在 x 给定条件下最可能的输出：

$$
y=g(x)=\arg\max_y p(y|x)
$$

意味着我们需要最大化在输入 x 条件下，输出 y 的概率。

- 判别模型**Discriminative Models**：直接学习 $p(y|x)$，专注于输入与输出的关系。例如逻辑回归、SVM、NNs

- 生成模型**Generative Models**：先学习联合概率 $p(x, y)$，通过 $p(y|x)=\frac{p(x, y)}{p(x)}$ 来推导，关注数据生成的过程。例如：朴素贝叶斯、隐马尔科夫、GAN

对于生成模型（根据贝叶斯）：

$$
g(x)=\arg\max_y p(y)p(x|y)=\arg\max_y p(x,y)
$$

## Bayesian Model

$$
p(y|x)=\frac{p(x|y)p(y)}{p(x)}\propto p(x | y) p(y)
$$

其中：

- p(x∣y)：数据生成分布，表示当类别 y 给定时，数据 x 的分布。
- p(y)：模型的先验分布，表示类别 y 的先验概率。
- p(x)：边缘分布，表示所有数据 x 的分布。

贝叶斯建模的挑战：

- **数据生成分布 p(x∣y) 很复杂**：数据生成过程可能涉及高维特征或复杂的依赖关系。

- **求解条件概率 p(y∣x) 分析上不可行（Intractable）**：计算 p(x) 通常需要对 y 求积分，这在实际中可能无法直接解析求解。

为了解决这些问题，我们做如下假设（以图书分类为例）：

> - Y：书籍类别
> 
> - X：书中的词汇
> 
> - P(X|Y)：Y 类故事会使用什么样的词汇
> 
> - P(Y|X)：我们最终感兴趣的，X 词组最有可能出现在 Y 类书中

可以假定：

- Y 服从多项式分布（离散变量）$Y\sim\text{Multinomial}(\gamma)$；

- $X\mid Y\sim p(X\mid \theta_Y)$：在类别确定的条件下，书中单词分布由参数 $\theta_y$ 确定；

- 参数 $\gamma$ 的先验服从迪利克雷分布 $\gamma\sim Dirichlet(\beta)$，若 $\beta$ 值较大则分布更加均匀，反之则更加突出

- 假设单词分布的参数 θ 服从某种先验分布 p(θ)：$\theta_1,\theta_2,...\sim^{iid}p(\theta)$

则有：

$$
p(X,Y\mid\gamma,\Theta)=p(X\mid Y,\Theta)p(Y\mid \gamma)
$$

BOUNS：**潜在狄利克雷分配模型（Latent Dirichlet Allocation, LDA）**

## Discriminative Models

对于分类模型（仅根据观察到的数据x，查看未见类别标签y的条件概率）：

- 直接建模 $p(y|x)$，

- 无需将强制假设独立性

- 可以整合多种特征

- 实现更高的准确率

- 可能会过拟合

举例（概率模型）：

- 最大熵模型 Maximum Entropy

- 条件随机场（Conditional Random Field, CRF）

- 逻辑回归（Logistic Regression）

非概率模型：

- 支持向量机 SVM

- 感知机 Perceptron

# Lecture3.2：Log-Linear Models

## 特征表示

特征：描述观测数据 x 某些方面的证据片段，通常与预测标签 y 相关。

在不同领域中，特征可以是不同的指标

### 1.NLP

NLP 中的特征，即embedding，将文本转化为向量的形式。特征函数通常是一个二值函数 $f_i(x,y)$，有的特征关注局部的含义（如WSD），有的函数关注全文的特点（如Classification）。

特征向量有很长的特征值组成：$[f_1(x,y),f_2(x,y),...,f_m(x,y)]$，对于一个具体的样本，特征向量会非常稀疏。特征值不仅依赖于数据本身 x，也依赖于预测的标签 y。

权重向量 $\lambda$ 是模型内部的参数，存储了每个特征的重要性评分。与特征向量作点积得到评分（即Scoring过程）

### 2.Bag-of-Words

对于**文本分类**任务，需要对文本进行特征提取。

- 最简单的BoW：One-Hot（哑变量/独热编码），向量的每一位都是 0 或 1，如果词表中的第 i 个词出现过则记为 1，否则记为 0。

- TF：基于频率，在One-Hot上，记录对应词出现的次数。

- TF-IDF：加权词袋模型，最强大的变体。

TF-IDF，$TF_{t,d}\times IDF_t$：

$$
TF_{t,d}=1+\log_{10}(\text{count}(t,d))
$$

TF衡量词语在文章中出现的频率，取对数和加一用于平滑数据（TF强化高频词）；

$$
IDF_t\log_{10}\frac{N}{DF_t}
$$

N是语料库中文档的总数，DF_t是包含词 t 的文档数。IDF称为逆文档频率，衡量词语的通用程度（也就是强调特征词、实词、关键词）。

## 基于特征的判别模型

### 1.Log-Linear Model

### 2.Model Training

### 3.参数估计 Para. Estimations

### 4.正则化 Refularization
