# Lecture02：WSD

（WSD：Word Sense Disambiguation，词义消歧）

每个单词都具有不同的含义，这种歧义存在于多个层面：同音异义、一词多义等（无关语言/语种），我们需要选择正确的发音和含义

## 2.1 The WSD Task

The WSD Task：在给定一个模糊的词及其特定语境时，我们应该确定在此语境中所调用的目标词的意义。

WSD对于NLP来说常被视为推理能力的一部分。

- Input：目标词及其上下文，以及**可能的意义集合**。

- Model：提取各种**特征**并与**现有知识**进行比较。

- Output：在此上下文中目标词的语义标签。

计算机存储有人工构建的词汇资源，包括词典定义、标注的示例等，即提前知道目标词的所有可能含义，称为**意义库存（Sense Inventory）**。

- WordNet（EN）、HowNet（CN）、现代汉语语义词典（CN）、BabelNet（Multi）

WordNet是一个大型的英语词汇数据库。名词、动词、形容词和副词被组织成认知同义词集合（synsets），每个集合表达一个独特的概念。

SensEval：一系列的词义消歧评测，涵盖了广泛的语言，并发布了相当多的标注数据。

BabelNet：一个覆盖范围广泛的多语言语义网络

## 2.2 Machine Learning Methods for WSD

### 2.2.1 监督学习（Supervised）

主要步骤：获取**训练数据**（带有标注感知标签的数据实例），为每个实例**提取各种特征**，找到一个数学模型来**学习**带有标签 X 的实例应该是什么样子，给定一个未见过的实例，提取它的特征，并使用模型**预测**哪个标签最合适。

- 优势：选择多样，能够适应不同类型的问题和数据；竞争性表现，能够达到较高的准确性。

- 缺点：需要拥有足够的、带有正确词义标注的训练数据，这可能需要大量时间和资源；如果训练数据的质量较差，模型的性能会受到影响。

### 2.2.2 无监督学习（Unsupervised）

相较于带样本学习，无监督学习的要点在于：**相似的意义出现在相似的语境中**。

- 从上下文提取特征；

- 按照提及、用法对处理词进行聚类，将具有相似上下文的词归为一组。

- 适当的表示归纳出的词义。

优点在于无需标注数据；

缺点：聚类结果难以理解，需要人工干预

### 2.2.3 半监督学习（Semi-Supervised）

从一个小规模的带标注的种子数据（seed data）开始，通过自动扩展的方法生成更大的标注样本集。

- 获取带标注的小语料库作为种子数据；

- 通过**自举（Bootstraping）** 获得更多标注样本（即通过种子数据先训练分类器，再利用**Top K**输出作为扩展样本）

- 重复；

- 按照**监督学习**的方式，通过扩展后的数据集对模型进行训练和评估。

优点：很容易获得更大规模的训练数据。

缺点：很难判断和评估扩展数据的质量；在实际操作中需要设计和应用许多技巧，使方法能够有效运行；如果初始模型不够准确，可能会引入错误的样本，导致**误差累积（错误传播）**。

---

监督学习的两个关键组件：提取上下文特征（Extract context features）和选择模型。

上下文特征：

- 邻近词（Neighboring words）

- 邻近的N-grams和词组搭配（Neighboring N-grams, local collocations），目标词前后N个词的组合。

- 词性标注（Part-of-Speech, POS），目标词的词性（如名词、动词）以及其邻近词的词性，有助于区分词义。

- 分布式语义模型（Distributional Semantic Models）。使用高级语义表示方法，比如**潜在语义分析（LSA）**、**潜在狄利克雷分布（LDA）**，或**神经网络（NN）**，通过统计分析或深度学习模型构建词语的语义表示，捕捉更丰富的上下文含义。

选择模型：

- 朴素贝叶斯（Naïve Bayes）；

- 线性模型（Linear Model）；

- 逻辑回归（Logistic Regression）；

- 支持向量机（SVM）和 最大熵模型（Maximum Entropy）；

- 神经网络（NN）

## 2.3 朴素贝叶斯

贝叶斯公式：

$$
P(A|B)=\frac{P(A)P(B|A)}{P(B)}
$$

给定目标词 $w$，根据上下文 $C$ 来确定其正确词义 $s^*$，其目标在于可以使 $P(s_k|C)$ 最大的词义：

$$
s^*=\arg\max_{s_k}{P(s_k|C)}
$$

