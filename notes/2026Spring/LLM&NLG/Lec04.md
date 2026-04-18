# Lecture04:预训练语言模型

## 4.1 预训练概述

### 4.1.1 预训练词向量

Word Vector 在 NLP/NLG 中很重要，相较于 One-Hot、稀疏向量（SparseVec），密集向量（DanseVec）更加方便意义层面的表达计算。

**Word2Vec**：上下文无关的Word Embedding，基于大量生语料训练。

代表方法为：CBOW（输入上下文进行总结该词汇）、Skip-gram（反之，通过当前词预测其上下文）。

上下文无关的Word Embedding不能准确表示词义。

**ElMo**：上下文有关的Word Embedding。

预训练过程中，每个词经过双层双向LSTM，基于语言模型进行预训练（称为 Feature-based Pre-Training）

更好的Word Embedding：更大规模、更先进的模型框架（Transformer）、更好的训练目标

### 4.1.2 预训练语言模型

- 海量高质量数据：C4、books、Wiki

- 先进的深层神经网络：多层Transformer

- 简单有效的预训练/自监督学习目标：语言模型目标

- 强大的算力；GPU/TPU/NPU

### 4.1.3 预训练-微调范式

- 预训练：大量生语料、学习通用知识/能力

- 特定任务微调：少量标注数据、学习任务相关知识/能力

### 4.1.4 Subword模型

**词表**：基于训练数据构建，不存在的词、错误拼写、虚构词汇均视为 UNK

固定的词表并不合适，过大的词表会导致计算量过大。

Subword Model将词语的构成部分（Subword token）进行编码，训练/测试中将词语切分为已知的subword序列。

（例如：taaaaasty->taa#aaa#sty，Transformerify->Transformer#ify）

**BPE/Byte-pair encoding**：字符级suwords，将常见的subword pair合并加入词典，直到满足词典大小

在中文（UTF-8）中，每个汉字相当于3字节。BPE可以用于不同语言。

## 4.2 基于 Encoder 的预训练：BERT

**Bidirectional Encoder Representations from Transformers（BERT）**：堆叠 Transformer 的 ncoder，用于对输入词语序列进行编码，获得对应的词向量序列。

其输入结合了 3 种Embedding：Tokens Embedddding（WordVec）、Segments Embeddings，Position Embeddings。

有 2 个标准版本：BERT-base（12Layers，110M），BERT-large（24Layers，340M）。

训练数据：BookCorpus（800M Words）+ English Wiki（2500M Words）

BERT 通过两个自监督学习任务进行训练：

- **Masked LM（MLM，掩码语言模型）**

为了解决传统从左向右预测无法考虑双边信息的问题，随机选出 15% 的 token/subtoken，其中 80% 替换为 $[MASK]$，10% 不变，10% 替换为随机 token。目标是预测原始的输入，损失函数从缺失位置获得。

- **Next Sentence Prediction（NSP，下一句预测）**

为了让模型理解两个句子之间的关系，输入两个子句 A&B，开头有标记 [CLS]，中间和结尾有特殊标记 [SEP]。句子 B 有 50% 概率是真实的下一句，50% 为随机的一句。模型最后一层对 [CLS] 对应的向量进行分类。

- 下游任务：微调

**变体/改进**：

- RoBERTa：训练更长、数据更多、去除NSP任务

- SpanBERT：掩码文本片段

- Mbert：多语言

- Pixel-bert：多模态

- Tinybert，Albert：小型化

## 4.3 基于 Encoder-Decoder：BART，T5

Encode和Decoder分别负责文本的理解和生成，即条件文本生成内容。

### 4.3.1 BART

BART，也可以称为一种 **去噪自编码器（Denoising Autoencoder）**。其框架基于 Seq2Seq Transformer：

- ReLU->GeLu

- Decoder 每一层针对 encoder 的最后隐层执行 cross-attention

- Base/large model：6/12 layers in encoder and decoder，比同等级的BERT模型多10%参数

- 基于books/wiki数据预训练

其训练目标是尝试恢复损坏前的文本。输入（双向注意力）是以各种方式损坏的文本（随机掩码、删除、片段掩码、片段置换、文档旋转），输出（自回归）是预测原本的文本。

### 4.3.2 T5

**Text-to-Text Transfer Transformer**，基于打乱-重构进行训练，将 NLP 视为序列转换任务（指令+输入->输出）。

训练基于文本重构，即同占位符替换不同长度的随机片段，Decoder 需输出被删除的片段。

数据集为 **C4**（Colossal Clean Crawled Corpus）数据集，包含海量网页文本。

（Small: 60M, Base: 220M, Large: 770M）

## 4.4 基于 Decoders：GPT（系列）

Decoder是自回归模型，只能从左向右预测下一个 Token。其利用 Causal/masked Self-Attention关注输入/已有信息，是当前最成功的预训练模型。

**扩散语言模型（Diffusion LM）**，传统模型生成的单向的，生成效率较低；DLM仿照扩散模型，从纯噪声中生成文本，并行更快且可控。e.g. LLaDA
