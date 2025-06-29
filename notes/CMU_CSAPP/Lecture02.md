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

# Chapter02 Bits,Bytes,and Integer

## Everything is bits

每个 bit 是 0 或1；

数字、字符串、集合等用不同方式编码为 bits，以告诉计算机该干什么；在数字世界里可以通过各种模拟信号来对 bit 进行量化

为什么使用 bit？（电子实现）

- 易于用双稳态元件存储
- 在嘈杂和不精确的线路中可靠传输（高电位/低电位）

bit 可以通过二进制表示，例如：

- $15213\_{10}\rightarrow 11101101101101\_{2}$

- $1.20\_{10}\rightarrow 1.00110011[0011]...\_{2}$

- $1.5213\_{10}\rightarrow 1.1101101101101\_2\times2^{13}$

## Encoding Byte Values

**Byte = 8 Bits**

表示范围：$ 00000000\_2\ to\ 11111111\_2 $ ，十进制：$ 0\_{10}\ to\ 255\_{10} $ ，十六进制：$00\_{16}\ to\ FF\_{16}$。

| Hex   | Decimal | Binary | Hex   | Decimal | Binary |
| ----- | ------- | ------ | ----- | ------- | ------ |
| **0** | 0       | 0000   | **8** | 8       | 1000   |
| **1** | 1       | 0001   | **9** | 9       | 1001   |
| **2** | 2       | 0010   | **A** | 10      | 1010   |
| **3** | 3       | 0011   | **B** | 11      | 1011   |
| **4** | 4       | 0100   | **C** | 12      | 1100   |
| **5** | 5       | 0101   | **D** | 13      | 1101   |
| **6** | 6       | 0110   | **E** | 14      | 1110   |
| **7** | 7       | 0111   | **F** | 15      | 1111   |

十六进制使用 `'0'` ~ `'9'` 和 `’A‘` ~ `’F‘`；

$FA1D37B_{16}$ 在 C 语言中写为：`0xFA1D37B`or`0xfa1d37b`。

**C 语言中的数据类型的字节数**：

| 数据类型          | Typical 32-bit | Typical 64-bit | x86-64 |
| ------------- |:--------------:|:--------------:|:------:|
| `char`        | 1              | 1              | 1      |
| `short`       | 2              | 2              | 2      |
| `int`         | 4              | 4              | 4      |
| `long`        | 4              | 8              | 8      |
| `float`       | 4              | 4              | 4      |
| `double`      | 8              | 8              | 8      |
| `long double` | -              | -              | 10/16  |
| `pointer`     | 4              | 8              | 8      |

## Boolean Algebra布尔代数

将`True`编码为`1`，`False`编码为`0`。`0`，`1`作为了逻辑最基本的值。布尔运算包括：与（and）、或（or）、非（not）、异或（Exclusive-Or，xor）。

| 运算  | 条件                       | 简记   |
| --- |:------------------------:| ---- |
| And | `A&B=1`当且仅当`A=1 and B=1` | 同真为真 |
| Or  | `A\|B=1`当`A=1 or B=1`    | 有真为真 |
| Not | `~A=1`当且仅当`A=0`          | 真假互换 |
| Xor | `A^B=1`当且仅当`A!=B`        | 相异为真 |

当我们操作连续的比特时，可以视为对每个比特位进行了布尔操作。将连续的比特从左到右编号，并将`1`所在的位数记录，得到比特数和集合的一一对应关系，如下：

| 比特数/编号                | 集合        |
| --------------------- | --------- |
| 01101001<br/>76543210 | {0，3，5，6} |
| 01010101<br/>76543210 | {0，2，4，6} |

那么布尔操作也可以视为集合的运算，如下：

| 布尔操作 | 结果       | 结果集合          | 集合操作 |
| ---- | -------- | ------------- | ---- |
| `&`  | 01000001 | {0，6}         | 交集   |
| `\|` | 01111101 | {0，2，3，4，5，6} | 并集   |
| `~`  | 00111100 | {1，3，5，7}     | 补集   |
| `^`  | 10101010 | {2，3，4，5}     | 对称差集 |

aaa
