# Lecture03：Bits，Bytes，and Integers cont

## Addition

对于 **Unsigned Addition**，两个`w`位的数字相加的真实结果应该是`w+1`位，而通常会舍弃前面一位变成`w`位。我们可以将其视为一种模运算：$ s = UAdd_w(u, v) = (u+v)\mod{2^w} $

对于 **Two's Complement Addition**，在位运算上存在与上述相同的行为，例如对于代码：

```c
int s, t, u, v;
s = (int)((unsigned) u + (unsigned) v);
t = u + v
```

会给出`s == t`的结果。(positive overflow & negitive overflow)有时会出现超出上限的正溢出和小于下限的负溢出（以`w=4`为例）：`7+5=-4`，`(-3)+(-6)=7`。

## Negation

本质上就是加法，同上；

## Multiplication

对于（`w`位）乘法，我们可能会需要`2w`位来存储结果：

- **Unsigned**：2w bits
  $ 0\le x*y\le(2^w-1)^2 =2^{2w}-2^{w+1}+1 $

- **Two's complement** MIN：2w-1 bits
  $ x*y\ge-2^{w-1}*(2^{w-1}-1)=-2^{2w-2}+2^{w-1} $

- **Two's complement** MIN：2w bits
  $ x*y\le(-2^{w-1})^2=2^{2w-2} $

但是实际上，我们依然会截取最后`w`位，对无符号数来说，就是模运算：$ UMult_w(u,v)=u\cdot v\mod{2^w} $。但是对于补码，我们的位运算是一致的，但是仍然由余下的最高位数决定结果符号，而不考虑原来的符号。

## Shifting

### Power-of-2 Multiply with Shift

位运算`u << k`等效于`u * 2^k`，不论是 signed or unsigned。其结果依然是`w`位。

### Unsigned Power-of-2 Divide with Shift

位运算`u >> k`等效于`[u / 2^k]`(向下取整)，使用逻辑位移，结果依然是`w`位。（参考带余除法）

对于补码来说，C语言标准并没有明确指出使用什么位移，不过对大多数机器来说的算数位移。 

---

## Counting Down with Unsigned

如果我们使用`unsigned int`作为数组索引倒数，很可能会出现下溢出现象导致数组超限（即使使用`int`，`sizeof()`函数的返回值是无符号类型，会强制转换`int`。）：

```c
unsigned i;
for (i = cnt-2; i >= 0; i--)
    a[i] += a[i+1]
```

```c
#define DELTA sizeof(int)
int i;
for (i = CNF; i - DELTA >= 0; i -= DELTA)
    ...
```

解决办法之一是确保改用`signed int`；另一种方法则是：

```c
unsigned i;
for (i = cut - 2; i < cnt; i--)
    a[i] += a[i+1]
```

一旦发生下溢，就会因为`i = UMAX > cut`而跳出循环，避免数组索引超限。

以及：

```c
size_t i;
for (i = cut-2; i < cut; i--)
    a[i] += a[i+1]
```

- `size_t` 是一种专门为表示非负整数设计的数据类型，通常用于数组索引、内存大小等领域。
- 它的定义是和机器的"字长（word size）"相关的，意味着它能够使用完整的地址范围。
- 使用 `size_t` 可以使代码更具可移植性（portable），因为它是为内存和索引操作专门定义的类型。
- 它也表明这个变量只会承担数组索引、大小等非负值的职能，语义更加明确。

在 32 位机器上，`size_t` 通常是 `unsigned int`；而在 64 位机器上，`size_t` 通常是 `unsigned long long`。

## Representations in memory，pointers，strings

#### Byte-oriented Memory Organization

计算机内存相当于一个巨大的字节数组，一个地址就像是这个数组的索引，指针变量存储的就是一个地址。

系统为每个“进程”提供了私有的地址空间，因此，一个程序可以修改自己的数据，但不能修改其他程序的数据。

#### Machine Words

任何一个机器都有其**字长(Word Size)**，表示其惯常处理的数据和运算，决定了整数数据的标准大小和地址的大小。

 32 位（4 字节）的机器限制存储空间为4GB（2^32 字节）；64位机器则潜在支持 18PB（Petabytes，即千万亿字节）的可寻址内存。

不过机器依然支持不同的数据格式：

- 数据可以是**字长的分数或倍数**。
  - 比如1字节（1/4字长）、8字节（2倍字长）等。
- 所有数据格式都是**整数倍的字节（Bytes）**。

#### Word-oriented Memory Organization

地址通常是一个**字(Word)** 的第一位， 连续内存通常以每4位或8位分隔，方便内存对齐。

#### Byte Ordering

在多字节字（multi-byte word）中，各个字节在内存中的存储，我们有如下约定：

- **小端序(Litter Endian)**：x86架构，运行 Android、iOS 和 Windows 的 ARM 处理器。
  其最低有效字节(LSB)存储在最低地址。

- **大端序(Big Endian)**：Sun、PPC Mac、Internet。
  其最低有效字节(LSB)存储在最高地址，即高位在低字节处，低位在高字节处。

例如：对于数`0x01234567`，存储为：

|          | 大端序    | 小端序    |
| -------- | ------ | ------ |
| 地址       | 数据     | 数据     |
| `0x0001` | `0x01` | `0x67` |
| `0x0002` | `0x23` | `0x45` |
| `0x0003` | `0x45` | `0x23` |
| `0x0004` | `0x67` | `0x01` |

这段代码可以以字节级的方式（byte-level）查看数据的存储表示。它将数据的每个字节打印出来，包括字节在内存中的地址和对应的值（以十六进制表示）。

```c
typedef unsigned char *pointer;

void show_bytes(pointer start, size_t len){
    size_t i;
    for(i = 0; i < len; i++)
        // 遍历每个字节的索引
        printf("%p\t0x%.2x\n", start+i, start[i]);
    printf("\n");
}
```

**`printf("%8p\t0x%.2x\n", start+i, start[i]);`**

- 打印每个字节的地址和值：
  - **`%8p`**: 打印地址（以指针形式）。
  - **`start+i`**: 当前字节的内存地址。
  - **`0x%.2x`**: 以2位十六进制格式显示字节的值。
  - **`\n`**: 换行以更清晰地观察每个字节。
