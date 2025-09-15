# DataLab

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
| bitOr      | 1   | 8     | negate         | 2   |       |
| upperBits  | 1   |       | oneMoreThan    | 2   |       |
| fullAdd    | 2   |       | ezThreeFourths | 3   |       |
| rotateLeft | 3   |       | isLess         | 3   |       |
| bitParity  | 4   |       | satMul2        | 3   |       |
| palindrome | 4   |       | modThree       | 4   |       |

浮点数部分：

| 名称          | 评分  | 最大操作数 |
| ----------- | --- | ----- |
| float_half  | 4   |       |
| float_i2f   | 4   |       |
| float64_f2i | 4   |       |
| float_pwr2  | 4   |       |

## bitOr

- 目标：实现`x | y`

- 可用操作：`~`、`&`

- 最大操作数：

- 评分：

## upperBits

- 目标：

- 可用操作：

- 最大操作数：

- 评分：

## fullAdd

- 目标：

- 可用操作：

- 最大操作数：

- 评分：

## rotateLeft

- 目标：

- 可用操作：

- 最大操作数：

- 评分：

## bitParity

- 目标：

- 可用操作：

- 最大操作数：

- 评分：

## palindrome

- 目标：

- 可用操作：

- 最大操作数：

- 评分：

## negate

- 目标：

- 可用操作：

- 最大操作数：

- 评分：

## oneMoreThan

- 目标：

- 可用操作：

- 最大操作数：

- 评分：

## ezThreeFourths

- 目标：

- 可用操作：

- 最大操作数：

- 评分：

## isLess

- 目标：

- 可用操作：

- 最大操作数：

- 评分：

## satMul2

- 目标：

- 可用操作：

- 最大操作数：

- 评分：

## modThree

- 目标：

- 可用操作：

- 最大操作数：

- 评分：

## float_half

- 目标：

- 可用操作：

- 最大操作数：

- 评分：

## float_i2f

- 目标：

- 可用操作：

- 最大操作数：

- 评分：

## float64_f2i

- 目标：

- 可用操作：

- 最大操作数：

- 评分：

## float_pwr2

- 目标：

- 可用操作：

- 最大操作数：

- 评分：
