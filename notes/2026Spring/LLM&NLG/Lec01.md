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

# L1：自然语言生成与语言模型基础

## 1.1概述

弱人工智能、强人工智能

## 1.2自然语言生成基础

自然语言处理=自然语言理解+自然语言生成

专家系统->统计方法->深度学习->大型语言模型

- 翻译系统：谷歌翻译

- 智能问答/对话：IBM沃森、Siri、ChatGPT

- 知识图谱：谷歌知识图谱

自然语言生成：根据给定的输入，自动生成可读性好、内容可靠的自然语言语句和篇章

难点：搜索空间大，$O(W^L)$，L文本长度，W词表大小；质量评价困难，无法自动评估

sakana.ai、NotebookLM（做PPT不赖）

经典文本生成内容：

- 文本扩写：AMR2Text、Data2Text、Topic2Text、对话

- 文本缩写：Summarization、Headline generation

- 文本改写：Paraphrasing、Simplification、Style transfer、Machine translate

文本生成经典方法：

- 流水线：数据采集-数据分析-文档规矩-语句输出

- 端到端：数据采集-端到端深度学习-稿件生成

## 1.3语言模型基础

语言模型：**统计概率模型**

- 为给定的语句/词语序列计算概率

- 根据给定的语句/词语序列计算下一个词的概率

$$
P(W)=P(w_1,...,w_n),P(w_n|w_1,...,w_{n-1})
$$

用途：

- 机器翻译、拼写纠错、语音识别、文本生成

$$
P(w_1w_2...w_n)=\prod P(w_i|w_1w_2...w_{i-1})
$$

问题：语料库有限。假设：马尔科夫假设（每个词只依赖于前面若干词而非全部词语）

$$
P(w_i|w_1w_2...w_{i-1})\approx P(w_i|w_{i-k}...w_{i-1})
$$

**N元模型**：

- Unigram model：每个词相互独立$P(w_1...w_n)\approx\prod P(w_i)$

- Bigram：二元组模型，每个词依赖前一个词

- Trigram、4-grams、5-grams

N元模型是对语言的不充分建模，无法体现长距离依赖关系，但是能用。

>  Bigram模型可以参考NNs：Zero to Hero课程。

实际概率计算会取对数相加，既避免数值过小，又因为加法快于乘法。

N-元模型会对训练集过拟合，泛化性存在问题。（即训练集中不存在的数据绝对不会出现在结果中）解决办法：

- 概率平滑 / 拉普拉斯平滑 / 加一平滑

$$
P_{add-k}(w+i|w_{i-1})=\frac{c(w_{n-1}w_n)+k}{c(w_{n-1})+kV}
$$

- Backoff / 退化：使用更少的上下文。若三元模型为0，则退化为bigram、再退化为unigram……。不是真正的概率分布，可采用 Katz Backoff

- Interpolation / 插值：混合 trigram、bigram、unigram。通常更加有效，且为真正的概率分布。

OOV词语：不在词表V中，用新token \<UNK\> 表示，训练时计算 \<UNK\> 的概率，测试时使用之。

**语言模型的评估？** 能不能对真实 / 常见的语句计算更高的概率。

外部评测：下游任务的性能指标

内部评测：困惑度Perplexity / PPL / PP，即经过词语数规范化后的测试集的逆概率。

$$
ppl(W)=P(w_1...w_N)^{-\frac{1}{N}}
$$

PPL 应该尽可能低，相当于最大化概率。

语言模型能不能考虑**句法**？PCFG / 概率上下文无关句法，计算复杂
