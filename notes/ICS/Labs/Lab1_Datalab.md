# DataLab

*PKU，2025Fall，ICS，DataLab*

> ⚠️ 致各位同学：
> 
> **本笔记的目的是借鉴交流，而非仅仅提供答案，<font color='red'>请勿抄袭，后果自负</font>。**
> 
> 你可以参考我的想法、了解有哪些注意的地方，但是在自己实现的时候不要参考，避免抄袭。

## 关于Linux的必要指令

上传文件：`scp [本地文件] ubuntu@[ip]:[文件夹]`

下载文件（到当前目录）：`scp ubuntu@[ip]:/home/...`

当前工作目录：`pwd`

当前文件夹列表：`ls`

进入`xxx`文件夹：`cd xxx`

返回上级文件夹：`cd ..`

创建文件夹：`mkdir [NAME]`

创建文件：`touch [NAME]`

删除：`rm [OPTIONS] [NAME]`

- `-r` 递归删除一个目录

- `-f` 强制删除

压缩与解压缩tar文件: `tar [OPTIONS] [NAME]`（常用：`tar -xvf [TAR] -C [PATH]`）

- `-x` 解压

- `-c` 选择多个目录/文件进行打包

- `-f [PACAGE_NAME]` 指定打包后文件名

- `-z` 压缩与解压缩tar.gz文件

- `-C [TARGET_DIR]` 指导解压目录

编译c文件：`gcc [SRC] –o [DEST]`

---

## 写前须知：

### 1.作业说明

北京大学的DataLab每年的出入都不小，但比较难的题在网上找一找总是有的。

所有的代码均在文件`bits.c`中完成，而`Btest`（`btest.c`的编译结果）用于测试你的程序。每当你改动你的代码后，都需要重新编译文件：

```bash
make
```

`btest`：用于测试你的函数是否正确。仅在一个小的测试集上进行测试，不能完全保证你的函数是正确的。

```bash
# 编译并运行
make && ./btest
# 对某个函数进行单元测试
make && ./btest -f bitXnor
# 对某个函数进行单元测试，且指定测试用例，以 -1 指定第一个参数，依次类推
make && ./btest -f bitXnor -1 7 -2 0xf
```

注意，这里的 `make` 是必需的，每当你修改了 `bits.c`，都需要重新编译。有关编译的更多知识，你会在第七章学习到。

`dlc`：用于检查你的代码是否符合规范。

```bash
# 检查是否符合编码规范
./dlc bits.c
```

`bdd checker`：穷举测试所有可能的输入，完整地检查你的函数是否正确。

```bash
# 对某个函数进行单元测试
./bddcheck/check.pl -f bitXnor
# 检查所有函数
./bddcheck/check.pl
# 检查所有函数，且输出总结信息
./bddcheck/check.pl -g
```

`driver.pl`：用于评分，检查你的函数是否符合规范且正确。

```bash
./driver.pl
```

### 2.辅助工具

要使用辅助工具，你必须先编译：

```bash
make
```

`ishow`：用于显示整数的二进制形式。

```bash
# 显示 -1 的二进制形式
./ishow -1
# Hex = 0xffffffff,       Signed = -1,    Unsigned = 4294967295

# 以 0x 开头，十六进制表示转整数
./ishow 0xffffffff
# Hex = 0xffffffff,       Signed = -1,    Unsigned = 4294967295
```

`fshow`：用于显示浮点数的二进制形式。

```bash
# 带小数点，浮点数转表示
./fshow 12.0
# Floating point value 12
# Bit Representation 0x41400000, sign = 0, exponent = 0x82, fraction = 0x400000
# Normalized.  +1.5000000000 X 2^(3)

# 不带小数点，表示转浮点数
./fshow 12
# Floating point value 1.681558157e-44
# Bit Representation 0x0000000c, sign = 0, exponent = 0x00, fraction = 0x00000c
# Denormalized.  +0.0000014305 X 2^(-126)

# 不带小数点，以 0x 开头，十六进制表示转浮点数
./fshow 0x41400000
# Floating point value 12
# Bit Representation 0x41400000, sign = 0, exponent = 0x82, fraction = 0x400000
# Normalized.  +1.5000000000 X 2^(3)
```

### 3.代码要求

函数中的只能使用`1~255`的整数，不可以使用类似`0xffffffff`的大数；只能使用函数参数和局部变量。

你能使用的运算符有：单目运算符`!`、`~`、`&`、`|`、`^`、`+`、`<<`、`>>`；

不能使用**条件**、**循环**、**分支**语句；不能使用**宏**或声明/使用**额外的函数**；不能使用诸如`&&`、`||`、`-`、`?`的**运算符**；不能使用任何形式的**类型转换**；不能使用除`int`外的数据类型，包括数组、结构体和联合体。