根据贝叶斯公式（$P(C)$对所有候选词义是相同的，所以可以忽略）：

$$
s^*=\arg\max_{s_k}{\frac{P(C|s_k)P(s_k)}{P(C)}}=\arg\max_{s_k}{P(C|s_k)P(s_k)}
$$

对于条件概率 $P(C|s_k)$，表示在词义为 $s_k$​ 的情况下，上下文 $C$ 出现的概率。通过特征独立性检验，假设上下文中的每个特征独立，则：

$$
P(C|s_k)=P(\{v_x|v_x\in C\}|s_k)=\prod_{v_x\in C}P(v_x|s_k)
$$

其中：

$$
P(v_x|s_k)=\frac{Count(v_x,s_k)}{\sum_{v\in V}Count(v,s_k)}
$$

而先验概率 $P(s_k)$，表示目标词 $w$ 取某一词义 $s_k$​ 的概率。通常通过统计训练数据中该词义的出现频率计算：

$$
P(s_k)=\frac{Count(s_k)}{Count(w)}
$$

在最后的测试阶段：

$$
P(s_k \mid C') \propto P(C' \mid s_k) P(s_k) = \prod_{v_x \in C'} P(v_x \mid s_k) P(s_k)

$$

故则需要选择在任意上下文 $C'$ 中：

$$
s_k=\arg\max_{s_k}\prod_{v_x \in C'} P(v_x \mid s_k) P(s_k)
$$

---

如何评估一个 WSD 系统（假设只有正类和负类）？

将系统的输出与**标准答案（Gold Standards）** 进行比较，从而构建一个混淆矩阵：

|                            | **Positive (Gold Standards)** | **Negative (Gold Standards)** |
| -------------------------- | ----------------------------- | ----------------------------- |
| **Positive (Your Output)** | **tp (True Positive)**        | **fp (False Positive)**       |
| **Negative (Your Output)** | **fn (False Negative)**       | **tn (True Negative)**        |

**准确率**：

$$
Acc=\frac{tp+tn}{tp+fp+tn+fn}=\frac{t*}{all}
$$

精确度$Precision_{positive}$：选中的正例中正确的百分比

$$
Pre=\frac{tp}{tp+fp}=\frac{tp}{*p}
$$

召回率Recall：选择正确的正例的百分比

$$
Rec=\frac{tp}{tp+fn}=\frac{tp}{true}
$$

F-measure：于评估分类模型性能的统计量，pre和rec的加权调和平均（$\beta=1$ 时称F1值）：

$$
F_{\beta}=\frac{1+\beta^2}{\frac{1}{Pre}+\frac{\beta^2}{Rec}}
=\frac{(1+\beta^2)Pre\times Rec}{\beta^2\times Pre+Rec}
$$

宏Macro F1：对所有词义/类别的分数取平均

微Micro F1：对所有实例的分数取平均

词汇示例：也称为针对特定目标词的词义消歧，通常每个句子一个目标词。

所有词：针对给定文本中的所有开类词，包括所有名词、动词、形容词和副词，通常需要训练很多很多很多分类器。

## 2.4 Popular WSD Sol.

- 启发：**最常见义项（Most Frequent Sense, MFS）** MFS：默认选择单词最常见的意义作为单词的解释。适用于快速处理词义消歧问题，尤其是在缺乏上下文信息的情况下。

- **One Sense per Discourse**：在一个特定的语篇中，单词的意义往往会保持一致。

- **One Sense per Collocation**：在相同的搭配（collocation）中，单词的意义往往保持一致。

### Lesk算法

Lesk：通过比较单词的定义（gloss）与输入上下文中的单词，选择**重叠词最多的意义**。

### 传统：It Makes Sense（IMS）

- 它利用了目标词的**词性标注**、**周围的词语**以及**局部搭配**等特征。

- 然后结合机器学习分类器（如支持向量机 SVM）预测单词的正确意义。

现在：

1. **基于预训练语言模型**：
   - 如 BERT、RoBERTa 等，能够捕捉单词的上下文语义。
   - 跨语言任务可以使用 XLM-R 等多语言模型。
2. **注意力机制**：
   - 通过注意力机制，更好地关注上下文中与目标词相关的部分。
3. **深度学习框架**：
   - 利用神经网络构建复杂模型（如双向LSTM或Transformer）。
