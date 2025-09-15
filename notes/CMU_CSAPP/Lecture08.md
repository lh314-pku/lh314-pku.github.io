# Machine Level Programming IV Date

## Arrays

### 1.One-dimensional

**基本原则**：`T A[L]`

- `T`：数组的数据类型，`L`：数组长度；

- 在内存中占据连续的`L * sizeof(T)`字节。

例如：`char string[12]`占据`1*12=12`字节，`int val[5]`占据`5 * 4 = 20`字节，`char *p[3]`占据`3 * 8 = 24`字节。

`A`本身可以作为数组中索引为0的元素的指针使用，以`int val[5]={1,5,2,1,3}`为例，设`val[0]`地址为`x`，则有：

| 名称         | 类型      | 值               |
| ---------- | ------- | --------------- |
| `val`      | `int *` | x               |
| `val + i`  | `int *` | x + 4 * i       |
| `val[3]`   | `int`   | 1               |
| `val[5]`   | `int`   | ?(out of range) |
| `&val[2]`  | `int *` | x + 8           |
| `*(val+1)` | `int`   | 5               |

#### Arrry example:

```c
#define ZLEN 5
typedef int zip_dig[ZLEN]
zip_dig cmu = {1,5,2,1,3};
zip_dig mit = {0,2,1,3,9};
zip_dig ucb = {9,4,7,2,0};
```

数组`cmu`、`mit`以及`ucb`存储在连续的（间隔为4字节）内存地址上，`zip_dig cmu`相当于`int cmu[5]`。当访问数组元素时：

```c
int get_digit(zip_dig z, int digit){
    return z[digit];
}
```

根据`IA32`标准，汇编部分有：

```asm6502
# %rdi = z
# %rsi = digit
movl (%rdi, %rsi, 4), %eax # z[digit]
```

即在`%rdi`的初始地址上加上`%rsi`（索引） 乘 `sizeof(int) = 4`作为偏移量。这也能解释为什么数组索引是从0开始。

#### Array Loop example：*

```c
void zincr(zip_dig z){
    size_t i;
    for (i = 0; i < ZLEN; i++)
        z[i]++;
}
```

```asm6502
  # %rdi = z
  movl    $0, %eax        # i = 0
  jmp     .L3             # goto middle
.L4:                      # loop:
  addl    $1, (%rdi,%rax,4) # z[i]++
  addq    $1, %rax        # i++
.L3:                      # middle
  cmpq    $4, %rax        # i : 4
  jbe     .L4             # if <=, goto loop
  rep;    ret
```

### 2.Multi-dimensional(嵌套)

以二维数组`T A[R][C]`为例：

- R行，C列；

- `size = R * C * sizeof(T)`；

#### Understanding Pointer & Array

Comp：可否编译通过？

Bad：会不会返回一个空指针引用？

Size：`sizeof`的返回值。