你的机器：使用二进制补码、32位的整数表示、使用算术右移、超出限制会发生不可预测的事情。

对于需要实现浮点运算的问题，编码规则不那么严格。你可以使用循环和条件控制、整数和无符号整数、任意的整数和无符号常量。但是不可以使用任何浮点数据类型、操作或常量。

具体函数见下文：

---

DataLab算是8个Lab最简单的一个，目的是实现如下函数（puzzle）：

整数部分：

| 名称         | 评分  | 最大操作数 | 名称             | 评分  | 最大操作数 |
| ---------- | --- | ----- | -------------- | --- | ----- |
| bitOr      | 1   | 8     | negate         | 2   | 5     |
| upperBits  | 1   | 10    | oneMoreThan    | 2   | 15    |
| fullAdd    | 2   | 20    | ezThreeFourths | 3   | 12    |
| rotateLeft | 3   | 25    | isLess         | 3   | 24    |
| bitParity  | 4   | 20    | satMul2        | 3   | 20    |
| palindrome | 4   | 40    | modThree       | 4   | 60    |

浮点数部分：

| 名称          | 评分  | 最大操作数 |
| ----------- | --- | ----- |
| float_half  | 4   | 30    |
| float_i2f   | 4   | 30    |
| float64_f2i | 4   | 20    |
| float_pwr2  | 4   | 30    |

## bitOr

- 目标：实现`x | y`

- 可用操作：`~`、`&`

- 最大操作数：8

- 评分：1

这个题没什么难度，无非是考察`&`和`|`的关系。

```c
int bitOr(int x, int y) {
  return ~((~x) & (~y));
}
```

## upperBits

- 目标：在32位整数的高n位上补0（0 <= n <= 32）

- 可用操作：`!`、`~`、`&`、`^`、`|`、`+`、`<<`、`>>`

- 最大操作数：10

- 评分：1

本题有一个需要注意的点是`n`可以为0，所以不能直接移动1，而是移动`!!n`。另外DataLab不允许使用`-`，所以用`+(~n + 1)`代替：

```c
int upperBits(int n) {
  return ((!!n) << 31) >> (n + ~1 + 1);
}
```

## fullAdd

- 目标：实现一个4 bits的加法。说人话就是`(x + y) mod 16`（0 <= x, y < 16）

- 可用操作：`~`、`|`、`^`、`&`、`<<`、`>>`

- 最大操作数：20

- 评分：2

本题最恶心人的地方在于不能使用`+`，我们只能使用`^`和`&`模拟求和和进位操作。这个过程是有限步的，因为保留后4位，只需要连续模拟4次求和后答案就已经稳定。

```c
int fullAdd(int x, int y) {
  int res1 = x ^ y;
  int carry1 = (x & y) << 1;
  int res2 = res1 ^ carry1;
  int carry2 = (res1 & carry1) << 1;
  int res3 = res2 ^ carry2;
  int carry3 = (res2 & carry2) << 1;
  int res4 = res3 ^ carry3;
  return res4 & 15;
}
```

## rotateLeft

- 目标：循环左移，即左边的位移到右边

- 可用操作：`!`、`~`、`&`、`^`、`|`、`+`、`<<`、`>>`

- 最大操作数：25

- 评分：3

这个题可能对于写循环写习惯的同学来说不太友好，但是总体不难：通过`&`将对应数位提取出来后移位，然后拼接两部分即可。

```c
int rotateLeft(int x, int n) {
  int res = x << n;
  int window = (1 << n) + (~1 + 1); // 创建提取数位的窗口
  res += ((((window << (32 + ~n + 1)) & x) >> (32 + ~n + 1)) & window);
  return res;
}
```

## bitParity

- 目标：如果`x`（二进制补码）有奇数个0则返回1；反之则返回0。

- 可用操作：`!`、`~`、`&`、`^`、`|`、`+`、`<<`、`>>`

- 最大操作数：20

- 评分：4

这个题都出到这里了显然不可能让我们数一遍1的个数。32位整型中0和1的奇偶性相同，通过异或操作，两个0或1都会被归零。故将x依次相邻2^n (n=1,2,3,4,5)的数位做异或，偶数个0和1均被归零，若为奇数个1则x最后以1结尾，反之则以0结尾：

```c
int bitParity(int x) {
  x = x ^ (x >> 1);
  x = x ^ (x >> 2);
  x = x ^ (x >> 4);
  x = x ^ (x >> 8);
  x = x ^ (x >> 16);
  return x & 1;
}
```

## palindrome

- 目标：判断一个二进制补码是不是回文数

- 可用操作：`!`、`~`、`&`、`^`、`|`、`+`、`<<`、`>>`，可以使用大数。