**1.指针与数组的声明与内存分配 (理解 #1)**

| Decl        | A1, A2        | *A1, *A2      |
| ----------- | ------------- | ------------- |
|             | Comp，Bad，Size | Comp，Bad，Size |
| `int A1[3]` | Y，N，12        | Y，N，4         |
| `int *A2`   | Y，N，8         | Y，N，4         |

**知识点分析：**

- **`int A1[3]`：**
  
  - 静态数组，分配了固定大小的内存，大小为 `3 * sizeof(int)`。
  - `A1` 本身表示数组起始地址，可以编译（`Comp = Y`），引用有效（`Bad = N`）。
  - `*A1` 指向第一个元素，大小为 `4` 字节（假设 `int` 为 4 字节）。

- **`int *A2`：**
  
  - 指针变量，没有初始化，未指向有效内存空间。
  - `A2` 本身占用 8 字节大小（指针大小为 8 字节）。
  - 因未分配内存，`*A2` 是潜在的无效引用（`Bad = Y`）。

**内存布局图的解释：**

- **A1：** 直接分配了连续的数组内存 (`Allocated int`)。
- **A2：** 指针本身 (`Allocated Pointer`) 已分配，但未初始化，指向未分配的内存 (`Unallocated int`)。

**2.多层指针与数组的组合 (理解 #2)**

| Decl           | An            | *An           | **An          |
| -------------- | ------------- | ------------- | ------------- |
|                | Comp，Bad，Size | Comp，Bad，Size | Comp，Bad，Size |
| `int A1[3]`    | Y，N，12        | Y，N，4         | Y，-，-         |
| `int *A2[3]`   | Y，N，24        | Y，N，8         | Y，Y，4         |
| `int (*A3)[3]` | Y，N，8         | Y，Y，12        | Y，Y，4         |
| `int (*A4[3])` |               |               |               |

**知识点分析：**

1. **`int A1[3]`：**
   
   - 类似前一张图，静态分配数组。
   - `An` 表示整个数组，大小为 `12` 字节；`*An` 为数组首元素地址，大小 `4` 字节。
   - `**An` 不存在（因为不是指针数组）。

2. **`int *A2[3]`：**
   
   - 指针数组，包含**三个指向整数的指针**，每个指针大小为 8 字节，总大小 `24` 字节。
   - `An` 是指针数组本身，`*An` 表示指向数组中某个指针，大小 `8` 字节。
   - `**An` 是解引用后的整数值，由于这些指针未初始化，可能会发生无效引用（`Bad = Y`）。

3. **`int (*A3)[3]`：**
   
   - 一个指向数组的指针，指向一个包含 3 个整数的数组。
   - `An` 是指针，大小为 8 字节；`*An` 是整个数组，大小为 `12` 字节。
   - `**An` 为数组首元素，大小 `4` 字节。

4. **`int (*A4[3])`：** 同`A2`.

**内存布局图的解释：**

- **A1：** 静态数组，连续分配内存。
- **A2：** 每个元素为一个指针 (`Allocated pointer`)，但这些指针仍未初始化 (`Unallocated int`)。
- **A3：** 指针已分配，指向未分配的整型数组。

**3.通用结论**

- **编译(Comp)：**  
  所有声明（只要语法正确）均可编译。

- **潜在错误引用(Bad)：**  
  未初始化的指针（如 `A2` 和 `**An` 中发生解引用时）可能会出现错误。

- **大小计算(Size)：**
  
  - 数组变量的大小为整个数组的大小。
  - 指针变量的大小固定为指针类型（如 8 字节）。
  - `sizeof` 的结果取决于变量的类型，但不会自动解引用。

### 3.Multi-level

#### 列向量（Row Vector）

`A[i]`是一个有`C`个元素的数组，起始地址为：`A + i * (C*K)`。

#### 数组元素（Array Elements）

`A[i][j]`是其中一个元素，地址为：`A + i * C * K + j * K = A + (i * C + j) * K`。

### 16x16 Matrix Access

## Structures

结构体的数据结构更加简单，例如：

```c
struct rec{
    int a[4];        // 0-16
    size_t i;        // 17-24
    struct rec *next;// 25-32
}
int *get_ap(struct rec *r, size_t idx){
    return &r->a[idx]
}
```

该函数的汇编代码也很简单：

```aspnet
# r in %rdi, idx in %rsi
  leaq  (%rdi,%rsi,4), %rax
  ret
```

### 1.Allocation

### 2.Access

### 3.Alignment

数据对齐原则：

**对齐数据**

- 基本数据类型需要 K 字节
- 地址必须是 K 的倍数
- 在某些机器上是必须的；在 x86-64 架构上建议

**对齐数据的动机**

内存由（对齐的）4 或 8 字节的块访问（取决于系统）

- 加载或存储跨越四字边界的数据效率低
- 当数据跨越两个页面时虚拟内存处理更复杂

**编译器**

- 在结构中插入空隙以确保字段的正确对齐

## Floating Point