- 最大操作数：40

- 评分：4

判断回文数最朴素的想法就是：能不能把`x`反转后与原来的`x`比较？

```c
int palindrome(int x) {
  // 逐次对x的每2^n(n=4,3,2,1,0)做交换即可！
  int y = ((x >> 16) & 0x0000ffff) + ((x & 0x0000ffff) << 16);
  y = ((y >> 8) & 0x00ff00ff) + ((y & 0x00ff00ff) << 8);
  y = ((y >> 4) & 0x0f0f0f0f) + ((y & 0x0f0f0f0f) << 4);
  y = ((y >> 2) & 0x33333333) + ((y & 0x33333333) << 2);
  y = ((y >> 1) & 0x55555555) + ((y & 0x55555555) << 1);
  return !(y ^ x);
}
```

## negate

- 目标：返回`-x`

- 可用操作：`!`、`~`、`&`、`^`、`|`、`+`、`<<`、`>>`

- 最大操作数：5

- 评分：2

没有什么技术含量

```c
int negate(int x) {
  return (~x + 1);
}
```

## oneMoreThan

- 目标：比较`y`是否比`x`大一。若是则返回1，否则返回0。

- 可用操作：`!`、`~`、`&`、`^`、`|`、`+`、`<<`、`>>`

- 最大操作数：15

- 评分：2

这道题的坑就是：`x = Tmax, y = Tmin`，即数值溢出。不过比较简单，只需要两个条件：`y == x + 1`且`y != 0x80000000`

```c
int oneMoreThan(int x, int y) {
  return !(((x+1) ^ y) | !(y ^ (1 << 31)));
}
```

其实写成`!((x+1) ^ y) & !!(y ^ (1 << 31));`更加符合逻辑，上述写法是为了减少运算次数()。

## ezThreeFourths

- 目标：实现`* 3/4`并且将结果向0舍入。

- 可用操作：`!`、`~`、`&`、`^`、`|`、`+`、`<<`、`>>`

- 最大操作数：12

- 评分：3

这道题需要考虑溢出情况（其实不考虑也没关系），而且对于负数来说是需要进一（即向0舍入）。所以我们需要加入偏置`bias`，保证`x >= 0`时向下舍入而`x < 0`时向上舍入。

```c
int ezThreeFourths(int x) {
  int threeTimesX = (x << 1) + x;
  int bias = (threeTimesX >> 31) & 3;
  return (threeTimesX + bias) >> 2;
}
```

解释一下：若`3x < 0`，则`threeTimesX >> 31`为`0xffffffff`，`bias = 0x3`。除非`3x`可以被4整除（即以`00`结尾），加上`bias`后都会进一位到第3位（即结果的最后一位），实现了向上舍入。

## isLess

- 目标：若`x < y`则返回1，否则返回0。

- 可用操作：`!`、`~`、`&`、`^`、`|`、`+`、`<<`、`>>`

- 最大操作数：24

- 评分：3

通过提取符号位和做差，考虑两种情况：`x < 0 && y >= 0`或者两者同号时`y - x > 0`：

```c
int isLess(int x, int y) {
  int diff = !!(y ^ x);
  int sign_x = (x >> 31) & 1;
  int sign_y = (y >> 31) & 1;
  int a1 = sign_x & (!sign_y);
  int sign_yx = ((y + ~x + 1) >> 31) & 1;
  int a = !((sign_x ^ sign_y) | sign_yx);
  return (a1 | a) & diff;
}
```

## satMul2

- 目标：对`x`乘2，但是向下溢出返回`0x80000000`，向上溢出返回`0x7fffffff`

- 可用操作：`!`、`~`、`&`、`^`、`|`、`+`、`<<`、`>>`

- 最大操作数：20

- 评分：3

题目逻辑很简单：先`x2`，再判断溢出。问题出现在两个方面：1.溢出怎么得到两种不同的结果？2.怎么在没有条件语句的情况下实现条件返回。

```c
int satMul2(int x) {
  int xx = x << 1;
  int overflow = (xx ^ x) >> 31; // 溢出? 是:-1=0xffffffff,否:0=0x00000000
  int dir = xx >> 31; // 溢出方向? 正向:-1,反向:0
  int Tmin = 1 << 31; // 0x80000000
  int res1 = (~overflow) & xx;
  // 考虑溢出情况：正向溢出到0x7fffffff，反向溢出到0x80000000
  int res2 = overflow & (dir ^ Tmin);
  return res1 | res2;
}
```

A：1.溢出处理很简单，因为Tmax和Tmin互反，所以通过溢出方向+异或运算即可。2.我们可以得到一种通用的条件结构：对于条件cond，是则有结果res1，否则有结果res2，可以如此输出：`return (cond & res1) | (~cond & res2)`（注：上述的“是否”指：是`0xffffffff`，否`0x0`）

## modThree

- 目标：在不使用`%`的情况下对一个数模三。

- 可用操作：`!`、`~`、`&`、`^`、`|`、`+`、`<<`、`>>`

- 最大操作数：60

- 评分：4

这道题感觉是一道纯粹的数论题，其中需要两个前提：

1. `2^n mod 3`的结果中，`1`, `2`循环出现；

2. `2^2^n(n > 0)`与1同余；

首先，判断`x`是否为0或Tmin，方便后续求负数：

```c
int isTmin = !((!x) | (x^(~x+1)));
```

接下来考虑`x`的绝对值，方便后续合并求模：

```c
int sign = x >> 31;
int abs_x = (sign & (~x+1)) | ((~sign) & x);
int mask = (0xff << 8) + 0xff;
int res = abs_x;
res = (res >> 16) + (res & mask);
res = (res >> 16) + (res & mask);
res = (res >> 8) + (res & 0xff);
res = (res >> 8) + (res & 0xff);
res = (res >> 4) + (res & 0xf);
res = (res >> 4) + (res & 0xf);
res = (res >> 2) + (res & 3);
res = (res >> 2) + (res & 3);
```

接下来考虑修正：

1. 因为`res`只剩下两位，但是不排除剩余3的可能，可以判断是否为3。若为3，则加上`isThree == 1`，通过进位使后两位归零；

2. 如果`x`为0或Tmin，由于取负时的问题，需要在`res`后加上`isTmin == 1`，作为修正（负数与其绝对值的模差1位）；

3. 若原数为负，还需要对`res`作`~res + 1`。

```c
int isThree;
isThree = !(res ^ 3);
res += isThree + isTmin;
res = res & 3;
return (sign & (~res + 1)) | (~sign & res);
```

合并代码，即得解决方案（注意代码规范：变量一律声明在最前面）：

```c
int modThree(int x) {
  int isTmin = !((!x) | (x^(~x+1)));
  int sign = x >> 31;
  int abs_x = (sign & (~x+1)) | ((~sign) & x);
  int mask = (0xff << 8) + 0xff;
  int res = abs_x;
  int isThree;
  res = (res >> 16) + (res & mask);
  res = (res >> 16) + (res & mask);
  res = (res >> 8) + (res & 0xff);
  res = (res >> 8) + (res & 0xff);
  res = (res >> 4) + (res & 0xf);
  res = (res >> 4) + (res & 0xf);
  res = (res >> 2) + (res & 3);
  res = (res >> 2) + (res & 3);
  isThree = !(res ^ 3);
  res += isThree + isTmin;
  res = res & 3;
  return (sign & (~res + 1)) | (~sign & res);
}
```

> 从浮点数部分开始可以使用允许的语句和所有大数，以及任意`int / unsigned`的运算，但是不能使用浮点类型的变量。、
> 
> 题目中32位浮点数以`unsigned`给出，返回值同理。

## float_half

- 目标：对一个浮点数`*0.5`

- 可用操作：`!`、`~`、`&`、`^`、`|`、`+`、`<<`、`>>`、`||`、`&&`、`if`、`while`

- 最大操作数：30

- 评分：4

## float_i2f

- 目标：`int`转`float`

- 可用操作：`!`、`~`、`&`、`^`、`|`、`+`、`<<`、`>>`、`||`、`&&`、`if`、`while`

- 最大操作数：30

- 评分：4

## float64_f2i

- 目标：`double`（64位浮点数）转`int`

- 可用操作：`!`、`~`、`&`、`^`、`|`、`+`、`<<`、`>>`、`||`、`&&`、`if`、`while`

- 最大操作数：20

- 评分：4

## float_pwr2

- 目标：任意`2^n`的浮点表示

- 可用操作：`!`、`~`、`&`、`^`、`|`、`+`、`<<`、`>>`、`||`、`&&`、`if`、`while`

- 最大操作数：30

- 评分：4

---

最后评分：

```c
Points  Rating  Errors  Points  Ops     Puzzle
1       1       0       2       4       bitOr
1       1       0       2       7       upperBits
2       2       0       2       11      fullAdd
3       3       0       2       16      rotateLeft
4       4       0       2       11      bitParity
4       4       0       2       27      palindrome
2       2       0       2       2       negate
2       2       0       2       7       oneMoreThan
3       3       0       2       6       ezThreeFourths
3       3       0       2       19      isLess
3       3       0       2       10      satMul2
4       4       0       2       50      modThree
4       4       0       2       20      float_half
4       4       0       2       28      float_i2f
4       4       0       2       19      float64_f2i
4       4       0       2       9       float_pwr2
```
